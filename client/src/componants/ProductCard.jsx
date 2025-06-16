import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Plus, Minus, Star } from "lucide-react";
import { useCart } from "../componants/CartContext";
import { motion } from "framer-motion";

export default function ProductCard({ product }) {
  const { cartItems, addToCart, removeFromCart, updateQuantity } = useCart();
  const existingItem = cartItems.find((item) => item._id === product._id);

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart({ ...product, id: product._id, quantity: 1 });
  };

  const handleRemove = (e) => {
    e.preventDefault();
    if (existingItem.quantity === 1) {
      removeFromCart(product._id);
    } else {
      updateQuantity(product._id, existingItem.quantity - 1);
    }
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.25 && rating - full < 0.75;
    const empty = 5 - full - (half ? 1 : 0);

    return (
      <>
        {[...Array(full)].map((_, i) => (
          <Star key={"full" + i} size={16} fill="#facc15" stroke="#facc15" />
        ))}
        {half && (
          <Star
            key="half"
            size={16}
            fill="url(#halfGradient)"
            stroke="#facc15"
          />
        )}
        {[...Array(empty)].map((_, i) => (
          <Star key={"empty" + i} size={16} fill="none" stroke="#d1d5db" />
        ))}
        <svg width="0" height="0">
          <defs>
            <linearGradient id="halfGradient">
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="50%" stopColor="white" stopOpacity="1" />
            </linearGradient>
          </defs>
        </svg>
      </>
    );
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="border rounded-2xl p-4 shadow hover:shadow-lg transition-all duration-300 cursor-pointer bg-white"
    >
      <Link
        to={`/products/${product.category}/${product._id}`}
        className="block group"
      >
        <img
          src={`${import.meta.env.VITE_API_URL}/${product.image_url}`}
          alt={product.name}
          className="w-full h-48 object-contain mb-3 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        <h3 className="text-base font-semibold mb-1 line-clamp-2 text-gray-800">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mb-1">
          <p className="text-xl font-bold text-green-600">
            ₹{product.offer_price}
          </p>
          <p className="text-sm text-gray-400 line-through">
            ₹{product.original_price}
          </p>
          <p className="text-sm text-red-500 font-semibold">
            {product.off_now}
          </p>
        </div>

        <div className="flex items-center gap-1 mb-2">
          {renderStars(product.rating)}
          {/* <span className="text-sm text-gray-500 ml-1">
            ({product.total_ratings})
          </span> */}
        </div>
      </Link>

      {existingItem ? (
        <div className="mt-3 flex justify-between items-center border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={handleRemove}
            className="w-10 h-10 bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            <Minus size={16} className="mx-auto" />
          </button>
          <span className="px-4 font-semibold text-gray-700">
            {existingItem.quantity}
          </span>
          <button
            onClick={handleAdd}
            className="w-10 h-10 bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            <Plus size={16} className="mx-auto" />
          </button>
        </div>
      ) : (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          className="mt-3 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition"
        >
          <ShoppingCart size={16} />
          Add to Cart
        </motion.button>
      )}
    </motion.div>
  );
}
