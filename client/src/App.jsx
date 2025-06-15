import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import CategoryPage from "./componants/CategoryPage";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import ProductDetail from "./componants/ProductDetail ";
import Cart from "./pages/Cart";
import { PrivateRoute } from "./route/PrivateRoute";

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/home" element={<Home />} />

        {/* Category pages for each product type */}
        <Route path="/products/:category" element={<CategoryPage />} />
        <Route
          path="/products/:category/:productId"
          element={
            <PrivateRoute>
              <ProductDetail />
            </PrivateRoute>
          }
        />
        {/* <Route path="/cart" element={<CartPage />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />

        {/* Redirect default */}
        <Route path="*" element={<Navigate to="/home" replace />} />
        {/* <Route path="/search" element={<Search />} /> */}
      </Routes>
      <Footer />
    </Router>
  );
}
