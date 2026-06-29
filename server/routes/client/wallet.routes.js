const router = require('express').Router();
const { getWallet, topUp } = require('../../controller/client/wallet.controller');
const { protect } = require('../../middleware/authMiddleware');

router.get('/',        protect, getWallet);
router.post('/topup',  protect, topUp);

module.exports = router;
 
 