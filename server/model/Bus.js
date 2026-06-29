const mongoose = require("mongoose");

const BusSchema = new mongoose.Schema(
  {
    busName: {
      type: String,
      required: [true, "Bus name is required"],
      trim: true,
      minlength: [2, "Bus name must be at least 2 characters"],
    },
    busNumber: {
      type: String,
      required: [true, "Bus number is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    busType: {
      type: String,
      enum: ["2+2 Seater", "2+1 Sleeper", "2+1 Mixed"],
      required: [true, "Bus type is required"],
    },
    coach: {
      type: String,
      enum: ["AC", "NON-AC"],
      required: [true, "Coach type is required"],
    },
    seatLayout: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

const Bus = mongoose.model("Bus", BusSchema);

module.exports = Bus;
