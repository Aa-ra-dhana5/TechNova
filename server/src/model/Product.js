import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    u_id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    offer_price: {
      type: Number,
      required: true,
    },
    original_price: {
      type: Number,
      required: true,
    },
    off_now: {
      type: String,
    },
    total_ratings: {
      type: Number,
    },
    total_reviews: {
      type: Number,
    },
    rating: {
      type: Number,
    },
    description: {
      type: [String], // stored as array of strings
    },
    item_link: {
      type: String,
    },
    image_url: {
      type: String,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
