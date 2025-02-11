const express = require('express')

const {
    userSingUpCtrl,
    userLoginCtrl,
}=require('../../controllers/users/userCtrl')

const userRoutes= express.Router()

userRoutes.post('/singup',userSingUpCtrl)
userRoutes.post("/singin",userLoginCtrl);


module.exports=userRoutes