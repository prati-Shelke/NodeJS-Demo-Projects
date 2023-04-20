const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    sender : { type:mongoose.Schema.Types.ObjectId , refPath:'senderType' , required:true , 
                validate(value)
                {
                  if(value==null)
                  throw new Error('Invalid sender');
                }},
    senderType : { type: String , required: true , enum: ['organizations', 'Customer']}
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
