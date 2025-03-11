const express= require('express')

const authMiddleware = require('../../middlewares/auth/authMiddleware')
const {chatctrl} = require('../../controllers/Chat/chatCtrl')

const chatRoutes= express.Router()


chatRoutes.get('/view/:userRequestId',authMiddleware,chatctrl)

module.exports = chatRoutes