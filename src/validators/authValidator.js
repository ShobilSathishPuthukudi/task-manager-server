import { body } from 'express-validator';

const registerValidation = [
  body('name')
    .trim()
    .exists({ checkFalsy: true })
    .withMessage('Name is required')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters')
    .isLength({ max: 50 })
    .withMessage('Name cannot be more than 50 characters'),

  body('email')
    .trim()
    .exists({ checkFalsy: true })
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),

  body('password')
    .trim()
    .exists({ checkFalsy: true })
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .isLength({ max: 128 })
    .withMessage('Password cannot be more than 50 characters'),
];

const loginValidation = [
  body('email')
    .trim()
    .exists({ checkFalsy: true })
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),

  body('password').trim().notEmpty().withMessage('Password is required'),
];

export { registerValidation, loginValidation };
