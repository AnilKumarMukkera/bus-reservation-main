const Wallet = require('../../model/Wallet');
const ApiError = require('../../utils/ApiError');
const asyncHandler = require('../../utils/asyncHandler');
const { v4: uuidv4 } = require('uuid');
 
/* ── GET /api/wallet  — get my wallet ── */
exports.getWallet = asyncHandler(async (req, res) => {
  let wallet = await Wallet.findOne({ user: req.user._id });
  if (!wallet) {
    wallet = await Wallet.create({ user: req.user._id, balance: 0, transactions: [] });
  }
  res.json({ success: true, wallet });
});
 
/* ── POST /api/wallet/topup  — add money ── */
exports.topUp = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) throw ApiError.badRequest('Amount must be positive.');
 
  let wallet = await Wallet.findOne({ user: req.user._id });
  if (!wallet) wallet = await Wallet.create({ user: req.user._id, balance: 0, transactions: [] });
 
  wallet.balance += Number(amount);
  wallet.transactions.push({
    txId: uuidv4(),
    amount: Number(amount),
    type: 'topup',
    description: `Wallet top-up of ₹${amount}`,
  });
  await wallet.save();
 
  res.json({ success: true, message: `₹${amount} added to wallet.`, wallet });
});
 
/* ── internal: deduct wallet for payment ── */
exports.deductWallet = async (userId, amount, description) => {
  const wallet = await Wallet.findOne({ user: userId });
  if (!wallet) throw ApiError.badRequest('Wallet not found. Please top up first.');
  if (wallet.balance < amount) throw ApiError.badRequest('Insufficient wallet balance.');
 
  wallet.balance -= amount;
  wallet.transactions.push({
    txId: uuidv4(),
    amount,
    type: 'debit',
    description,
  });
  await wallet.save();
  return wallet;
};
 
/* ── internal: credit wallet (refund) ── */
exports.creditWallet = async (userId, amount, description) => {
  let wallet = await Wallet.findOne({ user: userId });
  if (!wallet) wallet = await Wallet.create({ user: userId, balance: 0, transactions: [] });
 
  wallet.balance += amount;
  wallet.transactions.push({
    txId: uuidv4(),
    amount,
    type: 'refund',
    description,
  });
  await wallet.save();
  return wallet;
};
 
 