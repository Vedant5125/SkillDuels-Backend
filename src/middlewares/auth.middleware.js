import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Note: In ES Modules, you must include the .js extension

// Verify JWT Token
export const protect = async (req, res, next) => {
  let token;

  // Check if header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (split "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach user to request object (excluding password)
      req.user = await User.findById(decoded.id).select('-password');
      
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Check for Admin Role
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    // 403 Forbidden is better here than 401 because the user IS logged in, just not an admin
    res.status(403).json({ message: 'Access denied: Admins only' });
  }
};
