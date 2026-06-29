import React, { useState, useEffect, useRef } from 'react';
import './PassengerDetailsModal.css';

const PassengerDetailsModal = ({ passengerCount, onSubmit, onClose }) => {
  const [passengers, setPassengers] = useState(
    Array.from({ length: passengerCount }, () => ({
      fullName: '',
      age: '',
      gender: 'Male',
    }))
  );
  const [error, setError] = useState('');
  const firstInputRef = useRef(null);

  // Focus first input when modal opens
  useEffect(() => {
    if (firstInputRef.current) firstInputRef.current.focus();
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleChange = (index, field, value) => {
    setError('');
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const handleSubmit = () => {
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.fullName.trim()) {
        setError(`Please enter the full name for Passenger ${i + 1}.`);
        return;
      }
      if (!p.age || isNaN(p.age) || Number(p.age) <= 0 || Number(p.age) > 120) {
        setError(`Please enter a valid age for Passenger ${i + 1}.`);
        return;
      }
      if (!p.gender) {
        setError(`Please select a gender for Passenger ${i + 1}.`);
        return;
      }
    }
    setError('');
    onSubmit(passengers);
  };

  const genderIcons = { Male: '👨', Female: '👩' };

  return (
    <div
      className="pdm-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdm-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="pdm-modal">
        {/* Header */}
        <div className="pdm-header">
          <div className="pdm-header-left">
            <span className="pdm-icon">🧳</span>
            <div>
              <h2 id="pdm-title" className="pdm-title">Passenger Details</h2>
              <p className="pdm-subtitle">
                {passengerCount} {passengerCount === 1 ? 'passenger' : 'passengers'} · Fill in travel details
              </p>
            </div>
          </div>
          <button
            className="pdm-close-btn"
            onClick={onClose}
            aria-label="Close passenger details dialog"
          >
            ✕
          </button>
        </div>

        {/* Passenger forms */}
        <div className="pdm-body">
          {passengers.map((p, index) => (
            <div key={index} className="pdm-passenger-card">
              <div className="pdm-passenger-header">
                <span className="pdm-passenger-avatar">
                  {genderIcons[p.gender] || '🧑'}
                </span>
                <span className="pdm-passenger-label">Passenger {index + 1}</span>
              </div>

              <div className="pdm-fields">
                {/* Full Name */}
                <div className="pdm-field pdm-field--name">
                  <label htmlFor={`name-${index}`} className="pdm-label">
                    Full Name <span aria-hidden="true" className="pdm-required">*</span>
                  </label>
                  <div className="pdm-input-wrapper">
                    <span className="pdm-input-icon">👤</span>
                    <input
                      ref={index === 0 ? firstInputRef : null}
                      id={`name-${index}`}
                      type="text"
                      className="pdm-input"
                      value={p.fullName}
                      onChange={(e) => handleChange(index, 'fullName', e.target.value)}
                      placeholder="e.g. Vijay Patel"
                      autoComplete="name"
                      aria-required="true"
                    />
                  </div>
                </div>

                <div className="pdm-field-row">
                  {/* Age */}
                  <div className="pdm-field pdm-field--age">
                    <label htmlFor={`age-${index}`} className="pdm-label">
                      Age <span aria-hidden="true" className="pdm-required">*</span>
                    </label>
                    <div className="pdm-input-wrapper">
                      <span className="pdm-input-icon">🎂</span>
                      <input
                        id={`age-${index}`}
                        type="number"
                        className="pdm-input"
                        value={p.age}
                        onChange={(e) => handleChange(index, 'age', e.target.value)}
                        placeholder="Age"
                        min="1"
                        max="120"
                        aria-required="true"
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="pdm-field pdm-field--gender">
                    <label className="pdm-label">
                      Gender <span aria-hidden="true" className="pdm-required">*</span>
                    </label>
                    <div className="pdm-gender-group" role="radiogroup" aria-label={`Gender for passenger ${index + 1}`}>
                      {['Male', 'Female'].map((g) => (
                        <label
                          key={g}
                          className={`pdm-gender-option ${p.gender === g ? 'pdm-gender-option--selected' : ''}`}
                        >
                          <input
                            type="radio"
                            name={`gender-${index}`}
                            value={g}
                            checked={p.gender === g}
                            onChange={() => handleChange(index, 'gender', g)}
                            className="pdm-radio-hidden"
                          />
                          <span className="pdm-gender-icon">{genderIcons[g]}</span>
                          <span className="pdm-gender-text">{g}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="pdm-error" role="alert">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Footer */}
        <div className="pdm-footer">
          <button className="pdm-btn pdm-btn--secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="pdm-btn pdm-btn--primary" onClick={handleSubmit}>
            Continue to Buses →
          </button>
        </div>
      </div>
    </div>
  );
};

export default PassengerDetailsModal;
