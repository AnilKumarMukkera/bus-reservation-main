const updateSeatLayoutPrice = (layout, newPrice) => {
  if (!layout) return layout;
  
  // Clone the layout to avoid mutating the original directly if it's cached
  const updatedLayout = JSON.parse(JSON.stringify(layout));

  const updateRows = (rows) => {
    for (let i = 0; i < rows.length; i++) {
      for (let j = 0; j < rows[i].length; j++) {
        const seat = rows[i][j];
        if (seat) {
          seat.price = newPrice;
        }
      }
    }
  };

  if (updatedLayout.type === 'seater' && updatedLayout.rows) {
    updateRows(updatedLayout.rows);
  } else if ((updatedLayout.type === 'sleeper' || updatedLayout.type === 'mixed') && updatedLayout.decks) {
    for (let i = 0; i < updatedLayout.decks.length; i++) {
      if (updatedLayout.decks[i].rows) {
        updateRows(updatedLayout.decks[i].rows);
      }
    }
  }

  return updatedLayout;
};

module.exports = {
  updateSeatLayoutPrice
};
