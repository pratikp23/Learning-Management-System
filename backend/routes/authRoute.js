// import express from "express"
// import {googleSignup, login, logOut, resetPassword, sendOtp, signUp, verifyOtp } from "../controllers/authController.js"

// const authRouter = express.Router()

// authRouter.post("/signup",signUp)

// authRouter.post("/login",login)
// authRouter.get("/logout",logOut)
// authRouter.post("/googlesignup",googleSignup)
// authRouter.post("/sendotp",sendOtp)
// authRouter.post("/verifyotp",verifyOtp)
// authRouter.post("/resetpassword",resetPassword)


// export default authRouter





import validator from "validator";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import sendMail from "../configs/Mail.js";

// from chat gpt

import express from "express"
import { 
  googleSignup,
  login,
  logOut,
  resetPassword,
  sendOtp,
  signUp,
  verifyOtp,
  sendSignupOtp,
  sendMagicLink,
  loginMagic
} from "../controllers/authController.js"

const authRouter = express.Router()

authRouter.post("/signup", signUp)

authRouter.post("/login", login)

authRouter.get("/logout", logOut)

authRouter.post("/googlesignup", googleSignup)

authRouter.post("/sendotp", sendOtp)

authRouter.post("/verifyotp", verifyOtp)

authRouter.post("/resetpassword", resetPassword)

authRouter.post("/send-signup-otp", sendSignupOtp)

authRouter.post("/send-magic-link", sendMagicLink)

authRouter.post("/login-magic", loginMagic)

export default authRouter





