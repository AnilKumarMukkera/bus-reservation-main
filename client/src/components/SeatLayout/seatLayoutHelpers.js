import { buses, seatLayouts } from '../../data/busData';

export const findBusById = (busId) => {
  for (let i = 0; i < buses.length; i++) {
    if (String(buses[i].id) === String(busId)) {
      return buses[i];
    }
  }

  return null;
};

export const findLayoutById = (layoutId) => {
  for (let i = 0; i < seatLayouts.length; i++) {
    if (seatLayouts[i].id === layoutId) {
      return seatLayouts[i];
    }
  }

  return null;
};

export const cloneLayoutRows = (layout) => {
  const clonedRows = [];

  if (!layout) {
    return clonedRows;
  }

  if (layout.decks) {
    for (let i = 0; i < layout.decks.length; i++) {
      const deck = layout.decks[i];
      const clonedDeckRows = [];

      if (deck.rows) {
        for (let j = 0; j < deck.rows.length; j++) {
          const row = deck.rows[j];
          const clonedRow = [];

          for (let k = 0; k < row.length; k++) {
            if (row[k]) {
              clonedRow.push({ ...row[k] });
            } else {
              clonedRow.push(null);
            }
          }

          clonedDeckRows.push(clonedRow);
        }
      }

      clonedRows.push({
        name: deck.name,
        label: deck.label,
        hasSteeringWheel: deck.hasSteeringWheel,
        layoutType: deck.layoutType,
        rows: clonedDeckRows
      });
    }

    return clonedRows;
  }

  if (layout.rows) {
    for (let i = 0; i < layout.rows.length; i++) {
      const row = layout.rows[i];
      const clonedRow = [];

      for (let j = 0; j < row.length; j++) {
        if (row[j]) {
          clonedRow.push({ ...row[j] });
        } else {
          clonedRow.push(null);
        }
      }

      clonedRows.push(clonedRow);
    }
  }

  return clonedRows;
};
