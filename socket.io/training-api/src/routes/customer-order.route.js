const express = require('express');
const validate = require('../middlewares/validate');
const orderController = require('../controllers/order.controller');
const orderValidation = require('../validations/order.validation')
const customerAuth = require('../middlewares/customer-auth');
const router = express.Router();


router
    .route('/')
    .get(customerAuth(),orderController.getOrders)
    .post(customerAuth(),validate(orderValidation.createOrder),orderController.createOrder)

router
    .route('/confirm/:orderId')
    .put(customerAuth(),validate(orderValidation.confirmOrder),orderController.confirmOrder)

router
    .route('/:orderId')
    .get(customerAuth(),orderController.getOrder)

router
    .route('/cancel/:orderId') 
    .patch(customerAuth(),orderController.cancelOrder)


module.exports = router;
