import React, { useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { Plus, Info, Upload } from 'lucide-react';

export default function MedicineCard({ medicine }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [showRxModal, setShowRxModal] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleAdd = () => {
    if (medicine.is_rx) {
      setShowRxModal(true);
    } else {
      addToCart(medicine, quantity);
      alert("Added to cart!");
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file.");
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("/api/prescriptions/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      addToCart(medicine, quantity);
      alert("Prescription uploaded and medicine added to cart!");
      setShowRxModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to upload prescription.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 leading-tight">{medicine.brand_name}</h3>
          {medicine.is_rx ? (
            <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded ml-2">Rx</span>
          ) : (
            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded ml-2">OTC</span>
          )}
        </div>
        <p className="text-sm text-gray-500 mb-1">{medicine.generic_name}</p>
        <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide">{medicine.category}</p>
        <div className="flex items-center space-x-2 bg-blue-50/50 p-2 rounded-lg my-3 border border-blue-100/50">
          <Info className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-gray-600">Strength: {medicine.strength}</span>
        </div>
      </div>
      <div className="mt-4 border-t pt-4">
        <p className="text-2xl font-bold text-primary mb-4">${medicine.price.toFixed(2)}</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-16 border border-gray-300 rounded-lg bg-gray-50 px-2 py-2.5 text-center focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            onClick={handleAdd}
            className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-sky-600 text-white py-2.5 rounded-lg font-bold transition shadow-sm"
          >
            <Plus className="w-5 h-5"/> Add
          </button>
        </div>
      </div>

      {showRxModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 md:p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
            <h3 className="text-2xl font-bold mb-2 text-gray-900">Upload Prescription</h3>
            <p className="text-gray-500 mb-6 leading-relaxed">
              {medicine.brand_name} requires a prescription. Please upload a clear image of your Rx to continue.
            </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary transition cursor-pointer mb-6">
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <input 
                type="file" 
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
              />
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowRxModal(false)} 
                className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpload} 
                disabled={uploading}
                className="px-5 py-2.5 bg-primary hover:bg-sky-600 text-white font-bold rounded-lg transition disabled:opacity-50 flex items-center gap-2"
              >
                {uploading ? "Uploading..." : "Upload & Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
