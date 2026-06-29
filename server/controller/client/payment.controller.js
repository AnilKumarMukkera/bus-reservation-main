const Booking = require('../../model/Booking');
const Bus = require('../../model/Bus');
const Wallet = require('../../model/Wallet');
const Subscription = require('../../model/Subscription');
const ApiError = require('../../utils/ApiError');
const asyncHandler = require('../../utils/asyncHandler');
const walletCtrl = require('./wallet.controller');
const { v4: uuidv4 } = require('uuid');
const { SEAT_STATUS } = require('../../config/constants');
 
/* ── helpers (reused from booking.controller) ── */
function updateSeatStatuses(seatLayout, seatNos, newStatus) {
  const updateRows = (rows) => {
    for (const row of rows) {
      for (const seat of row) {
        if (seat && seatNos.includes(seat.seatNo)) seat.status = newStatus;
      }
    }
  };
  if (seatLayout.rows?.length) updateRows(seatLayout.rows);
  if (seatLayout.decks?.length) {
    for (const deck of seatLayout.decks) updateRows(deck.rows);
  }
}
 
function collectSeats(seatLayout) {
  const all = [];
  const push = (rows) => { for (const row of rows) for (const s of row) if (s) all.push(s); };
  if (seatLayout.rows?.length) push(seatLayout.rows);
  if (seatLayout.decks?.length) for (const d of seatLayout.decks) push(d.rows);
  return all;
}
 
function calcAmount(seatLayout, seatNos) {
  return collectSeats(seatLayout)
    .filter((s) => seatNos.includes(s.seatNo))
    .reduce((sum, s) => {
      const rawPrice = s && (s.price !== undefined ? s.price : 0);
      const p = Number(rawPrice || 0);
      if (!Number.isFinite(p)) {
        console.warn('Non-finite seat price encountered, treating as 0', { seatNo: s && s.seatNo, price: rawPrice });
        return sum;
      }
      return sum + p;
    }, 0);
}
 
/* ══════════════════════════════════════════════════════════════
   POST /api/payment/checkout
   Unified checkout — authenticated users only
   Body: { busId, from, to, date, seats, passengers,
     paymentMethod, withoutDriver? }
   ══════════════════════════════════════════════════════════════ */
