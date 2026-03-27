const express = require('express');
const bookingRoutes = require('./routes/booking.routes');
const paymentRoutes = require('./routes/payment.routes');

const app = express();

app.use(express.json());

// IMPORTANT LINE 👇
app.use('/api', bookingRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.use('/api/payment', paymentRoutes);

module.exports = app;