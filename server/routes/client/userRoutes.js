const router = require('express').Router();
const path = require('path');
const { protect } = require('../../middleware/authMiddleware');
const { getProfile, updateProfile, changePassword } = require('../../controller/client/user.controller');
 
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
 
module.exports = router;
 
 