const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const {
  authService,
  userService,
  tokenService,
  emailService
} = require('../services');
const ApiError = require('../utils/ApiError');

const register = catchAsync(async (req, res) => {
  const org = await userService.createOrg(req.body);
  let user;
  try {
    user = await userService.createUser({
      _org: org._id,
      ...req.body
    });
  } catch (e) {
    await org.remove();
    throw e;
  }
  user = await user.populate("_org", "name email");
  const {
    token,
    expires
  } = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({
    user,
    token,
    expires
  });
});

const login = catchAsync(async (req, res) => {
  const {
    email,
    password
  } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const {
    token,
    expires
  } = await tokenService.generateAuthTokens(user);
  res.send({
    user,
    token,
    expires
  });
});

const socialLogin = catchAsync(async (req, res) => {
  const idToken = req.body.token;
  let user;
  const provider = req.params.provider.toLowerCase();
  switch(provider) {
    case "google":
      user = await authService.loginWithGoogle(idToken);
      break;
      case "facebook":
      user = await authService.loginWithFacebook(idToken);
      break;
    default:
      throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, `Provider ${req.body.provider} is not supported`);
  }
  const {
    token,
    expires
  } = await tokenService.generateAuthTokens(user);
  res.send({
    user,
    token,
    expires
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

const self = catchAsync(async (req, res) => {
  res.send(req.user);
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