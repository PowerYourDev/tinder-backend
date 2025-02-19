const express = require('express')

const {
    
    userRequestReceivedCtrl,
    userRequestConnectionCtrl,

    userFeedCtrl
}=require('../../controllers/users/userCtrl')
const authMiddleware = require('../../middlewares/auth/authMiddleware')

const userRoutes= express.Router()




userRoutes.get('/requests/received',authMiddleware,userRequestReceivedCtrl)
userRoutes.get('/requests/connections',authMiddleware,userRequestConnectionCtrl)

userRoutes.get("/feed",authMiddleware,userFeedCtrl)


module.exports=userRoutes