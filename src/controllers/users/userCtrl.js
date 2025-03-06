const ConnectionRequest = require('../../models/Request/Request')
const User = require('../../models/user/User')

const {singupValidate} =require('../../utils/validate')
const generateToken = require('../../config/jwtToken/generateToken')


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
    ).populate('fromUserId',USER_SAFE_DATA)

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

   

   const data = userConnections.map((row) => {
     if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
       return row.toUserId;
     }
     return row.fromUserId;
   });

   res.json({ data });
     
  }catch(err){
     res.status(400).send("ERROR"+err)
  }
}

const userFeedCtrl=async(req,res)=>{
   try{

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
const skip = (page-1)*limit

    const loggedInUser=req.user

    const notAllowedUsersToShowONFeed=await ConnectionRequest.find({
     $or:[ {fromUserId:loggedInUser._id},
      {toUserId:loggedInUser._id},
]
    }).select("fromUserId  toUserId")

    const savingNotAllowedUsers=new Set()

    notAllowedUsersToShowONFeed.map((user)=>{
      savingNotAllowedUsers.add(user.fromUserId.toString())
      savingNotAllowedUsers.add(user.toUserId.toString())
    })

    const allowedUsersFeed=await User.find({
     $and: [{_id:{$nin:Array.from(savingNotAllowedUsers)}},
           {_id:{$ne:loggedInUser._id}}
      ]
    }).select(USER_SAFE_DATA).skip(skip).limit(limit)



    res.json({ data: allowedUsersFeed,message:"successfully feteched the feed users data" });

   }catch(err){
    res.status(400).json({
      message:err
    })
   }
}



  module.exports={
   

    userRequestReceivedCtrl,
    userRequestConnectionCtrl,
    userFeedCtrl
    
  }