import React from 'react';

export default function SlotList({ slots, onBook, loading }) {
  if (loading) return <p>Loading slots...</p>;
  if (!slots.length) return <p>No available slots.</p>;

  return (
    <ul>
      {slots.map((slot) => (
        <li key={slot.id} style={{ marginBottom: 10 }}>
          <strong>{new Date(slot.startAt).toLocaleString()}</strong> - {new Date(slot.endAt).toLocaleTimeString()}
          <button onClick={() => onBook(slot.id)} style={{ marginLeft: 10 }}>
            Book
          </button>
        </li>
      ))}
    </ul>
  );
}
