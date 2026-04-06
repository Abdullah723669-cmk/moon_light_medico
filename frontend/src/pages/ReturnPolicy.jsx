import React from 'react';

export default function ReturnPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 border-b pb-4">Return Policy</h1>
        
        <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
          <p>
            At Moon Light Medico, we strive to ensure that our customers receive exactly what they order in perfect condition.
            However, we understand that situations arise where you may need to return a product.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Eligible Items for Return</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Products that are damaged during transit.</li>
            <li>Products that match an incorrect order specification (e.g., wrong medicine or incorrect dosage).</li>
            <li>Products that are expired upon delivery.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Non-Returnable Items</h2>
          <p>For safety and hygiene reasons, the following items CANNOT be returned:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Opened or used medication.</li>
            <li>Products requiring refrigeration or cold-chain maintenance (e.g., insulin, certain vaccines).</li>
            <li>Inhalers, injections, or personal care products once the seal is broken.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. How to Initiate a Return</h2>
          <p>
            You must alert us to the issue within <strong>48 hours</strong> of receiving your delivery. Please contact our support team
            at <a href="mailto:support@moonlightmedico.com" className="text-primary hover:underline">support@moonlightmedico.com</a> with your order number and photo evidence of the damaged or incorrect item.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Refunds</h2>
          <p>
            Once your return is received and inspected, we will notify you of the approval or rejection of your refund. 
            If approved, the refund will be processed and applied to your original method of payment within 5-7 business days.
          </p>
        </div>
      </div>
    </div>
  );
}
