import React from 'react';
import './FilterSidebar.css';

const FilterSidebar = ({ selectedFilters, onFilterChange, onClearAll }) => {
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    onFilterChange(name, checked);
  };

  return (
    <div className="filter-sidebar">
      <div className="sidebar-header">
        <h3>Filters</h3>
        <button type="button" className="clear-btn" onClick={onClearAll}>Clear All</button>
      </div>
      <hr />
      
      <div className="filter-group">
        <h4>Bus Type</h4>
        <div className="filter-options">
          <label>
            <input 
              type="checkbox" 
              name="AC" 
              checked={selectedFilters.AC}
              onChange={handleCheckboxChange} 
            /> AC
          </label>
          <label>
            <input 
              type="checkbox" 
              name="NonAC" 
              checked={selectedFilters.NonAC}
              onChange={handleCheckboxChange} 
            /> Non-AC
          </label>
          <label>
            <input 
              type="checkbox" 
              name="Sleeper" 
              checked={selectedFilters.Sleeper}
              onChange={handleCheckboxChange} 
            /> Sleeper
          </label>
          <label>
            <input
              type="checkbox"
              name="Seater"
              checked={selectedFilters.Seater}
              onChange={handleCheckboxChange}
            /> Seater
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;