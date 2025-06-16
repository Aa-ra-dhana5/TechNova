import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoute from "./route/authRouter.js";
import productRoutes from "./route/products.js";
import { getUsername } from "./controller/authController.js";

connectDB();

const app = express();

// ✅ Allow only specific origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://technova-web.onrender.com",
];

// ✅ CORS middleware at top
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ✅ Log CORS headers (after cors, before routes)
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log("🔍 Origin:", req.headers.origin);
    console.log("🔁 Response Headers:", res.getHeaders());
  });
  next();
});

// ✅ Routes
app.use("/api/auth", authRoute);
app.use("/api/products", productRoutes);
app.use(express.static("public"));

app.use("/product-images", express.static("public/product-images"));
app.use("/mobile", express.static("public/mobile"));
app.use("/smartwatch", express.static("public/smartwatch"));
app.use("/water", express.static("public/water"));

app.get("/", (req, res) => {
  res.send("You get the route now!!");
});

app.get("/api/users/:id", getUsername);

export default app;
