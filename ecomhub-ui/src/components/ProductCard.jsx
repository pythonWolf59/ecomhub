import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom"; // ✅ for navigation

const ProductCard = ({ product }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate(); // ✅

  const handleAdd = () => {
    addToCart({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image, // ✅ Include image
    quantity,
    total: quantity * product.price,
    });

    setIsOpen(false);
    setQuantity(1);
    navigate("/cart"); // ✅ Redirect to Cart page
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center justify-between">
        <img
          src={`/products/${product.image}`}
          alt={product.name}
          className="w-32 h-32 object-contain mb-2"
        />
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-blue-600 font-bold mb-2">SAR {product.price}</p>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Buy Now
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              &times;
            </button>
            <img
              src={`/products/${product.image}`}
              alt={product.name}
              className="w-40 h-40 object-contain mx-auto mb-4"
            />
            <h2 className="text-xl font-semibold text-center">{product.name}</h2>
            <p className="text-center text-gray-600">
              Unit Price: SAR {product.price}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center justify-center mt-4 space-x-4">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                -
              </button>
              <span className="text-lg font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(100, q + 1))}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>

            {/* Total Price */}
            <p className="text-center mt-4 text-blue-600 font-bold">
              Total: SAR {product.price * quantity}
            </p>

            {/* Buy Now */}
            <button
              onClick={handleAdd}
              className="mt-6 bg-green-600 text-white px-6 py-2 rounded w-full hover:bg-green-700 transition"
            >
              Buy Now
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
