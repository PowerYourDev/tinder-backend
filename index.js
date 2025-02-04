const express =require('express')
const dbConnect =require('./config/dbConnect')
const User =require("./models/user/User")

const App = express()


App.post("/singUP",async(req,res)=>{
  try{
    const data={
        firstName:"saiteja",
        lastName:"teja",
        email:"hello@gamil.com",
        password:"teja678"
       }
       const userStoring= await User.create(data)
       res.send(userStoring)
       
  }catch(e){
   console.log(userStoring)
  }


})



App.listen(5000,()=>{
    console.log("app is running successfull")

    dbConnect.then(()=>{
        console.log("db connnected succesfully")
    }).catch((e)=>{
        console.log(e)
    })
    
})
