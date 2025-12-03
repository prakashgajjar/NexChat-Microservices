import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import  connectDB  from "./configs/db.config.js";
import storeKeys from "./routes/storeKeys.routes.js";
import userRoutes from "./routes/user.routes.js";

const PATH =  "../../.env" ;
dotenv.config({ path:PATH});

const app = express();

app.use(
  cors({
    origin: [process.env.NEXT_PUBLIC_BASE_URL, process.env.AUTH_SERVICE_URL], 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
app.use(express.json());

connectDB();

app.use("/api/keys", storeKeys);
app.use("/api/user", userRoutes);

app.listen(process.env.PORT_USER, () =>
  console.log(`Auth service running on port ${process.env.PORT_USER}`)
);
