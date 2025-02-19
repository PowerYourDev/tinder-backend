const express= require('express')

const {
    authSingUpCtrl,
    authLoginCtrl,
    authLogoutCtrl
} = require('../../controllers/Auth/AuthCtrl')

const authRoutes= express.Router()


authRoutes.post('/singup',authSingUpCtrl)
authRoutes.post("/singin",authLoginCtrl);
authRoutes.post('/logout',authLogoutCtrl)







module.exports=authRoutes