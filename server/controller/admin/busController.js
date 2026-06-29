const Bus = require("../../model/Bus");
const Route = require("../../model/Route");
const { generateSeatLayout } = require("../../utils/seatLayoutGenerator");

/**
 * Add a new bus
 * POST /api/admin/buses
 */
const createBus = async (req, res) => {
  try {
    const { busName, busNumber, busType, coach } = req.body;

    // Validate required fields
    if (!busName || !busNumber || !busType || !coach) {
      return res.status(400).json({
        success: false,
        message: "All fields (busName, busNumber, busType, coach) are required",
      });
    }

    // Check if bus with same number already exists
    const existingBus = await Bus.findOne({ busNumber: busNumber.toUpperCase() });
    if (existingBus) {
      return res.status(400).json({
        success: false,
        message: "Bus with this number already exists",
      });
    }

    // Generate initial seat layout based on busType
    const seatLayout = generateSeatLayout(busType);

    // Create new bus
    const newBus = new Bus({
      busName,
      busNumber: busNumber.toUpperCase(),
      busType,
      coach,
      seatLayout,
    });

    await newBus.save();

    res.status(201).json({
      success: true,
      message: "Bus added successfully",
      data: newBus,
    });
  } catch (error) {
    console.error("Error creating bus:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error adding bus",
    });
  }
};

/**
 * Get all buses
 * GET /api/admin/buses
 */
const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: buses.length,
      data: buses,
    });
  } catch (error) {
    console.error("Error fetching buses:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching buses",
    });
  }
};

/**
 * Get single bus by ID
 * GET /api/admin/buses/:id
 */
const getBusById = async (req, res) => {
  try {
    const { id } = req.params;

    const bus = await Bus.findById(id);
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    res.status(200).json({
      success: true,
      data: bus,
    });
  } catch (error) {
    console.error("Error fetching bus:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching bus",
    });
  }
};

/**
 * Update a bus
 * PUT /api/admin/buses/:id
 */
const updateBus = async (req, res) => {
  try {
    const { id } = req.params;
    const { busName, busNumber, busType, coach } = req.body;

    const bus = await Bus.findById(id);
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    // Check if new bus number already exists (if it's being changed)
    if (busNumber && busNumber !== bus.busNumber) {
      const existingBus = await Bus.findOne({ busNumber: busNumber.toUpperCase() });
      if (existingBus) {
        return res.status(400).json({
          success: false,
          message: "Bus with this number already exists",
        });
      }
    }

    // Prevent changing busType or coach after creation (seat layout depends on these)
    if (busType && busType !== bus.busType) {
      return res.status(400).json({
        success: false,
        message: "Cannot change bus type after registration. To change seat layout, register a new bus.",
      });
    }
    if (coach && coach !== bus.coach) {
      return res.status(400).json({
        success: false,
        message: "Cannot change coach type after registration. To change coach, register a new bus.",
      });
    }

    // Update allowed fields only
    if (busName) bus.busName = busName;
    if (busNumber) bus.busNumber = busNumber.toUpperCase();

    await bus.save();

    res.status(200).json({
      success: true,
      message: "Bus updated successfully",
      data: bus,
    });
  } catch (error) {
    console.error("Error updating bus:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error updating bus",
    });
  }
};

/**
 * Delete a bus
 * DELETE /api/admin/buses/:id
 */
const deleteBus = async (req, res) => {
  try {
    const { id } = req.params;

    const bus = await Bus.findByIdAndDelete(id);
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    // Also remove any routes that were assigned to this bus
    try {
      const deleted = await Route.deleteMany({ busId: id });
      console.log(`Deleted ${deleted.deletedCount || 0} routes for bus ${id}`);
    } catch (e) {
      console.warn('Failed to delete routes for removed bus', e.message || e);
    }

    res.status(200).json({
      success: true,
      message: "Bus deleted successfully",
      data: bus,
    });
  } catch (error) {
    console.error("Error deleting bus:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error deleting bus",
    });
  }
};

module.exports = {
  createBus,
  getAllBuses,
  getBusById,
  updateBus,
  deleteBus,
};
