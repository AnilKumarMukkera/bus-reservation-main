const Bus = require("../../model/Bus");
const Booking = require("../../model/Booking");
const Route = require("../../model/Route");
const { countAvailableSeats } = require('../../utils/helpers');

// legacy bookingId generation removed — `ticketNumber` on Booking model is canonical

// Legacy direct booking endpoint removed — bookings are created by the unified
// payment/checkout flow in `payment.controller.js`. The POST /api/bookings route
// was unused by the client and has been removed in favor of the single source of truth.

// server-side seat hold/reserve functionality removed; booking must create confirmed bookings

// server-side release endpoint removed

/**
 * @desc    Get logged in user's bookings
 * @route   GET /api/client/bookings/mybookings
 * @access  Private
 */
const getUserBookings = async (req, res) => {
  try {
    // Support bookings created with either `userId` or legacy `user` field
    const bookings = await Booking.find({ $or: [{ userId: req.user._id }, { user: req.user._id }] }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: bookings,
    });
    console.log(`Fetched ${bookings.length} bookings for user ${req.user._id}`);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * @desc    Cancel a booking — releases seats and deletes the booking record
 * @route   DELETE /api/bookings/:id
 * @access  Private
 */
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Only the owner can cancel their booking
    const ownerId = booking.userId || booking.user;
    if (!ownerId || String(ownerId) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorised to cancel this booking.' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled.' });
    }

    // Release the booked seats back to available on the bus
    const bus = await Bus.findById(booking.bus);
    if (bus && bus.seatLayout && booking.seats && booking.seats.length > 0) {
      const releaseInRows = (rows) => {
        for (const row of rows) {
          for (const seat of row) {
            if (seat && booking.seats.includes(seat.seatNo)) {
              seat.status = 'available';
            }
          }
        }
      };

      if (bus.seatLayout.rows && bus.seatLayout.rows.length) {
        releaseInRows(bus.seatLayout.rows);
      }
      if (bus.seatLayout.decks && bus.seatLayout.decks.length) {
        for (const deck of bus.seatLayout.decks) {
          if (deck.rows) releaseInRows(deck.rows);
        }
      }

      bus.seatsAvailable = (bus.seatsAvailable || 0) + booking.seats.length;
      bus.markModified('seatLayout');
      await bus.save();
      try {
        const avail = countAvailableSeats(bus.seatLayout);
        await Route.findOneAndUpdate({ busId: bus._id }, { availableSeats: avail });
      } catch (e) {
        console.warn('Could not update route availableSeats after cancel', e.message || e);
      }

    }
    // Mark booking as cancelled instead of deleting so it shows in Cancelled Records
    await Booking.findByIdAndUpdate(req.params.id, { status: 'cancelled' });

    return res.status(200).json({
      success: true,
      message: 'Booking cancelled and seats released successfully.',
    });
  } catch (error) {
    console.error('cancelBooking error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error cancelling booking.' });
  }
};

module.exports = {
  getUserBookings,
  cancelBooking,
};
