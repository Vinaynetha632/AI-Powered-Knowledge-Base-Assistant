const errorHandler = (err, req, res, next) => {
  console.error('Error encountered:', err.message || err);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'An internal server error occurred';

  // Multer limits error
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'File size exceeds the 10MB limit.';
  }

  // Mongoose Cast Error (e.g. invalid document ID)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = 'Invalid ID format requested.';
  }

  // MongoDB duplicate key (e.g. duplicate email)
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Email address is already in use.';
  }

  // Custom validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = errorHandler;
