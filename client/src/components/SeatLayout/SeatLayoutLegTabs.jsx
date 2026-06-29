import React from 'react';
import './SeatLayoutLegTabs.css';

const SeatLayoutLegTabs = ({ isTwoWay, activeLeg, onChange, goingSelectedCount, returnSelectedCount }) => {
  if (!isTwoWay) {
    return null;
  }

  return (
    <div className="leg-tabs">
      <button
        type="button"
        className={activeLeg === 'going' ? 'leg-tab active' : 'leg-tab'}
        onClick={() => onChange('going')}
      >
        Going ({goingSelectedCount})
      </button>
      <button
        type="button"
        className={activeLeg === 'return' ? 'leg-tab active' : 'leg-tab'}
        onClick={() => onChange('return')}
      >
        Return ({returnSelectedCount})
      </button>
    </div>
  );
};

export default SeatLayoutLegTabs;
