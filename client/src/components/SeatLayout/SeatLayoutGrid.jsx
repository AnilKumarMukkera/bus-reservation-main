import React from 'react';
import './SeatLayoutGrid.css';
import './SeatLayoutSeater.css';
import './SeatLayoutSleeper.css';
import './SeatLayoutMixed.css';

const SeatLayoutGrid = ({ title, busName, seatRows, layoutType, getSeatClass, onSeatClick }) => {
  const hasDeckedSeats = seatRows.length > 0 && seatRows[0] && seatRows[0].rows;
  const layoutClassName = layoutType === 'mixed'
    ? 'seat-grid-panel mixed-layout'
    : hasDeckedSeats
      ? 'seat-grid-panel sleeper-layout'
      : 'seat-grid-panel seater-layout';

  const renderSeat = (seat, seatKey) => {
    if (!seat) {
      return <div key={seatKey} className="seat-slot spacer"></div>;
    }

    const sStatus = (seat.status || '').toString().toLowerCase();
    // Treat only 'booked' seats as disabled/unavailable. Ignore 'held' status on client.
    const isDisabled = sStatus === 'booked';

    return (
      <button
        key={seatKey}
        type="button"
        className={getSeatClass(seat)}
        onClick={() => onSeatClick(seat)}
        disabled={isDisabled}
      >
        <span className="seat-number">{seat.seatNo}</span>
        {seat.femaleOnly ? <span className="seat-tag">F</span> : null}
        {seat.status === 'booked' ? (
          <span className="seat-status-label sold">Sold</span>
        ) : (
          <span className="seat-status-label price">₹{seat.price}</span>
        )}
      </button>
    );
  };

  const renderDeckPanel = (deck) => (
    <div key={deck.name} className={`deck-panel${deck.layoutType ? ` deck-panel-${deck.layoutType}` : ''}`}>
      <div className="deck-panel-header">
        <h4>{deck.label}</h4>
        {deck.hasSteeringWheel ? <span className="steering-wheel" aria-hidden="true"></span> : null}
      </div>

      <div className="deck-seat-grid">
        {deck.rows.map((row, rowIndex) => (
          <div key={`${deck.name}-${rowIndex}`} className="deck-seat-row">
            {row.map((seat, seatIndex) => renderSeat(seat, `${deck.name}-${rowIndex}-${seatIndex}`))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={layoutClassName}>
      <div className="seat-grid-title">
        <h3>{title}</h3>
        <p>{busName}</p>
      </div>

      <div className="seat-legend">
        <span><i className="legend-box available"></i> Available</span>
        <span><i className="legend-box booked"></i> Booked</span>
        <span><i className="legend-box selected"></i> Selected</span>
        <span><i className="legend-box female-only"></i> Female only</span>
      </div>

      {hasDeckedSeats ? (
        <div className="deck-layout-grid">
          {seatRows.map((deck) => renderDeckPanel(deck))}
        </div>
      ) : (
        <div className="seater-map-wrapper">
          <div className="seater-map-card">
            <div className="seater-map-header">
              <span className="steering-wheel" aria-hidden="true"></span>
            </div>

            <div className="seat-grid">
              {seatRows.map((row, rowIndex) => (
                <div key={rowIndex} className="seat-row">
                  {row.map((seat, seatIndex) => renderSeat(seat, `${rowIndex}-${seatIndex}`))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatLayoutGrid;
