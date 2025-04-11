import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  HiOutlineChevronLeft,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineClipboardList,
  HiOutlineDocumentText,
  HiOutlineAcademicCap,
  HiOutlineExclamation
} from "react-icons/hi";
import axios from "axios";
import toast from "react-hot-toast";

const CreateAssignment = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructions: "",
    dueDate: "",
    dueTime: "23:59",
    maxMarks: 100,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    setLoading(true);
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/courses/${courseId}`;
      const response = await axios.get(URL, {
        headers: { 'authorization': `Bearer ${token}` },
        withCredentials: true
      });

      if (response.data.status === "success") {
        setCourse(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch course details. Please try again.");
      console.error("Error fetching course:", error);
      navigate("/courses/faculty");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.instructions.trim()) {
      newErrors.instructions = "Instructions are required";
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    } else {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = "Due date cannot be in the past";
      }
    }
    
    if (!formData.dueTime) {
      newErrors.dueTime = "Due time is required";
    }
    
    if (!formData.maxMarks || formData.maxMarks <= 0) {
      newErrors.maxMarks = "Maximum marks must be greater than 0";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    setSubmitting(true);
    
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/assignments`;
      const response = await axios.post(URL, 
        {
          ...formData,
          courseId
        },
        {
          headers: { 'authorization': `Bearer ${token}` },
          withCredentials: true
        }
      );
      
      if (response.data.status === "success") {
        toast.success("Assignment created successfully");
        navigate(`/courses/${courseId}/edit`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create assignment. Please try again.");
      console.error("Error creating assignment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-full bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        {/* Back Navigation */}
        <button
          onClick={() => navigate(`/faculty/course/${courseId}`)}
          className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 font-medium focus:outline-none"
        >
          <HiOutlineChevronLeft className="mr-1 h-5 w-5" />
          Back to Course
        </button>

        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center">
            <div className="bg-indigo-100 rounded-lg p-3 mr-4">
              <HiOutlineClipboardList className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Assignment</h1>
              {course && (
                <p className="text-gray-600 flex items-center mt-1">
                  <HiOutlineAcademicCap className="h-4 w-4 mr-1" />
                  {course.title} • {course.courseCode}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Assignment Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            {/* Assignment Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Assignment Title*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.title ? "border-red-300" : "border-gray-300"
                } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                placeholder="e.g., Midterm Project"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description*
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.description ? "border-red-300" : "border-gray-300"
                } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                placeholder="Brief description of the assignment"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Instructions */}
            <div>
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
                Instructions*
              </label>
              <textarea
                id="instructions"
                name="instructions"
                rows={5}
                value={formData.instructions}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.instructions ? "border-red-300" : "border-gray-300"
                } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                placeholder="Detailed instructions for students"
              />
              {errors.instructions && (
                <p className="mt-1 text-sm text-red-600">{errors.instructions}</p>
              )}
            </div>

            {/* Due Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                  Due Date*
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineCalendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className={`pl-10 block w-full rounded-md border ${
                      errors.dueDate ? "border-red-300" : "border-gray-300"
                    } px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                  />
                </div>
                {errors.dueDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
                )}
              </div>

              <div>
                <label htmlFor="dueTime" className="block text-sm font-medium text-gray-700">
                  Due Time*
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineClock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="time"
                    id="dueTime"
                    name="dueTime"
                    value={formData.dueTime}
                    onChange={handleChange}
                    className={`pl-10 block w-full rounded-md border ${
                      errors.dueTime ? "border-red-300" : "border-gray-300"
                    } px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                  />
                </div>
                {errors.dueTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.dueTime}</p>
                )}
              </div>
            </div>

            {/* Max Marks */}
            <div>
              <label htmlFor="maxMarks" className="block text-sm font-medium text-gray-700">
                Maximum Marks*
              </label>
              <input
                type="number"
                id="maxMarks"
                name="maxMarks"
                value={formData.maxMarks}
                onChange={handleChange}
                min="1"
                className={`mt-1 block w-full rounded-md border ${
                  errors.maxMarks ? "border-red-300" : "border-gray-300"
                } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
              />
              {errors.maxMarks && (
                <p className="mt-1 text-sm text-red-600">{errors.maxMarks}</p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(`/faculty/course/${courseId}`)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <div className="flex items-center">
                <div className="mr-4 text-sm text-gray-500 flex items-center">
                  <HiOutlineExclamation className="h-4 w-4 mr-1 text-amber-500" />
                  All fields marked with * are required
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    submitting ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {submitting ? "Creating..." : "Create Assignment"}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Tips Section */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <HiOutlineDocumentText className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Tips for creating effective assignments</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Be clear and specific about your expectations</li>
                  <li>Break down complex assignments into manageable steps</li>
                  <li>Provide rubrics or grading criteria when possible</li>
                  <li>Set reasonable deadlines that allow sufficient time for completion</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateAssignment;