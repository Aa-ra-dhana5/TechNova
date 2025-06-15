import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductsByCategory } from "../services/productServices";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "framer-motion";

// 👇 Category → Brand Map
const categoryBrandMap = {
  smartwatch: ["Noise", "Fire-Boltt", "boAt", "Realme", "Samsung"],
  ac: ["LG", "Samsung", "Voltas", "Daikin", "Blue Star"],
  water: ["Kent", "Aquaguard", "Pureit", "Livpure", "HUL"],
  mobile: ["Apple", "Samsung", "Realme", "Redmi", "OnePlus", "Vivo", "Oppo"],
};

const sortOptions = [
  { value: "price_low_high", label: "Price: Low to High" },
  { value: "price_high_low", label: "Price: High to Low" },
  { value: "rating_high_low", label: "Rating: High to Low" },
];

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const data = await fetchProductsByCategory(category);
      setProducts(data);
      extractBrands(data);
      setLoading(false);
    };
    loadProducts();
  }, [category]);

  const extractBrands = (products) => {
    const validBrands = categoryBrandMap[category.toLowerCase()] || [];
    const detected = new Set();
    products.forEach((product) => {
      validBrands.forEach((brand) => {
        if (product.name.toLowerCase().includes(brand.toLowerCase())) {
          detected.add(brand);
        }
      });
    });
    setBrands([...detected]);
  };

  const filterByBrand = (products) =>
    selectedBrand
      ? products.filter((product) =>
          product.name.toLowerCase().includes(selectedBrand.toLowerCase())
        )
      : products;

  const sortFilteredProducts = (products) => {
    const sorted = [...products];
    switch (sortOption) {
      case "price_low_high":
        return sorted.sort(
          (a, b) => Number(a.offer_price) - Number(b.offer_price)
        );
      case "price_high_low":
        return sorted.sort(
          (a, b) => Number(b.offer_price) - Number(a.offer_price)
        );
      case "rating_high_low":
        return sorted.sort((a, b) => Number(b.rating) - Number(a.rating));
      default:
        return sorted;
    }
  };

  const filteredAndSortedProducts = sortFilteredProducts(
    filterByBrand(products)
  );

  return (
    <section className="bg-gradient-to-br from-white via-blue-100 to-cyan-50 min-h-screen overflow-hidden  mx-auto  px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-10 text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-700 mb-2 capitalize">
            {category} Collection
          </h1>
          <p className="text-gray-500 text-lg">
            Explore premium {category} products from trusted brands
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10"
        >
          {/* Brand Filter */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <button
              onClick={() => setSelectedBrand("")}
              className={`px-4 py-2 rounded-full border ${
                selectedBrand === ""
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-indigo-600 border-indigo-400"
              } transition duration-300`}
            >
              All
            </button>
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-4 py-2 rounded-full border ${
                  selectedBrand === brand
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-indigo-600 border-indigo-400"
                } transition duration-300`}
              >
                {brand}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="w-full md:w-64">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Sort By</option>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredAndSortedProducts.length > 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8"
          >
            <AnimatePresence>
              {filteredAndSortedProducts.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <p className="text-center text-gray-500 text-lg mt-10">
            No products found.
          </p>
        )}
      </div>
    </section>
  );
};

export default CategoryPage;
