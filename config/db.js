// config/db.js
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

// Create a connection pool to Neon DB
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Neon
});

pool.on('connect', () => {
  console.log('✅ Connected to Neon PostgreSQL Database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});
