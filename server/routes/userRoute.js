import { Router } from 'express'
import {registerUser,loginUser,userCredit, paymentRazorpay, verifyRazorpay} from '../controller/userController.js'
import userAuth from '../middlewares/auth.js'

const userRouter = Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.get("/credits",userAuth,userCredit)
userRouter.post("/pay-razor",userAuth,paymentRazorpay)
userRouter.post("/verify-razor",verifyRazorpay)
export default userRouter