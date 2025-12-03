import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./configs/db.config.js";
import otpRoutes from "./routes/otp.routes.js";
import authRoutes from "./routes/auth.routes.js";

const PATH =  "../../.env" ;
dotenv.config({ path:PATH});
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

app.listen(process.env.PORT_AUTH, () =>
  console.log(`Auth service running on port ${process.env.PORT_AUTH }`)
);
