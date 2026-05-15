import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./configs/db.config.js";
import otpRoutes from "./routes/otp.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000", 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
app.use(express.json());
app.use(cookieParser());

connectDB();


app.use("/api/otp", otpRoutes);
app.use("/api/auth", authRoutes);

//use for docker compose to check auth services is helthy
app.get("/api/health", (req, res) => {
  return res.status(200).json({
    status: "OK",
    message: "Auth service is healthy",
  });
});
app.listen(process.env.PORT_AUTH, () =>
  console.log(`Auth service running on port ${process.env.PORT_AUTH }`)
);
