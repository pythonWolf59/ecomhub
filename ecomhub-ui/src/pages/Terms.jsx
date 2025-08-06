import React from "react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12 space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 text-center">Terms & Conditions</h1>

        <p className="text-gray-700 text-sm text-center italic">
          Last updated: August 6, 2025
        </p>

        <section className="space-y-4">
          <div>
            <h2 className="inline-block bg-indigo-100 text-indigo-700 font-semibold px-3 py-1 rounded-full text-sm uppercase">
              1. Digital Product Delivery
            </h2>
            <p className="mt-2 text-gray-700 leading-relaxed">
              All gift card purchases are processed and delivered digitally. Once an order is confirmed, we will securely send the gift card code to the Email or WhatsApp number provided by the customer during checkout. Please ensure that the contact details you provide are accurate and accessible.
            </p>
          </div>

          <div>
            <h2 className="inline-block bg-indigo-100 text-indigo-700 font-semibold px-3 py-1 rounded-full text-sm uppercase">
              2. Responsibility for Incorrect Information
            </h2>
            <p className="mt-2 text-gray-700 leading-relaxed">
              We are not responsible for any failed or misdirected delivery due to incorrect Email or WhatsApp information provided by the customer. It is the customer’s sole responsibility to ensure that their contact information is accurate at the time of order placement.
            </p>
          </div>

          <div>
            <h2 className="inline-block bg-indigo-100 text-indigo-700 font-semibold px-3 py-1 rounded-full text-sm uppercase">
              3. Refunds and Returns
            </h2>
            <p className="mt-2 text-gray-700 leading-relaxed">
              All gift card sales are final. Once the gift card code has been sent, we do not offer refunds or accept returns under any circumstances. Gift card codes are one-time use only and cannot be revoked or reissued once delivered.
            </p>
          </div>

          <div>
            <h2 className="inline-block bg-indigo-100 text-indigo-700 font-semibold px-3 py-1 rounded-full text-sm uppercase">
              4. Issues with Gift Card Codes
            </h2>
            <p className="mt-2 text-gray-700 leading-relaxed">
              In the rare event that a customer receives a code that does not work, the customer must submit a formal complaint via the Contact Us form on our website. The following information must be provided:
            </p>
            <ul className="list-disc list-inside text-gray-700 ml-4 mt-2 space-y-1">
              <li>Order ID</li>
              <li>Date and time of purchase</li>
              <li>Delivery mode (Email or WhatsApp)</li>
              <li>A clear video recording showing that the code is not functional</li>
            </ul>
            <p className="mt-2 text-gray-700 leading-relaxed">
              Upon receiving a valid claim, we will conduct a thorough investigation. Please allow up to 21 business days for us to complete our review. We reserve the right to approve or disapprove any request at our sole discretion based on the evidence provided.
            </p>
          </div>

          <div>
            <h2 className="inline-block bg-indigo-100 text-indigo-700 font-semibold px-3 py-1 rounded-full text-sm uppercase">
              5. Acceptance of Terms
            </h2>
            <p className="mt-2 text-gray-700 leading-relaxed">
              By placing an order on our website, you acknowledge that you have read, understood, and agreed to all the above terms and conditions. It is your responsibility to review these terms prior to making a purchase.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
