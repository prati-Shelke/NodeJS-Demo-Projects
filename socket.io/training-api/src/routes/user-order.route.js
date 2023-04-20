const auth = require('../middlewares/auth')
const express = require('express');
const orderController = require('../controllers/order.controller');
const router = express.Router();

router 
    .route('/')
    .get(auth(),orderController.getOrdersForSeller)

router
    .route('/:orderId')
    .get(auth() , orderController.getOrderByIdForSeller)

router 
    .route('/cancel/:orderId')
    .patch(auth() , orderController.cancelOrderForSeller)

router
    .route('/dispatch/:orderId')
    .patch(auth() , orderController.dispatchOrder)

router
    .route('/deliver/:orderId')
    .patch(auth() , orderController.deliverOrder)

module.exports = router;
