const Order = require("../models/order.model");
const ApiError = require('../utils/ApiError');
const Chat = require("../models/chat.model");
const Message = require('../models/message.model');
const httpStatus = require('http-status');



/***********************************Return chat with new message or Create chat if not exits**************************/
/**
* Get all orders
* @param {ObjectId} orderId
* @param {ObjectId} customerId
* @returns {Promise<Object>}
*/

const accessChat = async(orderId,customerId) =>
{
    const order = await Order.find({_id:orderId,createdBy:customerId})
    const sellerId =  order[0].sellerId
   
    if(!orderId)
    {
        throw new ApiError(httpStatus.NOT_FOUND, 'Please provide order id!!')
    }

    var isChat = await Chat.find({
    $and: [
      { customer: { $eq: customerId } },
      { seller: { $eq: sellerId }  },
    ],
    }).populate("seller","name email").populate("customer","name email picture").populate("latestMessage").populate("latestMessage.receiver")
   
    
    if (isChat.length > 0) 
    {
        return isChat[0]
    }
    else 
    {
        var chatData = {
          seller: sellerId ,
          customer : customerId
        };
    
        
        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate("seller","name email").populate("customer","name email picture").populate("latestMessage")
        return FullChat
       
    }
}


/***********************************get all chats**************************/
/**
* Get all orders
* @param {ObjectId} customerId
* @returns {Promise<Object>}
*/
const getChats = async(customerId) =>
{
    const allChats = await Chat.find(
        { $eq : customerId})
        .populate("seller","name email").populate("customer","name email picture").populate({path:"latestMessage",populate:{path:"sender",select:"name email picture"}})
        .sort({updatedAt:-1})
    
    if(allChats.length==0)
    {
        throw new ApiError(httpStatus.NOT_FOUND, 'Chat not found with this sellerId')
    }
    else
    {
        return allChats
    }
}

/***********************************send message to chat**************************/
/**
* Get all orders
* @param {String} content
* @param {ObjectId} chatId
* @param {ObjectId} sender
* @param {String} senderType
* @returns {Promise<Object>}
*/
const sendMessage = async(content , chatId , sender , senderType) =>
{
    var newMessage = 
    {
        sender : sender ,
        senderType : senderType,
        content: content,
        chat: chatId,
    };

  
    let message = await (await (await (await Message.create(newMessage))
                    .populate("chat"))
                    .populate("chat.seller","name email"))
                    .populate("chat.customer","name email picture")
                  
    message = await message.populate("sender","name email")

    let chat = await Chat.find({
        $and:[
            {$or:[
                  { customer : { $eq : sender} }, 
                  { seller : { $eq : sender} }
            ]},
            {_id: { $eq : chatId}}
        ]});

    if(chat.length===0)
    {
        await Message.findOneAndDelete(message._id)
        throw new ApiError(httpStatus.NOT_FOUND, 'Chat not found please check your request')
    }
    else
    {
        await Chat.updateOne({ latestMessage: message })
        return message
    }
       
}


/***********************************get all message for particular chat**************************/
const getMessages = async(chatId) =>
{
   
    const messages = await Message.find({ chat: chatId })
    .populate("chat")
    .populate("sender","name email picture")

    return messages
}

module.exports = {
    accessChat,
    getChats,
    sendMessage,
    getMessages
}