const Route = require("../../model/Route");
const Bus = require("../../model/Bus");
const { updateSeatLayoutPrice } = require("../../utils/updateSeatPrice");
const { generateSeatLayout } = require("../../utils/seatLayoutGenerator");

// @desc    Create a new route

const createRoute = async (req, res) => {
  try {
    const { busId, source, destination, duration, departureTime, arrivalTime, price, startDate, endDate } = req.body;

    // Validate required fields (availableSeats is derived from bus seatLayout)
    if (!busId || !source || !destination || !duration || !departureTime || !arrivalTime || !price || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if bus exists
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    // Check if the bus already has a route
    const activeRoute = await Route.findOne({ busId });
    if (activeRoute) {
      return res.status(400).json({
        success: false,
        message: "This bus already has a route assigned. Please delete the current route before assigning a new one.",
      });
    }

    // Check if a route with the same source, destination and bus already exists
    // (allow same source/destination for different buses)
    const existingRoute = await Route.findOne({ source: source.trim(), destination: destination.trim(), busId });
    if (existingRoute) {
      return res.status(400).json({
        success: false,
        message: `A route from ${source} to ${destination} for this bus already exists.`,
      });
    }

    // Generate a fresh seat layout for the new route and set the price on the bus
    const newLayout = generateSeatLayout(bus.busType);
    bus.seatLayout = updateSeatLayoutPrice(newLayout, price);
    bus.markModified("seatLayout");
    await bus.save();

    // Compute available seats from the newly saved bus seatLayout
    const { countAvailableSeats } = require('../../utils/helpers');
    const availableSeatsCount = countAvailableSeats(bus.seatLayout);

    // Create new route (availableSeats derived from seatLayout)
    const route = await Route.create({
      busId,
      source,
      destination,
      duration,
      departureTime,
      arrivalTime,
      price,
      startDate,
      endDate,
      availableSeats: availableSeatsCount,
    });

    res.status(201).json({
      success: true,
      message: "Route created successfully",
      data: route,
    });
  } catch (err) {
    console.error("Error creating route:", err);
    // Handle Mongo duplicate key error more gracefully
    if (err && err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A route with the same source and destination already exists.",
      });
    }

    res.status(500).json({
      success: false,
      message: err.message || "Error creating route",
    });
  }
};

// @desc    Get all routes (with bus details)

const getRoutes = async (req, res) => {
  try {
    const routes = await Route.find()
      .populate("busId", "busName busNumber busType coach")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Routes fetched successfully",
      data: routes,
    });
  } catch (err) {
    console.error("Error fetching routes:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Error fetching routes",
    });
  }
};

// @desc    Get a single route by ID

const getRouteById = async (req, res) => {
  try {
    const { id } = req.params;
    const route = await Route.findById(id).populate("busId", "busName busNumber busType coach");

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Route fetched successfully",
      data: route,
    });
  } catch (err) {
    console.error("Error fetching route:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Error fetching route",
    });
  }
};

// @desc    Update a route
// @access  Private (admin only)
const updateRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const { busId, source, destination, duration, departureTime, arrivalTime, price, startDate, endDate, availableSeats } = req.body;

    // Find route
    let route = await Route.findById(id);
    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    // If busId is being changed, verify new bus exists
    if (busId && busId !== route.busId.toString()) {
      const bus = await Bus.findById(busId);
      if (!bus) {
        return res.status(404).json({
          success: false,
          message: "Bus not found",
        });
      }
    }

    const newBusId = busId || route.busId;

    // Check if the bus already has another route
    const activeRoute = await Route.findOne({ 
      busId: newBusId, 
      _id: { $ne: id } 
    });
    
    if (activeRoute) {
      return res.status(400).json({
        success: false,
        message: "This bus already has a route assigned. Please assign a different bus.",
      });
    }

    // Update route
    const oldBusId = route.busId.toString();
    // If source/destination changed, ensure no other route has same pair
    if ((source && source !== route.source) || (destination && destination !== route.destination)) {
      // Only consider it a conflict if another route for the same bus has the same source/destination
      const conflictingRoute = await Route.findOne({
        source: source || route.source,
        destination: destination || route.destination,
        busId: newBusId,
        _id: { $ne: id }
      });

      if (conflictingRoute) {
        return res.status(400).json({
          success: false,
          message: `Another route for this bus from ${source || route.source} to ${destination || route.destination} already exists.`,
        });
      }
    }
    // Fetch the bus to update (used to compute availableSeats )
    const busToUpdate = await Bus.findById(newBusId);
    // compute availableSeats from assigned bus seatLayout
    const { countAvailableSeats } = require('../../utils/helpers');
    let updatedAvailableSeats = undefined;
    if (busToUpdate && busToUpdate.seatLayout) {
      updatedAvailableSeats = countAvailableSeats(busToUpdate.seatLayout);
    }

    const updateObj = { busId, source, destination, duration, departureTime, arrivalTime, price, startDate, endDate };
    if (typeof updatedAvailableSeats === 'number') updateObj.availableSeats = updatedAvailableSeats;

    route = await Route.findByIdAndUpdate(
      id,
      updateObj,
      { returnDocument: 'after', runValidators: true }
    ).populate("busId", "busName busNumber busType coach");

    if (busToUpdate) {
      const isNewBusAssigned = busId && busId !== oldBusId;
      
      if (isNewBusAssigned) {
        // Generate a fresh seat layout if assigning a new bus
        const newLayout = generateSeatLayout(busToUpdate.busType);
        busToUpdate.seatLayout = updateSeatLayoutPrice(newLayout, price);
        
        // Reset the old bus layout too since it's now free
        const oldBus = await Bus.findById(oldBusId);
        if (oldBus) {
           const oldBusLayout = generateSeatLayout(oldBus.busType);
           oldBus.seatLayout = oldBusLayout;
           oldBus.markModified("seatLayout");
           await oldBus.save();
        }
      } else {
        // Just update the price for the existing layout
        busToUpdate.seatLayout = updateSeatLayoutPrice(busToUpdate.seatLayout, price);
      }
      
      busToUpdate.markModified("seatLayout");
      await busToUpdate.save();

      // After saving the bus layout changes, recompute availableSeats and update the route
      try {
        const { countAvailableSeats } = require('../../utils/helpers');
        const availAfter = countAvailableSeats(busToUpdate.seatLayout);
        await Route.findByIdAndUpdate(id, { availableSeats: availAfter });
        // Refresh route for response
        route = await Route.findById(id).populate("busId", "busName busNumber busType coach");
      } catch (e) {
        console.warn('Could not update route.availableSeats after bus layout change', e.message || e);
      }
    }

    res.status(200).json({
      success: true,
      message: "Route updated successfully",
      data: route,
    });
  } catch (err) {
    console.error("Error updating route:", err);
    // Handle Mongo duplicate key error more gracefully
    if (err && err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A route with the same source and destination already exists.",
      });
    }

    res.status(500).json({
      success: false,
      message: err.message || "Error updating route",
    });
  }
};

// @desc    Delete a route
// @access  Private (admin only)
const deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;

    const route = await Route.findByIdAndDelete(id);
    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    // Reset the bus seat layout to default since it's now available
    const bus = await Bus.findById(route.busId);
    if (bus) {
      const newLayout = generateSeatLayout(bus.busType);
      bus.seatLayout = newLayout;
      bus.markModified("seatLayout");
      await bus.save();
    }

    res.status(200).json({
      success: true,
      message: "Route deleted successfully",
      data: route,
    });
  } catch (err) {
    console.error("Error deleting route:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Error deleting route",
    });
  }
};

module.exports = {
  createRoute,
  getRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
};