// ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchProductById } from "../services/productServices";
import { useCart } from "../componants/CartContext";
import { Star, Plus, Minus } from "lucide-react";

export default function ProductDetail() {
  const { productId } = useParams();
  const { addToCart, cartItems, updateQuantity } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [name, setName] = useState("guest_user");

  useEffect(() => {
    const loadUser = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const res = await fetch(`${import.meta.env.VITE_USER_API_URL}/users/${userId}`);
        const user = await res.json();
        if (user?.name) setName(user.name);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const getProduct = async () => {
      const data = await fetchProductById(productId);

      // Normalize description
      const cleanedDescription = normalizeDescription(data.description);

      const fullImageUrl = data.image_url?.startsWith("http")
        ? data.image_url
        : `${import.meta.env.VITE_API_URL}/${data.image_url}`;

      const rating_breakdown = generateRatingBreakdown(data.total_ratings, data.rating);
      const feature_ratings = generateFeatureRatings();

      setProduct({
        ...data,
        image_url: fullImageUrl,
        description: cleanedDescription,
        rating_breakdown,
        feature_ratings,
      });

      setMainImage(fullImageUrl);
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

  const handleReviewSubmit = () => {
    if (reviewText.trim()) {
      setReviews((prev) => [...prev, { name, text: reviewText.trim() }]);
      setReviewText("");
    }
  };

  const cartItem = cartItems.find((item) => item.id === product?._id);
  const quantity = cartItem?.quantity || 0;

  if (!product) return <div className="p-10 text-center text-xl">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 text-gray-800">
      {/* Product Display */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* LEFT - IMAGES */}
        <div className="lg:w-1/2">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-[400px] object-contain rounded border"
          />
          <div className="flex gap-4 mt-4">
            {[product.image_url, ...(product.thumbnails || [])].map((img, idx) => {
              const imageUrl = img?.startsWith("http")
                ? img
                : `${import.meta.env.VITE_API_URL}/${img}`;
              return (
                <img
                  key={idx}
                  src={imageUrl}
                  onClick={() => setMainImage(imageUrl)}
                  className={`w-20 h-20 border rounded cursor-pointer object-cover ${
                    mainImage === imageUrl ? "border-red-500" : "border-gray-300"
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* RIGHT - DETAILS */}
        <div className="lg:w-1/2 space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <div className="flex items-center space-x-2">
            {[...Array(Math.floor(product.rating))].map((_, i) => (
              <Star key={i} size={16} fill="#facc15" stroke="#facc15" />
            ))}
            <span className="text-sm text-gray-500">
              ({product.total_reviews} reviews)
            </span>
          </div>

          <p className="text-2xl text-red-600 font-bold">
            ₹{product.offer_price.toLocaleString()}
            <span className="ml-2 line-through text-gray-500 text-base">
              ₹{product.original_price.toLocaleString()}
            </span>
          </p>

          <div className="flex gap-4 items-center">
            {quantity > 0 ? (
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => updateQuantity(product._id, quantity - 1)}
                  className="bg-gray-200 px-3 py-1 rounded"
                >
                  <Minus size={16} />
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => updateQuantity(product._id, quantity + 1)}
                  className="bg-gray-200 px-3 py-1 rounded"
                >
                  <Plus size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() =>
                  addToCart({
                    id: product._id,
                    title: product.name,
                    price: product.offer_price,
                    quantity: 1,
                    thumbnail: product.image_url,
                  })
                }
                className="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600"
              >
                Add to Cart
              </button>
            )}
            <button
              onClick={() => {
                addToCart({
                  id: product._id,
                  title: product.name,
                  price: product.offer_price,
                  quantity: 1,
                  thumbnail: product.image_url,
                });
                navigate("/cart");
              }}
              className="border px-5 py-2 rounded hover:bg-gray-100"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* SPECIFICATIONS */}
      <div className="mt-10 border rounded-md p-4">
        <h3 className="text-lg font-semibold mb-4 text-cyan-900">SPECIFICATIONS</h3>
        {product.description.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {product.description.map((desc, i) => (
              <div key={i} className="bg-white border rounded-md p-3 shadow-sm text-sm">
                • {desc.replace(/^'(.*)'$/, "$1")}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No description available.</p>
        )}
      </div>

      {/* RATINGS & REVIEWS */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold text-cyan-800 mb-4">
          Ratings & Reviews
        </h3>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="space-y-1 w-full lg:w-1/2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-6">{star}★</span>
                <div className="bg-gray-200 h-2 flex-1 rounded">
                  <div
                    className="bg-green-500 h-2 rounded"
                    style={{
                      width: `${
                        (product.rating_breakdown[star] / product.total_ratings) * 100
                      }%`,
                    }}
                  ></div>
                </div>
                <span>{product.rating_breakdown[star]}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 w-full lg:w-1/2">
            {Object.entries(product.feature_ratings).map(([feature, value]) => (
              <div key={feature} className="text-center">
                <div className="text-2xl font-semibold text-green-600">{value}</div>
                <p className="text-sm text-gray-600 mt-1">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold text-cyan-800 mb-2">
            Customer Reviews
          </h3>
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((rev, idx) => (
                <div key={idx} className="border p-3 rounded bg-gray-50">
                  <p className="font-semibold text-gray-700">{rev.name}</p>
                  <p className="text-sm text-gray-600">{rev.text}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No reviews yet. Be the first to review!</p>
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
      </div>

      {/* RELATED PRODUCTS */}
      <div className="mt-16">
        <h2 className="text-xl font-bold mb-4">Related Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedProducts.map((item) => (
            <Link
              key={item._id}
              to={`/products/${item.category}/${item._id}`}
              className="border p-4 rounded hover:shadow-lg transition"
            >
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-40 object-contain mb-2"
              />
              <h3 className="text-sm font-semibold truncate">{item.name}</h3>
              <p className="text-red-500 font-bold text-sm">
                ₹{item.offer_price.toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helpers
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

function generateRatingBreakdown(totalRatings, avgRating) {
  let weights;
  if (avgRating >= 4.5) weights = [0.05, 0.05, 0.1, 0.2, 0.6];
  else if (avgRating >= 4.0) weights = [0.05, 0.1, 0.1, 0.35, 0.4];
  else if (avgRating >= 3.5) weights = [0.1, 0.15, 0.25, 0.3, 0.2];
  else if (avgRating >= 3.0) weights = [0.15, 0.25, 0.3, 0.2, 0.1];
  else weights = [0.4, 0.3, 0.2, 0.05, 0.05];

  const rawCounts = weights.map((w) => Math.round(w * totalRatings));
  const diff = totalRatings - rawCounts.reduce((a, b) => a + b, 0);
  rawCounts[4] += diff;

  return {
    1: rawCounts[0],
    2: rawCounts[1],
    3: rawCounts[2],
    4: rawCounts[3],
    5: rawCounts[4],
  };
}

function generateFeatureRatings() {
  return {
    "Battery & Charger": (3 + Math.random()).toFixed(1),
    Display: (3 + Math.random()).toFixed(1),
    Design: (3 + Math.random()).toFixed(1),
    "Activity Tracking": (3 + Math.random()).toFixed(1),
  };
}
