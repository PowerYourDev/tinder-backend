const express =require('express')
const cookieParser = require('cookie-parser')
const bycrpt= require('bcrypt')
const cors =require('cors')
const http =require('http')

const dbConnect =require('./config/db/dbConnect')

const User =require("./models/user/User")


const authMiddleware =require('./middlewares/auth/authMiddleware')



const userRoutes=require('./routes/users/userRoutes')
const profileRoutes=require('./routes/profile/profileroutes')
const RequestRoutes=require('./routes/request/RequestRoute')
const AuthRoutes=require('./routes/Auth/AuthRoutes')

const initiaizeSocket = require('./utils/socket')
const ChatRoutes = require('./routes/Chat/ChatRoutes')

const App = express()

App.use(cors(
   {
     origin: 'https://saiteja-dev-connect.vercel.app',

     credentials: true,
   }
))

// we use this exprees.json middleware because to handle and convert  all the incoming json data to js object which we are passing as request to api's 
// we can use express.json() middleware by using   "app.use()" because it has run for all requests
App.use(express.json({ limit: '10mb' }));
App.use(cookieParser())

App.use("/api/auth",AuthRoutes)
App.use("/api/users",userRoutes)
App.use('/api/profile',profileRoutes)
App.use('/api/request',RequestRoutes)

App.use('/api/chat',ChatRoutes)


const server = http.createServer(App);
initiaizeSocket(server)


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
    server.listen(5000, () => {
      console.log("Server is successfully listening on port 5000...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });
