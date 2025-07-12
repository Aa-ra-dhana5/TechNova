import React, { useState } from "react";
import { useCart } from "./CartContext";

export default function CheckoutForm({
  platformFee = 0,
  discount = 0,
  setShowCheckout,
  setPaymentSuccess,
  setIsProcessingPayment,
}) {
  const { cartItems, dispatch } = useCart();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    paymentMethod: "card",
  });

  const [errors, setErrors] = useState({});

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    return newErrors;
  };

  const getTotalAmount = () => {
    const subtotal = cartItems.reduce((acc, item) => {
      const price = parseFloat(item.offer_price || 0);
      const quantity = parseInt(item.quantity || 0);
      if (isNaN(price) || isNaN(quantity)) return acc;
      return acc + price * quantity;
    }, 0);
    const gst = subtotal * 0.18;
    return subtotal + gst + platformFee - discount;
  };

  const handleNext = () => {
    const validationErrors = validateStep1();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      setStep(2);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true); // ✅ show success

      // 🔁 delay modal close so animation renders
      setTimeout(() => {
        setShowCheckout(false);
        dispatch({ type: "CLEAR_CART" });
      }, 3000); // 300ms delay is enough
    }, 2000);
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">
        {step === 1 ? "Shipping Details" : "Payment Summary"}
      </h2>

      {step === 1 && (
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="bg-blue-600 text-white rounded px-6 py-2 hover:bg-blue-700"
          >
            Continue to Payment
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
            >
              <option value="card">Credit/Debit Card</option>
              <option value="upi">UPI</option>
              <option value="cod">Cash on Delivery</option>
            </select>
          </div>

          {/* <div className="border-t pt-4 text-sm text-gray-700">
            <p>Platform Fee: ₹{platformFee}</p>
            <p>Discount: -₹{discount}</p>
            <p className="font-bold text-lg">
              Total: ₹{getTotalAmount().toLocaleString("en-IN")}
            </p>
          </div> */}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="bg-gray-300 text-gray-800 rounded px-6 py-2 hover:bg-gray-400"
            >
              Back
            </button>

            <button
              type="submit"
              className="bg-green-600 text-white rounded px-6 py-2 hover:bg-green-700"
            >
              {formData.paymentMethod === "cod" ? "Place Order" : "Pay Now"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
