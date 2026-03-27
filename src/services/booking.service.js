const pool = require('../config/db');

const createBooking = async ({ partner_id, user_id, slot_time }) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Lock partner row (prevents race condition)
    const partner = await client.query(
      'SELECT * FROM partners WHERE id = $1 FOR UPDATE',
      [partner_id]
    );

    if (!partner.rows.length) {
      throw new Error('Partner not found');
    }

    const booking = await client.query(
      `INSERT INTO bookings (partner_id, user_id, slot_time, status)
       VALUES ($1, $2, $3, 'CREATED')
       RETURNING *`,
      [partner_id, user_id, slot_time]
    );

    await client.query('COMMIT');

    return booking.rows[0];

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const cancelBooking = async (booking_id) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Lock booking row
    const bookingRes = await client.query(
      'SELECT * FROM bookings WHERE id = $1 FOR UPDATE',
      [booking_id]
    );

    if (!bookingRes.rows.length) {
      throw new Error('Booking not found');
    }

    const booking = bookingRes.rows[0];

    let refundAmount = 0;

    if (booking.status === 'CREATED') {
      refundAmount = 100; // full refund
    } else if (booking.status === 'ASSIGNED') {
      refundAmount = 50; // partial refund
    }

    // Update booking
    await client.query(
      `UPDATE bookings SET status = 'CANCELLED' WHERE id = $1`,
      [booking_id]
    );

    // Update payment
    await client.query(
      `UPDATE payments SET status = 'REFUNDED' WHERE booking_id = $1`,
      [booking_id]
    );

    await client.query('COMMIT');

    return {
      message: 'Booking cancelled',
      refundAmount,
    };

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

module.exports = {
  createBooking,
  cancelBooking,
};