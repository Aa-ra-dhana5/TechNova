import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoute from "./route/authRouter.js";
import productRoutes from "./route/products.js";
import { getUsername } from "./controller/authController.js";

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/products", productRoutes);
app.use("/product-images", express.static("public/product-images"));
app.use("/mobile", express.static("public/mobile"));
app.use("/smartwatch", express.static("public/smartwatch"));
app.use("/water", express.static("public/water"));

app.get("/", (req, res) => {
  //   console.log(req.query);
  res.send("You get the route now!!");
});
app.get("/api/users/:id", getUsername);

export default app;
