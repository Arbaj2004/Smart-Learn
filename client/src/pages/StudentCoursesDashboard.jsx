import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineAcademicCap, HiOutlineCalendar, HiOutlineUserGroup, HiOutlineBookOpen, HiOutlineChevronRight, HiOutlineViewGrid, HiOutlineClipboardList } from "react-icons/hi";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";

const StudentCoursesDashboard = () => { 
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [semester, setSemester] = useState("");
  const [department, setDepartment] = useState("");
  const [viewMode, setViewMode] = useState("enrolled"); // "enrolled" or "all"
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchEnrolledCourses();
    fetchAllCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    setLoading(true);
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/students/enrolled-courses`;
      const response = await axios.get(URL, {
        headers: { 'authorization': `Bearer ${token}` },
        withCredentials: true
      });

      if (response.data.status === "success") {
        setEnrolledCourses(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch enrolled courses. Please try again.");
      console.error("Error fetching enrolled courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCourses = async () => {
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/courses`;
      const response = await axios.get(URL, {
        headers: { 'authorization': `Bearer ${token}` },
        withCredentials: true
      });

      if (response.data.status === "success") {
        setAllCourses(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching all courses:", error);
      // Don't show toast for this as it's secondary data
    }
  };

  const filterCourses = () => {
    // Determine which course list to filter based on view mode
    const coursesToFilter = viewMode === "enrolled" ? enrolledCourses : allCourses;
    let filtered = [...coursesToFilter];
    
    if (semester) {
      filtered = filtered.filter(course => course.semester.toString() === semester);
    }
    
    if (department) {
      filtered = filtered.filter(course => 
        course.department.toLowerCase().includes(department.toLowerCase())
      );
    }
    
    return filtered;
  };

  const handleEnroll = async (courseId) => {
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/students/enroll-course/${courseId}`;
      const response = await axios.post(URL, {}, {
        headers: { 'authorization': `Bearer ${token}` },
        withCredentials: true
      });

      if (response.data.status === "success") {
        toast.success("Successfully enrolled in course!");
        // Refresh both course lists
        fetchEnrolledCourses();
        fetchAllCourses();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to enroll in course.");
      console.error("Enrollment error:", error);
    }
  };

  // Check if a course is already enrolled
  const isEnrolled = (courseId) => {
    return enrolledCourses.some(course => course._id === courseId);
  };

  return (
    <div className="min-h-full bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">SmartLearn Dashboard</h1>
          <p className="mt-2 text-gray-600">
            {viewMode === "enrolled" 
              ? "Manage your enrolled courses" 
              : "Browse and enroll in available courses"}
          </p>
        </div>

        {/* View Toggle */}
        <div className="mb-6 flex items-center">
          <span className="mr-4 text-sm font-medium text-gray-700">View:</span>
          <div className="bg-white rounded-lg shadow-sm inline-flex">
            <button
              onClick={() => setViewMode("enrolled")}
              className={`flex items-center px-4 py-2 rounded-l-lg ${
                viewMode === "enrolled" 
                  ? "bg-indigo-600 text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <HiOutlineClipboardList className="mr-2 h-5 w-5" />
              My Courses
            </button>
            <button
              onClick={() => setViewMode("all")}
              className={`flex items-center px-4 py-2 rounded-r-lg ${
                viewMode === "all" 
                  ? "bg-indigo-600 text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <HiOutlineViewGrid className="mr-2 h-5 w-5" />
              All Courses
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">
              Semester
            </label>
            <select
              id="semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <input
              type="text"
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Filter by department"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSemester("");
                setDepartment("");
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Courses Grid */}
        {loading && viewMode === "enrolled" ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filterCourses().length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <HiOutlineAcademicCap className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No courses found</h3>
            <p className="mt-1 text-gray-500">
              {viewMode === "enrolled" 
                ? enrolledCourses.length === 0 
                  ? "You are not enrolled in any courses yet." 
                  : "No enrolled courses match your current filters."
                : allCourses.length === 0
                  ? "There are no available courses at the moment."
                  : "No available courses match your current filters."
              }
            </p>
            {viewMode === "enrolled" && enrolledCourses.length === 0 && (
              <button
                onClick={() => setViewMode("all")}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Browse Available Courses
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterCourses().map((course) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-indigo-100 rounded-full p-2 mr-3">
                        <HiOutlineAcademicCap className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{course.courseCode}</h3>
                        <p className="text-sm text-gray-500">{course.department}</p>
                      </div>
                    </div>
                    <div className="bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full px-2 py-1">
                      Sem {course.semester}
                    </div>
                  </div>
                  <h2 className="font-bold text-xl mb-2 text-gray-900">{course.title}</h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description || "No description provided"}
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <HiOutlineCalendar className="mr-2 h-4 w-4" />
                      <span>
                        {new Date(course.startDate).toLocaleDateString()} 
                        {course.endDate && ` - ${new Date(course.endDate).toLocaleDateString()}`}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <HiOutlineUserGroup className="mr-2 h-4 w-4" />
                      <span>{course.studentsEnrolled?.length || 0} students enrolled</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <HiOutlineBookOpen className="mr-2 h-4 w-4" />
                      <span>{course.credits} credits</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    {isEnrolled(course._id) ? (
                      <button
                        onClick={() => navigate(`/courses/${course._id}`)}
                        className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium flex items-center"
                      >
                        View Course
                        <HiOutlineChevronRight className="ml-1 h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEnroll(course._id)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium"
                      >
                        Enroll Now
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default StudentCoursesDashboard;