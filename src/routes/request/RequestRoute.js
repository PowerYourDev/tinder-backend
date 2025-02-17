const express = require('express')


const authMiddleware = require('../../middlewares/auth/authMiddleware')

const {
    requestSendCtrl,
    requestViewCtrl

}=require('../../controllers/Request/requestCtrl')

const RequestRoutes= express.Router()

RequestRoutes.post('/request/send/:status/:toUserId',authMiddleware, requestSendCtrl)
RequestRoutes.post('/request/review/:status/:requestId',authMiddleware, requestViewCtrl)



module.exports=RequestRoutes