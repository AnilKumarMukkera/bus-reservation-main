const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// Routes
const adminBusRoutes = require("./routes/admin/busRoutes");
const adminRouteRoutes = require("./routes/admin/routeRoutes");
const adminBookingRoutes = require("./routes/admin/bookingRoutes");
const adminFeedbackRoutes = require("./routes/admin/feedbackRoutes");
const clientSearchRoutes = require("./routes/client/searchRoutes");
const clientBookingRoutes = require("./routes/client/bookingRoutes");
const clientAuthRoutes = require("./routes/client/authRoutes");
const clientUserRoutes = require("./routes/client/userRoutes");
const clientPaymentRoutes = require("./routes/client/payment.routes");
const clientWalletRoutes = require("./routes/client/wallet.routes");
const clientSubscriptionRoutes = require("./routes/client/subscription.routes");

// Admin Routes
app.use("/api/admin/buses", adminBusRoutes);
app.use("/api/admin/routes", adminRouteRoutes);
app.use("/api/admin/bookings", adminBookingRoutes);
app.use("/api/feedback", adminFeedbackRoutes);

// Client Routes
app.use("/api/client", clientSearchRoutes);
app.use("/api/bookings", clientBookingRoutes);
app.use("/api/auth", clientAuthRoutes);
app.use("/api/users", clientUserRoutes); // user profile and change-password
app.use("/api/payment", clientPaymentRoutes);
app.use("/api/wallet", clientWalletRoutes);
app.use("/api/subscriptions", clientSubscriptionRoutes);


// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Bus Reservation Server is running..." });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 3939;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err && err.stack ? err.stack : err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason && reason.stack ? reason.stack : reason);
  // wait a short while then exit so logs flush
  setTimeout(() => process.exit(1), 100);
});
