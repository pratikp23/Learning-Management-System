import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});


export const sendMail=async (to,otp) => {
    return transporter.sendMail({
        from:process.env.EMAIL,
        to:to,
        subject:"Reset Your Password",
        html:`<p>Your OTP for Password Reset is <b>${otp}</b>.
        It expires in 5 minutes.</p>`
    })
}

export const sendMagicLinkMail=async (to,magicLink) => {
    return transporter.sendMail({
        from:process.env.EMAIL,
        to:to,
        subject:"Your Magic Login Link",
        html:`<p>Click the link below to instantly log in to your account. This link will expire in 15 minutes:</p>
               <p><a href="${magicLink}" style="padding: 10px 20px; background-color: black; color: white; text-decoration: none; border-radius: 5px; display: inline-block;">Login Instantly</a></p>
               <p>If the button doesn't work, copy and paste this link into your browser:</p>
               <p>${magicLink}</p>`
    })
}

export default sendMail