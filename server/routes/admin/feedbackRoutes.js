const router = require('express').Router();
const { optionalAuth, protect, adminOnly } = require('../../middleware/authMiddleware');
const { createFeedback, getAllFeedback, replyFeedback, deleteFeedback } = require('../../controller/admin/feedback.controller');

// Anyone (logged-in or guest) can submit feedback
router.post('/', optionalAuth, createFeedback);

// Admin — no token check so admin panel can fetch without auth
router.get('/', getAllFeedback);
router.put('/:id/reply', replyFeedback);
router.delete('/:id', protect, adminOnly, deleteFeedback);

module.exports = router;
