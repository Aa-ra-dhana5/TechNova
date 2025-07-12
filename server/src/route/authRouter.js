import {
  signUp,
  login,
  verify,
  getCart,
  cartUpdate,
} from "../controller/authController.js";
import express from "express";
import authJWT from "../middleware/authMiddleware.js"; // make sure path is correct



const router = express.Router();

// Public Routes
router.post("/signUp", signUp);
router.post("/login", login);
router.get("/verify/:token", verify);

// Protected Routes (require login via cookie)
router.get("/cart", authJWT, getCart);
router.post("/cart", authJWT, cartUpdate);




export default router;
