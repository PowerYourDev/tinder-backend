const express = require('express')


const authMiddleware = require('../../middlewares/auth/authMiddleware')

const {
    requestSendCtrl,
    requestViewCtrl

}=require('../../controllers/Request/requestCtrl')

const RequestRoutes= express.Router()

RequestRoutes.post('/send/:status/:toUserId',authMiddleware, requestSendCtrl)
RequestRoutes.post('/review/:status/:requestId',authMiddleware, requestViewCtrl)



module.exports=RequestRoutes