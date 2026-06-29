const mongoose = require('mongoose');
 
const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus' },
  userName: { type: String, required: true },
  email: { type: String },
  mobile: { type: String },
  busName: { type: String },
  route: { type: String },
  ticketNumber: { type: String },
  category: { type: String, default: 'buses' },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  comment: { type: String, required: true },
  status: { type: String, enum: ['New', 'Reviewed'], default: 'New' },
  reply: { type: String, default: '' },
}, { timestamps: true });
 
module.exports = mongoose.model('Feedback', feedbackSchema);
 
 