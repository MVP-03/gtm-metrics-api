'use strict';

// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  const status = err.status ?? 500;
  res.status(status).json({
    error: {
      message: err.message,
      status,
    },
  });
}

module.exports = errorHandler;
