import React from 'react';

export default function BookingList({ bookings, loading }) {
  if (loading) return <p>Loading bookings...</p>;
  if (!bookings.length) return <p>No bookings found.</p>;

  return (
    <ul>
      {bookings.map((b) => (
        <li key={b.id} style={{ marginBottom: 10 }}>
          Slot: {new Date(b.slot.startAt).toLocaleString()} - {new Date(b.slot.endAt).toLocaleTimeString()} | Patient: {b.user?.name || b.user?.email}
        </li>
      ))}
    </ul>
  );
}
