import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Feedback.css";

export default function Feedback() {
  const [search, setSearch] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeReply, setActiveReply] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3939/api/feedback");
      if (res.data.success) {
        setFeedbacks(res.data.feedbacks);
      } else {
        setError(res.data.message || "Failed to fetch feedback.");
      }
    } catch (err) {
      setError("Error fetching feedback. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openReply = (fb) => {
    setActiveReply(fb.id);
    setReplyText(fb.reply || "");
  };

  const submitReply = async (id) => {
    if (!replyText.trim()) return;
    setReplyLoading(true);
    try {
      const res = await axios.put(`http://localhost:3939/api/feedback/${id}/reply`, { reply: replyText });
      if (res.data.success) {
        setFeedbacks((prev) =>
          prev.map((f) => (f.id === id ? { ...f, reply: replyText, status: "Reviewed" } : f))
        );
        setActiveReply(null);
        setReplyText("");
      }
    } catch (err) {
      console.error("Reply failed:", err);
    } finally {
      setReplyLoading(false);
    }
  };

  const filteredFeedbacks = feedbacks.filter(
    (f) =>
      (f.userName || "").toLowerCase().includes(search.toLowerCase()) ||
      (f.busName || "").toLowerCase().includes(search.toLowerCase()) ||
      (f.route || "").toLowerCase().includes(search.toLowerCase()) ||
      (f.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (f.ticketNumber || "").toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? "star filled" : "star"}>{i < rating ? "★" : "☆"}</span>
    ));

  return (
    <div className="feedback-container">
      <div className="feedback-header">
        <h2>Customer Feedback</h2>
        <p>View and respond to customer reviews</p>
      </div>

      <input
        type="text"
        placeholder="Search by user, bus, route or email..."
        className="search-box"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="empty-text">Loading feedback...</p>
      ) : error ? (
        <p className="empty-text" style={{ color: "red" }}>{error}</p>
      ) : filteredFeedbacks.length === 0 ? (
        <p className="empty-text">No feedback found.</p>
      ) : (
        filteredFeedbacks.map((f) => (
          <div key={f.id} className="feedback-card">

            {/* Top row: user info + status badge */}
            <div className="feedback-top">
              <div className="feedback-user-info">
                <div className="feedback-avatar">{(f.userName || "?")[0].toUpperCase()}</div>
                <div>
                  <h4 className="feedback-username">{f.userName || "Anonymous"}</h4>
                  {f.email && <p className="feedback-email">{f.email}</p>}
                  <p className="feedback-date">{formatDate(f.createdAt)}</p>
                </div>
              </div>
              <span className={`status ${f.status === "New" ? "new" : "reviewed"}`}>
                {f.status}
              </span>
            </div>

            {/* Bus & route details */}
            {(f.busName || f.route) && (
              <div className="feedback-bus-info">
                {f.busName && (
                  <span className="bus-detail-chip">🚌 {f.busName}</span>
                )}
                {f.route && (
                  <span className="bus-detail-chip route-chip">📍 {f.route}</span>
                )}
                {f.ticketNumber && (
                  <span className="bus-detail-chip booking-chip">🎫 {f.ticketNumber}</span>
                )}
              </div>
            )}

            {/* Category + rating */}
            <div className="feedback-meta">
              {f.category && <span className="category-tag">{f.category}</span>}
              <div className="rating">{renderStars(f.rating)}</div>
            </div>

            {/* Review text */}
            <p className="comment">"{f.comment}"</p>

            {/* Admin reply */}
            {f.reply && activeReply !== f.id && (
              <div className="reply">
                <strong>Admin Reply:</strong> {f.reply}
              </div>
            )}

            {/* Reply form */}
            {activeReply === f.id ? (
              <div className="reply-form">
                <textarea
                  placeholder="Write your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={3}
                />
                <div className="reply-actions">
                  <button
                    className="reply-btn reply-btn--cancel"
                    onClick={() => setActiveReply(null)}
                    disabled={replyLoading}
                  >
                    Cancel
                  </button>
                  <button
                    className="reply-btn reply-btn--submit"
                    onClick={() => submitReply(f.id)}
                    disabled={replyLoading || !replyText.trim()}
                  >
                    {replyLoading ? "Sending..." : "Submit Reply"}
                  </button>
                </div>
              </div>
            ) : (
              <button className="reply-btn reply-btn--open" onClick={() => openReply(f)}>
                {f.reply ? "✏️ Edit Reply" : "💬 Reply"}
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
