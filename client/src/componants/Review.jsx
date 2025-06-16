// ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchProductById } from "../services/productServices";
import { useCart } from "../componants/CartContext";
import { Star, Plus, Minus } from "lucide-react";

// Rating Circle Component
function RatingCircle({ value, label }) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 5) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width="80" height="80" className="mb-1">
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="6"
          fill="none"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="#22c55e"
          strokeWidth="6"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="fill-green-700 font-bold text-sm"
        >
          {value.toFixed(1)}
        </text>
      </svg>
      <p className="text-xs text-center text-gray-600">{label}</p>
    </div>
  );
}

export default function ProductDetail() {
  const { productId } = useParams();
  const { addToCart, cartItems, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [username, setUsername] = useState("guest_user"); // Replace with actual user info if logged in

  useEffect(() => {
    const getProduct = async () => {
      const data = await fetchProductById(productId);
      let cleanedDescription = [];

      if (typeof data.description === "string") {
        try {
          cleanedDescription = JSON.parse(data.description);
        } catch {
          cleanedDescription = normalizeDescription(data.description);
        }
      } else if (Array.isArray(data.description)) {
        if (
          data.description.length === 1 &&
          typeof data.description[0] === "string" &&
          (data.description[0].startsWith("[") ||
            data.description[0].startsWith("['"))
        ) {
          try {
            cleanedDescription = JSON.parse(data.description[0]);
          } catch {
            cleanedDescription = normalizeDescription(data.description[0]);
          }
        } else {
          cleanedDescription = data.description;
        }
      }

      setProduct({ ...data, description: cleanedDescription });
      setMainImage(data.image_url || "");
    };
    getProduct();
  }, [productId]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!product?.category) return;
      const res = await fetch(
        `${import.meta.env.VITE_PRODUCT_API_URL}/products?category=${product.category}`
      );
      const data = await res.json();
      setRelatedProducts(data.filter((p) => p._id !== productId).slice(0, 6));
    };
    fetchSuggestions();
  }, [product]);

  const cartItem = cartItems.find((item) => item.id === product?._id);
  const quantity = cartItem?.quantity || 0;
  const normalizedDescription = normalizeDescription(product?.description);

  const ratingAspects = [
    {
      name: "Cooling",
      value: +(Math.random() * 1 + product?.rating - 1).toFixed(1),
    },
    {
      name: "Noise",
      value: +(Math.random() * 1 + product?.rating - 1.2).toFixed(1),
    },
    {
      name: "Energy Efficiency",
      value: +(Math.random() * 1 + product?.rating - 0.8).toFixed(1),
    },
    {
      name: "Value for Money",
      value: +(Math.random() * 1 + product?.rating - 0.6).toFixed(1),
    },
  ];

  const handleReviewSubmit = () => {
    if (reviewText.trim()) {
      setReviews((prev) => [...prev, { username, text: reviewText.trim() }]);
      setReviewText("");
    }
  };

  if (!product)
    return <div className="p-10 text-center text-xl">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 text-gray-800">
      {/* existing content remains same... */}

      {/* Review Highlights with Circular Progress */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold text-cyan-800 mb-4">
          Highlights based on Reviews
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {ratingAspects.map((aspect, i) => (
            <RatingCircle key={i} value={aspect.value} label={aspect.name} />
          ))}
        </div>
      </div>

      {/* User Review Section */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold text-cyan-800 mb-2">
          Customer Reviews
        </h3>
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((rev, idx) => (
              <div key={idx} className="border p-3 rounded bg-gray-50">
                <p className="font-semibold text-gray-700">{rev.username}</p>
                <p className="text-sm text-gray-600">{rev.text}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              No reviews yet. Be the first to review!
            </p>
          )}
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Write your review..."
            className="flex-1 border p-2 rounded"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
          <button
            onClick={handleReviewSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </div>

      {/* existing related products block remains */}
    </div>
  );
}

function normalizeDescription(desc) {
  if (!desc) return [];
  if (Array.isArray(desc)) return desc;
  if (typeof desc === "string") {
    try {
      const parsed = JSON.parse(desc);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    return desc
      .replace(/[\[\]"]+/g, "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}
