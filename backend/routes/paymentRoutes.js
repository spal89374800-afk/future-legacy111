const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getRazorpayKey } = require('../controllers/paymentController');

// @route   GET /api/payments/key
// @desc    Get Razorpay Key ID
// @access  Public
router.get('/key', getRazorpayKey);

// @route   POST /api/payments/create-order
// @desc    Create a new Razorpay order
// @access  Public (in real app, should be Private/Authenticated)
router.post('/create-order', createOrder);

// @route   POST /api/payments/verify-payment
// @desc    Verify a payment signature from Razorpay
// @access  Public (in real app, should be Private/Authenticated)
router.post('/verify-payment', verifyPayment);

module.exports = router;

