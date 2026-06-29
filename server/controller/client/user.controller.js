const User = require('../../model/User');
const ApiError = require('../../utils/ApiError');
const asyncHandler = require('../../utils/asyncHandler');
const { sanitizeUser } = require('../../utils/helpers');
 
/* ══════════════════════════════════════════════════════════════
   GET /api/users/profile
   ══════════════════════════════════════════════════════════════ */
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw ApiError.notFound('User not found.');
  res.json({ success: true, user: sanitizeUser(user) });
});
 
/* ══════════════════════════════════════════════════════════════
   PUT /api/users/profile
   ══════════════════════════════════════════════════════════════ */
exports.updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'phone', 'gender', 'birthdate'];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });
 
  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });
  if (!user) throw ApiError.notFound('User not found.');
 
  res.json({
    success: true,
    message: 'Profile updated successfully.',
    user: sanitizeUser(user),
  });
});
 
/* ══════════════════════════════════════════════════════════════
   PUT /api/users/change-password
   ══════════════════════════════════════════════════════════════ */
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
 
  // Basic validation
  if (!newPassword || newPassword.length < 8) {
    throw ApiError.badRequest('New password must be at least 8 characters.');
  }

  const user = await User.findById(req.user._id).select('+password');
  if (!user) throw ApiError.notFound('User not found.');
 
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    throw ApiError.badRequest('Current password is incorrect.');
  }
 
  user.password = newPassword;
  await user.save();
 
  res.json({ success: true, message: 'Password changed successfully.' });
});

 
 