import React, { useEffect, useState } from "react";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import { motion } from "framer-motion";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000/api/products";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(API_URL);
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch products", err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getTopRated = () =>
    [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);

  const getNewArrivals = () => {
    const categoryMap = {};
    products.forEach((p) => {
      if (!categoryMap[p.category]) categoryMap[p.category] = [];
      categoryMap[p.category].push(p);
    });

    const arrivals = [];
    Object.values(categoryMap).forEach((arr) => {
      const latestTwo = arr
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 2);
      arrivals.push(...latestTwo);
    });

    return arrivals;
  };

  const getBestReviewed = () => {
    const famousBrands = [
      "samsung",
      "apple",
      "lg",
      "sony",
      "boat",
      "hp",
      "dell",
      "asus",
      "realme",
      "redmi",
    ];
    const grouped = {};

    products.forEach((p) => {
      const cat = p.category.toLowerCase();
      if (!grouped[cat]) grouped[cat] = [];

      const isFamous = famousBrands.some((brand) =>
        p.name.toLowerCase().includes(brand)
      );

      if (isFamous || p.rating >= 4.2) {
        grouped[cat].push(p);
      }
    });

    const best = [];
    Object.values(grouped).forEach((arr) => {
      const topRated = arr
        .sort((a, b) => b.offer_price - a.offer_price)
        .slice(0, 2);
      best.push(...topRated);
    });

    return best.slice(0, 12);
  };

  const truncate = (str, len = 80) =>
    str?.length > len ? str.slice(0, len) + "..." : str;

  const ProductCard = ({ product }) => (
    <motion.div
      className="bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-gray-200 hover:border-cyan-500 p-5 transition cursor-pointer flex flex-col w-full hover:scale-105"
      whileHover={{ y: -5 }}
      key={product._id}
    >
      <img
        src={product.image_url}
        alt={product.name}
        className="w-full h-52 object-contain mb-4 rounded-lg"
      />
      <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-2">
        {product.name}
      </h3>
      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
        {truncate(product.description?.join(" ") || "")}
      </p>
      <div className="flex justify-between items-center mt-auto pt-3">
        <div className="text-cyan-700 font-extrabold text-xl">
          ₹{product.offer_price?.toLocaleString()}
        </div>
        <a
          href={product.item_link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 font-medium hover:underline"
        >
          View
        </a>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-xl text-cyan-600 animate-pulse">
        Loading products...
      </div>
    );
  }

  return (
    <main className="relative bg-gradient-to-br from-white via-blue-100 to-cyan-50 min-h-screen overflow-hidden pb-20">
      {/* Hero Section */}
      <section className="w-full h-[500px] relative">
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          interval={5000}
        >
          {[
            {
              img: "https://i0.wp.com/gadgets-africa.com/wp-content/uploads/2019/11/Intelligenthq.jpg?fit=2000%2C1000&ssl=1",
              title: "Experience the Future of Shopping",
              subtitle: "Tech. Style. Affordability — All in One Place.",
            },
            {
              img: "https://businessupside.in/wp-content/uploads/2021/11/Consumer-electronics.jpg",
              title: "Unbeatable Deals, Just for You",
              subtitle: "Your dream gadget at a dreamy price.",
            },
          ].map((slide, idx) => (
            <div
              key={idx}
              className="h-[500px] bg-cover bg-center flex items-center justify-center"
              style={{ backgroundImage: `url(${slide.img})` }}
            >
              <div className="bg-black bg-opacity-50 p-8 rounded-3xl text-white text-center">
                <motion.h1
                  className="text-4xl md:text-6xl font-extrabold"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {slide.title}
                </motion.h1>
                <motion.p
                  className="mt-4 text-xl md:text-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {slide.subtitle}
                </motion.p>
              </div>
            </div>
          ))}
        </Carousel>
      </section>

      {/* Sections */}
      {[
        { title: "🌟 Top Rated Products", products: getTopRated() },
        { title: "🆕 New Arrivals", products: getNewArrivals() },
      ].map((section, i) => (
        <section key={i} className="max-w-7xl mx-auto px-6 py-20">
          <motion.h2
            className="text-4xl font-extrabold mb-12 text-center text-cyan-800"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {section.title}
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {section.products.map((prod) => (
              <ProductCard product={prod} key={prod._id} />
            ))}
          </div>
        </section>
      ))}

      <section className="py-20 bg-gradient-to-r from-blue-100 to-cyan-100 overflow-hidden">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-cyan-800">
          🔥 Best Reviewed Products
        </h2>
        <div
          className="flex gap-6 animate-marquee whitespace-nowrap hover:[animation-play-state:paused] px-6"
          style={{ animation: "scroll 30s linear infinite" }}
        >
          {getBestReviewed().map((product) => (
            <motion.div
              key={product._id}
              whileHover={{ scale: 1.05 }}
              className="min-w-[250px] bg-white rounded-xl shadow-lg p-5 flex-shrink-0 border border-gray-200"
            >
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-40 object-contain mb-3"
              />
              <h4 className="text-lg font-semibold text-gray-800">
                {product.name}
              </h4>
              <div className="mt-2 text-cyan-700 font-bold text-lg">
                ₹{product.offer_price?.toLocaleString()}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-3 gap-10">
        {[
          {
            title: "🚚 Fast Delivery",
            desc: "Get your product at lightning speed, across all cities.",
            icon: "https://img.icons8.com/ios-filled/100/delivery.png",
          },
          {
            title: "🔁 Easy Returns",
            desc: "We offer 7-day return policy, no extra questions.",
            icon: "https://img.icons8.com/ios-filled/100/return.png",
          },
          {
            title: "🔐 Secure Payments",
            desc: "Protected transactions with 128-bit SSL encryption.",
            icon: "https://img.icons8.com/ios-filled/100/lock.png",
          },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            className="bg-white shadow-xl p-10 rounded-3xl text-center border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.2 }}
          >
            <img src={item.icon} className="mx-auto mb-6 h-16" />
            <h3 className="text-2xl font-bold mb-2 text-cyan-700">
              {item.title}
            </h3>
            <p className="text-gray-600 text-md">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Newsletter */}
      <section className="bg-cyan-700 text-white py-20 px-6 text-center rounded-t-3xl">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
          🎁 Subscribe to Our Newsletter
        </h2>
        <p className="mb-8 max-w-2xl mx-auto text-lg">
          Stay updated with the latest offers and product launches.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto"
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="px-6 py-3 text-gray-900 rounded-full w-full focus:outline-none"
          />
          <button
            type="submit"
            className="bg-white text-cyan-700 font-bold px-6 py-3 rounded-full hover:bg-cyan-100 transition"
          >
            Subscribe
          </button>
        </form>
      </section>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </main>
  );
}
