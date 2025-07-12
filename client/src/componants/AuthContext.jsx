import React, { createContext, useContext, useEffect, useState } from "react";
import { getUserCart, updateUserCart } from "../services/authServices";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🔧 Normalize productId to string always
  const normalizeId = (productId) => {
    if (typeof productId === "string") return productId;
    if (typeof productId === "object" && productId?._id) return productId._id;
    return String(productId);
  };

  const formatCart = (cartArray) =>
  cartArray.map((item) => ({
    productId: item.productId?._id ? item.productId : { _id: item.productId }, // 📌 if populated, keep full object
    quantity: item.quantity || 1,
  }));


  // ✅ On App Load → Sync cart from server if logged in
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const cartFromServer = await getUserCart(); // uses cookie
        const formatted = formatCart(cartFromServer || []);
        setCart(formatted);
        setIsLoggedIn(true);
        console.log("✅ Logged in with cart:", formatted);
      } catch (err) {
        console.log("❌ Not logged in or session expired");
        setIsLoggedIn(false);
        const guestCart = JSON.parse(localStorage.getItem("cartItems")) || [];
        setCart(guestCart);
      } finally {
        setIsLoading(false);
      }
    };

    checkLogin();
  }, []);

  // ✅ Called after successful login API
  const handleLogin = async () => {
    try {
      const guestCart = JSON.parse(localStorage.getItem("cartItems")) || [];
      const serverCart = await getUserCart();

      const merged = mergeCarts(serverCart || [], guestCart);
      const formatted = formatCart(merged);

      setCart(formatted);
      await updateUserCart(formatted); // sync to server
      localStorage.removeItem("cartItems");
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login sync error:", error);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCart([]);
  };

  // ✅ Debounced Cart Sync
  useEffect(() => {
    if (isLoading) return; // don't sync while loading

    const delay = setTimeout(() => {
      if (isLoggedIn) {
        updateUserCart(cart).catch((err) =>
          console.error("Cart sync failed:", err)
        );
      } else {
        localStorage.setItem("cartItems", JSON.stringify(cart));
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [cart, isLoggedIn, isLoading]);

  // ✅ Merge Cart with normalized IDs
  const mergeCarts = (userCart, guestCart) => {
    const merged = [...userCart];

    guestCart.forEach((guestItem) => {
      const guestId = normalizeId(guestItem.productId);

      const index = merged.findIndex(
        (item) => normalizeId(item.productId) === guestId
      );

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
        isLoading,
        handleLogin,
        logout,
        cart,
        setCart,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
