const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    // A more generic ticket number used by the payment flow
    ticketNumber: {
      type: String,
      unique: true,
      default: () => 'TKT' + Math.random().toString(36).substring(2, 10).toUpperCase(),
    },

    // User references - optional to allow guest bookings
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    userName: {
      type: String,
    },

    // Backwards-compatible alias (some controllers use `user`)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // Bus references / info
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
    },
    busName: {
      type: String,
    },
    busNumber: {
      type: String,
    },

    // Route & travel info
    route: {
      type: String,
    },
    from: String,
    to: String,
    date: Date,

    // Seat counts / demographics
    seatsCount: {
      type: Number,
      default: 0,
    },
    maleSeats: {
      type: Number,
      default: 0,
    },
    femaleSeats: {
      type: Number,
      default: 0,
    },

    // Payment / booking financials
    totalAmount: {
      type: Number,
    },
    securityDeposit: {
      type: Number,
      default: 0,
    },
    paymentMethod: String,
    paymentId: String,

    // Guest fields
    guestEmail: String,
    guestPhone: String,

    // Additional flags and counts
    passengers: Number,
    withoutDriver: Boolean,

    // Status and dates
    dateOfBooking: {
      type: Date,
      default: Date.now,
    },
    rescheduledDate: Date,
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'Rescheduled'],
      default: 'confirmed',
    },

    // Refund tracking
    refunded: {
      type: Boolean,
      default: false,
    },
    refundedAt: {
      type: Date,
    },

    // Seats and passenger details
    seats: {
      type: [String],
      default: [],
    },
    passengerDetails: [
      {
        fullName: String,
        age: Number,
        gender: String,
        seatNo: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
