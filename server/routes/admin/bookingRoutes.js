const express = require("express");
const { getAllBookings, refundBooking } = require("../../controller/admin/bookingController");

const router = express.Router();

router.get("/", getAllBookings);
router.post("/:id/refund", refundBooking);

module.exports = router;
