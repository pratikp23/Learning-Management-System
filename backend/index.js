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

// ---- CORS MUST BE THE FIRST MIDDLEWARE ----
const allowedOrigins = [
  "https://learning-management-system-nine-bay.vercel.app",
  "http://localhost:3000"
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl) or when not in production
    if (!origin) return callback(null, true);
    if (process.env.NODE_ENV !== "production" || allowedOrigins.includes(origin)) {
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

app.listen(port, () => {
    console.log(`Server Started on port ${port}`)
    connectDb()
})