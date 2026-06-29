import React, { useEffect, useMemo, useState } from "react";
import "./SeatLayout.css";
import "./SeatLayoutSeater.css";
import "./SeatLayoutSleeper.css";
import "./SeatLayoutMixed.css";
import { seatLayouts } from "../data/busData";

const layoutTabs = [
  { key: "mixed", label: "Mixed", layoutId: "mixed-seater-lower-sleeper-upper" },
  { key: "sleeper", label: "Sleeper", layoutId: "sleeper-2x1" },
  { key: "seater", label: "Seater", layoutId: "seater-37" }
];

const layoutMeta = {
  "mixed-seater-lower-sleeper-upper": {
    title: "SeatLayoutMixed",
    subtitle: "Lower deck seater + upper deck sleeper"
  },
  "sleeper-2x1": {
    title: "SeatLayoutSleeper",
    subtitle: "2 + 1 two-deck sleeper"
  },
  "seater-37": {
    title: "SeatLayoutSeater",
    subtitle: "2 + 2 single-deck seater"
  }
};

const busTypeLayoutMap = {
  "2+2 Seater": "seater-37",
  "2+1 Sleeper": "sleeper-2x1",
  "2+1 Mixed": "mixed-seater-lower-sleeper-upper"
};

const getSeatClassName = (seat, isSeater, isMixedSeaterDeck) => {
  const baseClass = isSeater ? "admin-seat-box admin-seat-box-seater" : "admin-seat-box";
  const mixedSeaterClass = isMixedSeaterDeck ? " admin-seat-box-mixed-seater" : "";
  const femaleClass = seat.femaleOnly ? " female-only" : " available";
  return `${baseClass}${mixedSeaterClass}${femaleClass}`;
};

export default function SeatLayout({ selectedBusType }) {
  const defaultLayoutId = busTypeLayoutMap[selectedBusType] || "mixed-seater-lower-sleeper-upper";
  const [activeLayoutId, setActiveLayoutId] = useState(defaultLayoutId);

  useEffect(() => {
    setActiveLayoutId(defaultLayoutId);
  }, [defaultLayoutId]);

  const activeLayout = useMemo(
    () => seatLayouts.find((layout) => layout.id === activeLayoutId),
    [activeLayoutId]
  );

  const activeMeta = activeLayout ? layoutMeta[activeLayout.id] : null;

  const renderSeat = (seat, seatKey, isSeater, isMixedSeaterDeck = false) => {
    if (!seat) {
      const spacerClass = isSeater
        ? "admin-seat-slot spacer seater-spacer"
        : isMixedSeaterDeck
          ? "admin-seat-slot spacer mixed-seater-spacer"
          : "admin-seat-slot spacer sleeper-spacer";
      return <div key={seatKey} className={spacerClass} />;
    }

    return (
      <div key={seatKey} className={getSeatClassName(seat, isSeater, isMixedSeaterDeck)}>
        <span className="seat-number">{seat.seatNo}</span>
        {seat.femaleOnly ? <span className="seat-tag">F</span> : null}
        <span className="seat-status-label price">₹{seat.price}</span>
      </div>
    );
  };

  const renderSeaterLayout = (rows) => (
    <div className="admin-seater-layout">
      <div className="admin-seater-map-wrapper">
        <div className="admin-seater-map-card">
          <div className="admin-seater-map-header">
            <span className="admin-steering-wheel" aria-hidden="true" />
          </div>
          <div className="admin-seat-grid">
            {rows.map((row, rowIndex) => (
              <div key={`seater-row-${rowIndex}`} className="admin-seat-row admin-seater-row">
                {row.map((seat, seatIndex) => renderSeat(seat, `seater-${rowIndex}-${seatIndex}`, true))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDeckPanel = (deck, isMixed) => {
    const isMixedSeaterDeck = isMixed && deck.layoutType === "seater";
    const rowClassName = isMixedSeaterDeck
      ? "admin-seat-row admin-deck-seat-row admin-mixed-seater-row"
      : "admin-seat-row admin-deck-seat-row";

    return (
      <div
        key={`${activeLayout.id}-${deck.name}`}
        className={`admin-deck-panel${isMixedSeaterDeck ? " admin-deck-panel-seater" : ""}`}
      >
        <div className="admin-deck-panel-header">
          <h5>{deck.label}</h5>
          {deck.hasSteeringWheel ? <span className="admin-steering-wheel" aria-hidden="true" /> : null}
        </div>
        <div className="admin-deck-seat-grid">
          {deck.rows.map((row, rowIndex) => (
            <div key={`${deck.name}-row-${rowIndex}`} className={rowClassName}>
              {row.map((seat, seatIndex) =>
                renderSeat(seat, `${deck.name}-${rowIndex}-${seatIndex}`, false, isMixedSeaterDeck)
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="admin-seat-layout-panel">
      <div className="admin-seat-layout-header">
        <h3>Seat Layout Preview</h3>
        <p>Read-only preview of the same 3 seat layouts used in client booking.</p>
      </div>

      <div className="admin-layout-toggle" role="tablist" aria-label="Seat layout type">
        {layoutTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeLayoutId === tab.layoutId}
            className={`layout-toggle-btn${activeLayoutId === tab.layoutId ? " active" : ""}`}
            onClick={() => setActiveLayoutId(tab.layoutId)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="admin-seat-legend">
        <span><i className="legend-chip general" />General Seat</span>
        <span><i className="legend-chip female" />Female Seat</span>
      </div>

      {activeLayout ? (
        <article className="admin-layout-card">
          <header className="layout-card-header">
            <h4>{activeMeta.title}</h4>
            <p>{activeMeta.subtitle}</p>
          </header>

          {activeLayout.type === "seater" ? (
            renderSeaterLayout(activeLayout.rows)
          ) : (
            <div className={`admin-deck-layout-grid${activeLayout.type === "mixed" ? " mixed-layout" : " sleeper-layout"}`}>
              {activeLayout.decks.map((deck) => renderDeckPanel(deck, activeLayout.type === "mixed"))}
            </div>
          )}
        </article>
      ) : null}
    </section>
  );
}
