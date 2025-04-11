import axios from 'axios';
import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineTicket } from "react-icons/hi";
import toast from "react-hot-toast";

const formatDate = (dateString) => {
  const date = new Date(dateString);

  const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const optionsTime = { hour: '2-digit', minute: '2-digit' };

  const formattedDate = date.toLocaleDateString('en-GB', optionsDate);
  const formattedTime = date.toLocaleTimeString('en-GB', optionsTime);

  return `${formattedDate} ${formattedTime}`;
};

const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  return text.length > maxLength 
    ? `${text.substring(0, maxLength)}...` 
    : text;
};

const TicketPage = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [allTickets, setAllTickets] = useState([]);
  const [filter, setFilter] = useState('all');

  const fetchAllTickets = async () => {
    const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/chatBot/getAllTickets`;
    try {
      setLoading(true);
      const response = await axios.get(URL, { 
        headers: { 'authorization': `Bearer ${token}` },
        withCredentials: true 
      });
      setAllTickets(response.data.data.rows);
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching tickets");
      console.error("Error fetching Tickets:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTickets();
  }, []);

  const handleClick = (ticketId) => {
    navigate(`/ticket/${ticketId}`);
  };

  const filteredTickets = allTickets.filter(ticket => {
    if (filter === 'answered') return ticket.Answer;
    if (filter === 'unanswered') return !ticket.Answer;
    return true;
  });

  return (
    <div className="min-h-screen flex justify-center items-center p-4 sm:p-6 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 sm:p-8 shadow-lg border border-gray-200"
        >
          <div className="flex flex-col items-center mb-4 sm:mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-2 sm:mb-4"
            >
              <HiOutlineTicket className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
            </motion.div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 text-center">
              All Tickets
            </h1>
            <div className="mt-2 sm:mt-4 flex flex-wrap justify-center space-x-2">
              {['all', 'answered', 'unanswered'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`
                    px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium 
                    transition duration-200 mb-1
                    ${filter === status 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                  `}
                >
                  {status === 'all' && 'All Tickets'}
                  {status === 'answered' && 'Answered'}
                  {status === 'unanswered' && 'Unanswered'}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          )}

          {!loading && filteredTickets.length === 0 && (
            <div className="text-center text-gray-500">
              No tickets found
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredTickets.map((ticket) => (
              <motion.div
                key={ticket.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  rounded-lg p-3 sm:p-4 shadow-md border 
                  relative overflow-hidden
                  ${ticket.Answer 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200 cursor-pointer'}
                `}
                onClick={() => !ticket.Answer && handleClick(ticket.id)}
              >
                <h3 className={`
                  text-sm sm:text-base font-semibold mb-1 sm:mb-2 
                  line-clamp-2 h-10 sm:h-12 overflow-hidden
                  ${ticket.Answer ? 'text-green-800' : 'text-red-800'}
                `}>
                  {ticket.Question}
                </h3>
                {ticket.Answer && (
                  <p className="text-xs sm:text-sm text-gray-700 mb-2 
                    line-clamp-3 h-12 sm:h-16 overflow-hidden">
                    {truncateText(ticket.Answer, 150)}
                  </p>
                )}
                <div className="text-2xs sm:text-xs text-gray-500 
                  flex justify-between items-end absolute bottom-2 left-3 right-3">
                  <span className="truncate max-w-[50%] mr-2">{ticket.EmailID}</span>
                  <span>{formatDate(ticket.createdAt)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TicketPage;