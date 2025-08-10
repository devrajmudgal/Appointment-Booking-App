const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('Passw0rd!', 10);
  const patientPassword = await bcrypt.hash('Passw0rd!', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: adminPassword,
      role: 'admin',
    },
  });

  const patient = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      passwordHash: patientPassword,
      role: 'patient',
    },
  });

  const slot1 = await prisma.slot.create({
    data: {
      startAt: new Date(Date.now() + 3600 * 1000),
      endAt: new Date(Date.now() + 2 * 3600 * 1000),
    },
  });

  const slot2 = await prisma.slot.create({
    data: {
      startAt: new Date(Date.now() + 4 * 3600 * 1000),
      endAt: new Date(Date.now() + 5 * 3600 * 1000),
    },
  });

  console.log({ admin, patient, slot1, slot2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
