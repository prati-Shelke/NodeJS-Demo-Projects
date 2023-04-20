const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const customerService = require('./customer.service');
const {
  Token
} = require('../models');
const ApiError = require('../utils/ApiError');
const {
  tokenTypes
} = require('../config/tokens');
const Customer = require('../models/customer.model');

/**
 * Generate token
 * @param {ObjectId} customerId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (customerId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: customerId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} customerId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (token, customerId, expires, type, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    user: customerId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.sub,
    blacklisted: false
  });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {Customer} customer
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (customer) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(customer.id || customer._id, accessTokenExpires, tokenTypes.ACCESS);

  return {
    token: accessToken,
    expires: accessTokenExpires.toDate()
  };
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (email) => {
  const customer = await customerService.getCustomerByEmail(email);
  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No customers found with this email');
  }
  
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(customer.id, expires, tokenTypes.RESET_PASSWORD);
  await saveToken(resetPasswordToken, customer.id, expires, tokenTypes.RESET_PASSWORD);
  return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {Customer} customer
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (customer) => 
{
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  const verifyEmailToken = generateToken(customer.id, expires, tokenTypes.VERIFY_EMAIL);
  await saveToken(verifyEmailToken, customer.id, expires, tokenTypes.VERIFY_EMAIL);
  return verifyEmailToken;
};

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
};