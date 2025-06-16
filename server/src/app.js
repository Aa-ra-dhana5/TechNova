import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoute from "./route/authRouter.js";
import productRoutes from "./route/products.js";
import { getUsername } from "./controller/authController.js";

connectDB();

// ✅ Proper CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://technova-web.onrender.com",
];

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Other middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/api/auth", authRoute);
app.use("/api/products", productRoutes);

// ✅ Static files
app.use("/product-images", express.static("public/product-images"));
app.use("/mobile", express.static("public/mobile"));
app.use("/smartwatch", express.static("public/smartwatch"));
app.use("/water", express.static("public/water"));
app.use(express.static("public"));

app.get("/", (req, res) => res.send("You get the route now!!"));
app.get("/api/users/:id", getUsername);

export default app;
