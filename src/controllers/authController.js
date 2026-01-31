import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/generateToken.js';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('Account with this email already exists');
  }

  const newUser = await User.create({
    name,
    email,
    password,
  });

  const accessToken = generateAccessToken(newUser._id);
  const refreshToken = generateRefreshToken(newUser._id);

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

  newUser.refreshToken = hashedRefreshToken;
  await newUser.save();

  res.cookie('refreshToken', refreshToken, cookieOptions);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      accessToken,
    },
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password +refreshToken');

  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

  user.refreshToken = hashedRefreshToken;
  await user.save();

  res.cookie('refreshToken', refreshToken, cookieOptions);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      accessToken,
    },
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.clearCookie('refreshToken', cookieOptions);
    res.status(401);
    throw new Error('Unauthorized');
  }

  try {
    const decode = verifyRefreshToken(refreshToken);

    if (!decode?.userId) {
      res.clearCookie('refreshToken', cookieOptions);
      res.status(403);
      throw new Error('Unauthorized');
    }

    const user = await User.findById(decode.userId).select('+refreshToken');

    if (!user || !user.refreshToken) {
      res.clearCookie('refreshToken', cookieOptions);
      res.status(403);
      throw new Error('Unauthorized');
    }

    const isValidToken = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!isValidToken) {
      res.clearCookie('refreshToken', cookieOptions);
      res.status(403);
      throw new Error('Unauthorized');
    }

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);

    user.refreshToken = hashedNewRefreshToken;
    await user.save();

    res.cookie('refreshToken', newRefreshToken, cookieOptions);

    res.status(200).json({
      success: true,
      message: 'Success',
      data: {
        newAccessToken,
      },
    });
  } catch (error) {
    res.status(401);
    throw new Error(error.message || 'Unauthorized');
  }
});

const getCurrentUser = (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const { _id, name, email, createdAt } = req.user;

  res.status(200).json({
    success: true,
    message: 'Get current user successful',
    data: {
      id: _id,
      name,
      email,
      createdAt,
    },
  });
};

const logoutUser = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  res.clearCookie('refreshToken', cookieOptions);

  if (refreshToken) {
    try {
      const decoded = verifyRefreshToken(refreshToken);

      const user = await User.findById(decoded.userId).select('+refreshToken');

      if (user && user.refreshToken) {
        const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
        if (isValid) {
          user.refreshToken = null;
          await user.save();
        }
      }
    } catch (error) {
      console.error('Logout token verification failed', error.message);
    }
  }

  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  refreshAccessToken,
};
