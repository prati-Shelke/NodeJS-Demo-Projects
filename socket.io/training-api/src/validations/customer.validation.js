const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const updateProfile = {
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      name: Joi.string(),
    })
    .min(1),
};

const updatePicture = {
  file: Joi.object()
    .required()
};


const changePassword = {
  body:Joi.object().keys({
    old_password:Joi.string().required().custom(password),
    new_password:Joi.string().required().custom(password)
  })
}
module.exports = {
  updateProfile,
  updatePicture,
  changePassword
};
