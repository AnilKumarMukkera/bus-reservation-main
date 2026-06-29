const router = require('express').Router();
const { checkout } = require('../../controller/client/payment.controller');
const { protect } = require('../../middleware/authMiddleware');

// Checkout requires authentication in this application (no guest bookings)
router.post('/checkout', protect, checkout);
 
module.exports = router;
 
 