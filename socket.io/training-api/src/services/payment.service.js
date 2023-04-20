const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');

const {
  
} = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
const checkCard = async (cardNumber) => {
  
};

module.exports = {
  checkCard,
};