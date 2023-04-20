const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const {
  emailService,
  customerService,
  customerAuthService,
  customerTokenService
} = require('../services');



const ApiError = require('../utils/ApiError');

const register = catchAsync(async (req, res) => {
  let customer;
  customer = await customerService.createCustomer(req.body);
  delete customer.addresses;
  const {
    token,
    expires
  } = await customerTokenService.generateAuthTokens(customer);
  res.status(httpStatus.CREATED).send({
    customer,
    token,
    expires
  });
});

const login = catchAsync(async (req, res) => {
  const {
    email,
    password
  } = req.body;
  const customer = await customerAuthService.loginUserWithEmailAndPassword(email, password);
  const {
    token,
    expires
  } = await customerTokenService.generateAuthTokens(customer);
  res.send({
    customer,
    token,
    expires
  });
});

const self = catchAsync(async (req, res) => {
  res.send(req.customer);
});


/**********************************forgot password****************************/

const forgotPassword = catchAsync(async (req,res)=>
{
  
  const resetPasswordToken = await customerTokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmailToCustomer(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
})

/***********************************reset password***************************/
const resetPassword = catchAsync(async (req, res) =>
{
  await customerAuthService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});


/***********************************send verification mail**********************/
const sendVerificationEmail = catchAsync(async (req, res) => 
{
  const verifyEmailToken = await customerTokenService.generateVerifyEmailToken(req.customer);
  await emailService.sendVerificationEmailToCustomer(req.customer.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

/************************************verify email****************************/
const verifyEmail = catchAsync(async (req, res) => 
{
  await customerAuthService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});


/************************************social login***************************/
const socialLogin = catchAsync(async (req, res) => 
{
    const idToken = req.body.token;
    let customer;
    const provider = req.params.provider.toLowerCase();
    switch(provider) {
      case "google":
        customer = await customerAuthService.loginWithGoogle(idToken);
        break;
        case "facebook":
        customer = await customerAuthService.loginWithFacebook(idToken);
        break;
      default:
        throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, `Provider ${req.body.provider} is not supported`);
    }
    const {
      token,
      expires
    } = await customerAuthService.generateAuthTokens(customer);
    res.send({
      customer,
      token,
      expires
    });
});


module.exports = {
  register,
  login,
  self,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  socialLogin
};