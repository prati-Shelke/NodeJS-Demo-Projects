const catchAsync = require('../utils/catchAsync');
const {chatService} = require('../services')


/***********************************Return chat with new message or Create chat if not exits**************************/

const accessChat = catchAsync(async(req,res) =>
{
    try
    {
        const orderId = req.params.orderId
        let chat = await chatService.accessChat(orderId,req.customer._id)
        res.status(200).json(chat);
    } catch (error) 
    {
      res.status(400);
      throw new Error(error.message);
    }
})


/***********************************get all chats**************************/

const getChats = catchAsync(async(req,res)=>
{
    try
    {
        const allChats = await chatService.getChats(req.customer._id)
        res.send(allChats)
    } catch (error) 
    {
      res.status(400);
      throw new Error(error.message);
    }

})


/***********************************send message to chat**************************/

const sendMessage = catchAsync(async(req,res)=>
{
    const { content , chat , sender , senderType} = req.body
    
    let message = await chatService.sendMessage(content , chat , sender , senderType)
    res.send(message)
    
})


/***********************************get all message for particular chat**************************/

const getMessages = catchAsync(async(req,res)=>
{
    try 
    {
        const messages = await chatService.getMessages(req.params.chatId)
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

module.exports ={
    accessChat,
    getChats,
    sendMessage,
    getMessages
}
