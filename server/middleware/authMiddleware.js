const jwt = require("jsonwebtoken");
const User = require("../model/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log('protect: Authorization header present');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
      console.log('protect: token decoded ->', decoded);
      req.user = await User.findById(decoded.id).select("-password");
      console.log('protect: user found ->', req.user ? req.user._id : 'NO_USER');
      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, message: "Not authorized" });
    }
  }

  return res.status(401).json({ success: false, message: "Not authorized, no token" });
};

// Optional auth: if token present, set req.user; otherwise allow anonymous
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      console.log('optionalAuth: Authorization header present');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
      console.log('optionalAuth: token decoded ->', decoded);
      req.user = await User.findById(decoded.id).select("-password");
      console.log('optionalAuth: user found ->', req.user ? req.user._id : 'NO_USER');
    } catch (err) {
      // ignore and continue as guest
      req.user = null;
    }
  }
  return next();
};

const adminOnly = (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Not authorized' });
  if (req.user.role !== 'admin' && req.user.role !== 'Admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  return next();
};

module.exports = { protect, optionalAuth, adminOnly };
