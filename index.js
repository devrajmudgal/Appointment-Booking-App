require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true,
}));

app.use(express.json());

// Auth middleware
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Role-based authorization middleware
function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

// Register patient
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { name, email, passwordHash, role: 'patient' },
    });
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    if (err.code === 'P2002') {
      res.status(400).json({ error: { code: 'EMAIL_TAKEN', message: 'Email already in use' } });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Login (returns JWT + role)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, role: user.role });
});

// Get available slots in date range (default next 7 days)
app.get('/api/slots', authenticate, async (req, res) => {
  let { from, to } = req.query;
  const now = new Date();

  if (!from) from = now.toISOString().slice(0, 10);
  if (!to) {
    const toDate = new Date(now);
    toDate.setDate(toDate.getDate() + 7);
    to = toDate.toISOString().slice(0, 10);
  }

  try {
    const slots = await prisma.slot.findMany({
      where: {
        startAt: { gte: new Date(from) },
        endAt: { lte: new Date(to + 'T23:59:59Z') },
        bookings: null,
      },
    });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Book a slot (patient only)
app.post('/api/book', authenticate, authorizeRole('patient'), async (req, res) => {
  const { slotId } = req.body;
  if (!slotId) return res.status(400).json({ error: 'slotId required' });

  try {
    const booking = await prisma.booking.create({
      data: {
        slot: { connect: { id: slotId } },
        user: { connect: { id: req.user.id } },
      },
    });
    res.status(201).json(booking);
  } catch (err) {
    if (err.code === 'P2002') {
      res.status(400).json({ error: { code: 'SLOT_TAKEN', message: 'Slot already booked' } });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Get bookings of logged-in patient
app.get('/api/my-bookings', authenticate, authorizeRole('patient'), async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: { slot: true },
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: get all bookings
app.get('/api/all-bookings', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { slot: true, user: true },
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