exports.checkout = asyncHandler(async (req, res) => {
  const { paymentMethod } = req.body;

  if (!paymentMethod) throw ApiError.badRequest('Payment method is required.');

  // Support multi-leg booking payload: { legs: [{ busId, from, to, date, seats, passengerDetails, withoutDriver }] }
  let legs = Array.isArray(req.body.legs) && req.body.legs.length > 0 ? req.body.legs : null;

  // Backwards-compat: accept legacy `going` and `return` arrays from older clients
  if (!legs && (Array.isArray(req.body.going) || Array.isArray(req.body.return))) {
    legs = [];
    if (Array.isArray(req.body.going) && req.body.going.length > 0) {
      legs.push({ busId: req.body.busId, from: req.body.from, to: req.body.to, date: req.body.date, seats: req.body.going, passengerDetails: req.body.passengerDetails || [] });
    }
    if (Array.isArray(req.body.return) && req.body.return.length > 0) {
      // try to obtain return busId from common fields if provided
      const returnBusId = req.body.returnBusId || (req.body.returnBus && req.body.returnBus.busId) || null;
      legs.push({ busId: returnBusId, from: req.body.to, to: req.body.from, date: req.body.returnDate || req.body.return_date || null, seats: req.body.return, passengerDetails: [] });
    }
    if (legs.length === 0) legs = null;
  }

  if (!legs) {
    // single-leg legacy flow
    const { busId, from, to, date, seats, passengers, withoutDriver, passengerDetails } = req.body;
    if (!seats || !Array.isArray(seats) || seats.length === 0) {
      const keys = Object.keys(req.body || {}).join(', ');
      throw ApiError.badRequest(`Select at least one seat. Payload missing seats. Received keys: ${keys}`);
    }

    const bus = await Bus.findById(busId);
    if (!bus) throw ApiError.notFound('Bus not found.');
    if (bus.status && bus.status !== 'Active') throw ApiError.badRequest('Bus not available.');

    // Validate seat availability (only treat already booked seats as unavailable)
    const allSeats = collectSeats(bus.seatLayout);
    for (const sn of seats) {
      const seat = allSeats.find((s) => s.seatNo === sn);
      if (!seat) throw ApiError.badRequest(`Seat ${sn} does not exist.`);
      const status = (seat.status || '').toString().toLowerCase();
      if (status === 'booked' || status === (SEAT_STATUS.BOOKED || '').toString().toLowerCase()) {
        throw ApiError.badRequest(`Seat ${sn} is already booked.`);
      }
    }

    // Calculate fare server-side
    let totalAmount = calcAmount(bus.seatLayout, seats);
    if (!totalAmount || totalAmount === 0) totalAmount = bus.price * seats.length;

    // Coach bus — security deposit for without-driver
    let securityDeposit = 0;
    if (withoutDriver && bus.busCategory === 'Coach') {
      securityDeposit = 5000;
      totalAmount += securityDeposit;
    }

    // proceed to single-leg payment below by reusing existing logic (we'll fall through)
    req._single = { bus, from, to, date, seats, passengers, passengerDetails, withoutDriver, totalAmount, securityDeposit };
  } else {
    // multi-leg flow: validate all legs and compute raw amounts
    if (!Array.isArray(legs) || legs.length === 0) throw ApiError.badRequest('No legs provided for multi-leg booking.');
  }
 
  // Require authenticated user for checkout (guest booking removed)
  const userId = req.user ? req.user._id : null;
  if (!userId) throw ApiError.unauthorized('Login required to complete booking.');

  // ── Check active subscription discount ───────────────────
  let subscriptionDiscount = 0;
  if (userId) {
    const now = new Date();
    const activeSub = await Subscription.findOne({
      user: userId,
      status: 'active',
      expiryDate: { $gte: now },
    });
    if (activeSub) {
      subscriptionDiscount = activeSub.discountPercentage;
    }
  }

  // If single-leg flow was attached as req._single, use that; else process multi-leg
  if (req._single) {
    const single = req._single;
    let totalAmount = single.totalAmount;
    let securityDeposit = single.securityDeposit || 0;

    // Apply discounts server-side
    let chargeAmount = totalAmount;
    if (subscriptionDiscount > 0) chargeAmount = chargeAmount * (1 - subscriptionDiscount / 100);
    if (paymentMethod === 'wallet') chargeAmount = chargeAmount * 0.95;
    chargeAmount = Math.round(chargeAmount * 100) / 100;
    if (!Number.isFinite(chargeAmount) || Math.abs(chargeAmount) > 1e12) {
      throw ApiError.badRequest(`Computed chargeAmount is invalid: ${chargeAmount}`);
    }

    // Process payment once
    const paymentId = `SIM-${uuidv4().substring(0, 8).toUpperCase()}`;
    if (paymentMethod === 'wallet') {
      if (!userId) throw ApiError.unauthorized('Login required for wallet payment.');
      // explicit check to provide clear error when balance insufficient
      const wallet = await Wallet.findOne({ user: userId });
      const balance = wallet ? Number(wallet.balance || 0) : 0;
      const amountNum = Number(chargeAmount || 0);
      if (balance < amountNum) {
        throw ApiError.badRequest(`Insufficient wallet balance. Available: ₹${balance}, Required: ₹${amountNum}`);
      }
      await walletCtrl.deductWallet(userId, amountNum, `Payment for ${single.bus.busName || single.bus.name || 'bus'} (${single.from}→${single.to})`);
    }

    // Book seats and create one booking
    updateSeatStatuses(single.bus.seatLayout, single.seats, SEAT_STATUS.BOOKED);
    single.bus.seatsAvailable = Math.max(0, (single.bus.seatsAvailable || 0) - single.seats.length);
    single.bus.markModified('seatLayout');
    await single.bus.save();

    let booking;
    try {
      booking = await Booking.create({
        user: userId,
        userId: userId,
        userName: req.user.name,
        bus: single.bus._id,
        busName: single.bus.busName || single.bus.name,
        busNumber: single.bus.busNumber,
        route: `${single.from} → ${single.to}`,
        from: single.from,
        to: single.to,
        date: single.date,
        seats: single.seats,
        seatsCount: single.seats.length,
        passengers: Number(single.passengers) || single.seats.length,
        passengerDetails: Array.isArray(single.passengerDetails) ? single.passengerDetails : [],
        totalAmount: chargeAmount,
        securityDeposit,
        withoutDriver: !!single.withoutDriver,
        paymentMethod,
        paymentId,
      });
    } catch (createErr) {
      console.error('Error creating booking in checkout:', createErr && createErr.stack ? createErr.stack : createErr);
      if (createErr.name === 'ValidationError') {
        const details = Object.values(createErr.errors).map(e => e.message);
        return res.status(400).json({ success: false, message: 'Validation error', details });
      }
      return res.status(500).json({ success: false, message: 'Error creating booking', error: createErr.message });
    }

    return res.status(201).json({ success: true, message: 'Booking confirmed! Your e-ticket is ready.', booking: {
      id: booking._id,
      ticketNumber: booking.ticketNumber,
      busName: booking.busName,
      route: booking.route,
      from: booking.from,
      to: booking.to,
      date: booking.date,
      seats: booking.seats,
      passengerDetails: booking.passengerDetails,
      totalAmount: booking.totalAmount,
      securityDeposit: booking.securityDeposit,
      paymentMethod: booking.paymentMethod,
      paymentId: booking.paymentId,
      status: booking.status,
      createdAt: booking.createdAt,
    }});
  }

  // Multi-leg processing
  // Validate each leg and compute raw per-leg amounts
  const legData = [];
  let rawSum = 0;
  // Debug: log incoming legs (shallow) to catch malformed payloads
  try {
    console.log('Checkout received legs count:', Array.isArray(legs) ? legs.length : 0);
  } catch (e) {
    /* ignore */
  }
  for (const leg of legs) {
    const { busId, from: lfrom, to: lto, date: ldate, seats: lseats = [], passengerDetails: lpass = [], withoutDriver: lwithout } = leg;
    if (!busId || !Array.isArray(lseats) || lseats.length === 0) throw ApiError.badRequest('Each leg must include busId and seats[]');
    // Normalize seats array: client may send seat objects instead of seatNo strings
    const seatNos = lseats.map(s => (s && typeof s === 'object' && s.seatNo) ? String(s.seatNo) : String(s));
    // Sanity check: don't allow absurd seat counts
    if (seatNos.length > 200) throw ApiError.badRequest(`Too many seats requested for a single leg: ${seatNos.length}`);
    const bus = await Bus.findById(busId);
    if (!bus) throw ApiError.notFound('Bus not found for one of the legs.');
    if (bus.status && bus.status !== 'Active') throw ApiError.badRequest('Bus not available for one of the legs.');

    // validate seats (only 'booked' blocks)
    const allSeats = collectSeats(bus.seatLayout);
    for (const sn of seatNos) {
      const seat = allSeats.find((s) => s.seatNo === sn);
      if (!seat) throw ApiError.badRequest(`Seat ${sn} does not exist on bus ${busId}.`);
      const status = (seat.status || '').toString().toLowerCase();
      if (status === 'booked' || status === (SEAT_STATUS.BOOKED || '').toString().toLowerCase()) {
        throw ApiError.badRequest(`Seat ${sn} is already booked on bus ${busId}.`);
      }
    }

    // compute raw amount for this leg
    let raw = calcAmount(bus.seatLayout, seatNos);
    if (!raw || raw === 0) raw = (bus.price || 0) * lseats.length;
    // ensure bus.price numeric when used
    if ((!raw || raw === 0) && bus && bus.price !== undefined) {
      const bp = Number(bus.price || 0);
      if (!Number.isFinite(bp)) {
        throw ApiError.badRequest(`Invalid bus price for bus ${busId}.`);
      }
      raw = bp * seatNos.length;
    }
    if (!Number.isFinite(raw) || Math.abs(raw) > 1e12) {
      throw ApiError.badRequest(`Computed leg fare is invalid for bus ${busId}: ${raw}`);
    }
    let legSecurity = 0;
    if (lwithout && bus.busCategory === 'Coach') { legSecurity = 5000; raw += legSecurity; }

    legData.push({ bus, from: lfrom, to: lto, date: ldate, seats: seatNos, passengerDetails: Array.isArray(lpass) ? lpass : [], withoutDriver: !!lwithout, rawAmount: raw, securityDeposit: legSecurity });
    rawSum += raw;
  }

  // Log per-leg raw amounts for debugging and validate rawSum
  try {
    const legAmounts = legData.map((ld, idx) => ({ idx, busId: String(ld.bus._id), rawAmount: ld.rawAmount }));
    console.log('Multi-leg raw amounts:', { legAmounts, rawSum });
  } catch (e) {
    console.warn('Could not stringify leg amounts for debug:', e && e.message ? e.message : e);
  }

  if (!Number.isFinite(rawSum) || rawSum <= 0) throw ApiError.badRequest(`Invalid leg amounts computed: ${rawSum}`);
  // guard against absurdly large amounts (likely a bug). 1e12 ~ ₹1 trillion
  if (Math.abs(rawSum) > 1e12) {
    throw ApiError.badRequest(`Computed total fare is unexpectedly large: ${rawSum}. Please contact support.`);
  }

  // Apply discounts server-side on combined amount
  let combined = rawSum;
  if (subscriptionDiscount > 0) combined = combined * (1 - subscriptionDiscount / 100);
  if (paymentMethod === 'wallet') combined = combined * 0.95;
  combined = Math.round(combined * 100) / 100;

  // Process single payment for combined amount
  const paymentId = `SIM-${uuidv4().substring(0, 8).toUpperCase()}`;
  if (paymentMethod === 'wallet') {
    if (!userId) throw ApiError.unauthorized('Login required for wallet payment.');
    const wallet = await Wallet.findOne({ user: userId });
    const balance = wallet ? Number(wallet.balance || 0) : 0;
    const amountNum = Number(combined || 0);
    console.log('Wallet payment attempt:', { userId: String(userId), balance, amountNum });
    if (!Number.isFinite(amountNum) || Math.abs(amountNum) > 1e12) {
      throw ApiError.badRequest(`Computed combined amount is invalid: ${amountNum}`);
    }
    if (balance < amountNum) {
      throw ApiError.badRequest(`Insufficient wallet balance. Available: ₹${balance}, Required: ₹${amountNum}`);
    }
    await walletCtrl.deductWallet(userId, amountNum, `Payment for multi-leg booking`);
  }

  // Allocate combined amount proportionally to legs
  const bookingsCreated = [];
  let allocatedSum = 0;
  for (let i = 0; i < legData.length; i++) {
    const ld = legData[i];
    // proportional share
    let share = Math.round((ld.rawAmount / rawSum) * combined * 100) / 100;
    // last leg gets remainder to ensure total matches combined
    if (i === legData.length - 1) share = Math.round((combined - allocatedSum) * 100) / 100;
    allocatedSum += share;

    // Mark seats booked on this bus
    updateSeatStatuses(ld.bus.seatLayout, ld.seats, SEAT_STATUS.BOOKED);
    ld.bus.seatsAvailable = Math.max(0, (ld.bus.seatsAvailable || 0) - ld.seats.length);
    ld.bus.markModified('seatLayout');
    await ld.bus.save();

    // create booking record
    const created = await Booking.create({
      user: userId,
      userId: userId,
      userName: req.user.name,
      bus: ld.bus._id,
      busName: ld.bus.busName || ld.bus.name,
      busNumber: ld.bus.busNumber,
      route: `${ld.from} → ${ld.to}`,
      from: ld.from,
      to: ld.to,
      date: ld.date,
      seats: ld.seats,
      seatsCount: ld.seats.length,
      passengers: ld.seats.length,
      passengerDetails: Array.isArray(ld.passengerDetails) ? ld.passengerDetails : [],
      totalAmount: share,
      securityDeposit: ld.securityDeposit || 0,
      withoutDriver: !!ld.withoutDriver,
      paymentMethod,
      paymentId,
    });

    bookingsCreated.push(created);
  }

  // Respond with an array of bookings
  return res.status(201).json({ success: true, message: 'Multi-leg booking confirmed', bookings: bookingsCreated.map(b => ({
    id: b._id,
    ticketNumber: b.ticketNumber,
    busName: b.busName,
    route: b.route,
    from: b.from,
    to: b.to,
    date: b.date,
    seats: b.seats,
    passengerDetails: b.passengerDetails,
    totalAmount: b.totalAmount,
    securityDeposit: b.securityDeposit,
    paymentMethod: b.paymentMethod,
    paymentId: b.paymentId,
    status: b.status,
    createdAt: b.createdAt,
  })) });
});
 
// Guest booking/cancellation support removed — guest flows are not used in this application.
 
 