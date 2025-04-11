import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiOutlineTicket, 
  HiOutlineMail, 
  HiOutlineCalendar, 
  HiOutlineClock 
} from "react-icons/hi";
import toast from 'react-hot-toast';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const optionsDate = { day: '2-digit', month: 'long', year: 'numeric' };
  const optionsTime = { hour: '2-digit', minute: '2-digit' };

  const formattedDate = date.toLocaleDateString('en-US', optionsDate);
  const formattedTime = date.toLocaleTimeString('en-US', optionsTime);

  return `${formattedDate} at ${formattedTime}`;
};

const calculateDaysSince = (createdAt) => {
  const createdDate = new Date(createdAt);
  const today = new Date();
  const differenceInTime = today - createdDate;
  return Math.floor(differenceInTime / (1000 * 3600 * 24));
};

const ResponseTicket = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { ticketId } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    message: "",
    _id: ticketId
  });
  const [ticket, setTicket] = useState(null);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchTicket = async () => {
    const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/chatBot/getTicket/${ticketId}`;
    try {
      setLoading(true);
      const response = await axios.get(URL, {
        headers: { 'authorization': `Bearer ${token}` },
        withCredentials: true
      });
      setTicket(response.data.data.rows[0]);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching ticket");
      console.error("Error fetching Tickets:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/chatBot/updateTicket/${ticketId}`;
    try {
      const response = await axios.post(URL,
        { message: data.message },
        {
          headers: { 'authorization': `Bearer ${token}` },
          withCredentials: true
        }
      );

      if (response.data.status === "success") {
        toast.success("Response sent successfully");
        navigate('/admin/tickets');
      } else {
        toast.error("Failed to send response");
      }
    } catch (error) {
      toast.error("Error sending response");
      console.error("Response submission error:", error);
    }
  };

  return (
    <div className="min-h-full flex justify-center items-center p-6 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
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
              <HiOutlineTicket className="w-8 h-8 text-indigo-600" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Ticket Details
            </h1>

            {loading ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : ticket && (
              <div className="w-full space-y-6">
                {/* Ticket Information Section */}
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <HiOutlineMail className="w-6 h-6 text-indigo-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-indigo-800 mb-2">
                        {ticket.Question}
                      </h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="flex items-center">
                          <HiOutlineCalendar className="mr-2 text-gray-500" />
                          Created on {formatDate(ticket.createdAt)}
                        </p>
                        <p className="flex items-center">
                          <HiOutlineClock className="mr-2 text-gray-500" />
                          Opened {calculateDaysSince(ticket.createdAt)} days ago
                        </p>
                        <p className="flex items-center">
                          <HiOutlineMail className="mr-2 text-gray-500" />
                          {ticket.EmailID}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Response Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label 
                      htmlFor="message" 
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Your Response
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="6"
                      onChange={handleOnChange}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-sm resize-none"
                      placeholder="Write your response here..."
                      value={data.message}
                      required
                    ></textarea>
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-indigo-600 text-white rounded-lg py-3 font-medium transition duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white shadow"
                  >
                    Send Response
                  </motion.button>
                </form>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResponseTicket;