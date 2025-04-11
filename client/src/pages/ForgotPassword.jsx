import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/users/forgotPassword`,
        { email }
      );

      if (response.data.status === 'success') {
        toast.success('Password reset link sent to your email.');
        setTimeout(() => {
        }, 1000);
      } else {
        toast.error(response.data.message || 'Failed to send reset link.');
      }
    } catch (error) {
      toast.error(error.response.data.message || 'Failed to send reset link.');
      console.error('Forgot Password Error:', error.response.data.message);
    }
  };

  return (
    <div className="min-h-full flex flex-col justify-center items-center bg-gray-50 px-6">
      <Toaster position="top-right" />
      <div className="sm:w-full sm:max-w-md bg-white p-8 shadow-md rounded-lg">
        <h2 className="text-center text-2xl font-bold text-gray-900">Forgot Password?</h2>
        <p className="text-center text-sm text-gray-600 mt-2">
          Enter your email to receive a reset link.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
          >
            Send Reset Link
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Remember your password?{' '}
          <Link to="/signin" className="text-indigo-600 hover:text-indigo-500 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
