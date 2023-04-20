const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
    {
        seller : { type : mongoose.Schema.Types.ObjectId , ref : 'organizations'},
        customer: { type : mongoose.Schema.Types.ObjectId , ref : 'Customer' } ,
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        }
    },
    { timestamps: true }
);

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;
