const express = require("express");
const customerAuth = require('../middlewares/customer-auth');
const chatController = require('../controllers/chat.controller')
const chatValidation = require('../validations/chat.validation')
const validate = require('../middlewares/validate');
const router = express.Router();
router.use(customerAuth());

/***********************************Return chat with new message or Create chat if not exits**************************/
router.
    route("/:orderId")
    .post(chatController.accessChat);


/***********************************get all chats**************************/
router
    .route("/")
    .get(chatController.getChats)


/***********************************send message to chat**************************/

router
    .route("/message/send-message")
    .post(validate(chatValidation.sendMessage),chatController.sendMessage)


/***********************************get all message for particular chat**************************/
router
    .route("/message/get-messages/:chatId")
    .get(chatController.getMessages)

module.exports = router;