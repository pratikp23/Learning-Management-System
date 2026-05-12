import express from "express"
import dotenv from "dotenv"
import connectDb from "./configs/db.js"
import authRouter from "./routes/authRoute.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/userRoute.js"
import courseRouter from "./routes/courseRoute.js"
import paymentRouter from "./routes/paymentRoute.js"
import aiRouter from "./routes/aiRoute.js"
import reviewRouter from "./routes/reviewRoute.js"

dotenv.config()

let port = process.env.PORT || 5000
let app = express()

app.use(express.json())
app.use(cookieParser())

// Allow frontend URL (configure for deployment via env)
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://learning-management-system-cggj-lp6pntv6o.vercel.app",
    "https://learning-management-sys-git-c87077-palakvishwakarma44s-projects.vercel.app"
  ],
  credentials: true
}));

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/course", courseRouter)
app.use("/api/payment", paymentRouter)
app.use("/api/ai", aiRouter)
app.use("/api/review", reviewRouter)

app.get("/", (req, res) => {
    res.send("Hello From Server")
})

app.listen(port, () => {
    console.log(`Server Started on port ${port}`)
    connectDb()
})