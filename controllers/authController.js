import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';
import { generateToken } from '../utils/generateToken.js';

// Signup
export const signup = async (req, res) => {
  const { username, email, password, full_name, role, phone_number } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash, full_name, role, phone_number)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id, username, email, role`,
      [username, email, hashedPassword, full_name, role, phone_number]
    );
    res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ message: 'User not found' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: 'Invalid password' });

    const token = generateToken(user.user_id, user.role);
    res.json({ token, user: { id: user.user_id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
