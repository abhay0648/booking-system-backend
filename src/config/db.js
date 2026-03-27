const { Pool } = require('pg');

const pool = new Pool({
  user: 'divydhiman',
  host: 'localhost',
  database: 'booking_db',
  password: '', 
  port: 5432,
  max: 10,
});

module.exports = pool;