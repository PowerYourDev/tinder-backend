const mongoose = require('mongoose')


const messageSchema = new mongoose.Schema(
    {
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
     
    },
    
    { timestamps: true }
  );

const chatSchema= mongoose.Schema({
    participants:[{
        required:true,
        type: mongoose.Schema.Types.ObjectId,
         ref: "User",
 } ],
 messages:[messageSchema],
 

})


const Chat = mongoose.model("chat",chatSchema)

module.exports=Chat