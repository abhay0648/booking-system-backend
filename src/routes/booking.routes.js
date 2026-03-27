const express = require('express');
const router = express.Router();

const bookingController = require('../controllers/booking.controller');

// Route: POST /api/book
router.post('/book', bookingController.createBooking);

router.post('/cancel', bookingController.cancelBooking);

module.exports = router;