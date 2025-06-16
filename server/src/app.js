import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; // ✅ NEW
import connectDB from "./config/db.js";
import authRoute from "./route/authRouter.js";
import productRoutes from "./route/products.js";
import { getUsername } from "./controller/authController.js";

connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser()); // ✅ Needed to read cookies

// ✅ CORS setup for cross-origin cookies
app.use(
  cors({
    origin: "https://technova-web.onrender.com", // frontend domain
    credentials: true, // ✅ allows sending/receiving cookies
  })
);

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
