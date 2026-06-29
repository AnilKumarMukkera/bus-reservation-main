import React, { useState } from 'react';
import busphoto from '../../assets/busphoto.jpg';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import PassengerDetailsModal from './PassengerDetailsModal';

const busLocations = [
  'Hyderabad', 'Secunderabad', 'Nizamabad', 'Karimnagar', 'Warangal',
  'Khammam', 'Vijayawada', 'Guntur', 'Nellore', 'Tirupati', 'Chennai',
  'Bangalore', 'Mysore', 'Coimbatore', 'Madurai', 'Pune', 'Mumbai',
  'Nagpur', 'Aurangabad', 'Delhi', 'Agra', 'Jaipur', 'Ahmedabad',
  'Surat', 'Rajkot', 'Indore', 'Bhopal', 'Kolkata', 'Patna', 'Ranchi',
  'Bhubaneswar', 'Cuttack', 'Lucknow', 'Kanpur', 'Varanasi', 'Goa',
];

function Home() {
  const navigate = useNavigate();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [tripType, setTripType] = useState('oneway');
  const [date, setDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = () => {
    if (!from || !to || !date || !passengers || (tripType === 'twoway' && !returnDate)) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setShowModal(true);
  };

  const handleModalSubmit = (passengerDetails) => {
    setShowModal(false);
    navigate('/bus-details', {
      state: {
        from, to, date,
        returnDate: tripType === 'twoway' ? returnDate : '',
        passengers,
        passengerDetails,
        tripType: tripType === 'twoway' ? 'two-way' : 'one-way',
      },
    });
  };

  // Today's date for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <main className="home-page">
      {/* ── Hero Banner ── */}
      <section className="home-hero" aria-label="Hero banner">
        
        <div className="home-hero__overlay">
          <h1 className="home-hero__title">Find Your Perfect Bus</h1>
          <p className="home-hero__sub">Comfortable, affordable journeys across India</p>
        </div>
      </section>

      {/* ── Search Card ── */}
      <section className="home-search-wrapper" aria-label="Bus search form">
        <div className="home-card">
          <div className="home-card__header">
            <span className="home-card__icon" aria-hidden="true">🚌</span>
            <h2 className="home-card__title">Search Buses</h2>
          </div>

          {/* Trip Type Toggle */}
          <div className="home-trip-toggle" role="group" aria-label="Trip type">
            <button
              type="button"
              className={`home-trip-btn ${tripType === 'oneway' ? 'home-trip-btn--active' : ''}`}
              onClick={() => setTripType('oneway')}
              aria-pressed={tripType === 'oneway'}
            >
              ➡️ One Way
            </button>
            <button
              type="button"
              className={`home-trip-btn ${tripType === 'twoway' ? 'home-trip-btn--active' : ''}`}
              onClick={() => setTripType('twoway')}
              aria-pressed={tripType === 'twoway'}
            >
              🔄 Round Trip
            </button>
          </div>

          {/* Form Grid */}
          <div className="home-form-grid">

            {/* From */}
            <div className="home-field">
              <label htmlFor="from" className="home-label">
                <span className="home-label__icon">📍</span> From
              </label>
              <input
                list="locations"
                id="from"
                name="from"
                placeholder="Departure city"
                className="home-input"
                value={from}
                onChange={(e) => { setFrom(e.target.value); setError(''); }}
                autoComplete="off"
                aria-required="true"
              />
            </div>

            {/* To */}
            <div className="home-field">
              <label htmlFor="to" className="home-label">
                <span className="home-label__icon">🏁</span> To
              </label>
              <input
                list="locations"
                id="to"
                name="to"
                placeholder="Destination city"
                className="home-input"
                value={to}
                onChange={(e) => { setTo(e.target.value); setError(''); }}
                autoComplete="off"
                aria-required="true"
              />
            </div>

            <datalist id="locations">
              {busLocations.map((place) => (
                <option key={place} value={place} />
              ))}
            </datalist>

            {/* Date */}
            <div className="home-field">
              <label htmlFor="date" className="home-label">
                <span className="home-label__icon">📅</span> Travel Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                className="home-input"
                value={date}
                min={today}
                onChange={(e) => { setDate(e.target.value); setError(''); }}
                aria-required="true"
              />
            </div>

            {/* Return Date */}
            {tripType === 'twoway' && (
              <div className="home-field">
                <label htmlFor="returnDate" className="home-label">
                  <span className="home-label__icon">↩️</span> Return Date
                </label>
                <input
                  type="date"
                  id="returnDate"
                  name="returnDate"
                  className="home-input"
                  value={returnDate}
                  min={date || today}
                  onChange={(e) => { setReturnDate(e.target.value); setError(''); }}
                  aria-required="true"
                />
              </div>
            )}

            {/* Passengers */}
            <div className="home-field">
              <label htmlFor="passengers" className="home-label">
                <span className="home-label__icon">👥</span> Passengers
              </label>
              <select
                id="passengers"
                name="passengers"
                className="home-input home-select"
                value={passengers}
                onChange={(e) => { setPassengers(e.target.value); setError(''); }}
                aria-required="true"
              >
                <option value="">Select count</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? 'Passenger' : 'Passengers'}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Error */}
          {error && (
            <p className="home-error" role="alert" aria-live="polite">
              ⚠️ {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="button"
            className="home-search-btn"
            onClick={handleSubmit}
          >
            <span>🔍</span> Search Buses
          </button>

          {/* Trust badges */}
          <div className="home-trust-row" aria-label="Service highlights">
            <span className="home-trust-badge">✅ Safe & Secure</span>
            <span className="home-trust-badge">⚡ Instant Booking</span>
            <span className="home-trust-badge">💰 Best Fares</span>
          </div>
        </div>
      </section>

      {showModal && (
        <PassengerDetailsModal
          passengerCount={Number(passengers)}
          onSubmit={handleModalSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
    </main>
  );
}

export default Home;
