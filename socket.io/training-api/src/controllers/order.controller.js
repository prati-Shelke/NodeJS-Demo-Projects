const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const {orderService} = require('../services')

/***********************************get all orders**************************/
const getOrders = catchAsync(async(req,res) =>
{
   
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await orderService.getOrders(options,req.customer._id);
    res.send(result);
})


/***********************************get one order***************************/
const getOrder = catchAsync(async(req,res) =>
{
    const order = await orderService.getOrderById(req.params.orderId,req.customer._id);
    if (!order || order.length==0 ) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
    }
    res.send(order);
})

/***********************************Create order****************************/
const createOrder = catchAsync(async (req, res) => 
{
    let order = await orderService.createOrder(req.customer._id,req.body);
    res.status(httpStatus.CREATED).send({order})
});

/***********************************Confirm order***************************/
const confirmOrder = catchAsync(async (req,res) =>
{
    let result = await orderService.confirmOrder(req.params.orderId,req.body)
    res.send({message:result})
})

/*************************************Cancel order**************************/
const cancelOrder = catchAsync(async (req,res) =>
{
    let order = await orderService.cancelOrder(req.params.orderId)
    res.send({order})
})


/**************************************Get All orders for seller*************/
const getOrdersForSeller = catchAsync(async (req,res) =>
{
    console.log("hi")
    const options = pick(req.query, ['sortBy', 'limit', 'page'])
    const result = await orderService.getOrdersForSeller(options , req.user._org._id);
    res.send(result);
})

/***********************************get one order for seller***************************/
const getOrderByIdForSeller = catchAsync(async(req,res) =>
{
    console.log("hi")
    const order = await orderService.getOrderByIdForSeller(req.params.orderId,req.user._org._id);
    if (!order || order.length==0 ) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
    }
    res.send(order);
})

/***************************************cancel order for seller***********************/
const cancelOrderForSeller = catchAsync(async (req,res) =>
{
    let order = await orderService.cancelOrderForSeller(req.params.orderId)
    res.send({order})
})

/***************************************dispatch order for seller*******************/
const dispatchOrder = catchAsync(async (req,res) =>
{
    let order = await orderService.dispatchOrder(req.params.orderId)
    res.send({order})
})

/***************************************dispatch order for seller*******************/
const deliverOrder = catchAsync(async (req,res) =>
{
    let order = await orderService.deliverOrder(req.params.orderId)
    res.send({order})
})

module.exports = {
    getOrders,
    createOrder,
    confirmOrder,
    getOrder,
    cancelOrder,
    getOrdersForSeller,
    getOrderByIdForSeller,
    cancelOrderForSeller,
    dispatchOrder,
    deliverOrder
}