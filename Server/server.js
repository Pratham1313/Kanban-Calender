import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./connection/connection.js";
import Authroutes from "./routes/Authroutes.js";
import Userdataroutes from "./routes/Userdataroutes.js";

// Initialize express app
const app = express();
dotenv.config();

// Middleware setup
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
//Initialize Database Connection
connectDB();

//routes
app.use("/api/auth/", Authroutes);
app.use("/api/data/", Userdataroutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
