import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getUserCart, updateUserCart } from "../services/authServices";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [cart, setCart] = useState([]);

  // ⬇️ Load token and cart on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const guestCart = JSON.parse(localStorage.getItem("cartItems")) || [];

    if (storedToken && storedToken.split(".").length === 3) {
      try {
        const decoded = jwtDecode(storedToken);
        const id = decoded.userId;
        setToken(storedToken);
        setUserId(id);
        setIsLoggedIn(true);

        getUserCart(id, storedToken).then((userCart) => {
          const mergedCart = mergeCarts(userCart || [], guestCart);
          setCart(mergedCart);
          updateUserCart(id, mergedCart, storedToken);
          localStorage.removeItem("cartItems");
        });
      } catch (error) {
        console.error("Token decode error:", error);
        logout();
      }
    } else {
      setCart(guestCart);
    }
  }, []);

  // ⬇️ LOGIN
  const login = async (token) => {
    if (!token || token.split(".").length !== 3) {
      console.error("Invalid token");
      return;
    }

    localStorage.setItem("token", token);
    setToken(token);
    setIsLoggedIn(true);

    try {
      const decoded = jwtDecode(token);
      const id = decoded.userId;
      setUserId(id);

      const guestCart = JSON.parse(localStorage.getItem("cartItems")) || [];
      const userCart = await getUserCart(id, token);
      const mergedCart = mergeCarts(userCart || [], guestCart);

      setCart(mergedCart);
      await updateUserCart(id, mergedCart, token);
      localStorage.removeItem("cartItems");
    } catch (error) {
      console.error("Login error:", error);
      logout();
    }
  };

  // ⬇️ LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserId(null);
    setToken(null);
    setCart([]);
  };

  // ✅ ⬇️ SYNC CART TO SERVER WITH DEBOUNCE
  useEffect(() => {
    if (isLoggedIn && userId && token) {
      const timeout = setTimeout(() => {
        console.log("⬆️ Debounced cart sync:", cart);
        updateUserCart(userId, cart, token).catch((err) =>
          console.error("Error syncing cart:", err)
        );
      }, 500); // debounce delay (adjust if needed)

      return () => clearTimeout(timeout);
    } else {
      // Save guest cart to localStorage
      localStorage.setItem("cartItems", JSON.stringify(cart));
    }
  }, [cart, isLoggedIn, userId, token]);

  // ⬇️ MERGE CARTS
  const mergeCarts = (userCart, guestCart) => {
    const merged = [...userCart];
    guestCart.forEach((guestItem) => {
      const index = merged.findIndex((item) => item._id === guestItem._id);
      if (index !== -1) {
        merged[index].quantity += guestItem.quantity;
      } else {
        merged.push(guestItem);
      }
    });
    return merged;
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        cart,
        setCart,
        token,
        userId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
