import React from 'react';
import BusCard from './BusCard';
import './BusPairCard.css';

const BusPairCard = ({ pair, goingDate, returnDate, onSelectSeats }) => {
  return (
    <div className="bus-pair-card">
      <div className="pair-bus-section">
        <h4 className="pair-title">Going Date Bus ({goingDate})</h4>
        <BusCard bus={pair.outbound} showSelectSeats={false} />
      </div>

      <div className="pair-bus-section">
        <h4 className="pair-title">Return Date Bus ({returnDate})</h4>
        <BusCard bus={pair.return} showSelectSeats={false} />
      </div>

      <div className="pair-total-price">
        <div className='pair-total-inner'>
          <p>Total Price</p>
        <strong>₹{pair.totalPrice}</strong>
        </div>
        
        <button type="button" className="select-seats-btn" onClick={() => onSelectSeats(pair.outbound, pair)}>
          Select Seats
        </button>
      </div>
    </div>
  );
};

export default BusPairCard;
