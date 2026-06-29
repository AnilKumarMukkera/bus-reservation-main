const mongoose = require('mongoose');
const { WALLET_TX_TYPES } = require('../config/constants');
 
const transactionSchema = new mongoose.Schema({
  txId:      { type: String, required: true },
  amount:    { type: Number, required: true },
  type:      { type: String, enum: Object.values(WALLET_TX_TYPES), required: true },
  description:{ type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});
 
const walletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    balance: { type: Number, default: 0, min: 0 },
    transactions: [transactionSchema],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
 
module.exports = mongoose.model('Wallet', walletSchema);
 
 