const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d', 
  });
};

/**
 * @desc    
 * @route   
 * @access  
 */
const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please fill in all required fields.');
    }

    if (password.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters long.');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('An account with this email already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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
 * @desc    
 * @route   
 * @access  
 */
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide both email and password.');
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password.');
    }

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
 * @desc    
 * @route   
 * @access  
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
 * @desc    
 * @route  
 * @access  
 */
const getMe = async (req, res, next) => {
  try {
    
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
