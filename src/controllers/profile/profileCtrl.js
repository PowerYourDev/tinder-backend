const {checkingAllowedFields}=require('../../utils/validate')
//-------------------------------------
//profile view
//-------------------------------------

const profileViewCtrl=async(req,res)=>{
  try{
     const user=req.user
     res.send(user)
  }catch(err){
    res.status(400).send("err:"+err)
  }
}

const profileEditCtrl=async(req,res)=>{
  try{
     checkingAllowedFields(req.body)

     const loggedInUser = req.user

     Object.keys(req.body).forEach((key)=>loggedInUser[key]=req.body[key])
     await loggedInUser.save()

     res.json({
        message: `${loggedInUser.firstName}, your profile updated successfuly`,
        data: loggedInUser,
      });
  }catch(err){
    res.status(400).send("ERROR : " + err.message);
  }
}

module.exports={
    profileViewCtrl,
    profileEditCtrl

}