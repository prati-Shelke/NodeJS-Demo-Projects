const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const {
  
} = require('../services');
const ApiError = require('../utils/ApiError');

const exec = catchAsync(async (req, res) => {
  const {
    cardNumber,
    expiry,
    cvv,
    orderId
  } = req.body;
  // Create a transaction, link with order and respond
  res.send({
    txn: "",
    message: "Transaction successful" 
  });
});

module.exports = {
  register,
  login,
  socialLogin,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  self
};