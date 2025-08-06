import React, { useState } from "react";

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    query: "",
    category: "General Enquiry",
    file: null,
  });

  const [caseId, setCaseId] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulated Case ID generation
    const randomCaseId = Math.floor(100000000 + Math.random() * 900000000);
    setCaseId(randomCaseId);
    setSubmitted(true);

    // Later: POST formData to API with FormData()
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          Contact Us
        </h2>

        {submitted ? (
          <div className="text-center space-y-4">
            <div className="inline-block p-4 bg-green-100 text-green-700 rounded-full">
              ✅
            </div>
            <h3 className="text-2xl font-semibold text-green-700">
              Ticket Submitted Successfully!
            </h3>
            <p className="text-gray-700">
              Your Case ID is:
              <span className="ml-2 font-mono text-lg text-black bg-gray-100 px-2 py-1 rounded">
                #{caseId}
              </span>
            </p>
            <p className="text-sm text-gray-500">Our team will contact you shortly.</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-6"
            encType="multipart/form-data"
          >
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email (Optional)
              </label>
              <input
                type="email"
                name="email"
                pattern="^[^\s@]+@(gmail\.com|icloud\.com|hotmail\.com|outlook\.com|live\.com)$"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3"
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                WhatsApp (+966-5XXXXXXX)
              </label>
              <input
                type="tel"
                name="whatsapp"
                pattern="^\+966-5\d{7}$"
                placeholder="+966-5XXXXXXX"
                value={formData.whatsapp}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-3"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3 bg-white"
              >
                <option value="General Enquiry">General Enquiry</option>
                <option value="Complaints/Order Issues">Complaints / Order Issues</option>
              </select>
            </div>

            {/* Query */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Your Message
              </label>
              <textarea
                name="query"
                rows="4"
                value={formData.query}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3"
              ></textarea>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Attach File (.pdf, .png, .jpg)
              </label>
              <input
                type="file"
                name="file"
                accept=".pdf,.png,.jpg"
                onChange={handleChange}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-white file:bg-indigo-600 hover:file:bg-indigo-700"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition shadow-lg"
              >
                Submit Ticket
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactUsPage;
