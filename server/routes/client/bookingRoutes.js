const express = require("express");
const { getUserBookings, cancelBooking } = require("../../controller/client/bookingController");
const { protect } = require("../../middleware/authMiddleware");

const router = express.Router();

router.get("/mybookings", protect, getUserBookings);
router.delete("/:id", protect, cancelBooking);

module.exports = router;
