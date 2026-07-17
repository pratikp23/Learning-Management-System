import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
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

// ---- CORS MUST BE THE FIRST MIDDLEWARE ----
const allowedOrigins = [
  "https://learning-management-system-nine-bay.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    const isAllowed = 
      process.env.NODE_ENV !== "production" || 
      allowedOrigins.includes(origin) ||
      origin.endsWith(".vercel.app") ||
      /^https?:\/\/localhost:\d+$/.test(origin);

    if (isAllowed) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Enable preflight for all routes
app.options(/.*/, cors(corsOptions));
// ------------------------------------------------

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/course", courseRouter)
app.use("/api/payment", paymentRouter)
app.use("/api/ai", aiRouter)
app.use("/api/review", reviewRouter)

app.get("/", (req, res) => {
    res.send("Hello From Server")
})

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "UP",
        database: mongoose.connection.readyState === 1 ? "CONNECTED" : "DISCONNECTED",
        timestamp: new Date()
    })
})

app.listen(port, () => {
    console.log(`Server Started on port ${port}`)
    connectDb()
})