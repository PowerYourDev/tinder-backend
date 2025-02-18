const ConnectionRequest = require('../../models/Request/Request')

const {singupValidate} =require('../../utils/validate')
const generateToken = require('../../config/jwtToken/generateToken')




//-------------------------------------
//singUp
//-------------------------------------
const USER_SAFE_DATA="firstName lastName photoUrl age gender about skills"





const userRequestReceivedCtrl=async(req,res)=>{

  try{
    const loggedInUser=req.user
    console.log(loggedInUser,"dshfoids")
     
    const userReceivedConnectionRequests=await ConnectionRequest.find(
      {
        toUserId:loggedInUser._id,
        status:'interested'
       }
    ).populate('toUserId',USER_SAFE_DATA)

    res.json({
      message: "Data fetched successfully",
      data: userReceivedConnectionRequests,
    });



  }catch(err){
    res.status(400).send("ERROR"+err)
  }

}



const userRequestConnectionCtrl=async(req,res)=>{

  try{
      const loggedInUser=req.user

      const userConnections= await ConnectionRequest.find(
     {  $or: [{
          fromUserId:loggedInUser._id,
          status:"accepted"
       },{
        toUserId:loggedInUser._id,
        status:"accepted"
     }]}) .populate("fromUserId", USER_SAFE_DATA)
     .populate("toUserId", USER_SAFE_DATA);

   console.log(userConnections);

   const data = userConnections.map((row) => {
     if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
       return row.toUserId;
     }
     return row.fromUserId;
   });

   res.json({ data });
     res.send(userConnections)
  }catch(err){
     res.status(400).send("ERROR"+err)
  }
}



  module.exports={
   

    userRequestReceivedCtrl,
    userRequestConnectionCtrl,
    
  }