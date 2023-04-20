const Joi = require('joi');
const {validateExpiry} = require('./custom.validation')

const createOrder = 
{
    body:Joi.object().keys(
        {
            items:Joi.array().required(),
            deliveryFee:Joi.number().required(),
            total:Joi.number().required(),
            address:Joi.object().required(),
        })
}

const confirmOrder = 
{
    body:Joi.object().keys(
        {
            nameOnCard:Joi.string().required(),
            cardNumber:Joi.string().required(),
            expiry:Joi.string().required().custom(validateExpiry),
            cvv:Joi.string().required().min(3).max(3)
        }
    )
}

module.exports = {
    createOrder,
    confirmOrder
}