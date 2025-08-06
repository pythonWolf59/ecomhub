import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-100 to-gray-50 py-6 mt-10 shadow-inner">
      <div className="container mx-auto px-4 flex justify-center space-x-10">
        <Link
          to="/terms"
          className="text-sm text-gray-600 hover:text-pink-500 transition-colors"
        >
          Terms & Conditions
        </Link>
        <Link
          to="/privacy"
          className="text-sm text-gray-600 hover:text-pink-500 transition-colors"
        >
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}
