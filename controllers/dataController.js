const mockData = require('../data/mockData');
const { successResponse, errorResponse } = require('../utils/response');

// @desc    Get all initial application data
// @route   GET /api/data/all
// @access  Public (for now)
exports.getAllData = async (req, res) => {
  try {
    // In a real application, this would fetch data from various database collections.
    // For this demonstration, we are returning mock data.
    successResponse(res, 200, mockData);
  } catch (error) {
    console.error('Error fetching all data:', error);
    errorResponse(res, 500, 'Server Error');
  }
};
