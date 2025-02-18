const express = require('express')

const {
    userSingUpCtrl,
    userLoginCtrl,
    userLogoutCtrl,
    userRequestReceivedCtrl,
    userRequestConnectionCtrl
}=require('../../controllers/users/userCtrl')
const authMiddleware = require('../../middlewares/auth/authMiddleware')

const userRoutes= express.Router()




userRoutes.get('/requests/received',authMiddleware,userRequestReceivedCtrl)
userRoutes.get('/requests/connections',authMiddleware,userRequestConnectionCtrl)


module.exports=userRoutes