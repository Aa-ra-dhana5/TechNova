import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CartProvider } from "./componants/CartContext";
import { AuthProvider } from "./componants/AuthContext";

import * as Sentry from "@sentry/react";
import { browserTracingIntegration } from "@sentry/react";


// 🛠️ Initialize Sentry
Sentry.init({
  dsn: "https://<your-dsn>@sentry.io/<your-project-id>", // 🔁 Replace this with your actual DSN
  integrations: [new browserTracingIntegration()],
  tracesSampleRate: 1.0, 
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
