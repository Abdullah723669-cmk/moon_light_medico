import React from 'react';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 border-b pb-4">About Us</h1>
        
        <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
          <p>
            Welcome to <strong className="text-primary">Moon Light Medico</strong>, your trusted digital healthcare partner. 
            We are dedicated to providing accessible, reliable, and affordable healthcare solutions right at your fingertips.
          </p>
          <p>
            Founded with a vision to revolutionize the pharmacy experience, we seamlessly blend cutting-edge technology 
            with professional medical expertise. Whether you're looking for over-the-counter medicines, managing chronic 
            conditions with prescription drugs, or simply searching for wellness products, we have you covered.
          </p>
          <p>
            Our rigorous quality control ensures that every product you receive is authentic, safely handled, and delivered 
            with the utmost care. We work directly with certified manufacturers and authorized distributors.
          </p>
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h3>
            <p className="text-gray-700">
              To empower individuals to take control of their health by providing a secure, continuous, and user-friendly 
              supply of pharmaceutical essentials directly to their doorsteps.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
