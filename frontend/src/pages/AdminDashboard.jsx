import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import BookingList from '../components/BookingList';

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: { Authorization: `Bearer ${user.token}` },
  });

  const fetchAllBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/all-bookings');
      setBookings(res.data);
    } catch {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h2>Admin Dashboard</h2>
      <button onClick={logout}>Logout</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <h3>All Bookings</h3>
      <BookingList bookings={bookings} loading={loading} />
    </div>
  );
}
