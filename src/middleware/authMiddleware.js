import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { verifyAccessToken } from '../utils/generateToken.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, token missing');
  }

  try {
    const decoded = verifyAccessToken(token);

    if (!decoded?.userId) {
      res.status(401);
      throw new Error('Invalid or expired token');
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401);
      throw new Error('Not authorized');
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401);
    throw new Error(error.message || 'Invalid or expired token');
  }
});

export default protect;
