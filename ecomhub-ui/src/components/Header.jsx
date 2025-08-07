import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingCart } from "lucide-react";

export default function Header() {
  const { cart } = useCart();
  const cartCount = cart.length;

  return (
    <header className="bg-gradient-to-br from-blue-100 to-blue-50 shadow-md py-3 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/Ecomhub Logo.png"
            alt="Ecomhub Logo"
            className="h-10 w-auto"
          />
          <span className="text-xl font-bold text-gray-800 hidden sm:block">DK Digital Hub</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-gray-800 font-medium hover:text-pink-600">
            Home
          </Link>
          <Link to="/products" className="text-gray-800 font-medium hover:text-pink-600">
            Products
          </Link>
          <Link to="/contact" className="text-gray-800 font-medium hover:text-pink-600">
            Contact Us
          </Link>
          <Link to="/order-tracking" className="text-gray-800 font-medium hover:text-pink-600">
            Order Tracking
          </Link>

          {/* Cart Icon */}
          <Link to="/cart" className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-800 hover:text-pink-600" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
