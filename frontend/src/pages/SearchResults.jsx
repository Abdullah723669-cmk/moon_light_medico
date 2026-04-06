import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MedicineCard from '../components/MedicineCard';
import { Search } from 'lucide-react';

export default function SearchResults() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const q = searchParams.get('q') || "";

  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(q);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(searchInput)}`);
    } else {
      navigate('/search');
    }
  };

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/medicines/search?q=${encodeURIComponent(q)}`);
        setMedicines(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [q]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <Search className="w-8 h-8 text-primary"/>
            {q ? `Search Results for "${q}"` : "All Medicines"}
          </h2>
          <p className="text-gray-500 mt-2 font-medium">Found {medicines.length} items</p>
        </div>
        
        <form onSubmit={handleSearch} className="w-full md:w-96 relative">
          <input
            type="text"
            placeholder="Search medicines..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full py-3 pl-5 pr-12 text-md rounded-full border-2 border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition bg-gray-50"
          />
          <button 
            type="submit" 
            className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-sky-600 text-white p-2 rounded-full transition flex items-center justify-center"
          >
            <Search className="w-5 h-5"/>
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-500 font-medium animate-pulse">Loading medicines...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {medicines.map(med => (
            <MedicineCard key={med.id} medicine={med} />
          ))}
        </div>
      )}
      {!loading && medicines.length === 0 && (
        <div className="text-center py-32 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
          <p className="text-2xl font-bold text-gray-400 mb-2">No results found</p>
          <p className="text-gray-500">Try adjusting your search or checking for typos.</p>
        </div>
      )}
    </div>
  );
}
