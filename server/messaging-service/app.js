import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB  from "./configs/db.config.js";
import messageRouter from "./routes/message.routes.js"
import { verifyToken } from "./middleware/verifyToken.js";

const PATH =  "../../.env" ;
dotenv.config({ path:PATH});
const app = express();
app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_BASE_URL, 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/api/message", verifyToken, messageRouter);

//use for docker compose to check message services is helthy
app.get("/api/health", (req, res) => {
  return res.status(200).json({
    status: "OK",
    message: "Message service is healthy",
  });
});
app.listen(process.env.PORT_MESSAGE, () =>
  console.log(`messaging service running on port ${process.env.PORT_MESSAGE}`)
);
