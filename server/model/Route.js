const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema(
  {
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: [true, "Bus ID is required"],
    },
    source: {
      type: String,
      required: [true, "Source city is required"],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, "Destination city is required"],
      trim: true,
    },
    duration: {
      type: String, // e.g., "5h 30m" or "330 minutes"
      required: [true, "Duration is required"],
    },
    departureTime: {
      type: String,
      required: [true, "Departure time is required"],
    },
    arrivalTime: {
      type: String,
      required: [true, "Arrival time is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    availableSeats: {
      type: Number,
      required: [true, "Available seats is required"],
      min: [0, "Available seats cannot be negative"],
    },
  },
  { timestamps: true }
);

// Ensure each bus can have only one active route (unique by busId)
RouteSchema.index({ busId: 1 }, { unique: true });

module.exports = mongoose.model("Route", RouteSchema);
