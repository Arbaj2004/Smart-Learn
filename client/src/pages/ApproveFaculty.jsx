import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiOutlineUserGroup, HiOutlineCheck, HiOutlineTrash } from "react-icons/hi";
import toast from "react-hot-toast";
import axios from "axios";

const UnapprovedFaculty = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUnapprovedFaculty();
  }, []);

  const fetchUnapprovedFaculty = async () => {
    const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/admin/unapproved-faculty`;
    try {
      setLoading(true);
      const response = await axios.get(URL, {
        headers: { 'authorization': `Bearer ${token}` },
        withCredentials: true
      });

      if (response.data.status === "success") {
        setFacultyList(response.data.data.faculty);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch unapproved faculty.");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (facultyId) => {
    const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/admin/approve-faculty/${facultyId}`;
    try {
      const response = await axios.post(URL, {}, {
        headers: { 'authorization': `Bearer ${token}` },
        withCredentials: true
      });

      if (response.data.status === "success") {
        toast.success("Faculty approved successfully!");
        // Remove the approved faculty from the list
        setFacultyList(facultyList.filter(faculty => faculty._id !== facultyId));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve faculty.");
      console.error("Approval error:", error);
    }
  };

  const handleDelete = async (facultyId) => {
    if (!window.confirm("Are you sure you want to delete this faculty member?")) {
      return;
    }
    
    const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/admin/delete-faculty/${facultyId}`;
    try {
      const response = await axios.delete(URL, {
        headers: { 'authorization': `Bearer ${token}` },
        withCredentials: true
      });

      if (response.data.status === "success") {
        toast.success("Faculty deleted successfully!");
        // Remove the deleted faculty from the list
        fetchUnapprovedFaculty();
        // setFacultyList(facultyList.filter(faculty => faculty._id !== facultyId));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete faculty.");
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="min-h-full flex justify-center items-center p-6 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
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
              <HiOutlineUserGroup className="w-8 h-8 text-indigo-600" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 text-center">
              Unapproved Faculty
            </h1>
            <p className="mt-2 text-center text-gray-500 text-sm">
              Review, approve or remove pending faculty registrations
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : facultyList.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No pending faculty approvals</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md">
              <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 font-medium text-gray-900">Name</th>
                    <th className="px-6 py-4 font-medium text-gray-900">Email</th>
                    <th className="px-6 py-4 font-medium text-gray-900">Department</th>
                    <th className="px-6 py-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                  {facultyList.map((faculty) => (
                    <tr key={faculty._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {faculty.userId.name}
                      </td>
                      <td className="px-6 py-4">{faculty.userId.email}</td>
                      <td className="px-6 py-4">{faculty.userId.department}</td>
                      <td className="px-6 py-4 flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleApprove(faculty._id)}
                          className="rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-200 flex items-center"
                        >
                          <HiOutlineCheck className="mr-1" />
                          Approve
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(faculty._id)}
                          className="rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-200 flex items-center"
                        >
                          <HiOutlineTrash className="mr-1" />
                          Delete
                        </motion.button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchUnapprovedFaculty}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium transition duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white shadow"
            >
              Refresh List
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UnapprovedFaculty;