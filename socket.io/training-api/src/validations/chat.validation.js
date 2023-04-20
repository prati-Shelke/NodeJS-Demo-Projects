const Joi = require('joi');
const { objectId } = require('./custom.validation');

const sendMessage = {
    body: Joi.object().keys({
        sender: Joi.custom(objectId).required(),
        senderType : Joi.string().required(),
        content : Joi.string().required() ,
        chat : Joi.custom(objectId).required()
    }),
  };

module.exports =
{
    sendMessage
}