import React from 'react';
import { Truck, ShieldCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FastDelivery() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100 text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 mx-auto rounded-full flex items-center justify-center mb-6">
          <Truck className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Fast & Secure Delivery</h1>
        
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          We understand that when it comes to medications, timing is everything. Our delivery network is optimized to get your essentials to your door safely and quickly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 text-left">
          <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 flex items-start gap-4">
            <Clock className="w-8 h-8 text-emerald-600 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Same-Day Delivery</h3>
              <p className="text-gray-700">Available for orders placed before 2 PM in metropolitan areas. Track your rider in real-time.</p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex items-start gap-4">
            <ShieldCheck className="w-8 h-8 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Temperature Controlled</h3>
              <p className="text-gray-700">Special insulated packaging ensures your cold-chain medicines arrive perfectly preserved.</p>
            </div>
          </div>
        </div>

        <Link to="/search" className="inline-block bg-primary text-white font-bold px-8 py-4 rounded-full text-lg hover:bg-sky-600 transition shadow-lg hover:-translate-y-1">
          Start Shopping Now
        </Link>
      </div>
    </div>
  );
}
