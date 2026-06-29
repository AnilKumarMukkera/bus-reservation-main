import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './CancelBooking.css';

const CANCEL_REASONS = [
  'Change of travel plans',
  'Found a better alternative',
  'Medical emergency',
  'Work or personal commitment',
  'Incorrect booking details',
  'Bus schedule not suitable',
  'Weather or natural calamity',
  'Family emergency',
  'Booked by mistake',
  'Other',
];

function CancelBooking() {
  const location = useLocation();
  const navigate = useNavigate();

  // Pre-fill ticket number if navigated from Bookings or BusTicket
  const booking = location.state?.booking || null;
  const prefillTicketId = booking?.ticketNumber || booking?.bookingId || '';
  // Handle all possible ID field names (_id from DB, id from payment response)
  const rawId = booking?._id || booking?.id || null;
  // Only use it if it looks like a valid MongoDB ObjectId (24 hex chars)
  const bookingMongoId = rawId && /^[a-f\d]{24}$/i.test(String(rawId)) ? rawId : null;

  const [ticketNumber, setTicketNumber] = useState(prefillTicketId);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!ticketNumber.trim()) {
      setError('Ticket ID is required.');
      return;
    }
    if (!reason) {
      setError('Please select a reason for cancellation.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to cancel a booking.');
        setLoading(false);
        return;
      }

      // If we have the MongoDB _id from navigation state, use direct DELETE
      if (bookingMongoId) {
        await axios.delete(`http://localhost:3939/api/bookings/${bookingMongoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Fallback: look up by ticketNumber in user's bookings, then delete
        const lookup = await axios.get('http://localhost:3939/api/bookings/mybookings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const match = lookup.data.data?.find(
          (b) =>
            b.ticketNumber === ticketNumber.trim() ||
            b.bookingId === ticketNumber.trim() ||
            b.ticketId === ticketNumber.trim()
        );
        if (!match) {
          setError(`No active booking found with Ticket ID "${ticketNumber.trim()}". Please check and try again.`);
          setLoading(false);
          return;
        }
        await axios.delete(`http://localhost:3939/api/bookings/${match._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setSuccess('Your ticket has been successfully cancelled. Seats have been released.');
      setTimeout(() => navigate('/bookings'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cancel-page">
      <div className="cancel-card">
        <div className="cancel-card-header">
          <h1>Cancel Ticket</h1>
          <p>Confirm your ticket ID and select a reason to proceed with cancellation.</p>
        </div>

        {success ? (
          <div className="cancel-success-state">
            <div className="cancel-success-icon">✅</div>
            <h3>Cancellation Successful</h3>
            <p>{success}</p>
            <p className="cancel-redirect-note">Redirecting to your bookings...</p>
          </div>
        ) : (
          <form className="cancel-form" onSubmit={handleSubmit}>
            <label htmlFor="ticketNumber">Ticket ID</label>
            <input
              id="ticketNumber"
              name="ticketNumber"
              value={ticketNumber}
              onChange={(e) => { setTicketNumber(e.target.value); setError(''); }}
              placeholder="e.g. TKT4A2B3C1D"
              type="text"
              autoComplete="off"
              readOnly={!!prefillTicketId}
              className={prefillTicketId ? 'readonly-input' : ''}
            />

            <label htmlFor="reason">Reason for Cancellation</label>
            <select
              id="reason"
              name="reason"
              value={reason}
              onChange={(e) => { setReason(e.target.value); setError(''); }}
              className="cancel-select"
            >
              <option value="">-- Select a reason --</option>
              {CANCEL_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            {error && <div className="cancel-message cancel-error">⚠️ {error}</div>}

            <button
              type="submit"
              className="cancel-submit-button"
              disabled={loading}
            >
              {loading ? 'Cancelling...' : 'Cancel Ticket'}
            </button>

            <button
              type="button"
              className="cancel-back-button"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Go Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default CancelBooking;
