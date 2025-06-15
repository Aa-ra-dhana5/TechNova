import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, LogIn, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../componants/AuthContext";
import { useCart } from "../componants/CartContext"; // ✅ Use CartContext

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { isLoggedIn, logout } = useAuth();
  const { cartItems } = useCart();

  const navigate = useNavigate();
  const location = useLocation();

  const categories = [
    { name: "Smartwatch", slug: "smartwatch" },
    { name: "Water Purifier", slug: "water" },
    { name: "AC", slug: "ac" },
    { name: "Mobiles", slug: "mobile" },
  ];

  // ✅ Calculate total items directly (no useState)
  const totalItems = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  // Close dropdowns on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 bg-black/20 backdrop-blur-md text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          to="/home"
          className="text-2xl font-bold text-cyan-900 tracking-wide"
        >
          TechNova
        </Link>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Nav Links */}
        <nav
          className={`${
            mobileMenuOpen ? "flex" : "hidden"
          } absolute md:static top-full left-0 right-0 md:flex flex-col md:flex-row bg-black/90 md:bg-transparent md:items-center text-sm font-medium gap-4 md:gap-6 p-4 md:p-0 transition-all duration-300 z-40`}
        >
          <Link to="/home" className="hover:text-cyan-400 transition-all">
            Home
          </Link>

          {/* Dropdown */}
          <div className="relative">
            <button
              className="hover:text-cyan-400 transition-all flex items-center gap-1"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              Products
              <svg
                className="w-3 h-3 mt-1 ml-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute mt-2 left-0 bg-black/90 backdrop-blur-md rounded-md shadow-xl w-44 z-50 py-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/products/${cat.slug}`}
                    className="block px-4 py-2 hover:bg-cyan-600 transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative flex items-center gap-1 hover:text-cyan-400 transition-all"
          >
            <ShoppingCart size={18} />
            Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full animate-bounce shadow-md">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          {/* Auth Buttons */}
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 border border-cyan-500 text-cyan-400 rounded-full text-sm hover:bg-cyan-500 hover:text-white transition"
              >
                <LogIn size={16} className="inline-block mr-1" />
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full text-sm transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                logout();
                navigate("/home");
              }}
              className="px-4 py-2 border border-red-600 text-red-500 rounded-full text-sm hover:bg-red-600 hover:text-white transition"
            >
              <LogOut size={16} className="inline-block mr-1" />
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
