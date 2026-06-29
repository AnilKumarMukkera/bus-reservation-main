const User = require("../../model/User");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "30d",
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/client/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please include all fields" });
    }

    // optional: basic phone validation (if provided)
    if (phone && String(phone).replace(/\D/g, '').length !== 10) {
      return res.status(400).json({ success: false, message: 'Phone must be 10 digits' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid user data" });
    }
  } catch (error) {
    console.error('registerUser error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Authenticate a user
 * @route   POST /api/client/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            token: generateToken(user._id),
        },
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error('loginUser error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get user data
 * @route   GET /api/client/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('getMe error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
