import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineMail } from "react-icons/hi";
import toast from "react-hot-toast";
import axios from "axios";

const VerifyOtp = () => {
  const [data, setData] = useState({ otp: "" });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    if (value.length <= 6 && /^\d*$/.test(value)) {
      setData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (data.otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/users/verifySignupEmailOTP`;
    try {
      const response = await axios.post(URL, {
        Emailotp: data.otp
      }, {
        headers: { 'authorization': `Bearer ${token}` },
        withCredentials: true
      });

      if (response.data.status === "success") {
        //const userData = response.data.data.oldUser;
        //dispatch(loginSuccess(userData));
        localStorage.removeItem('token')
        toast.success("Email verification successful!");
        setData({ otp: "" });
        setTimeout(() => {
          setData({ password: "", email: "" });
        }, 1000);
        navigate('/signin');
      }
    } catch (error) {
      toast.error(error.response.data.message || "Verification failed. Please try again.");
      console.error("Verification error:", error);
      navigate('/signin');
    }
  };

  return (
    <div className="min-h-full flex justify-center items-center p-6 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-8 shadow-lg border border-gray-200"
        >
          <div className="flex flex-col items-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4"
            >
              <HiOutlineMail className="w-8 h-8 text-indigo-600" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 text-center">
              Email Verification
            </h1>
            <p className="mt-2 text-center text-gray-500 text-sm">
              We’ve sent a verification code to your email. Enter it below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="otp"
              >
                Verification Code
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-center text-lg tracking-widest shadow-sm"
                required
                value={data.otp}
                onChange={handleOnChange}
                maxLength={6}
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-indigo-600 text-white rounded-lg py-3 font-medium transition duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white shadow"
            >
              Verify Email
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VerifyOtp;
