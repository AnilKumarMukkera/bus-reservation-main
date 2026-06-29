const Booking = require("../../model/Booking");
const walletCtrl = require("../client/wallet.controller");

/**
 * @desc    Get all bookings
 * @route   GET /api/admin/bookings
 * @access  Private/Admin
 */
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * @desc    Refund a cancelled booking — credits amount back to user wallet
 * @route   POST /api/admin/bookings/:id/refund
 * @access  Private/Admin
 */
const refundBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });
    if (booking.status !== "cancelled") return res.status(400).json({ success: false, message: "Only cancelled bookings can be refunded." });
    if (booking.refunded) return res.status(400).json({ success: false, message: "This booking has already been refunded." });

    const userId = booking.user || booking.userId;
    if (!userId) return res.status(400).json({ success: false, message: "No user associated with this booking. Cannot process wallet refund." });

    const refundAmount = booking.totalAmount || 0;
    await walletCtrl.creditWallet(
      userId,
      refundAmount,
      `Refund for booking ${booking.ticketNumber || booking._id} (${booking.route || ''})`
    );

    booking.refunded = true;
    booking.refundedAt = new Date();
    await booking.save();

    res.status(200).json({ success: true, message: `₹${refundAmount} refunded to user wallet successfully.`, booking });
  } catch (error) {
    console.error("Error processing refund:", error);
    res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};

module.exports = {
  getAllBookings,
  refundBooking,
};
