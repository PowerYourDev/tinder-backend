const  User  = require("../../models/user/User")
const ConnectionRequest=require('../../models/Request/Request')


const requestSendCtrl=async(req,res)=>{

    try{
        const user= req.user
        const fromUserId=req.user._id
        const toUserId=req.params.toUserId
        const status=req.params.status
    

        const acceptedStatus=["ignored", "interested"]

        if(!acceptedStatus.includes(status)){
            throw new Error("status is not valid,please provide valid status")
        }
    
        const toUser=await User.findById(toUserId)

        if(!toUser){
            throw new Error("user does not exists")
        }


        const existienceConnection=await ConnectionRequest.findOne({
            $or:[{fromUserId,toUserId},
                {
                    fromUserId:toUserId,toUserId:fromUserId
                }]
        })

        if(existienceConnection){
           return res.json({
                data:existienceConnection,
                message:"Connection Request Already Exists!!"
            })
        }

       const connectionRequestCreated= await ConnectionRequest.create({
            fromUserId,
            toUserId,
            status
        })

        res.json({
            data:connectionRequestCreated,
            message:`${user.firstName} request sent to ${toUser.firstName}`
        })


    }catch(err){
        res.status(400).send(err)
    }

}


const requestViewCtrl=async(req,res)=>{
      try{
        const user=req.user
        const fromUserId=req.user._id
        const toUserId=req.params.toUserId
        const status=req.params.status

        const acceptedStatus=["accepted", "rejected"];

        if(!acceptedStatus.includes(status)){
            throw new Error("status is not valid,please provide valid status")
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested",
          });
          if (!connectionRequest) {
            return res
              .status(404)
              .json({ message: "Connection request not found" });
          }
    
          connectionRequest.status = status;
    
          const data = await connectionRequest.save();
    
          res.json({ message: "Connection request " + status, data });

          
      }catch(err){
        res.status(400).send("ERROR: " + err.message);
      }
}


module.exports={
    requestSendCtrl,
    requestViewCtrl
}