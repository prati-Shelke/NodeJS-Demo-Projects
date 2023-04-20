const Joi = require('joi');
const { password } = require('./custom.validation');

const forgotPassword = {
    body: Joi.object().keys({
      email: Joi.string().email().required(),
    }),
  };
  
  const resetPassword = 
  {
    query: Joi.object().keys({
        token: Joi.string().required(),
    }),
    body: Joi.object().keys({
      password: Joi.string().required().custom(password),
    }),
  };
  
  const verifyEmail = {
    query: Joi.object().keys({
      token: Joi.string().required(),
    }),
  };
  
  const socialLogin = {
    body: Joi.object().keys({
      token: Joi.string().required()
    }),
  };

  module.exports = {
    forgotPassword,
    resetPassword,
    verifyEmail,
    socialLogin
  };
  