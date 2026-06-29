import React from 'react';
import { Link } from 'react-router-dom';
import './SeatLayoutHeader.css';

const SeatLayoutHeader = ({ bus, routeState }) => {
  return (
    <div className="seat-layout-header">
      <div>
        <h2>{bus.name}</h2>
        <p>{bus.type}</p>
      </div>
      <Link to="/bus-details" state={routeState} className="back-link">Back to buses</Link>
    </div>
  );
};

export default SeatLayoutHeader;
