import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();  // ✅ use useCart() hook here
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [error, setError] = useState("");

  const validEmailDomains = ["@gmail.com", "@icloud.com", "@hotmail.com", "@outlook.com", "@live.com"];
  const isValidEmail = (email) => validEmailDomains.some(domain => email.endsWith(domain));
  const isValidWhatsApp = (number) => /^\+966-5\d{7}$/.test(number);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!email.trim() && !whatsapp.trim()) {
      setError("Please provide either a valid email or WhatsApp number.");
      return;
    }

    if (email && !isValidEmail(email)) {
      setError("Email must end with @gmail.com, @icloud.com, @hotmail.com, @outlook.com, or @live.com.");
      return;
    }

    if (whatsapp && !isValidWhatsApp(whatsapp)) {
      setError("WhatsApp number must be in format +966-5XXXXXXX");
      return;
    }

    setError("");
    clearCart();
    navigate("/success");
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Form */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow">
          {error && <p className="text-red-600 font-semibold">{error}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email (optional)</label>
            <input
              type="email"
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">WhatsApp Number (optional)</label>
            <input
              type="text"
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+966-05XXXXXXX"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
          >
            Place Order
          </button>
        </form>

        {/* Right: Order Summary */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {cart.length === 0 ? (
            <p>No items in cart.</p>
          ) : (
            <ul className="space-y-4">
              {cart.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-800">SAR {item.price * item.quantity}</p>
                </li>
              ))}
              <hr className="my-4" />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>SAR {total}</span>
              </div>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
