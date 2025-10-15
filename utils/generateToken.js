// utils/generateToken.js
import jwt from 'jsonwebtoken';

export const generateToken = (user_id, role) => {
  return jwt.sign({ id: user_id, role }, process.env.JWT_SECRET, {
    expiresIn: '7d', // token validity 7 days
  });
};
