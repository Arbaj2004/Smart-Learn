import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineAcademicCap } from "react-icons/hi";
import toast from "react-hot-toast";
import axios from "axios";

const CreateCourse = () => {
  const [data, setData] = useState({
    title: "",
    description: "",
    department: "",
    semester: "",
    courseCode: "",
    startDate: "",
    endDate: "",
    credits: 3,
    syllabus: "",
    visibility: true
  });
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  const handleOnChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!data.title || !data.department || !data.semester || !data.courseCode || !data.startDate) {
      toast.error("Please fill all required fields");
      return;
    }

    const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/faculty/course`;
    try {
      const response = await axios.post(URL, data, {
        headers: { 'authorization': `Bearer ${token}` },
        withCredentials: true
      });

      if (response.data.status === "success") {
        toast.success("Course created successfully!");
        navigate('/faculty/courses');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create course. Please try again.");
      console.error("Course creation error:", error);
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
              <HiOutlineAcademicCap className="w-8 h-8 text-indigo-600" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 text-center">
              Create New Course
            </h1>
            <p className="mt-2 text-center text-gray-500 text-sm">
              Fill in the details below to create a new course
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="title"
                >
                  Course Title*
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Enter course title"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 shadow-sm"
                  required
                  value={data.title}
                  onChange={handleOnChange}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="courseCode"
                >
                  Course Code*
                </label>
                <input
                  type="text"
                  id="courseCode"
                  name="courseCode"
                  placeholder="e.g., CS101"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 shadow-sm"
                  required
                  value={data.courseCode}
                  onChange={handleOnChange}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="department"
                >
                  Department*
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  placeholder="e.g., Computer Science"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 shadow-sm"
                  required
                  value={data.department}
                  onChange={handleOnChange}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="semester"
                >
                  Semester*
                </label>
                <input
                  type="number"
                  id="semester"
                  name="semester"
                  placeholder="e.g., 1"
                  min="1"
                  max="8"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 shadow-sm"
                  required
                  value={data.semester}
                  onChange={handleOnChange}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="startDate"
                >
                  Start Date*
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 shadow-sm"
                  required
                  value={data.startDate}
                  onChange={handleOnChange}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="endDate"
                >
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 shadow-sm"
                  value={data.endDate}
                  onChange={handleOnChange}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="credits"
                >
                  Credits
                </label>
                <input
                  type="number"
                  id="credits"
                  name="credits"
                  placeholder="e.g., 3"
                  min="1"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 shadow-sm"
                  value={data.credits}
                  onChange={handleOnChange}
                />
              </div>

              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="visibility"
                  name="visibility"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={data.visibility}
                  onChange={handleOnChange}
                />
                <label
                  htmlFor="visibility"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Make course visible to students
                </label>
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="description"
              >
                Course Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                placeholder="Enter course description"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 shadow-sm"
                value={data.description}
                onChange={handleOnChange}
              ></textarea>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="syllabus"
              >
                Syllabus URL
              </label>
              <input
                type="text"
                id="syllabus"
                name="syllabus"
                placeholder="Enter syllabus URL or description"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 shadow-sm"
                value={data.syllabus}
                onChange={handleOnChange}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium transition duration-200 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-white shadow"
                onClick={() => navigate('/faculty/courses')}
              >
                Cancel
              </motion.button>
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium transition duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white shadow"
              >
                Create Course
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CreateCourse;