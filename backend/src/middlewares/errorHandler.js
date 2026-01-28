const { logError } = require('../utils/logger');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = Number(err.status || err.statusCode || 500);
  const message = err.expose ? err.message : status >= 500 ? 'Internal server error' : err.message;

  logError('Request error', {
    status,
    message: err.message,
    path: req.originalUrl,
    method: req.method,
  });

  res.status(status).json({
    ok: false,
    error: {
      message,
      code: err.code || undefined,
    },
  });
}

module.exports = { errorHandler };

