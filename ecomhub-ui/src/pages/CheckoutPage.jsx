import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [agree, setAgree] = useState(false);
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

    if (!agree) {
      setError("You must agree to the Terms & Privacy Policy.");
      return;
    }

    setError("");
    clearCart();
    navigate("/success");
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md space-y-6">
          {error && <p className="text-red-600 font-semibold">{error}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email (optional)</label>
            <input
              type="email"
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">WhatsApp Number (optional)</label>
            <input
              type="text"
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+966-05XXXXXXX"
            />
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="terms"
              className="mt-1"
              checked={agree}
              onChange={() => setAgree(!agree)}
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I agree to the{" "}
              <Link to="/terms" className="text-blue-600 hover:underline font-medium">
                Terms and Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={!agree}
            className={`w-full font-semibold py-2 rounded-lg transition ${
              agree
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Place Order
          </button>
        </form>

        {/* Order Summary */}
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h2>

          {cart.length === 0 ? (
            <p className="text-gray-500">No items in cart.</p>
          ) : (
            <ul className="space-y-4">
              {cart.map((item, idx) => (
                <li key={idx} className="flex justify-between border-b pb-2">
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">SAR {item.price * item.quantity}</p>
                </li>
              ))}
              <div className="flex justify-between mt-6 text-lg font-bold text-gray-800">
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
