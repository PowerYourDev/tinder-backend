const express =require('express')
const cookieParser = require('cookie-parser')
const bycrpt= require('bcrypt')

const dbConnect =require('./config/db/dbConnect')

const User =require("./models/user/User")

const {singupValidate} =require('./utils/validate')
const generateToken = require('./config/jwtToken/generateToken')
const authMiddleware =require('./middlewares/auth/authMiddleware')

const App = express()

// we use this exprees.json middleware because to handle and convert  all the incoming json data to js object which we are passing as request to api's 
// we can use express.json() middleware by using   "app.use()" because it has run for all requests
App.use(express.json())
App.use(cookieParser())



App.post("/singup",async(req,res,next)=>{
  try{
    singupValidate(req)
      const {firstName,lastName,email,password}=req.body
    
      
       const savedUser= await User.create({firstName,lastName,email,password})
       res.send({ message: "User Added successfully!", data: savedUser })
       
  }catch(e){
   res.status(404).send("something went wrong"+e)
  }


})

App.post('/singin',async(req,res)=>{
  const {email,password}=req.body
  try{
     const userExist= await User.findOne({email:email})
     console.log(userExist)
     if(!userExist){
      throw new Error("email and password is incorrect")
     }
     const comparePassword= await bycrpt.compare(password,userExist.password)
     console.log(comparePassword)
     if(!comparePassword){
        throw new Error('email and password is not correct')
     }
     const tokenGenerated= generateToken(userExist._id)
     

     res.cookie("token",tokenGenerated,{ expires: new Date(Date.now() + 900000) })


     res.send('user login successfully')
    
  }catch(e){
     res.status(400).send('something went wrong'+e)
  }
})
//feed
App.get("/get-all-users",authMiddleware,async(req,res)=>{

  
 try{

  const allUsers=await User.find({})
    if(allUsers.length<1){
      res.status(400).send("no users found ")
    }
    res.send(allUsers)
 }catch(e){
   res.status.send(e,'something went wrong')
 }
})
//get user by email
App.get("/get-user",async(req,res)=>{
  const email=req.body.email
  try{
       const user=await User.findOne({email:email})
       if(!user){
       res.status(400).send("user not found")
       }
       res.send(user)
  }catch(e){
    res.status(400).send(e,"something went wrong")
  }
})


App.delete('/user-delet',async(req,res)=>{
  console.log(req.body._id)
  try{
    const deletingUser=await User.findByIdAndDelete(req.body._id)
    if(!deletingUser){
      res.status(400).send("email id not exists")
    }
    res.send("deleted succesfully")
  }catch(e){
    res.status(400).send("something went wrong")
  }
})

App.patch('/updating-user-details/:userId',async(req,res)=>{
  const userId=req.params.userId
  
    try{
      console.log(userId)
const Allowedupdate=['firstName',"lastName","photoUrl","about","age"]
  
const allwoedUpdating=Object.keys(req.body).every((value)=>{
   Allowedupdate.includes(value)
})

if(!allwoedUpdating){
  throw new Error("updating not allowed")
}
     const updatingUser=await User.findByIdAndUpdate(userId,req.body,{returnDocument: 'before',runValidators:true })
     console.log(updatingUser)
      res.send(updatingUser)
    }catch(err){
     res.status(400).send("something went wrong"+err)
    }
})






dbConnect()
  .then(() => {
    console.log("Database connection established...");
    App.listen(5000, () => {
      console.log("Server is successfully listening on port 5000...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });
