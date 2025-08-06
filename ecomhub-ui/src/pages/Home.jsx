const Home = () => {
  return (
    <section className="min-h-[80vh] flex items-center justify-center px-6 sm:px-12">
      <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-10">
        
        {/* Text content */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 leading-tight">
            Discover Digital Delights at <span className="text-indigo-600">Ecomhub</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Your one-stop shop for PDFs, Audio Files, Coupons, and more — delivered instantly.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a
              href="/products"
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition duration-200"
            >
              Shop Now
            </a>
            <a
              href="/contact"
              className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 transition duration-200"
            >
              Contact Us
            </a>
          </div>
        </div>

        {/* Optional image */}
        <div className="flex-1">
          <img
            src="/4605877.jpg"
            alt="Shopping Illustration"
            className="w-full max-w-md mx-auto"
          />
        </div>

      </div>
    </section>
  );
};

export default Home;
