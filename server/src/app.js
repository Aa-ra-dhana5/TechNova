import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoute from "./route/authRouter.js";
import productRoutes from "./route/products.js";
import { getUsername } from "./controller/authController.js";

import * as Sentry from "@sentry/node";
import { Integrations } from "@sentry/tracing";

connectDB();

const app = express();

// 🛠️ Sentry Initialization
Sentry.init({
  dsn: "https://<your-dsn>@sentry.io/<your-project-id>", // Replace this with your actual DSN
  integrations: [
    new Integrations.Http({ tracing: true }),
    new Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
});

// 📌 Sentry request + tracing middleware (must go first)
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/products", productRoutes);
app.use("/product-images", express.static("public/product-images"));
app.use("/mobile", express.static("public/mobile"));
app.use("/smartwatch", express.static("public/smartwatch"));
app.use("/water", express.static("public/water"));

app.get("/", (req, res) => {
  res.send("You get the route now!!");
});

app.get("/api/users/:id", getUsername);

// 📌 Sentry error handler (must come after all routes)
app.use(Sentry.Handlers.errorHandler());

// Optional: Custom fallback error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong!" });
});

export default app;

