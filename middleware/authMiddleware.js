// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Middleware to verify JWT token and attach user info to req.user
 */
export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // store user info (id, role)
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

/**
 * Middleware to restrict route access based on user roles
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized, no user data' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
};

/**
 * Role-specific middlewares for convenience
 */
export const healthWorker = authorize('healthWorker'); // only health workers
export const admin = authorize('admin');               // only admins
