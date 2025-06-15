import React from "react";
import ReactDom from "react-dom/client";
import App from "./App";
import { CartProvider } from "./componants/CartContext";
import { AuthProvider } from "./componants/AuthContext";

ReactDom.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
