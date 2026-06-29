const express = require('express');
const { subscribe, getMySubscription } = require('../../controller/client/subscription.controller');
const { protect } = require('../../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, subscribe);
router.get('/my', protect, getMySubscription);

module.exports = router;
