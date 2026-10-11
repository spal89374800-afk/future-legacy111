const Order = require('../models/orderModel');
const { successResponse, errorResponse } = require('../utils/response');

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (order) {
        // Ensure only the user who owns the order or an admin can view it
        if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return errorResponse(res, 401, 'Not authorized to view this order');
        }
        successResponse(res, 200, { order });
    } else {
        errorResponse(res, 404, 'Order not found');
    }
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    // Handle CastError for invalid ObjectId
    if (error.kind === 'ObjectId') {
        return errorResponse(res, 404, 'Order not found');
    }
    errorResponse(res, 500, 'Server Error');
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    successResponse(res, 200, { orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    errorResponse(res, 500, 'Server Error');
  }
};
