import React, { useState, useEffect } from "react";
import ProductCard from "../componants/ProductCard"; // Adjust path
import products from "../componants/products"; // Your full product list

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Filtering Logic
  useEffect(() => {
    let result = products;

    // Search by text
    if (searchTerm.trim() !== "") {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (category !== "all") {
      result = result.filter((product) => product.category === category);
    }

    // Filter by price
    if (maxPrice !== "") {
      result = result.filter((product) => product.price <= parseInt(maxPrice));
    }

    setFilteredProducts(result);
  }, [searchTerm, category, maxPrice]);

  return (
    <section className="min-h-screen px-6 py-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Search & Filter
        </h2>

        {/* Search Bar & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Text Search */}
          <input
            type="text"
            placeholder="Search products (e.g., wireless, bass, compact)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full md:w-1/4 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Categories</option>
            <option value="earbuds">Earbuds</option>
            <option value="headphones">Headphones</option>
            <option value="speakers">Speakers</option>
          </select>

          {/* Price Filter */}
          <input
            type="number"
            placeholder="Max Price (₹)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full md:w-1/4 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        {/* Product Results */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">No products found.</p>
        )}
      </div>
    </section>
  );
};

export default Search;
