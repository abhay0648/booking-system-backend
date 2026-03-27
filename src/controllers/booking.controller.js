const bookingService = require('../services/booking.service');

const createBooking = async (req, res) => {
  try {
    const result = await bookingService.createBooking(req.body);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { booking_id } = req.body;

    const result = await bookingService.cancelBooking(booking_id);

    res.json({
      success: true,
      data: result,
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createBooking,
  cancelBooking,
};