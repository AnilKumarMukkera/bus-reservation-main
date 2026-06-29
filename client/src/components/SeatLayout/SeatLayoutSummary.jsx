import React from 'react';
import './SeatLayoutSummary.css';

const SeatLayoutSummary = ({
  currentLegLabel,
  selectedSeatCount,
  totalPrice,
  selectedSeats,
  isTwoWay,
  goingTotal,
  returnTotal,
  onContinue
}) => {
  return (
    <div className="seat-summary-panel">
      <h3>Selection Summary</h3>
      <p><strong>Current Leg:</strong> {currentLegLabel}</p>
      <p><strong>Selected Seats:</strong> {selectedSeatCount}</p>
      <p><strong>Total Price:</strong> ₹{totalPrice}</p>

      {isTwoWay ? (
        <div className="two-way-summary">
          <p><strong>Going Total:</strong> ₹{goingTotal}</p>
          <p><strong>Return Total:</strong> ₹{returnTotal}</p>
        </div>
      ) : null}

      <div className="selected-seat-list">
        {selectedSeats.length > 0 ? (
          selectedSeats.map((seat) => (
            <span key={seat.seatNo} className="selected-seat-chip">{seat.seatNo}</span>
          ))
        ) : (
          <p>No seats selected yet</p>
        )}
      </div>

      <button 
        type="button" 
        className="continue-btn" 
        onClick={onContinue}
        disabled={selectedSeatCount === 0}
      >
        Continue
      </button>
    </div>
  );
};

export default SeatLayoutSummary;
