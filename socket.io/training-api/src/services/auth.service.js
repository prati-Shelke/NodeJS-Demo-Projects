const httpStatus = require('http-status');
const axios = require('axios');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const { OAuth2Client } = require('google-auth-library');
const config = require('../config/config');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || user.deleted || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return await user.populate("_org", "name email");
};

/**
 * Login with Google
 * @param {string} idToken
 * @returns {Promise<User>}
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
  const user = await userService.getUserByEmail(email);
  if (!user || user.deleted) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'This user does not exist');
  }
  return await user.populate("_org", "name email");
};

/**
 * Login with Facebook
 * @param {string} idToken
 * @returns {Promise<User>}
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

  const user = await userService.getUserByEmail(facebook.data.email || "no-facebook-email");
  if (!user || user.deleted) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return await user.populate("_org", "name email");
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  resetPassword,
  verifyEmail,
  loginWithGoogle,
  loginWithFacebook
};
