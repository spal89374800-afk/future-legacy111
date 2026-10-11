const express = require('express');
const router = express.Router();
const { getAllData } = require('../controllers/dataController');

// @route   GET /api/data/all
// @desc    Get all initial application data
// @access  Public
router.get('/all', getAllData);

module.exports = router;
