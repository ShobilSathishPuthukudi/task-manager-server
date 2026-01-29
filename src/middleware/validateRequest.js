import { validationResult } from 'express-validator';

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    const error = new Error('Validation error');
    error.statusCode = 400;
    error.errors = formattedErrors;

    return next(error);
  }

  next();
};

export default validateRequest;
