import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600">We're here to help! Reach out to us with any questions or concerns.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary focus:outline-none" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary focus:outline-none" placeholder="Your email" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary focus:outline-none" placeholder="How can we help?"></textarea>
              </div>
              <button type="button" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-600 transition">
                Send Message
              </button>
            </form>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Get in Touch</h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full text-primary">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                  <p className="text-gray-500 text-sm">Mon-Fri from 8am to 5pm</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full text-primary">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600">support@moonlightmedico.com</p>
                  <p className="text-gray-500 text-sm">We'll respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full text-primary">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Lab/Office</h3>
                  <p className="text-gray-600">123 Health Ave, Suite 456<br/>Medical District, NY 10001</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
