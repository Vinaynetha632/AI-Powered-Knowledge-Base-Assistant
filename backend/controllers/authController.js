const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d', // Token valid for 7 days
  });
};

/**
 * @desc    Register a new user
 * @route   POST /signup
 * @access  Public
 */
const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    // 1. Validate input fields
    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please fill in all required fields.');
    }

    if (password.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters long.');
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('An account with this email already exists.');
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data received.');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate a user
 * @route   POST /login
 * @access  Public
 */
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // 1. Validate inputs
    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide both email and password.');
    }

    // 2. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password.');
    }

    // 3. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password.');
    }

    // 4. Send response with JWT
    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user (client-side action mainly, but API confirmation)
 * @route   POST /logout
 * @access  Public
 */
const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully. Please remove token from local storage.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    // req.user is set by 'protect' middleware
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  logout,
  getMe,
};
