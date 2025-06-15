import {
  signUp,
  login,
  verify,
  getCart,
  cartUpdate,
} from "../controller/authController.js";
import express from "express";

const router = express.Router();

router.get("/verify/:token", verify);

router.post("/signUp", signUp);
router.post("/login", login);
router.post("/cart/:userId", cartUpdate);
router.get("/cart/:userId", getCart);

export default router;
