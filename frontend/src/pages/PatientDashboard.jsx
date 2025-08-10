import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import SlotList from '../components/SlotList';

export default function PatientDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: { Authorization: `Bearer ${user.token}` },
  });

  const fetchSlots = async () => {
    setLoadingSlots(true);
    setError(null);
    try {
      // Get next 7 days dates
      const from = new Date().toISOString().split('T')[0];
      const toDate = new Date();
      toDate.setDate(toDate.getDate() + 7);
      const to = toDate.toISOString().split('T')[0];
      const res = await api.get(`/slots?from=${from}&to=${to}`);
      setSlots(res.data);
    } catch (err) {
      setError('Failed to load slots');
    } finally {
      setLoadingSlots(false);
    }
  };

  const fetchBookings = async () => {
    setLoadingBookings(true);
    setError(null);
    try {
      const res = await api.get('/my-bookings');
      setBookings(res.data);
    } catch {
      setError('Failed to load bookings');
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchSlots();
    fetchBookings();
  }, []);

  const handleBook = async (slotId) => {
    setError(null);
    try {
      await api.post('/book', { slotId });
      alert('Booking successful!');
      fetchSlots();
      fetchBookings();
    } catch (err) {
      if (err.response?.data?.error === 'Slot already booked') {
        alert('This slot is already booked.');
        fetchSlots();
      } else {
        alert('Booking failed.');
      }
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h2>Patient Dashboard</h2>
      <button onClick={logout}>Logout</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <h3>Available Slots</h3>
      <SlotList slots={slots} loading={loadingSlots} onBook={handleBook} />

      <h3>My Bookings</h3>
      <BookingList bookings={bookings} loading={loadingBookings} />
    </div>
  );
}
