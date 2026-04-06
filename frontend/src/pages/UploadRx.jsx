import React, { useState } from 'react';
import axios from 'axios';

export default function UploadRx() {
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        await axios.post("http://localhost:8000/api/prescriptions/upload", formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccess(true);
        setFile(null);
      } catch (err) {
        console.error("Upload failed", err);
        alert("Failed to upload prescription. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Upload Prescription</h1>
        <p className="text-gray-600 mb-8">
          Please upload a clear image or PDF of your valid medical prescription. Our pharmacists will review it shortly.
        </p>

        {success ? (
          <div className="bg-green-50 p-6 rounded-xl border border-green-200">
            <h3 className="text-2xl font-bold text-green-800 mb-2">Success!</h3>
            <p className="text-green-700">Your prescription has been uploaded successfully. Our team will verify it and add the items to your cart.</p>
            <button 
              onClick={() => setSuccess(false)}
              className="mt-6 bg-green-600 text-white px-6 py-2 rounded-full font-bold hover:bg-green-700 transition"
            >
              Upload Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-primary transition group cursor-pointer relative">
              <input 
                type="file" 
                accept="image/*,.pdf" 
                onChange={(e) => setFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required
              />
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 text-primary flex items-center justify-center rounded-full mb-4 group-hover:bg-primary group-hover:text-white transition">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                </div>
                <span className="text-gray-700 font-medium">
                  {file ? file.name : "Click to browse or drag and drop"}
                </span>
                <span className="text-gray-500 text-sm mt-2">JPG, PNG or PDF (Max 5MB)</span>
              </div>
            </div>

            <button 
              type="submit" 
              className={`w-full py-4 rounded-xl font-bold text-lg transition ${file ? 'bg-primary hover:bg-sky-600 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              disabled={!file}
            >
              Submit Prescription
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
