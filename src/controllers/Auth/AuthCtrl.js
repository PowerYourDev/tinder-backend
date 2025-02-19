
const {singupValidate} =require('../../utils/validate')
const generateToken = require('../../config/jwtToken/generateToken')
const User =require("../../models/user/User")


const authSingUpCtrl=async(req,res,next)=>{
    try{
      singupValidate(req)
        const {firstName,lastName,email,password}=req.body
      
        
         const savedUser= await User.create({firstName,lastName,email,password})
         res.send({ message: "User Added successfully!", data: savedUser })
         
    }catch(e){
     res.status(404).send("something went wrong"+e)
    }
  
  
  }

//-------------------------------------
//login
//-------------------------------------

 const authLoginCtrl= async(req,res)=>{
    const {email,password}=req.body
    try{
       const userExist= await User.findOne({email:email})
       console.log(userExist)
       if(!userExist){
        throw new Error("email and password is incorrect")
       }
       const comparePassword= await userExist.validatePassword(password) 
       
       if(!comparePassword){
          throw new Error('email and password is not correct')
       }
       const tokenGenerated= generateToken(userExist._id)
  
       res.cookie("token",tokenGenerated,{ expires: new Date(Date.now() + 900000) }).send('user login successfully')
      
      
    }catch(e){
       res.status(400).send('something went wrong'+e)
    }
  }  

//-------------------------------------
//logout
//-------------------------------------

const authLogoutCtrl=async(req,res)=>{
    res.cookie('token',null,{
        expires: new Date(Date.now())
    }).send("user logout successfull")

}


module.exports={
    authSingUpCtrl,
    authLoginCtrl,
    authLogoutCtrl
}