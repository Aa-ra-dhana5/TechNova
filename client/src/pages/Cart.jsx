import React, { useState, useEffect } from "react";
import { useCart } from "../componants/CartContext";
import { Minus, Plus, Trash2, X, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CheckoutForm from "../componants/CheckoutForm";

export default function Cart() {
  const { cartItems, dispatch } = useCart();

  const [coupon, setCoupon] = useState("");
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const platformFee = 20;

  const handleAdd = (product) => {
    const cleanProduct = {
      productId: product.productId?._id || product._id || product.id,
      quantity: 1,
    };
    dispatch({ type: "ADD_ITEM", payload: cleanProduct });
  };

  const handleRemove = (productId) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId._id || productId });
  };

  const handleDecrease = (product) => {
    const cleanId = product.productId?._id || product._id || product.id;
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { productId: cleanId, quantity: product.quantity - 1 },
    });
  };

  const applyCoupon = (code) => {
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.offer_price * item.quantity,
      0
    );

    let disc = 0;
    if (code === "SAVE100") disc = 100;
    else if (code === "HDFCCARD" && subtotal >= 1500) disc = subtotal * 0.1;
    else if (code === "AXISBANK" && subtotal >= 999) disc = 75;

    if (disc > 0) {
      setCoupon(code);
      setDiscount(disc);
      setCouponApplied(true);
      setShowCouponModal(false);
    } else {
      alert("Invalid or inapplicable coupon");
    }
  };

  const removeCoupon = () => {
    setCoupon("");
    setDiscount(0);
    setCouponApplied(false);
  };

  useEffect(() => {
    if (paymentSuccess) {
      const timer = setTimeout(() => setPaymentSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [paymentSuccess]);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.productId?.offer_price || 0) * item.quantity,
    0
  );

  const totalGst = subtotal * 0.18;

  const grandTotal = subtotal + totalGst + platformFee - discount;

  if (cartItems.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <Link
          to="/"
          className="text-indigo-600 hover:underline font-medium text-lg"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      {/* Cart Items */}
      {cartItems.map((item) => (
        <div
          key={item.productId?._id || item._id || item.id}
          className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-b"
        >
          <img
            src={
              item.productId?.image_url?.startsWith("http")
                ? item.productId.image_url
                : `${import.meta.env.VITE_API_URL}/${item.productId?.image_url}`
            }
            alt={item.productId?.name}
            className="w-24 h-24 object-contain"
          />

          <div className="flex-1">
            <h3 className="text-lg font-semibold">{item.productId?.name}</h3>
            <p className="text-green-600 font-medium">
              {item.productId?.offer_price} x {item.quantity}
            </p>
            <p className="text-sm text-gray-500 line-through">
              {item.productId?.original_price}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDecrease(item)}
              className="w-9 h-9 bg-gray-200 hover:bg-gray-300 rounded"
            >
              <Minus size={16} className="mx-auto" />
            </button>
            <span className="px-3">{item.quantity}</span>
            <button
              onClick={() => handleAdd(item)}
              className="w-9 h-9 bg-gray-200 hover:bg-gray-300 rounded"
            >
              <Plus size={16} className="mx-auto" />
            </button>
            <button
              onClick={() => handleRemove(item.productId)}
              className="w-9 h-9 bg-red-100 hover:bg-red-200 rounded"
            >
              <Trash2 size={16} className="mx-auto text-red-600" />
            </button>
          </div>
        </div>
      ))}

      {/* Order Summary */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>GST (18%)</span>
            <span>₹{totalGst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Platform Fee</span>
            <span>₹{platformFee}</span>
          </div>
          {couponApplied && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({coupon})</span>
              <span>-₹{discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg mt-2 border-t pt-2">
            <span>Grand Total</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4 flex-wrap">
        {couponApplied ? (
          <button
            onClick={removeCoupon}
            className="bg-red-200 text-red-800 px-4 py-2 rounded hover:bg-red-300"
          >
            Remove Coupon
          </button>
        ) : (
          <button
            onClick={() => setShowCouponModal(true)}
            className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500"
          >
            Apply Coupon
          </button>
        )}
        <button
          onClick={() => setShowCheckout(true)}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          Proceed to Checkout
        </button>
      </div>

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            <button
              onClick={() => setShowCouponModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Apply a Coupon</h2>
            <div className="space-y-3 text-sm">
              {["SAVE100", "HDFCCARD", "AXISBANK"].map((code) => (
                <div
                  key={code}
                  className="bg-gray-100 p-3 rounded flex justify-between items-center"
                >
                  <span>{code}</span>
                  <button
                    onClick={() => applyCoupon(code)}
                    className="text-blue-600 hover:underline"
                  >
                    Apply
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Enter coupon manually"
                className="border px-4 py-2 rounded w-full"
              />
              <button
                onClick={() => applyCoupon(coupon)}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div
          onClick={() => setShowCheckout(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-xl p-6 rounded-lg shadow-lg relative"
          >
            <button
              onClick={() => setShowCheckout(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <X size={20} />
            </button>

            {isProcessingPayment && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <h2 className="text-lg font-semibold">
                    Processing Payment...
                  </h2>
                  <p className="text-sm text-gray-600">Please wait…</p>
                </div>
              </div>
            )}

            <CheckoutForm
              cartItems={cartItems}
              setCart={() => dispatch({ type: "CLEAR_CART" })}
              platformFee={platformFee}
              discount={discount}
              setShowCheckout={setShowCheckout}
              setPaymentSuccess={setPaymentSuccess}
              setIsProcessingPayment={setIsProcessingPayment}
            />
          </div>
        </div>
      )}

      {/* Payment Success Popup */}
      {paymentSuccess && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white p-8 rounded-xl shadow-2xl text-center w-80 relative"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
              className="bg-green-100 p-4 rounded-full mb-4"
            >
              <CheckCircle className="text-green-600 w-10 h-10" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-bold text-green-700 mb-2"
            >
              Payment Successful!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 text-sm"
            >
              Thank you for your purchase 🎉
            </motion.p>
            <motion.button
              onClick={() => setPaymentSuccess(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-5 text-sm text-indigo-600 hover:underline"
            >
              Close
            </motion.button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
