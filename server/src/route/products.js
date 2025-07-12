import express from "express";
import {
  getAllProducts,
  getProductById,
  getBulkProducts,
  getTopRatedProducts,
  getNewArrivalProducts,
} from "../controller/productController.js";

const router = express.Router();

router.get("/top-rated", getTopRatedProducts);
router.get("/new-arrivals", getNewArrivalProducts);
router.post("/bulk", getBulkProducts);
router.get("/:id", getProductById); // this must be last
router.get("/", getAllProducts);

export default router;
