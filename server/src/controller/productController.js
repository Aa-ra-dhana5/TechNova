import Product from "../model/Product.js";

// GET /api/products → Get All Products (with optional category, pagination)
export const getAllProducts = async (req, res) => {
  try {
    const { category, page = 1, limit = 12, brand, sort } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (category) {
      filter.category = { $regex: new RegExp(category, "i") }; // case-insensitive match
    }
    // matches brand name in product name

    let sortOption = {};
    switch (sort) {
      case "price_low_high":
        sortOption.offer_price = 1;
        break;
      case "price_high_low":
        sortOption.offer_price = -1;
        break;
      case "rating_high_low":
        sortOption.rating = -1;
        break;
    }

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({ success: true, data: products });
  } catch (err) {
    console.error("Error in getProducts:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/products/:id → Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/products/bulk → Get multiple products by ID array
export const getBulkProducts = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No product IDs provided." });
    }

    const products = await Product.find({ _id: { $in: ids } });
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    console.error("Error in getBulkProducts:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/products/top-rated → Top 2 from each category
export const getTopRatedProducts = async (req, res) => {
  try {
    const all = await Product.find().sort({ rating: -1 });
    console.log("Fetched products:", all.length);

    const topByCategory = {};
    for (const p of all) {
      const cat =
        typeof p.category === "string" && p.category.trim()
          ? p.category.trim()
          : "Uncategorized";

      if (!topByCategory[cat]) topByCategory[cat] = [];
      if (topByCategory[cat].length < 2) {
        topByCategory[cat].push(p);
      }
    }

    const final = Object.values(topByCategory).flat().slice(0, 12);
    res.status(200).json({ success: true, data: final });
  } catch (err) {
    console.error("Error in getTopRatedProducts:", err.message, err.stack);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/products/new-arrivals → Latest 2 from each category
export const getNewArrivalProducts = async (req, res) => {
  try {
    const all = await Product.find().sort({ created_at: -1 });
    console.log("Fetched products:", all.length);

    const newByCategory = {};
    for (const p of all) {
      const cat =
        typeof p.category === "string" && p.category.trim()
          ? p.category.trim()
          : "Uncategorized";

      if (!newByCategory[cat]) newByCategory[cat] = [];
      if (newByCategory[cat].length < 2) {
        newByCategory[cat].push(p);
      }
    }

    const final = Object.values(newByCategory).flat().slice(0, 12);
    res.status(200).json({ success: true, data: final });
  } catch (err) {
    console.error("Error in getNewArrivalProducts:", err.message, err.stack);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
