import React from "react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 md:p-12 space-y-6 border border-gray-200">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 text-center">Privacy Policy</h1>
        <p className="text-sm text-gray-500 text-center italic">Effective Date: August 6, 2025</p>

        <section className="space-y-6 text-gray-700 leading-relaxed text-base">
          <p>
            This Privacy Policy outlines how we collect, use, and protect your information when you use our website to purchase digital products such as gift cards.
          </p>

          <h2 className="text-lg font-semibold text-indigo-600">1. Data Collection</h2>
          <p>
            We collect personal information such as your name, email address, WhatsApp number, and transaction details strictly for the purpose of order processing and customer support.
          </p>

          <h2 className="text-lg font-semibold text-indigo-600">2. How We Use Your Data</h2>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>To deliver purchased digital goods</li>
            <li>To contact you in case of order issues</li>
            <li>To resolve complaints or disputes</li>
          </ul>

          <h2 className="text-lg font-semibold text-indigo-600">3. Data Sharing</h2>
          <p>
            We do not sell or share your personal information with third parties except when legally required or necessary for fraud prevention and compliance.
          </p>

          <h2 className="text-lg font-semibold text-indigo-600">5. Data Retention</h2>
          <p>
            We retain customer records and transaction history for up to 1 year for legal and support purposes.
          </p>

          <h2 className="text-lg font-semibold text-indigo-600">6. Consent</h2>
          <p>
            By using this website and placing an order, you consent to this Privacy Policy and agree to our Terms & Conditions.
          </p>
        </section>
      </div>
    </div>
  );
}
