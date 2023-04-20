const httpStatus = require('http-status');
const axios = require('axios');
const customerTokenService = require('./customer-token.service');
const customerService = require('./customer.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const { OAuth2Client } = require('google-auth-library');
const config = require('../config/config');
const Customer = require('../models/customer.model');

/**
 * Login with customername and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const customer = await customerService.getCustomerByEmail(email);
  if (!customer || customer.deleted || !(await customer.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return customer;
};



/***********************************reset password***************************/
/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
 const resetPassword = async (resetPasswordToken, newPassword) => 
 {
  
  try {
    const resetPasswordTokenDoc = await customerTokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const customer = await customerService.getCustomerById(resetPasswordTokenDoc.user);
    if (!customer) {
      throw new Error();
    }
    await customerService.updateCustomerById(customer.id, { password: newPassword });
    await Token.deleteMany({ customer: customer.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/***************************************verify email************************/
/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
 const verifyEmail = async (verifyEmailToken) => 
 {
  try {
    const verifyEmailTokenDoc = await customerTokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const customer = await customerService.getCustomerById(verifyEmailTokenDoc.user);
    if (!customer) {
      throw new Error();
    }
    await Token.deleteMany({ customer: customer.id, type: tokenTypes.VERIFY_EMAIL });
    await customerService.updateCustomerById(customer.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

/*******************************************login with google**************************/
/**
 * Login with Google
 * @param {string} idToken
 * @returns {Promise<Customer>}
 */
 const loginWithGoogle = async (idToken) => {

  const oAuth2Client = new OAuth2Client(config.socialLogin.google.clientId);
  const ticket = await oAuth2Client.verifyIdToken({
    idToken: idToken,
    audience: config.socialLogin.google.clientId
  });
  const { email, email_verified } = ticket.getPayload();
  if (!email || !email_verified) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Google authentication failed');
  }
  const customer = await customerService.getCustomerByEmail(email);
  if (!customer || customer.deleted) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'This customer does not exist');
  }
  return await customer.populate("_org", "name email");
};

/******************************************login with facebook****************************/
/**
 * Login with Facebook
 * @param {string} idToken
 * @returns {Promise<Customer>}
 */
const loginWithFacebook = async (idToken) => {
  let facebook;
  try {
    facebook = await axios.get(
      `https://graph.facebook.com/me?access_token=${idToken}&fields=id,name,email`
    );
    if (!facebook.data) {
      throw new Error("Invalid facebook session");
    }
  } catch (error) {
    console.log(error)
    throw new ApiError(httpStatus.UNAUTHORIZED, (() => {
      try {
        return error.response.data.error.message;
      } catch (e) {
        return "Something went wrong";
      }
    })());
  }
}


module.exports = {
  loginUserWithEmailAndPassword,
  resetPassword,
  verifyEmail,
  loginWithGoogle,
  loginWithFacebook
};
