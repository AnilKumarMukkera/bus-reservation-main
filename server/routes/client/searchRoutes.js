const express = require("express");
const Route = require("../../model/Route");
const Bus = require("../../model/Bus");
const { countAvailableSeats } = require('../../utils/helpers');

const Feedback = require('../../model/Feedback');

const router = express.Router();

/**
 * @route   POST /api/client/search
 * @desc    Search buses by source, destination, and date
 * @access  Public
 * @body    { source, destination, startDate, returnDate (optional) }
 */
router.post("/search", async (req, res) => {
  try {
    const { source, destination, startDate, returnDate } = req.body;

    // Validate required fields
    if (!source || !destination || !startDate) {
      return res.status(400).json({
        success: false,
        message: "source, destination, and startDate are required",
      });
    }

    // Convert startDate to Date range (start of day to end of day)
    const searchDate = new Date(startDate);
    const dayStart = new Date(searchDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(searchDate);
    dayEnd.setHours(23, 59, 59, 999);

    // Query routes matching source, destination, and startDate
    const routes = await Route.find({
      source: { $regex: source, $options: "i" }, // Case-insensitive search
      destination: { $regex: destination, $options: "i" },
      startDate: { $gte: dayStart, $lte: dayEnd }
    })
      .populate("busId", "busName busNumber busType coach seatLayout")
      .sort({ price: 1 }); // Sort by price ascending

    if (routes.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No routes found",
        data: [],
      });
    }

    // Collect busIds for rating lookup
    const busIds = routes.map(r => (r.busId && r.busId._id) || null).filter(Boolean);

    // Aggregate feedbacks by busId to compute average rating and count
    let ratingsMap = {};
    try {
      const agg = await Feedback.aggregate([
        { $match: { busId: { $in: busIds } } },
        { $group: { _id: '$busId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
      ]);
      agg.forEach(a => {
        // Use string form of ObjectId as key
        ratingsMap[String(a._id)] = { avgRating: Number(a.avgRating.toFixed(1)), count: a.count };
      });
    } catch (e) {
      console.warn('Could not aggregate feedback ratings:', e && e.message ? e.message : e);
      ratingsMap = {};
    }

    // Transform routes to bus card format
    const buses = routes.map((route) => ({
      id: route._id, // Use route ID as unique identifier
      busId: route.busId._id,
      name: route.busId.busName,
      busNumber: route.busId.busNumber,
      type: `${route.busId.busType} - ${route.busId.coach}`,
      departureTime: route.departureTime || new Date(route.startDate).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      arrivalTime: route.arrivalTime || new Date(route.endDate).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      duration: route.duration,
      price: route.price,
      // Attach dynamic rating if available, otherwise fall back to static placeholders
      avgRating: ratingsMap[String(route.busId._id)] ? ratingsMap[String(route.busId._id)].avgRating : 4.5,
      ratingCount: ratingsMap[String(route.busId._id)] ? ratingsMap[String(route.busId._id)].count : 0,
      // Derive seatsAvailable from the bus's seatLayout so it reflects live availability
      seatsAvailable: countAvailableSeats(route.busId?.seatLayout),
      date: startDate,
      source: route.source,
      destination: route.destination,
      seatLayoutType: determineSeatLayout(route.busId.busType),
      seatLayoutId: determineSeatLayoutId(route.busId.busType),
      seatLayout: route.busId.seatLayout, // Add the dynamic seat layout
    }));

    res.status(200).json({
      success: true,
      message: "Buses fetched successfully",
      data: buses,
    });
  } catch (err) {
    console.error("Error searching buses:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Error searching buses",
    });
  }
});

/**
 * Helper function to determine seat layout type based on bus type
 */
function determineSeatLayout(busType) {
  if (busType.includes("Seater")) {
    return "seater";
  } else if (busType.includes("Sleeper")) {
    return "sleeper";
  } else if (busType.includes("Mixed")) {
    return "mixed";
  }
  return "seater"; // Default fallback
}

/**
 * Helper function to determine seat layout ID based on bus type
 */
function determineSeatLayoutId(busType) {
  if (busType.includes("Seater")) {
    return "seater-37";
  } else if (busType.includes("Sleeper")) {
    return "sleeper-2x1";
  } else if (busType.includes("Mixed")) {
    return "mixed-seater-lower-sleeper-upper";
  }
  return "seater-37"; // Default fallback
}

module.exports = router;
