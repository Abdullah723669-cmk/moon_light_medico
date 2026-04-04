import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if(formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // Simulate signup for now
    login({ name: formData.name, email: formData.email, phone: formData.phone, address: formData.address });
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mt-4 mb-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Create an account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join Moon Light Medico today
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label className="sr-only" htmlFor="name">Full Name</label>
              <input 
                id="name" 
                name="name" 
                type="text" 
                required 
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" 
                placeholder="Full Name" 
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="email-address">Email address</label>
              <input 
                id="email-address" 
                name="email" 
                type="email" 
                autoComplete="email" 
                required 
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" 
                placeholder="Email address" 
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="phone">Phone Number</label>
              <input 
                id="phone" 
                name="phone" 
                type="tel" 
                required 
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" 
                placeholder="Phone Number" 
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="address">Address</label>
              <input 
                id="address" 
                name="address" 
                type="text" 
                required 
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" 
                placeholder="Delivery Address" 
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="password">Password</label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                autoComplete="new-password" 
                required 
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" 
                placeholder="Password" 
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="confirm-password">Confirm Password</label>
              <input 
                id="confirm-password" 
                name="confirmPassword" 
                type="password" 
                autoComplete="new-password" 
                required 
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" 
                placeholder="Confirm Password" 
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition">
              Sign up
            </button>
          </div>
          
          <div className="text-center text-sm">
             <span className="text-gray-600">Already have an account? </span>
             <Link to="/login" className="font-medium text-primary hover:text-sky-600 transition">
               Sign in
             </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
