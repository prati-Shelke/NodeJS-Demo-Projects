const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const verifyCallback = (req, resolve, reject) => {
  return async (err, customer, info) => {
    if (err || info || !customer) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }

    // Reject request if customer was deleted
    if (customer.deleted) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Customer deleted'))
    }

    req.customer = customer;

    resolve();
  };
};

// Access token authentication middleware
const customerAuth = () => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('customerJwt', {
      session: false
    }, verifyCallback(req, resolve, reject))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = customerAuth;
