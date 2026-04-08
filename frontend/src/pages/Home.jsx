import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Pill } from 'lucide-react';
import Chatbot from '../components/Chatbot';

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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-b border-gray-200 overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[60%] rounded-full bg-gradient-to-br from-cyan-300 to-blue-400 blur-3xl opacity-40 animate-pulse"></div>
          <div className="absolute top-[30%] -right-[10%] w-[40%] h-[50%] rounded-full bg-gradient-to-br from-purple-300 to-pink-400 blur-3xl opacity-40"></div>
          <div className="absolute -bottom-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-yellow-200 to-orange-300 blur-3xl opacity-40"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col items-center text-center relative z-10">
          <div className="bg-gradient-to-r from-primary to-blue-600 p-5 rounded-full mb-8 shadow-xl shadow-blue-200/50 transform hover:scale-110 transition-transform duration-300">
            <Pill className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-indigo-800 tracking-tight mb-6">
            Your Trusted <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">E-Pharmacy</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mb-12 leading-relaxed font-medium">
            Search for medicines by brand name, generic name, or category. Order OTC or upload prescriptions.
          </p>

          <form onSubmit={handleSearch} className="w-full max-w-4xl relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-400 to-secondary rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search e.g. Amlodipine, Cardipine, Antihypertensive..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full py-6 pl-8 pr-40 text-lg rounded-full border-none shadow-2xl focus:outline-none focus:ring-4 focus:ring-primary/30 transition bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-400"
              />
              <button 
                type="submit" 
                className="absolute right-3 top-3 bottom-3 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-indigo-600 text-white px-10 rounded-full font-bold text-lg transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-blue-500/50 hover:scale-105"
              >
                <Search className="w-6 h-6"/>
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Highlights Section */}
      <div className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-3 gap-10">
        <Link to="/search" className="bg-gradient-to-br from-white to-blue-50 p-10 rounded-3xl shadow-xl border border-blue-100/50 flex flex-col items-center text-center transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-cyan-400 text-white flex items-center justify-center rounded-3xl mb-8 text-3xl font-black shadow-lg group-hover:rotate-12 transition-transform duration-300">1</div>
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Search Medicine</h3>
          <p className="text-lg text-gray-600 leading-relaxed">Find exactly what you need by generic, brand, or disease category easily.</p>
        </Link>
        <Link to="/upload-rx" className="bg-gradient-to-br from-white to-purple-50 p-10 rounded-3xl shadow-xl border border-purple-100/50 flex flex-col items-center text-center transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group">
          <div className="w-20 h-20 bg-gradient-to-tr from-purple-500 to-pink-400 text-white flex items-center justify-center rounded-3xl mb-8 text-3xl font-black shadow-lg group-hover:rotate-12 transition-transform duration-300">2</div>
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Upload Rx</h3>
          <p className="text-lg text-gray-600 leading-relaxed">For prescription-only medicines, quickly upload your valid prescription.</p>
        </Link>
        <Link to="/delivery" className="bg-gradient-to-br from-white to-emerald-50 p-10 rounded-3xl shadow-xl border border-emerald-100/50 flex flex-col items-center text-center transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group">
          <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center rounded-3xl mb-8 text-3xl font-black shadow-lg group-hover:rotate-12 transition-transform duration-300">3</div>
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Fast Delivery</h3>
          <p className="text-lg text-gray-600 leading-relaxed">Get your medicines delivered right to your doorstep safely and securely.</p>
        </Link>
      </div>
      {/* Chatbot specific to home page per user instruction */}
      <Chatbot />
    </div>
  );
}
