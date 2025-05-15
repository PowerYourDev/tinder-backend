const express= require('express')

const {
    authSingUpCtrl,
    authLoginCtrl,
    authLogoutCtrl,
    authForgotPassword,
    resetPassword
} = require('../../controllers/Auth/AuthCtrl')

const authRoutes= express.Router()


authRoutes.post('/singup',authSingUpCtrl)
authRoutes.post("/singin",authLoginCtrl);
authRoutes.post('/logout',authLogoutCtrl)

authRoutes.post('/forgot-password',authForgotPassword)
authRoutes.post('/reset-password/:token',resetPassword)







module.exports=authRoutes