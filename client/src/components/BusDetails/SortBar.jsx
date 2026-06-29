import React from 'react';
import './SortBar.css';

const SortBar = ({ activeSort, onSortChange, count }) => {
  const sortOptions = ['Price', 'Ratings', 'Seats', 'Arrival', 'Departure'];

  return (
    <div className="sort-bar">
      <div className="sort-info">
        <span className="results-count">Showing {count} Buses on this route</span>
      </div>
      <div className="sort-buttons-container">
        <span className="sort-label">Sort by:</span>
        {sortOptions.map((option) => (
          <button
            key={option}
            className={`sort-btn ${activeSort === option ? 'active' : ''}`}
            onClick={() => onSortChange(option)}
          >
            {option} {activeSort === option ? '↓' : ''}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SortBar;