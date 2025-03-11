const Chat = require("../../models/chat/chat");


const chatctrl=async (req, res) => {
    const { userRequestId } = req.params;
    console.log( req.user,"JII",userRequestId)
    const userId = req.user._id;
   
  
    try {
      let chat = await Chat.findOne({
        participants: { $all: [userId, userRequestId] },
      }).populate({
        path: "messages.senderId",
        select: "firstName lastName",
      });
      if (!chat) {
        chat = new Chat({
          participants: [userId, userRequestId],
          messages: [],
        });
        await chat.save();
      }
      res.json(chat);
    } catch (err) {
      console.error(err);
    }
  }

  module.exports ={
    chatctrl
  }