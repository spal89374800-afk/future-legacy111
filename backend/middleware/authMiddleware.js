const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const secret = process.env.JWT_SECRET || 'future_legacy_secure_jwt_secret_key_2026';
      const decoded = jwt.verify(token, secret);

      if (mongoose.connection.readyState === 1) {
        // Get user from the token
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
          req.user = { id: decoded.id, role: 'student', name: 'Authorized User' };
        }
      } else {
        req.user = { id: decoded.id, role: 'student', name: 'Authorized User' };
      }

      next();
    } catch (error) {
      console.warn('Auth token verification notice:', error.message);
      res.status(401).json({ msg: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ msg: 'Not authorized, no token' });
  }
};

module.exports = { protect };

