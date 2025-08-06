import React, { useState } from "react";

export default function OrderTracking() {
  const [orderNumber, setOrderNumber] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const handleTrackOrder = () => {
    // Placeholder: simulate API response
    const response = {
      orderCreated: "08/05/2025 15:34:12",
      deliveryMode: "WhatsApp",
      status: "Delivered",
      deliveryInfo: "Delivered at 08/05/2025 16:05:22 to WhatsApp: +966-05XXXXXX",
    };
    setOrderDetails(response);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-10 space-y-6 border border-gray-200">
        <h1 className="text-3xl font-bold text-indigo-700 text-center">Track Your Order</h1>
        <div>
          <label htmlFor="orderNumber" className="block text-sm font-semibold text-gray-700 mb-2">
            Enter Order #
          </label>
          <input
            id="orderNumber"
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. 123456789"
          />
        </div>
        <button
          onClick={handleTrackOrder}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition duration-200"
        >
          Check Order Status
        </button>
      </div>

      {/* Modal */}
      {showModal && orderDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white max-w-lg w-full rounded-xl p-6 shadow-2xl relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">Order Summary</h2>

            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-600 font-semibold">Order Created:</p>
                <p className="italic text-gray-800">{orderDetails.orderCreated}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-600 font-semibold">Delivery Mode:</p>
                <span className="inline-block mt-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                  {orderDetails.deliveryMode}
                </span>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-600 font-semibold">Status:</p>
                <p className="text-green-600 font-semibold">{orderDetails.status}</p>
                <p className="text-sm italic text-gray-700 mt-1">{orderDetails.deliveryInfo}</p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
