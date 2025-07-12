import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../componants/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { handleLogin } = useAuth(); // ✅ use handleLogin instead of login

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_AUTH_API_URL}/auth/login`,
        {
          method: "POST",
          credentials: "include", // ✅ allow cookies
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        await handleLogin(); // ✅ update isLoggedIn and cart context
        navigate("/home");
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong, please try again!");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-300 via-indigo-200 to-cyan-200 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/90 backdrop-blur-lg max-w-md w-full p-8 rounded-3xl shadow-2xl"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 text-indigo-900">
          Login
        </h2>

        <AnimatePresence>
          {error && (
            <motion.p
              key="error-msg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center shadow-sm"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            required
            autoComplete="current-password"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-700 via-pink-600 to-cyan-500 text-white font-semibold shadow-lg"
          >
            Login
          </motion.button>
        </form>

        <p className="text-center mt-6 text-indigo-900">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-indigo-700 font-semibold hover:underline"
          >
            Sign up
          </a>
        </p>
      </motion.div>
    </section>
  );
};

export default Login;
