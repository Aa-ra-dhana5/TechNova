import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const modalRef = useRef(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/signUp", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok && data.success) {
        setMessage("Please verify your email. Check your inbox.");
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      setError("Something went wrong, please try again!");
      setLoading(false);
    }
  };

  // Handle clicking outside the modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setMessage("");
        setName("");
        setEmail("");
        setPassword("");
      }
    };
    if (message) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [message]);

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-300 via-indigo-200 to-cyan-200 px-6 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/90 backdrop-blur-lg max-w-md w-full p-8 rounded-3xl shadow-2xl z-10"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 text-indigo-900">
          Sign Up
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

        <form onSubmit={handleSignup} className="space-y-5">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            required
            autoComplete="name"
          />
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
            autoComplete="new-password"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold shadow-lg text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-700 via-pink-600 to-cyan-500"
            }`}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </motion.button>
        </form>

        <p className="text-center mt-6 text-indigo-900">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-indigo-700 font-semibold hover:underline"
          >
            Login
          </a>
        </p>
      </motion.div>

      {/* Modal overlay */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-20"
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white p-6 rounded-xl shadow-xl text-center max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-indigo-800 mb-4">
                Email Sent!
              </h3>
              <p className="text-gray-700">{message}</p>
              <button
                onClick={() => {
                  setMessage("");
                  setName("");
                  setEmail("");
                  setPassword("");
                }}
                className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default SignUp;
