import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function AdminInvoice() {
  const { invoice_number } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Editable fields
  const [discount, setDiscount] = useState(0);
  const [discountInput, setDiscountInput] = useState('');
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [enableDelivery, setEnableDelivery] = useState(false);
  const [status, setStatus] = useState('Pending');
  const [notes, setNotes] = useState('');
  const [paymentMode, setPaymentMode] = useState('COD');
  const [editedItems, setEditedItems] = useState([]);

  useEffect(() => {
    fetchInvoice();
  }, [invoice_number]);

  const fetchInvoice = async () => {
    try {
      const res = await axios.get(`/api/orders/invoice/${invoice_number}`);
      const data = res.data;
      setInvoice(data);
      setDiscount(data.discount_amount || 0);
      setDiscountInput(data.discount_amount ? String(data.discount_amount) : '');
      setDeliveryCharge(data.delivery_charge || 0);
      setEnableDelivery((data.delivery_charge || 0) > 0);
      setStatus(data.status);
      setNotes(data.notes || '');
      setPaymentMode(data.payment_mode);
      setEditedItems(data.items?.map(item => ({ ...item, editQty: item.quantity })) || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyDiscount = () => {
    const val = discountInput.trim();
    if (!val) {
      setDiscount(0);
      return;
    }
    if (val.endsWith('%')) {
      const pct = parseFloat(val);
      if (!isNaN(pct)) {
        setDiscount(itemsSubtotal * (pct / 100));
      }
    } else {
      const flat = parseFloat(val);
      if (!isNaN(flat)) {
        setDiscount(flat);
      }
    }
  };

  const updateItemQty = (itemId, newQty) => {
    setEditedItems(prev => prev.map(it =>
      it.id === itemId ? { ...it, editQty: Math.max(0, parseInt(newQty) || 0) } : it
    ));
  };

  const itemsSubtotal = editedItems.reduce((sum, it) => sum + (it.price * it.editQty), 0);
  const grandTotal = Math.max(0, itemsSubtotal - discount + (enableDelivery ? deliveryCharge : 0));

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await axios.put(`/api/orders/${invoice.id}`, {
        total_cost: grandTotal,
        discount_amount: discount,
        delivery_charge: enableDelivery ? deliveryCharge : 0,
        status: status,
        notes: notes,
        payment_mode: paymentMode,
        items: editedItems.map(it => ({
          medicine_id: it.medicine_id,
          quantity: it.editQty
        }))
      });
      setSaved(true);
      // Re-fetch to confirm server state
      await fetchInvoice();
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to save invoice. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen p-8 flex justify-center items-center font-medium text-gray-500">Loading Invoice...</div>;
  if (!invoice) return <div className="p-8 text-center font-bold text-red-500">Invoice not found!</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 print:bg-white print:py-0">
      <div className="max-w-5xl mx-auto px-4">

        {/* Action Bar — hidden on print */}
        <div className="flex flex-wrap items-center justify-between mb-6 print:hidden gap-4">
          <Link to="/admin" className="text-gray-500 hover:text-primary font-bold transition text-sm">
            ← Back to Order Management
          </Link>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-green-600 font-bold text-sm animate-pulse">✓ Saved Successfully</span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold transition shadow-md disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Invoice'}
            </button>
            <button
              onClick={() => window.print()}
              className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2.5 rounded-lg font-bold transition shadow-md"
            >
              🖨️ Print
            </button>
          </div>
        </div>

        {/* Invoice Card */}
        <div className="bg-white rounded-xl shadow-lg print:shadow-none print:rounded-none p-8 print:p-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start border-b pb-8 mb-8 border-gray-200">
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">INVOICE</h1>
              <p className="text-primary font-bold mt-2 text-lg">Moon Light Medico</p>
              <p className="text-gray-400 text-sm mt-1">Your Trusted E-Pharmacy</p>
            </div>
            <div className="text-right mt-4 md:mt-0">
              <p className="font-bold text-gray-800 text-lg">Invoice #: {invoice.invoice_number}</p>
              <p className="text-gray-500 mt-1">Order #: {invoice.order_number}</p>
              <p className="text-gray-500 text-sm">Date: {invoice.order_date}</p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-8">
            <h3 className="font-bold text-gray-400 uppercase text-xs tracking-widest mb-3">Billed To</h3>
            <p className="text-gray-900 font-bold text-lg">{invoice.customer_name}</p>
            <p className="text-gray-600 mt-1">{invoice.phone_number}</p>
            <p className="text-gray-600">{invoice.address}</p>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-y border-gray-200">
                  <th className="py-3 px-4 font-bold text-gray-700">Brand Name</th>
                  <th className="py-3 px-4 font-bold text-center text-gray-700">Quantity</th>
                  <th className="py-3 px-4 font-bold text-right text-gray-700">Unit Price</th>
                  <th className="py-3 px-4 font-bold text-right text-gray-700">Amount</th>
                </tr>
              </thead>
              <tbody>
                {editedItems.length > 0 ? (
                  editedItems.map(item => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-4 px-4 font-medium text-gray-900">{item.brand_name}</td>
                      <td className="py-4 px-4 text-center">
                        <input
                          type="number"
                          min="0"
                          value={item.editQty}
                          onChange={(e) => updateItemQty(item.id, e.target.value)}
                          className="w-20 text-center border border-gray-300 rounded-lg py-1 focus:outline-none focus:ring-2 focus:ring-indigo-300 print:border-none print:bg-transparent"
                        />
                      </td>
                      <td className="py-4 px-4 text-right text-gray-600">৳{item.price.toFixed(2)}</td>
                      <td className="py-4 px-4 text-right font-bold text-gray-900">
                        {item.editQty > 0 ? `৳${(item.editQty * item.price).toFixed(2)}` : <span className="text-red-400 text-sm">Returned</span>}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-gray-400 italic">No items in this order</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Editable Section — Discount, Delivery, Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 print:hidden">
            {/* Left: Discount & Delivery */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Discount (flat amount or %)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountInput}
                    onChange={(e) => setDiscountInput(e.target.value)}
                    placeholder="e.g. 50 or 10%"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                  <button onClick={applyDiscount} className="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-700 transition">
                    Apply
                  </button>
                </div>
                {discount > 0 && <p className="text-green-600 text-sm font-medium mt-1">Discount: ৳{discount.toFixed(2)}</p>}
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableDelivery}
                    onChange={(e) => {
                      setEnableDelivery(e.target.checked);
                      if (!e.target.checked) setDeliveryCharge(0);
                    }}
                    className="w-5 h-5 text-indigo-600 rounded border-gray-300"
                  />
                  <span className="text-sm font-bold text-gray-700">Add Delivery Charge</span>
                </label>
                {enableDelivery && (
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={deliveryCharge}
                    onChange={(e) => setDeliveryCharge(parseFloat(e.target.value) || 0)}
                    placeholder="Delivery charge amount"
                    className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                )}
              </div>
            </div>

            {/* Right: Status, Payment, Notes */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Order Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Returned">Returned</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Payment Mode</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  <option value="COD">Cash on Delivery (COD)</option>
                  <option value="Mobile Banking">Mobile Banking</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Notes / Amendment Reason</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. Customer returned 2 units of Maxpro..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
            </div>
          </div>

          {/* Totals Summary */}
          <div className="flex justify-end mb-8">
            <div className="w-80 bg-gray-50 p-6 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-600">Items Subtotal</span>
                <span className="font-bold text-gray-900">৳{itemsSubtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between items-center text-green-600 mb-2">
                  <span className="font-medium">Discount</span>
                  <span className="font-bold">- ৳{discount.toFixed(2)}</span>
                </div>
              )}
              {enableDelivery && deliveryCharge > 0 && (
                <div className="flex justify-between items-center text-gray-600 mb-2">
                  <span className="font-medium">Delivery Charge</span>
                  <span className="font-bold">+ ৳{deliveryCharge.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-3 border-t border-gray-200 mt-2">
                <span className="font-black text-xl text-gray-900">Grand Total</span>
                <span className="font-black text-2xl text-primary">৳{grandTotal.toFixed(2)}</span>
              </div>
              <div className="text-right mt-2">
                <span className="inline-block bg-sky-100 text-sky-700 text-xs font-bold px-2 py-1 rounded">Via {paymentMode}</span>
              </div>
              <div className="text-right mt-1">
                <span className={`inline-block text-xs font-bold px-2 py-1 rounded ${
                  status === 'Completed' ? 'bg-green-100 text-green-700' :
                  status === 'On Hold' ? 'bg-orange-100 text-orange-700' :
                  status === 'Returned' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {status}
                </span>
              </div>
            </div>
          </div>

          {/* Notes display for print */}
          {notes && (
            <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-bold text-gray-700 text-sm mb-1">Notes / Amendment</h4>
              <p className="text-gray-600 text-sm">{notes}</p>
            </div>
          )}

          {/* Sales Receiving Acknowledgement */}
          <div className="mt-16 mb-12 grid grid-cols-2 gap-12">
            <div className="border-t border-gray-400 pt-2 text-center">
              <p className="font-bold text-gray-700 text-sm italic">Customer Signature</p>
              <p className="text-[10px] text-gray-400 mt-1">(Receiving Acknowledgement)</p>
            </div>
            <div className="border-t border-gray-400 pt-2 text-center">
              <p className="font-bold text-gray-700 text-sm italic">Authorized Signature</p>
              <p className="text-[10px] text-gray-400 mt-1">Moon Light Medico</p>
            </div>
          </div>

          {/* Standard Sales Return Policy */}
          <div className="border-t border-gray-200 pt-8 pb-4">
            <h4 className="text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-widest">Return Policy</h4>
            <p className="text-[9px] text-gray-400 leading-relaxed text-justify italic">
              1. Medicines must be returned within 7 days of purchase in their original, unopened packaging. 
              2. Refrigerated medicines and surgical items are non-returnable. 
              3. Original invoice is required for any returns or exchanges. 
              4. Full refund is applicable only for defective products or errors made by the pharmacy. 
              5. All returns are subject to the pharmacist's final verification and approval.
            </p>
          </div>

          {/* Print footer */}
          <div className="border-t border-gray-200 pt-6 text-center text-gray-400 text-sm hidden print:block">
            <p className="font-bold">Thank you for choosing Moon Light Medico!</p>
            <p className="mt-1">Hotline: +880-1XXXX-XXXXXX | Website: www.moonlightmedico.com</p>
          </div>

          {/* Screen footer */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-gray-200 print:hidden gap-4">
            <Link to="/admin" className="text-gray-500 hover:text-primary font-bold transition">← Back to Orders</Link>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-bold transition shadow-md disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Invoice'}
              </button>
              <button
                onClick={() => window.print()}
                className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-lg font-bold transition shadow-md"
              >
                🖨️ Print Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
