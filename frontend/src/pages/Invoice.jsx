import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function Invoice() {
  const { invoice_number } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/orders/invoice/${invoice_number}`)
      .then(res => res.json())
      .then(data => {
        setInvoice(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [invoice_number]);

  if (loading) return <div className="min-h-screen p-8 flex justify-center items-center font-medium text-gray-500">Generating Invoice...</div>;
  if (!invoice || invoice.detail === "Invoice not found") return <div className="p-8 text-center font-bold text-red-500">Invoice not found!</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg print:shadow-none print:p-0">
        <div className="flex flex-col md:flex-row justify-between items-start border-b pb-8 mb-8 border-gray-200">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">INVOICE</h1>
            <p className="text-primary font-bold mt-2">Moon Light Medico</p>
          </div>
          <div className="text-right mt-4 md:mt-0">
            <p className="font-bold text-gray-800 text-lg">Invoice #: {invoice.invoice_number}</p>
            <p className="text-gray-500 mt-1">Date: {invoice.order_date}</p>
            <p className="text-gray-500 text-sm">Status: <span className="text-green-600 font-bold uppercase">{invoice.status}</span></p>
          </div>
        </div>
        
        <div className="mb-10">
          <h3 className="font-bold text-gray-400 uppercase text-xs tracking-widest mb-3">Billed To</h3>
          <p className="text-gray-900 font-bold text-lg">{invoice.customer_name}</p>
          <p className="text-gray-600 mt-1">{invoice.phone_number}</p>
          <p className="text-gray-600">{invoice.address}</p>
        </div>

        <div className="overflow-x-auto mb-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-y border-gray-200">
                <th className="py-3 px-4 font-bold text-gray-700">Brand Name</th>
                <th className="py-3 px-4 font-bold text-center text-gray-700">Order Quantity</th>
                <th className="py-3 px-4 font-bold text-right text-gray-700">Unit Price</th>
                <th className="py-3 px-4 font-bold text-right text-gray-700">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items && invoice.items.length > 0 ? (
                invoice.items.map(item => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-4 px-4 font-medium text-gray-900">{item.brand_name}</td>
                    <td className="py-4 px-4 text-center text-gray-600">{item.quantity}</td>
                    <td className="py-4 px-4 text-right text-gray-600">৳{item.price.toFixed(2)}</td>
                    <td className="py-4 px-4 text-right font-bold text-gray-900">৳{(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-400 italic">No detailed items recorded (Legacy Order)</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mb-12">
          <div className="w-72 bg-gray-50 p-6 rounded-lg border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-600">Subtotal</span>
              <span className="font-bold text-gray-900">৳{(invoice.total_cost + (invoice.discount_amount || 0)).toFixed(2)}</span>
            </div>
            {invoice.discount_amount > 0 && (
              <div className="flex justify-between items-center text-green-600 mb-4 pb-4 border-b border-gray-200">
                <span className="font-medium">Discount</span>
                <span className="font-bold">- ৳{invoice.discount_amount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center mb-2 pt-2">
              <span className="font-black text-xl text-gray-900">Grand Total</span>
              <span className="font-black text-2xl text-primary">৳{invoice.total_cost.toFixed(2)}</span>
            </div>
            <div className="text-right">
              <span className="inline-block bg-sky-100 text-sky-700 text-xs font-bold px-2 py-1 rounded">Via {invoice.payment_mode}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-gray-200 print:hidden gap-4">
          <Link to="/" className="text-gray-500 hover:text-primary font-bold transition">← Return to Shop</Link>
          <button 
            onClick={() => window.print()} 
            className="w-full sm:w-auto bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-sky-600 transition shadow-md active:scale-95"
          >
            🖨️ Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
