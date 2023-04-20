const httpStatus = require('http-status');
const {Order, Product} = require('../models');
const {paymentStatus,orderStatus} =require('../config/status')
const ApiError = require('../utils/ApiError');
const _ = require('underscore')
const cards = require('../utils/cards');
const moment = require('moment');


/**
 * Update order by id
 * @param {ObjectId} orderId
 * @param {Object} updateBody
 * @returns {Promise<Order>}
 */
const updateOrderById = async (orderId, updateBody) => {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Order not found');
    }

    Object.assign(order, updateBody);
    await order.save();
    return order;
  };


/************************************Get all orders*************************/
/**
* Get all orders
* @param {Object} options - Query options
* @param {ObjectId} customerId
* @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
* @param {number} [options.limit] - Maximum number of results per page (default = 10)
* @param {number} [options.page] - Current page (default = 1)
* @returns {Promise<QueryResult>}
*/

const getOrders = async(options,customerId) =>
{
    
    const orders = await Order.paginate({createdBy:customerId}, options);
    return orders;
}


/************************************get order by ID********************/
/**
* Get product by id
* @param {ObjectId} orderId
* @param {ObjectId} customerId
* @returns {Promise<Product>}
*/
const getOrderById = async (orderId,customerId) => 
{
    return Order.find({_id:orderId,createdBy:customerId});
};


/***********************************Create order****************************/
/**
* Create a order
* @param {ObjectId} customerId
* @param {Object} orderBody
* @returns {Promise<Order>}
*/

const createOrder = async (customerId,orderBody) =>
{
    const newOrder = await Order.create({...orderBody,createdBy:customerId});
    return newOrder;
}

/***********************************Confirm order***************************/
/**
* Confirm a order
* @param {ObjectId} orderId
* @param {Object} orderBody
* @returns {Promise<Order>}
*/

const confirmOrder = async (orderId,orderBody) => 
{
    let selectedCard = ""
    let order = await Order.findById(orderId)

    if(!order)
    {
        throw new ApiError(httpStatus.BAD_REQUEST , "order not found!!")
    }
    orderBody.cardNumber = orderBody.cardNumber.split(" ").join('')
   
    let orderedProducts = await Order.findById(orderId).distinct("items.productId")
    let products = await Product.find({_id:{$in:orderedProducts}});
    
    let item=[] ,temp2 , oldItems = order.items
    let temp = _.groupBy(products,"_org")

    if(order.paymentStatus === paymentStatus.PENDING || order.paymentStatus === paymentStatus.FAILED)
    {
        if(orderBody.expiry > moment().format('MM'+'/'+'YYYY'))
        {
            cards.forEach((card)=>
            {
                if(card.number == orderBody.cardNumber)
                {
                    selectedCard = card
                }
            })

            if(!selectedCard)
            {
                throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid card details!!');
            }
            
            if(!selectedCard.success)
            {
                neworder = {...order, paymentStatus:paymentStatus.FAILED , status:orderStatus.PENDING }
                Object.assign(order,neworder)
                await order.save()
                throw new ApiError(httpStatus.BAD_REQUEST,selectedCard.message)
            }
            if(selectedCard.success)
            {
                let transactionNo = Math.random().toString(36).toUpperCase().substr(2, 10)
                neworder = {...order, paymentStatus:paymentStatus.PAID , status:orderStatus.CONFIRMED ,transactionNo:transactionNo }
                Object.assign(order,neworder)
                await order.save()
            }
        }
        else
        {
            throw new ApiError(httpStatus.BAD_REQUEST,'Plz check validity of your card!!')
        }
    }
    else
    {
        throw new ApiError(httpStatus.BAD_REQUEST,'Your order is already confirmed!!')
    }

    
    for(const keys in temp)
    {
        item = []

        for(let i=0 ; i<temp[keys].length ;i++)
        {  
            oldItems.map((it)=> 
            {
                if(it.productId.equals(temp[keys][i]._id ))
                {
                    temp2 = {
                                productId : temp[keys][i]._id ,
                                name : temp[keys][i].name ,
                                price : temp[keys][i].price ,
                                qty : it.qty ,
                                subTotal : it.subTotal
                            }
                    item.push(temp2)
                }
            })
        }
                
        order.items =  item
        order.sellerId = keys

        let newOrder =
        {
            items : order.items,
            deliveryFee : order.deliveryFee,
            total : order.total,
            address : order.address,
            sellerId : order.sellerId,
            createdBy : order.createdBy,
            paymentStatus : order.paymentStatus ,
            status : order.status ,
            transactionNo :order.transactionNo
                    
        }
        let orders = await Order.create(newOrder)
        console.log(orders)
    }
    await order.delete()
    return "Your order is successfully placed!!";
}


/*************************************Cancel order**************************/
/**
* Confirm a order
* @param {ObjectId} orderId
* @returns {Promise<Order>}
*/
const cancelOrder = async (orderId) =>
{
    return updateOrderById(orderId,{ status: orderStatus.CANCELLED});
}

/************************************Get all orders*************************/
/**
* Get all orders
* @param {Object} options - Query options
* @param {ObjectId} sellerId
* @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
* @param {number} [options.limit] - Maximum number of results per page (default = 10)
* @param {number} [options.page] - Current page (default = 1)
* @returns {Promise<QueryResult>}
*/

const getOrdersForSeller = async(options,sellerId) =>
{
    const orders = await Order.paginate({sellerId:sellerId}, options);
    return orders;
}


/************************************get order by ID for seller********************/
/**
* Get product by id
* @param {ObjectId} orderId
* @param {ObjectId} sellerId
* @returns {Promise<Product>}
*/
const getOrderByIdForSeller = async (orderId,sellerId) => 
{
    return Order.find({_id:orderId,sellerId:sellerId});
};

/*************************************Cancel order for seller**************************/
/**
* Confirm a order
* @param {ObjectId} orderId
* @returns {Promise<Order>}
*/
const cancelOrderForSeller = async (orderId) =>
{
    return updateOrderById(orderId,{ paymentStatus : paymentStatus.REFUNDED ,status: orderStatus.CANCELLED });
}

/*************************************dispatch order for seller**************************/
/**
* Confirm a order
* @param {ObjectId} orderId
* @returns {Promise<Order>}
*/
const dispatchOrder = async (orderId) =>
{
    let order = await Order.findById(orderId)

    if(order.status!= orderStatus.CANCELLED)
        return updateOrderById(orderId,{ status: orderStatus.DISPATCHED ,paymentStatus : paymentStatus.PAID});
    else
        throw new ApiError(httpStatus.BAD_REQUEST,'Your order is cancelled!!')

}

/*************************************dispatch order for seller**************************/
/**
* Confirm a order
* @param {ObjectId} orderId
* @returns {Promise<Order>}
*/
const deliverOrder = async (orderId) =>
{
    let order = await Order.findById(orderId)
    
    if(order.status!= orderStatus.CANCELLED)
        return updateOrderById(orderId,{ status: orderStatus.DELIVERED , paymentStatus : paymentStatus.PAID});
    else
        throw new ApiError(httpStatus.BAD_REQUEST,'Your order is cancelled!!')
}


module.exports = {
    getOrders,
    createOrder,
    confirmOrder,
    getOrderById,
    cancelOrder,
    updateOrderById,
    getOrdersForSeller,
    getOrderByIdForSeller,
    cancelOrderForSeller,
    dispatchOrder,
    deliverOrder
}