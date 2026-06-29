import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Feedback.css';

const RATINGS = [1, 2, 3, 4, 5];
const RATING_LABELS = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' };
const CATEGORIES = [
  'Overall Experience',
  'Bus Comfort & Cleanliness',
  'Punctuality & Schedule',
  'Driver & Staff',
  'Booking Experience',
  'Customer Service',
  'Value for Money',
  'Other',
];

function Feedback() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking || null;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Pre-fill user details from localStorage if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u.name) setName(u.name);
        if (u.email) setEmail(u.email);
      }
    } catch {}
  }, []);

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Name is required.';
    if (!email.trim()) e.email = 'Email is required.';
    if (!category) e.category = 'Please select a category.';
    if (!rating) e.rating = 'Please give a rating.';
    if (!feedback.trim()) e.feedback = 'Please write your feedback.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError('');
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await axios.post('http://localhost:3939/api/feedback', {
        name,
        email,
        category,
        rating,
        feedback,
        busName: booking?.busName || booking?.busName || '',
        busId: booking?.busId || booking?.bus?._id || booking?.bus || undefined,
        route: booking ? `${booking.from || ''} → ${booking.to || ''}` : '',
        ticketNumber: booking?.ticketNumber || booking?.bookingId || booking?._id || '',
      }, { headers });

      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="fb-page">
        <div className="fb-card fb-success-card">
          <div className="fb-success-icon">🎉</div>
          <h2 className="fb-success-title">Thank You!</h2>
          <p className="fb-success-msg">
            Your feedback has been submitted. We appreciate you taking the time
            to share your experience.
          </p>
          <button className="fb-btn fb-btn--primary" onClick={() => navigate('/bookings')}>
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  const activeRating = hoveredRating || rating;

  return (
    <div className="fb-page">
      <div className="fb-card">
        {/* Header */}
        <div className="fb-header">
          <div className="fb-header-icon">✍️</div>
          <div>
            <h1 className="fb-title">Write a Review</h1>
            <p className="fb-subtitle">
              {booking
                ? `${booking.from || ''} → ${booking.to || ''} · ${booking.busName || ''}`
                : 'Share your travel experience with us'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="fb-form">
          {/* Name & Email row */}
          <div className="fb-row">
            <div className="fb-field">
              <label htmlFor="fb-name" className="fb-label">Full Name *</label>
              <input
                id="fb-name"
                type="text"
                className={`fb-input ${errors.name ? 'fb-input--error' : ''}`}
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })); }}
                placeholder="Your name"
                aria-required="true"
              />
              {errors.name && <span className="fb-error">{errors.name}</span>}
            </div>
            <div className="fb-field">
              <label htmlFor="fb-email" className="fb-label">Email Address *</label>
              <input
                id="fb-email"
                type="email"
                className={`fb-input ${errors.email ? 'fb-input--error' : ''}`}
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                placeholder="your@email.com"
                aria-required="true"
              />
              {errors.email && <span className="fb-error">{errors.email}</span>}
            </div>
          </div>

          {/* Category */}
          <div className="fb-field">
            <label htmlFor="fb-category" className="fb-label">Feedback Category *</label>
            <select
              id="fb-category"
              className={`fb-input fb-select ${errors.category ? 'fb-input--error' : ''}`}
              value={category}
              onChange={(e) => { setCategory(e.target.value); setErrors(p => ({ ...p, category: '' })); }}
              aria-required="true"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.category && <span className="fb-error">{errors.category}</span>}
          </div>

          {/* Star Rating */}
          <div className="fb-field">
            <label className="fb-label">Overall Rating *</label>
            <div
              className="fb-stars"
              role="radiogroup"
              aria-label="Rating"
              onMouseLeave={() => setHoveredRating(0)}
            >
              {RATINGS.map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`fb-star ${activeRating >= star ? 'fb-star--active' : ''}`}
                  onClick={() => { setRating(star); setErrors(p => ({ ...p, rating: '' })); }}
                  onMouseEnter={() => setHoveredRating(star)}
                  aria-label={`${star} star${star > 1 ? 's' : ''}`}
                  aria-pressed={rating === star}
                >
                  ★
                </button>
              ))}
              {activeRating > 0 && (
                <span className="fb-rating-label">{RATING_LABELS[activeRating]}</span>
              )}
            </div>
            {errors.rating && <span className="fb-error">{errors.rating}</span>}
          </div>

          {/* Feedback text */}
          <div className="fb-field">
            <label htmlFor="fb-text" className="fb-label">Your Feedback *</label>
            <textarea
              id="fb-text"
              className={`fb-input fb-textarea ${errors.feedback ? 'fb-input--error' : ''}`}
              value={feedback}
              onChange={(e) => { setFeedback(e.target.value); setErrors(p => ({ ...p, feedback: '' })); }}
              placeholder="Tell us about your experience — what went well and what could be improved..."
              aria-required="true"
              maxLength={600}
            />
            <div className="fb-char-count">{feedback.length}/600</div>
            {errors.feedback && <span className="fb-error">{errors.feedback}</span>}
          </div>

          {/* Actions */}
          <div className="fb-divider" />
          <div className="fb-actions">
            <button
              type="button"
              className="fb-btn fb-btn--secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            {submitError && <span className="fb-error" style={{ flex: 1 }}>{submitError}</span>}
            <button type="submit" className="fb-btn fb-btn--primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Feedback;
