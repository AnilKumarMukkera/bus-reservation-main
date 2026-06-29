import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Booking.css";
import { useNavigate } from "react-router-dom";

function BookingPage() {
  const navigate = useNavigate();
  const [bookedTickets, setBookedTickets] = useState([]);
  const [cancelledTickets, setCancelledTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view your bookings.");
        setLoading(false);
        return;
      }

      setLoading(true);
      const res = await axios.get("http://localhost:3939/api/bookings/mybookings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const allBookings = res.data.data;
        setBookedTickets(
          allBookings.filter(
            (b) =>
              b.status?.toLowerCase() === "confirmed" ||
              b.status?.toLowerCase() === "booked"
          )
        );
        setCancelledTickets(
          allBookings.filter((b) => b.status?.toLowerCase() === "cancelled")
        );
      } else {
        setError("Failed to load bookings");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred while fetching bookings"
      );
    } finally {
      setLoading(false);
    }
  };

  // Show success message if redirected back from cancel page
  useEffect(() => {
    fetchBookings();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="booking-loader">
        <div className="spinner"></div>
        <p>Fetching your active bookings...</p>
      </div>
    );
  }

  return (
    <div className="bookings-dashboard">
      <div className="dashboard-header">
        <h2>My Bookings Dashboard</h2>
        <button className="refresh-action-btn" onClick={fetchBookings}>
          Sync Tickets ↻
        </button>
      </div>

      {error && <div className="error-toast-banner">⚠️ {error}</div>}
      {successMsg && <div className="success-toast-banner">✅ {successMsg}</div>}

      {/* CONFIRMED TICKETS SECTION */}
      <section className="dashboard-section">
        <h3 className="section-title confirmed-title">Active Confirmed Bookings</h3>

        {bookedTickets.length > 0 ? (
          <div className="tickets-grid-layout">
            {bookedTickets.map((ticket) => (
              <div key={ticket._id} className="premium-booking-card">
                <div className="card-top-bar">
                  <span className="booking-id-tag">
                    Ticket: {ticket.ticketNumber || ticket.ticketId || ticket._id}
                  </span>
                  <span className="live-status-pill">Active Ticket</span>
                </div>

                <div className="card-main-details">
                  <div className="detail-item route-highlight">
                    <label>Journey Route</label>
                    <p>
                      {ticket.from} &rarr; {ticket.to}
                    </p>
                  </div>

                  <div className="detail-meta-row">
                    <div className="detail-item">
                      <label>Bus Operator</label>
                      <p className="operator-capitalize">
                        {ticket.busName || "rebel service"}
                      </p>
                    </div>
                    <div className="detail-item">
                      <label>Departure Date</label>
                      <p>{formatDate(ticket.date || ticket.dateOfBooking)}</p>
                    </div>
                    <div className="detail-item">
                      <label>Assigned Seats</label>
                      <p className="seats-list">
                        {(ticket.seats || []).join(", ") || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card-action-footer">
                  <button
                    onClick={() =>
                      navigate("/ticket", { state: { booking: ticket } })
                    }
                    className="action-btn-view"
                  >
                    🔍 View Ticket
                  </button>
                  <button
                    onClick={() => navigate("/feedback", { state: { booking: ticket } })}
                    className="action-btn-feedback"
                  >
                    ✍️ Write Feedback
                  </button>
                  <button
                    onClick={() => navigate("/cancel-booking", { state: { booking: ticket } })}
                    className="action-btn-cancel"
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-bookings-state">
            <p>No confirmed tickets found.</p>
            <button
              className="book-now-redirect"
              onClick={() => navigate("/")}
            >
              Book a New Journey
            </button>
          </div>
        )}
      </section>

      {/* CANCELLED TICKETS SECTION */}
      <section className="dashboard-section separated-section">
        <h3 className="section-title cancelled-title">Cancelled Records</h3>

        {cancelledTickets.length > 0 ? (
          <div className="tickets-grid-layout faded-layout">
            {cancelledTickets.map((ticket) => (
              <div
                key={ticket._id}
                className="premium-booking-card cancelled-variant"
              >
                <div className="card-top-bar">
                  <span className="booking-id-tag">
                    Ticket: {ticket.ticketNumber || ticket.ticketId || ticket._id}
                  </span>
                  <span className="cancelled-status-pill">Void / Cancelled</span>
                </div>
                <div className="card-main-details">
                  <div className="detail-item">
                    <label>Route</label>
                    <p>
                      {ticket.from} &rarr; {ticket.to}
                    </p>
                  </div>
                  <div className="detail-meta-row">
                    <div className="detail-item">
                      <label>Date</label>
                      <p>{formatDate(ticket.date || ticket.dateOfBooking)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-records-text">No history of cancelled tickets.</p>
        )}
      </section>
    </div>
  );
}

export default BookingPage;
