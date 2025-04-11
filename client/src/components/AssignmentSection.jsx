import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { motion } from "framer-motion";
import { HiOutlineDocumentText, HiOutlineClock, HiOutlineCalendar, HiOutlineTrash, HiOutlinePencil } from "react-icons/hi";

const AssignmentsSection = ({ courseId, token }) => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      try {
        const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/assignments/${courseId}`;
        const response = await axios.get(URL, {
          headers: { 'authorization': `Bearer ${token}` },
          withCredentials: true
        });
        
        setAssignments(response.data.data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load assignments");
        console.error("Error fetching assignments:", error);
        setLoading(false);
      }
    };
    
    fetchAssignments();
  }, [courseId, token]);

  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatDaysRemaining = (dueDate) => {
    if (!dueDate) return "No deadline";
    
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return "Overdue";
    } else if (diffDays === 0) {
      return "Due today";
    } else if (diffDays === 1) {
      return "Due tomorrow";
    } else {
      return `${diffDays} days remaining`;
    }
  };

  const getDaysRemainingColor = (dueDate) => {
    if (!dueDate) return "text-gray-500";
    
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return "text-red-600";
    } else if (diffDays <= 2) {
      return "text-amber-600";
    } else {
      return "text-green-600";
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/assignments/${assignmentId}`;
      await axios.delete(URL, {
        headers: { 'authorization': `Bearer ${token}` },
        withCredentials: true
      });
      
      toast.success("Assignment deleted successfully");
      setAssignments(assignments.filter(assignment => assignment._id !== assignmentId));
      setShowConfirmDelete(null);
    } catch (error) {
      toast.error("Failed to delete assignment");
      console.error("Error deleting assignment:", error);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-800">Assignments</h3>
        <button
          onClick={() => navigate(`/course/${courseId}/assignment/new`)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Assignment
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : assignments.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <HiOutlineDocumentText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h4 className="text-gray-700 font-medium mb-2">No assignments yet</h4>
          <p className="text-gray-500 mb-4">Create your first assignment for this course</p>
          <button
            onClick={() => navigate(`/course/${courseId}/assignment/new`)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Assignment
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <motion.div
              key={assignment._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 mb-2">
                      {assignment.title}
                    </h4>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {assignment.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <HiOutlineClock className="w-4 h-4 mr-1" />
                        <span className={getDaysRemainingColor(assignment.dueDate)}>
                          {formatDaysRemaining(assignment.dueDate)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <HiOutlineCalendar className="w-4 h-4 mr-1" />
                        {formatDate(assignment.dueDate)}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <HiOutlineDocumentText className="w-4 h-4 mr-1" />
                        {assignment.submissions?.length || 0} submissions
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/assignment/${assignment._id}`)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition"
                      title="View Assignment"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => navigate(`/assignment/${assignment._id}/edit`)}
                      className="p-2 text-amber-600 hover:bg-amber-50 rounded-full transition"
                      title="Edit Assignment"
                    >
                      <HiOutlinePencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setShowConfirmDelete(assignment._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
                      title="Delete Assignment"
                    >
                      <HiOutlineTrash className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              
              {showConfirmDelete === assignment._id && (
                <div className="bg-red-50 p-4 border-t border-red-100">
                  <p className="text-red-800 mb-3">Are you sure you want to delete this assignment?</p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setShowConfirmDelete(null)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeleteAssignment(assignment._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignmentsSection;