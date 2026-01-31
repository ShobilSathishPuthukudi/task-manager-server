import express from 'express';
import {
  loginValidation,
  registerValidation,
} from '../validators/authValidator.js';

import validateRequest from '../middleware/validateRequest.js';
import { authLimiter } from '../middleware/rateLimiter.js';

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

//Register
router.post(
  '/register',
  authLimiter,
  registerValidation,
  validateRequest,
  registerUser
);

//Login
router.post('/login', authLimiter, loginValidation, validateRequest, loginUser);

//Refresh token
router.post('/refresh', refreshAccessToken);

//Logout
router.post('/logout', protect, logoutUser);

//Get current logged-in user
router.get('/me', protect, getCurrentUser);

export default router;
