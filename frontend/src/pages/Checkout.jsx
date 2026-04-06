import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { user } = useAuth();
  const { cart, clearCart, discountAmount } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_name: '',
    phone_number: '',
    address: '',
    payment_mode: 'COD'
  });

  const subTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalCost = Math.max(0, subTotal - (discountAmount || 0));

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customer_name: user.name || '',
        phone_number: user.phone || '',
        address: user.address || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      // Map shopping cart natively to backend payload items array
      const items = cart.map(item => ({
        medicine_id: item.id,
        quantity: item.quantity
      }));

      const response = await fetch('/orders/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          total_cost: totalCost,
          discount_amount: discountAmount || 0,
          items: items
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Order Placed Successfully!`);
        clearCart();
        navigate(`/invoice/${data.invoice_number}`);
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error connecting to server. Is the backend running?");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
        <Link to="/" className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-sky-600 transition shadow-md">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 sm:p-10">
        <form onSubmit={handlePlaceOrder} className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Shipping Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="customer_name">Full Name</label>
                <input 
                  id="customer_name" 
                  name="customer_name" 
                  type="text" 
                  required 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={formData.customer_name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="phone_number">Phone Number</label>
                <input 
                  id="phone_number" 
                  name="phone_number" 
                  type="text" 
                  required 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={formData.phone_number}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="address">Delivery Address</label>
                <textarea 
                  id="address" 
                  name="address" 
                  required 
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Method</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <input 
                  id="payment_cod" 
                  name="payment_mode" 
                  type="radio" 
                  value="COD"
                  checked={formData.payment_mode === 'COD'}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300" 
                />
                <label htmlFor="payment_cod" className="ml-3 block text-sm font-medium text-gray-700">
                  Cash on Delivery (COD)
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  id="payment_mobile" 
                  name="payment_mode" 
                  type="radio" 
                  value="Mobile Banking"
                  checked={formData.payment_mode === 'Mobile Banking'}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300" 
                />
                <label htmlFor="payment_mobile" className="ml-3 block text-sm font-medium text-gray-700">
                  Mobile Banking (bKash / Nagad / Rocket)
                </label>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between items-center text-gray-600">
                <span className="font-medium">Subtotal</span>
                <span className="font-bold">৳{subTotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-green-600">
                  <span className="font-medium">Discount</span>
                  <span className="font-bold">- ৳{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
                <span className="text-xl font-bold text-gray-900">Total to Pay</span>
                <span className="text-2xl font-black text-primary">৳{totalCost.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/cart" className="flex-1 bg-gray-100 text-gray-800 text-center py-3 rounded-lg font-bold hover:bg-gray-200 transition">
              Back to Cart
            </Link>
            <button type="submit" className="flex-1 bg-primary text-white py-3 rounded-lg font-bold hover:bg-sky-600 transition shadow-md">
              Place Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
