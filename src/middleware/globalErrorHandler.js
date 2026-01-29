const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server error',
    errors: err.errors || undefined,
  });
};

export default errorHandler;
