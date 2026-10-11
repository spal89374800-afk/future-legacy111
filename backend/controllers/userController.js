const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/userModel');

// In-memory fallback store if database is offline
const inMemoryUsers = new Map();

// Generate JWT
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'future_legacy_secure_jwt_secret_key_2026';
  return jwt.sign({ id }, secret, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, imageUrl, mobileNumber } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Name, email, and password are required' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (mongoose.connection.readyState === 1) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'student',
        imageUrl: imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
        mobileNumber,
      });

      if (user) {
        return res.status(201).json({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          imageUrl: user.imageUrl,
          mobileNumber: user.mobileNumber,
          token: generateToken(user._id),
        });
      }
    } else {
      // Memory fallback
      if (inMemoryUsers.has(email)) {
        return res.status(400).json({ msg: 'User already exists' });
      }
      const mockId = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const newUser = {
        id: mockId,
        _id: mockId,
        name,
        email,
        password: hashedPassword,
        role: role || 'student',
        imageUrl: imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
        mobileNumber: mobileNumber || ''
      };
      inMemoryUsers.set(email, newUser);
      return res.status(201).json({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        imageUrl: newUser.imageUrl,
        mobileNumber: newUser.mobileNumber,
        token: generateToken(newUser._id),
      });
    }

    return res.status(400).json({ msg: 'Invalid user data' });
  } catch (err) {
    console.error('User registration error:', err.message);
    res.status(500).json({ msg: 'Server Error during registration' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email });

      if (user && (await bcrypt.compare(password, user.password))) {
        return res.json({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          imageUrl: user.imageUrl,
          mobileNumber: user.mobileNumber,
          token: generateToken(user._id),
        });
      }
    } else {
      // Memory fallback
      const user = inMemoryUsers.get(email);
      if (user && (await bcrypt.compare(password, user.password))) {
        return res.json({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          imageUrl: user.imageUrl,
          mobileNumber: user.mobileNumber,
          token: generateToken(user._id),
        });
      }
    }

    return res.status(400).json({ msg: 'Invalid credentials' });
  } catch (err) {
    console.error('User login error:', err.message);
    res.status(500).json({ msg: 'Server Error during login' });
  }
};

// @desc    Get user data
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
      if (mongoose.connection.readyState === 1) {
        const userProfile = await User.findById(req.user.id).select('-password');
        return res.status(200).json(userProfile);
      } else {
        return res.status(200).json({
          id: req.user.id,
          name: req.user.name || 'Student Aspirant',
          email: req.user.email || 'user@futurelegacy.edu',
          role: req.user.role || 'student'
        });
      }
    } catch (err) {
      return res.status(500).json({ msg: 'Error retrieving profile' });
    }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};

