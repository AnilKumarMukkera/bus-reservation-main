import React from 'react';
import './BusCard.css';

const BusCard = ({ bus, onSelectSeats, showSelectSeats = true }) => {
  return (
    <div className="bus-card">
      {/* 1. TRAVELS INFO SECTION */}
      <div className="bus-section info">
        <div className="top-row">
          <h3 className="bus-name">{bus.name}</h3>
          <span className="ad-tag">AD</span>
        </div>
        <p className="bus-type">{bus.type}</p>
        
        <div className="rating-row">
          <div className="rating-badge">
            <span className="star">★</span>
            {
              // Prefer server-provided avgRating; fall back to legacy `rating`
              (bus.avgRating !== undefined && bus.avgRating !== null) ? bus.avgRating.toFixed(1) : (bus.rating || 4.5)
            }
          </div>
          <span className="review-count">({bus.ratingCount ?? bus.reviewCount ?? 0})</span>
        </div>
      </div>

      {/* 2. JOURNEY TIMELINE SECTION */}
      <div className="bus-section timeline">
        <div className="time-block">
          <span className="time">{bus.departureTime}</span>
          <span className="location">Source</span>
        </div>
        
        <div className="duration-wrapper">
          <span className="duration-label">{bus.duration}</span>
          <div className="visual-path">
            <div className="dot"></div>
            <div className="path-line"></div>
            <div className="dot"></div>
          </div>
        </div>

        <div className="time-block">
          <span className="time">{bus.arrivalTime}</span>
          <span className="location">Destination</span>
        </div>
      </div>

      {/* 3. PRICING & SEAT SELECTION SECTION */}
      <div className="bus-section action">
        <div className="price-box">
          <span className="price-label">From</span>
          <span className="price-value">₹{bus.price}</span>
        </div>
        
        {showSelectSeats ? (
          <button className="select-seats-btn" onClick={() => onSelectSeats(bus)}>
            Select Seats
          </button>
        ) : null}
        
        <p className={`seats-status ${bus.seatsAvailable < 5 ? 'low' : ''}`}>
          {bus.seatsAvailable} Seats Left
        </p>
      </div>
    </div>
  );
};

export default BusCard;