
const {singupValidate} =require('../../utils/validate')
const generateToken = require('../../config/jwtToken/generateToken')
const User =require("../../models/user/User")
const nodemailer =require("nodemailer");
const jwt = require("jsonwebtoken");



const authSingUpCtrl=async(req,res,next)=>{
    try{
      singupValidate(req)
        const {firstName,lastName,email,password}=req.body
        const emailExists = await User.findOne({email})
        if(emailExists){
          return res.status(409).json({ message: "Email already exists." })
        }
      
        
         const savedUser= await User.create({firstName,lastName,email,password})
         const tokenGenerated = generateToken(savedUser._id)
         res.cookie("token",tokenGenerated,{
          secure: true,       // Set to true in production when using HTTPS
          sameSite: 'None',    // Allow cross-origin requests (important for CORS)
          expires: new Date(Date.now() + 900000) })
         res.json({
           message:"singup successfull",
           data:savedUser
         });
         
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
       
     
      
       if (comparePassword) {
        const tokenGenerated= generateToken(userExist._id)
  
        res.cookie("token",tokenGenerated,{
          secure: true,       // Set to true in production when using HTTPS
          sameSite: 'None',    // Allow cross-origin requests (important for CORS)
          expires: new Date(Date.now() + 900000) })
        res.json({
          message:"login successfull",
          data:userExist
        });
      } else {
        throw new Error("Invalid credentials");
      }
    }catch(e){
      console.log(e,"juhgf")
       res.status(400).json(
       { message:e.message,
        // stack:e.stack
       }
       )
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

const authForgotPassword=async(req,res)=>{
  try{

    userEmail=req.body.email

   const userExisted= await User.findOne({email:userEmail})
   if(!userExisted){
    return res.status(404).send({ message: "User not found" });
   }

   const tokenGenerated= generateToken(userExisted._id)


 

 

   const transporter = nodemailer.createTransport({
    service: "gmail",
  port: 465, 
  secure: true, 
    auth: {
      user:"saiteja28102001@gmail.com" ,
      pass: "nxyx ugfg ytrw ueii",
    },
  });

  
  const mailOptions = {
    from: "saiteja28102001@gmail.com",
    to: userEmail,
    subject: "Reset Password",
    html: `<h1>Reset Your Password</h1>
  <p>Click on the following link to reset your password:</p>
  <a href="http://localhost:5173/reset-password/${tokenGenerated}">http://localhost:5173/reset-password/${tokenGenerated}</a>
  <p>The link will expire in 10 minutes.</p>
  <p>If you didn't request a password reset, please ignore this email.</p>`,
  };


  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return res.status(500).send({ message: err.message });
    }
    res.status(200).send({ message: "Email sent" });
  });

  
  
  }catch(error){
    console.log(error)
    res.status(400).json(
      { message:e.message,
       // stack:e.stack
      }
      )
  }
}

const resetPassword=async(req,res)=>{


  try{
    const token = req.params.token;
    if(!token){
     return res.status(400).json({
        "message":"invalid password update Try-again"
      })
    }
console.log(token)
    const decodedObj = jwt.verify(token, "dev-tinder@12321");
    console.log(decodedObj,"jwt")
    if(!decodedObj){

     return res.status(401).json({
        "message":"invalid passwoed update Try-again"
      })
    }

    const findUser=await User.findOne({_id:decodedObj.id})
    if(!findUser){
      return res.status(401).json({"message":"user not Found"})
    }
console.log(findUser)
    findUser.password=req.body.newPassword
  const updated=await findUser.save();
  console.log(updated,"new")
  res.status(200).send({ message: "Password updated" });

  }catch(e){
console.log(e)
  }

}


module.exports={
    authSingUpCtrl,
    authLoginCtrl,
    authLogoutCtrl,
    authForgotPassword,
    resetPassword
}