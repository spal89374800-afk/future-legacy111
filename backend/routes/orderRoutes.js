const express = require('express');
const router = express.Router();
const { getOrderById, getUserOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/orders/myorders
// @desc    Get logged in user orders
// @access  Private
router.route('/myorders').get(protect, getUserOrders);

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.route('/:id').get(protect, getOrderById);

module.exports = router;
