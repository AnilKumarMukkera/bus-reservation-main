const Feedback = require('../../model/Feedback');
const ApiError = require('../../utils/ApiError');
const asyncHandler = require('../../utils/asyncHandler');
 
/* ══════════════════════════════════════════════════════════════
   POST /api/feedback
   User — submit feedback
   ══════════════════════════════════════════════════════════════ */
exports.createFeedback = asyncHandler(async (req, res) => {
  const { name, email, mobile, category, feedback, busName, busId, rating, route, bookingId, ticketNumber } = req.body;

  const fb = await Feedback.create({
    user: req.user ? req.user._id : undefined,
    busId: busId || undefined,
    userName: name || req.user?.name || 'Anonymous',
    email: email || req.user?.email,
    mobile,
    busName: busName || '',
    route: route || '',
    ticketNumber: ticketNumber || bookingId || '',
    category: category || 'Overall Experience',
    rating: rating || 5,
    comment: feedback,
  });
 
  res.status(201).json({
    success: true,
    message: 'Thank you for your feedback!',
    feedback: {
      id: fb._id,
      userName: fb.userName,
      category: fb.category,
      comment: fb.comment,
      rating: fb.rating,
      createdAt: fb.createdAt,
    },
  });
});
 
/* ══════════════════════════════════════════════════════════════
   GET /api/feedback/my
   User — get own feedback
   ══════════════════════════════════════════════════════════════ */
exports.getMyFeedback = asyncHandler(async (req, res) => {
  const feedbacks = await Feedback.find({ user: req.user._id }).sort('-createdAt');
  res.json({ success: true, count: feedbacks.length, feedbacks });
});
 
/* ══════════════════════════════════════════════════════════════
   GET /api/feedback
   Admin — get all feedback
   ══════════════════════════════════════════════════════════════ */
exports.getAllFeedback = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 50 } = req.query;
 
  const filter = {};
  if (status) filter.status = status;
 
  const total = await Feedback.countDocuments(filter);
  const feedbacks = await Feedback.find(filter)
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(Number(limit));
 
  const result = feedbacks.map((fb) => ({
    id: fb._id,
    userName: fb.userName,
    email: fb.email,
    busName: fb.busName,
    route: fb.route,
    ticketNumber: fb.ticketNumber,
    category: fb.category,
    rating: fb.rating,
    comment: fb.comment,
    status: fb.status,
    reply: fb.reply,
    createdAt: fb.createdAt,
  }));
 
  res.json({
    success: true,
    count: result.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    feedbacks: result,
  });
});
 
/* ══════════════════════════════════════════════════════════════
   PUT /api/feedback/:id/reply
   Admin — reply to feedback
   ══════════════════════════════════════════════════════════════ */
exports.replyFeedback = asyncHandler(async (req, res) => {
  const { reply } = req.body;
  if (!reply || !reply.trim()) {
    throw ApiError.badRequest('Reply cannot be empty.');
  }
 
  const fb = await Feedback.findByIdAndUpdate(
    req.params.id,
    { reply: reply.trim(), status: 'Reviewed' },
    { new: true }
  );
 
  if (!fb) throw ApiError.notFound('Feedback not found.');
 
  res.json({
    success: true,
    message: 'Reply sent successfully.',
    feedback: { id: fb._id, reply: fb.reply, status: fb.status },
  });
});
 
/* ══════════════════════════════════════════════════════════════
   DELETE /api/feedback/:id
   Admin — delete feedback
   ══════════════════════════════════════════════════════════════ */
exports.deleteFeedback = asyncHandler(async (req, res) => {
  const fb = await Feedback.findByIdAndDelete(req.params.id);
  if (!fb) throw ApiError.notFound('Feedback not found.');
  res.json({ success: true, message: 'Feedback deleted successfully.' });
});
 
 