'use strict';

/** Middleware factory — 400s if any of the listed query params are missing. */
function requireQuery(...params) {
  return (req, _res, next) => {
    const missing = params.filter(p => !req.query[p]);
    if (missing.length) {
      const err = new Error(`Missing required query params: ${missing.join(', ')}`);
      err.status = 400;
      return next(err);
    }
    next();
  };
}

module.exports = { requireQuery };
