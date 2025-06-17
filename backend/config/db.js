// db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // or use individual fields like user, host, password, db, port
  ssl: false // Set true if using hosted DB with SSL
});

module.exports = pool;
