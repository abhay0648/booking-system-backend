const pool = require('../config/db');

const handleWebhook = async ({ event_id, booking_id, amount, status }) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Idempotency check
    const existing = await client.query(
      'SELECT id FROM payments WHERE external_event_id = $1',
      [event_id]
    );

    if (existing.rows.length > 0) {
      return { message: 'Duplicate event ignored' };
    }

    // Insert payment
    await client.query(
      `INSERT INTO payments (booking_id, amount, status, external_event_id)
       VALUES ($1, $2, $3, $4)`,
      [booking_id, amount, status, event_id]
    );

    // Update booking status
    if (status === 'SUCCESS') {
      await client.query(
        `UPDATE bookings SET status = 'ASSIGNED' WHERE id = $1`,
        [booking_id]
      );
    }

    await client.query('COMMIT');

    return { message: 'Webhook processed' };

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

module.exports = {
  handleWebhook,
};