import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-8">Looks like you haven't added any medicines yet.</p>
        <Link to="/" className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-sky-600 transition shadow-md">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {cart.map((item) => (
            <li key={item.id} className="p-6 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center">
                <span className="text-4xl">💊</span>
              </div>
              <div className="flex-1 flex flex-col sm:flex-row justify-between w-full">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                  <p className="text-gray-500">{item.strength || 'Standard'}</p>
                  <p className="text-primary font-medium mt-1">৳{item.price}</p>
                </div>
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button 
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition"
                    >-</button>
                    <span className="px-3 py-1 font-medium border-x border-gray-300 w-12 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition"
                    >+</button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 transition p-2 bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-medium text-gray-900">Total</span>
            <span className="text-2xl font-bold text-gray-900">৳{totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={clearCart}
              className="flex-1 bg-white border-2 border-red-500 text-red-500 py-3 rounded-lg font-bold hover:bg-red-50 transition"
            >
              Clear Cart
            </button>
            <Link 
              to="/" 
              className="flex-1 bg-gray-100 text-gray-800 flex items-center justify-center py-3 rounded-lg font-bold hover:bg-gray-200 transition"
            >
              Buy More
            </Link>
            <Link 
              to="/checkout"
              className="flex-1 bg-primary text-white py-3 rounded-lg font-bold hover:bg-sky-600 transition shadow-md flex items-center justify-center"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
