import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  HiOutlineAcademicCap, 
  HiOutlineCalendar, 
  HiOutlineUserGroup, 
  HiOutlineBookOpen,
  HiOutlineDocumentText,
  HiOutlineClock,
  HiOutlineChevronLeft,
  HiOutlineInformationCircle,
  HiOutlineClipboardList,
  HiOutlineUser,
  HiOutlineDownload,
  HiOutlineMail
} from "react-icons/hi";
import toast from "react-hot-toast";
import axios from "axios";

const ViewCourse = () => {

  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);
    // Add this state to your component
const [assignments, setAssignments] = useState([]);
const [assignmentsLoading, setAssignmentsLoading] = useState(false);

// Add this function to fetch assignments
const fetchAssignments = async () => {
  if (activeTab !== "assignments") return;
  
  setAssignmentsLoading(true);
  try {
    const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/assignments/${courseId}`;
    const response = await axios.get(URL, {
      headers: { 'authorization': `Bearer ${token}` },
      withCredentials: true
    });

    if (response.data.status === "success") {
      setAssignments(response.data.data);
    }
  } catch (error) {
    toast.error("Failed to fetch assignments. Please try again.");
    console.error("Error fetching assignments:", error);
  } finally {
    setAssignmentsLoading(false);
  }
};

// Add this useEffect to trigger assignment fetching when tab changes
useEffect(() => {
  if (activeTab === "assignments") {
    fetchAssignments();
  }
}, [activeTab]);

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
      navigate("/student/courses");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-full bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-full bg-gray-50 flex justify-center items-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm max-w-md">
          <HiOutlineInformationCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Course not found</h3>
          <p className="mt-1 text-gray-500">
            The course you`re looking for doesn`t exist or you don`t have access to it.
          </p>
          <button
            onClick={() => navigate("/student/courses")}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 inline-flex items-center"
          >
            <HiOutlineChevronLeft className="mr-1 h-4 w-4" />
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Back Navigation */}
        <button
          onClick={() => navigate("/student/courses")}
          className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 font-medium focus:outline-none"
        >
          <HiOutlineChevronLeft className="mr-1 h-5 w-5" />
          Back to All Courses
        </button>

        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-indigo-100 rounded-full p-3 mr-4">
                <HiOutlineAcademicCap className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-gray-900 mr-3">{course.title}</h1>
                  <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full px-3 py-1">
                    {course.courseCode}
                  </span>
                </div>
                <p className="text-gray-600">{course.department} • Semester {course.semester}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="bg-gray-50 px-3 py-2 rounded-lg flex items-center">
                <HiOutlineUserGroup className="mr-2 h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {course.studentsEnrolled?.length || 0} Students
                </span>
              </div>
              <div className="bg-gray-50 px-3 py-2 rounded-lg flex items-center">
                <HiOutlineBookOpen className="mr-2 h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {course.credits} Credits
                </span>
              </div>
              <div className="bg-gray-50 px-3 py-2 rounded-lg flex items-center">
                <HiOutlineCalendar className="mr-2 h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {formatDate(course.startDate)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6 overflow-x-auto">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-4 font-medium text-sm border-b-2 whitespace-nowrap ${
                  activeTab === "overview"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("assignments")}
                className={`px-4 py-4 font-medium text-sm border-b-2 whitespace-nowrap ${
                  activeTab === "assignments"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Assignments
              </button>
              <button
                onClick={() => setActiveTab("resources")}
                className={`px-4 py-4 font-medium text-sm border-b-2 whitespace-nowrap ${
                  activeTab === "resources"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Resources
              </button>
              <button
                onClick={() => setActiveTab("faculty")}
                className={`px-4 py-4 font-medium text-sm border-b-2 whitespace-nowrap ${
                  activeTab === "faculty"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Faculty
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-medium text-gray-900 mb-4">Course Overview</h2>
              <div className="prose max-w-none text-gray-600">
                <p className="mb-6">{course.description || "No description available for this course."}</p>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Course Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <HiOutlineCalendar className="mt-1 mr-3 h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-sm text-gray-700">Start Date</p>
                        <p className="text-gray-600">{formatDate(course.startDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <HiOutlineCalendar className="mt-1 mr-3 h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-sm text-gray-700">End Date</p>
                        <p className="text-gray-600">
                          {course.endDate ? formatDate(course.endDate) : "Not specified"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <HiOutlineClock className="mt-1 mr-3 h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-sm text-gray-700">Credits</p>
                        <p className="text-gray-600">{course.credits}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <HiOutlineDocumentText className="mt-1 mr-3 h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-sm text-gray-700">Department</p>
                        <p className="text-gray-600">{course.department}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {course.syllabus && (
                  <div className="mb-6">
                    <h3 className="text-md font-medium text-gray-900 mb-3">Syllabus</h3>
                    <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                      <div className="flex items-center">
                        <HiOutlineDocumentText className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="text-gray-700">Course Syllabus</span>
                      </div>
                      <a 
                        href={course.syllabus} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 flex items-center text-sm font-medium"
                      >
                        <HiOutlineDownload className="h-4 w-4 mr-1" />
                        View
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

{activeTab === "assignments" && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-lg font-medium text-gray-900">Assignments</h2>
    </div>
    
    {assignmentsLoading ? (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    ) : assignments.length > 0 ? (
      <div className="space-y-4">
        {assignments.map((assignment) => (
          <div key={assignment._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-start mb-2 md:mb-0">
                <div className="bg-indigo-100 p-2 rounded-md mr-3">
                  <HiOutlineClipboardList className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                  <p className="text-sm text-gray-500">Due: {formatDate(assignment.dueDate)}</p>
                </div>
              </div>
              <button
                onClick={() => navigate(`/student/assignment/${assignment._id}`)}
                className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 text-sm font-medium flex items-center"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <HiOutlineClipboardList className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No Assignments Yet</h3>
        <p className="mt-1 text-gray-500">
          No assignments have been added to this course yet.
        </p>
      </div>
    )}
  </motion.div>
)}

          {activeTab === "resources" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-medium text-gray-900 mb-6">Course Resources</h2>
              
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <HiOutlineDocumentText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No Resources Yet</h3>
                <p className="mt-1 text-gray-500">
                  No resources have been added to this course yet.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === "faculty" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-medium text-gray-900 mb-6">Faculty Information</h2>
              
              {course.faculty ? (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-indigo-100 p-3 rounded-full mr-4">
                      <HiOutlineUser className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg text-gray-900">
                        {course.faculty.name || "Faculty Name"}
                      </h3>
                      <p className="text-gray-600">{course.faculty.email || "faculty@example.com"}</p>
                      <p className="text-gray-500 text-sm mt-1">
                        {course.faculty.department || course.department}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-2">Contact Information</h4>
                    <div className="flex items-center text-gray-600">
                      <HiOutlineMail className="h-5 w-5 mr-2" />
                      <a href={`mailto:${course.faculty.email || "faculty@example.com"}`} className="text-indigo-600 hover:text-indigo-800">
                        {course.faculty.email || "faculty@example.com"}
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <HiOutlineUser className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Faculty Information Not Available</h3>
                  <p className="mt-1 text-gray-500">
                    Faculty details for this course are not available at the moment.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ViewCourse;