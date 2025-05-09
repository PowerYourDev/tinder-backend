const socket = require("socket.io")
const crypto = require("crypto");
const Chat = require('../models/chat/chat')




const getSecretRoomId = (userId, targetUserId) => {
    return crypto
      .createHash("sha256")
      .update([userId, targetUserId].sort().join("$"))
      .digest("hex");
  };

const initiaizeSocket=(server)=>{
    const io = socket(server, {
        cors: {
          origin: "https://saiteja-dev-connect.vercel.app",
        },
      });

    io.on("connection",(socket)=>{
        socket.on("joinChat", ({ firstName, loggedInUserId,userRequestId}) => {
            const roomId = getSecretRoomId(loggedInUserId,userRequestId);
            console.log(firstName + " joined Room : " + roomId);
            socket.join(roomId);
          });
        socket.on("sendMessage",async({firstName,loggedInUserId,userRequestId,newMessage})=>{
            const roomId = getSecretRoomId(loggedInUserId, userRequestId);

           
            let chat = await Chat.findOne({
                participants: { $all: [loggedInUserId, userRequestId] },
              });


              if (!chat) {
                chat = new Chat({
                  participants: [loggedInUserId, userRequestId],
                  messages: [],
                });
              }
              

              chat.messages.push({
                senderId: loggedInUserId,
                text:newMessage,
              
              });
              console.log(chat,"chaaatt")
   

             const data= await chat.save();
              console.log(data,",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,")
              io.to(roomId).emit("messageReceived", { firstName, newMessage,loggedInUserId});






           
            
        })
        socket.on("disConnect",()=>{
            
        })

    })
}

module.exports=initiaizeSocket