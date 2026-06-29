import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Bookings.css";

export default function Bookings() {
  const [search, setSearch]               = useState("");
  const [bookings, setBookings]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [refundingId, setRefundingId]     = useState(null);
  const [refundMsg, setRefundMsg]         = useState({ id: null, text: "", type: "" });

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3939/api/admin/bookings");
      if (res.data.success) setBookings(res.data.bookings);
      else setError(res.data.message || "Failed to fetch bookings.");
    } catch (err) {
      setError("Error fetching bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (booking) => {
    const isGuest = !booking.user && !booking.userId;
    if (isGuest) {
      setRefundMsg({ id: booking._id, text: "Guest booking — no wallet to refund", type: "error" });
      setTimeout(() => setRefundMsg({ id: null, text: "", type: "" }), 4000);
      return;
    }
    if (!window.confirm(`Refund ₹${booking.totalAmount?.toFixed(2)} to ${resolveUserName(booking)}?`)) return;
    setRefundMsg({ id: null, text: "", type: "" });
    setRefundingId(booking._id);
    try {
      const res = await axios.post(`http://localhost:3939/api/admin/bookings/${booking._id}/refund`);
      if (res.data.success) {
        setRefundMsg({ id: booking._id, text: `₹${booking.totalAmount?.toFixed(2)} refunded to wallet`, type: "success" });
        setBookings((prev) => prev.map((b) => b._id === booking._id ? { ...b, refunded: true } : b));
        if (selectedBooking?._id === booking._id) setSelectedBooking((prev) => ({ ...prev, refunded: true }));
      } else {
        setRefundMsg({ id: booking._id, text: res.data.message || "Refund failed.", type: "error" });
      }
    } catch (err) {
      setRefundMsg({ id: booking._id, text: err.response?.data?.message || "Refund failed.", type: "error" });
    } finally {
      setRefundingId(null);
      setTimeout(() => setRefundMsg({ id: null, text: "", type: "" }), 4000);
    }
  };

  // ── Helpers ────────────────────────────────────────────────

  /** Resolve display name: stored userName → first passenger name → guest email → "Guest" */
  const resolveUserName = (b) =>
    b.userName ||
    (b.passengerDetails?.[0]?.fullName) ||
    b.guestEmail ||
    "Guest";

  /** Resolve seat count: seatsCount → seats array → passengers → 0 */
  const resolveSeatCount = (b) =>
    (b.seatsCount != null && b.seatsCount > 0)
      ? b.seatsCount
      : Array.isArray(b.seats) && b.seats.length > 0
      ? b.seats.length
      : b.passengers || 0;

  /** Resolve gender counts from passengerDetails */
  const resolveGenderCounts = (b) => {
    if (b.passengerDetails && b.passengerDetails.length > 0) {
      const male   = b.passengerDetails.filter(p => (p.gender || "").toLowerCase() === "male").length;
      const female = b.passengerDetails.filter(p => (p.gender || "").toLowerCase() === "female").length;
      return { male, female };
    }
    return { male: b.maleSeats || 0, female: b.femaleSeats || 0 };
  };

  /** Ticket ID — prefer ticketNumber, fall back to short _id */
  const resolveTicketId = (b) =>
    b.ticketNumber || (b._id ? `#${String(b._id).slice(-8).toUpperCase()}` : "—");

  const formatDate = (ds) => {
    if (!ds) return "—";
    const d = new Date(ds);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) +
           " " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  const getStatusClass = (status = "") => {
    const s = status.toLowerCase();
    if (s === "confirmed")   return "confirmed";
    if (s === "cancelled")   return "cancelled";
    if (s === "rescheduled") return "rescheduled";
    return "pending";
  };

  const filteredBookings = bookings.filter((b) => {
    const q = search.toLowerCase();
    return (
      resolveUserName(b).toLowerCase().includes(q) ||
      (b.busName    && b.busName.toLowerCase().includes(q))    ||
        (b.ticketNumber && b.ticketNumber.toLowerCase().includes(q))
    );
  });

  // ── Details panel ─────────────────────────────────────────
  if (selectedBooking) {
    const b        = selectedBooking;
    const userName = resolveUserName(b);
    const seats    = resolveSeatCount(b);
    const genders  = resolveGenderCounts(b);
    const ticketId = resolveTicketId(b);

    return (
      <div className="booking-container">
        {/* ── Header ── */}
        <div className="detail-page-header">
          <button className="back-btn" onClick={() => setSelectedBooking(null)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Bookings
          </button>
          <div className="detail-title-row">
            <div>
              <h2 className="detail-page-title">Booking Details</h2>
              <p className="detail-ticket-id">{ticketId}</p>
            </div>
            <span className={`status-pill ${getStatusClass(b.status)}`}>
              {b.status || "—"}
              {b.refunded && <span className="refunded-tag">· Refunded</span>}
            </span>
          </div>
        </div>

        {/* ── Info cards ── */}
        <div className="detail-cards-grid">
          {/* Booking Info */}
          <div className="detail-card">
            <div className="detail-card-title">Booking Info</div>
            <div className="detail-rows">
              <div className="detail-row">
                <span className="dr-label">Ticket ID</span>
                <span className="dr-value mono">{ticketId}</span>
              </div>
              <div className="detail-row">
                <span className="dr-label">User Name</span>
                <span className="dr-value">{userName}</span>
              </div>
              <div className="detail-row">
                <span className="dr-label">Date of Booking</span>
                <span className="dr-value">{formatDate(b.dateOfBooking || b.createdAt)}</span>
              </div>
              <div className="detail-row">
                <span className="dr-label">Travel Date</span>
                <span className="dr-value">{b.date ? formatDate(b.date) : "—"}</span>
              </div>
            </div>
          </div>

          {/* Journey Info */}
          <div className="detail-card">
            <div className="detail-card-title">Journey</div>
            <div className="detail-rows">
              <div className="detail-row">
                <span className="dr-label">Bus</span>
                <span className="dr-value">{b.busName || "—"}</span>
              </div>
              <div className="detail-row">
                <span className="dr-label">Route</span>
                <span className="dr-value">{b.route || `${b.from || ""} → ${b.to || ""}` || "—"}</span>
              </div>
              <div className="detail-row">
                <span className="dr-label">Seat Numbers</span>
                <span className="dr-value">
                  {(b.seats && b.seats.length > 0) ? b.seats.join(", ") : "—"}
                </span>
              </div>
              <div className="detail-row">
                <span className="dr-label">Total Seats</span>
                <span className="dr-value">
                  {seats}
                  <span className="gender-split"> (M: {genders.male} · F: {genders.female})</span>
                </span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="detail-card">
            <div className="detail-card-title">Payment</div>
            <div className="detail-rows">
              <div className="detail-row">
                <span className="dr-label">Total Amount</span>
                <span className="dr-value amount">₹{b.totalAmount?.toFixed(2) ?? "—"}</span>
              </div>
              {b.securityDeposit > 0 && (
                <div className="detail-row">
                  <span className="dr-label">Security Deposit</span>
                  <span className="dr-value">₹{b.securityDeposit?.toFixed(2)}</span>
                </div>
              )}
              <div className="detail-row">
                <span className="dr-label">Payment Method</span>
                <span className="dr-value capitalize">{b.paymentMethod || "—"}</span>
              </div>
              <div className="detail-row">
                <span className="dr-label">Payment ID</span>
                <span className="dr-value mono">{b.paymentId || "—"}</span>
              </div>
            </div>
          </div>

          {/* Guest info if present */}
          {(b.guestEmail || b.guestPhone) && (
            <div className="detail-card">
              <div className="detail-card-title">Guest Info</div>
              <div className="detail-rows">
                {b.guestEmail && (
                  <div className="detail-row">
                    <span className="dr-label">Email</span>
                    <span className="dr-value">{b.guestEmail}</span>
                  </div>
                )}
                {b.guestPhone && (
                  <div className="detail-row">
                    <span className="dr-label">Phone</span>
                    <span className="dr-value">{b.guestPhone}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Refund action ── */}
        {b.status === "cancelled" && !b.refunded && (
          <div className="refund-banner">
            {refundMsg.id === b._id && (
              <p className={`refund-msg ${refundMsg.type}`}>{refundMsg.text}</p>
            )}
            <button
              className="btn btn-refund"
              disabled={refundingId === b._id}
              onClick={() => handleRefund(b)}
            >
              {refundingId === b._id ? "Processing..." : `Refund ₹${b.totalAmount?.toFixed(2)}`}
            </button>
          </div>
        )}

        {/* ── Passenger table ── */}
        <div className="passengers-section">
          <div className="section-title">Passenger Details</div>
          {b.passengerDetails && b.passengerDetails.length > 0 ? (
            <div className="passenger-table-wrapper">
              <table className="passenger-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Full Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Seat No</th>
                  </tr>
                </thead>
                <tbody>
                  {b.passengerDetails.map((p, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{p.fullName || "—"}</td>
                      <td>{p.age || "—"}</td>
                      <td>
                        <span className={`gender-badge ${(p.gender || "").toLowerCase()}`}>
                          {p.gender || "—"}
                        </span>
                      </td>
                      <td className="mono">{p.seatNo || (b.seats && b.seats[i]) || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-text">No passenger details available.</p>
          )}
        </div>
      </div>
    );
  }

  // ── Bookings list ─────────────────────────────────────────
  return (
    <div className="booking-container">
      <div className="booking-header">
        <div>
          <h2>Bookings Management</h2>
          <p>View and manage all customer bookings</p>
        </div>
      </div>

      <div className="search-row">
        <div className="search-wrapper">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="4.5" stroke="#94a3b8" strokeWidth="1.5"/>
            <path d="M10.5 10.5L13.5 13.5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search by ticket ID, user or bus name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-box"
          />
        </div>
        <span className="result-count">{filteredBookings.length} booking{filteredBookings.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="booking-table-wrapper">
        {loading ? (
          <p className="empty-text">Loading bookings…</p>
        ) : error ? (
          <p className="empty-text error-text">{error}</p>
        ) : filteredBookings.length === 0 ? (
          <p className="empty-text">No bookings found.</p>
        ) : (
          <table className="booking-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>User</th>
                <th>Bus</th>
                <th>Route</th>
                <th>Seats</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <tr key={b._id}>
                  <td className="mono ticket-id-cell">{resolveTicketId(b)}</td>
                  <td>{resolveUserName(b)}</td>
                  <td>{b.busName || "—"}</td>
                  <td>{b.route || "—"}</td>
                  <td>{resolveSeatCount(b)}</td>
                  <td>{formatDate(b.dateOfBooking || b.createdAt).split(" ")[0]}</td>
                  <td className="amount-cell">₹{b.totalAmount?.toFixed(2) ?? "—"}</td>
                  <td>
                    <span className={`status-pill ${getStatusClass(b.status)}`}>
                      {b.status || "—"}
                    </span>
                    {b.refunded && <span className="status-pill refunded ml-6">Refunded</span>}
                  </td>
                  <td>
                    <div className="action-group">
                      <button
                        className="btn btn-details"
                        onClick={() => { setRefundMsg({ id: null, text: "", type: "" }); setSelectedBooking(b); }}
                      >
                        Details
                      </button>
                      {b.status === "cancelled" && !b.refunded && (
                        <button
                          className="btn btn-refund"
                          disabled={refundingId === b._id}
                          onClick={() => handleRefund(b)}
                          title={!b.user && !b.userId ? "Guest booking — no wallet" : `Refund ₹${b.totalAmount?.toFixed(2)}`}
                        >
                          {refundingId === b._id ? "…" : "Refund"}
                        </button>
                      )}
                      {refundMsg.id === b._id && (
                        <span className={`inline-refund-msg ${refundMsg.type}`}>{refundMsg.text}</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
