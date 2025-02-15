const express= require('express')


const authMiddleware =require('../../middlewares/auth/authMiddleware')
const {profileViewCtrl,profileEditCtrl}=require('../../controllers/profile/profileCtrl')

const profileRoutes=express.Router()

profileRoutes.get('/view',authMiddleware,profileViewCtrl)
profileRoutes.patch('/edit',authMiddleware,profileEditCtrl)


module.exports=profileRoutes

