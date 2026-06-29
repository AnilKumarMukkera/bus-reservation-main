// Small helper utilities used across controllers
function sanitizeUser(user) {
  if (!user) return null;
  const u = user.toObject ? user.toObject() : { ...user };
  delete u.password;
  return u;
}
// Count seats with status 'available' in a seatLayout object
function countAvailableSeats(seatLayout) {
  if (!seatLayout) return 0;
  let count = 0;
  const countInRows = (rows) => {
    for (const row of rows) {
      for (const s of row) {
        if (!s) continue;
        if (s.status === 'available') count++;
      }
    }
  };

  if (seatLayout.rows && Array.isArray(seatLayout.rows)) countInRows(seatLayout.rows);
  if (seatLayout.decks && Array.isArray(seatLayout.decks)) {
    for (const d of seatLayout.decks) {
      if (d.rows && Array.isArray(d.rows)) countInRows(d.rows);
    }
  }
  return count;
}

module.exports = { sanitizeUser, countAvailableSeats };
