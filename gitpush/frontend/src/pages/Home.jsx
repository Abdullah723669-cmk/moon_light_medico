import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Pill } from 'lucide-react';

export default function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary/5 border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col items-center text-center">
          <div className="bg-primary/10 p-4 rounded-full mb-6">
            <Pill className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Your Trusted <span className="text-primary">E-Pharmacy</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
            Search for medicines by brand name, generic name, or category. Order OTC or upload prescriptions.
          </p>

          <form onSubmit={handleSearch} className="w-full max-w-3xl relative">
            <input
              type="text"
              placeholder="Search e.g. Amlodipine, Cardipine, Antihypertensive..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full py-5 pl-7 pr-32 text-lg rounded-full border-2 border-primary/20 shadow-lg focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition bg-white text-gray-800 placeholder-gray-400"
            />
            <button 
              type="submit" 
              className="absolute right-3 top-3 bottom-3 bg-primary hover:bg-sky-600 text-white px-8 rounded-full font-bold text-lg transition flex items-center gap-2 shadow-md"
            >
              <Search className="w-5 h-5"/>
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Highlights Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition duration-300">
          <div className="w-16 h-16 bg-blue-100 text-primary flex items-center justify-center rounded-2xl mb-6 text-2xl font-bold">1</div>
          <h3 className="text-xl font-bold mb-3">Search Medicine</h3>
          <p className="text-gray-500">Find exactly what you need by generic, brand, or disease category easily.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition duration-300">
          <div className="w-16 h-16 bg-blue-100 text-primary flex items-center justify-center rounded-2xl mb-6 text-2xl font-bold">2</div>
          <h3 className="text-xl font-bold mb-3">Upload Rx</h3>
          <p className="text-gray-500">For prescription-only medicines, quickly upload your valid prescription.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition duration-300">
          <div className="w-16 h-16 bg-blue-100 text-primary flex items-center justify-center rounded-2xl mb-6 text-2xl font-bold">3</div>
          <h3 className="text-xl font-bold mb-3">Fast Delivery</h3>
          <p className="text-gray-500">Get your medicines delivered right to your doorstep safely and securely.</p>
        </div>
      </div>
    </div>
  );
}
