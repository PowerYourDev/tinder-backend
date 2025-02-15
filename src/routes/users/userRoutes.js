const express = require('express')

const {
    userSingUpCtrl,
    userLoginCtrl,
    userLogoutCtrl
}=require('../../controllers/users/userCtrl')

const userRoutes= express.Router()

userRoutes.post('/singup',userSingUpCtrl)
userRoutes.post("/singin",userLoginCtrl);
userRoutes.post('/logout',userLogoutCtrl)


module.exports=userRoutes