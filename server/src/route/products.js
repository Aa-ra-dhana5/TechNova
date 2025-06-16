import express from "express";
import Product from "../model/Product.js"; // Ensure this is correct

const router = express.Router();

router.get("/", async (req, res) => {
  const { category } = req.query;

  try {
    const query = category
      ? { category: { $regex: new RegExp(category, "i") } }
      : {};
    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// routes/products.js or similar
router.post("/bulk", async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "No product IDs provided." });
    }

    const products = await Product.find({ _id: { $in: ids } });

    res.json(products);
  } catch (error) {
    console.error("Error fetching products in bulk:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get top-rated products
router.get("/top-rated", async (req, res) => {
  try {
    const products = await Product.find().sort({ rating: -1 }).limit(6);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get newly added products
router.get("/new-arrivals", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(6);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
