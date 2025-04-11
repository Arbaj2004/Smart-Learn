import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineAcademicCap, HiOutlineUser, HiOutlineMail, HiOutlineIdentification, HiOutlineOfficeBuilding, HiPencil, HiOutlineLogout } from "react-icons/hi";
import { FaGraduationCap } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import Avatar from "../components/Avatar";
import ImageUploader from "../components/ImageUploader";

const StudentProfile = () => {
  const [user, setUser] = useState(null);
  const [roler, setRoler] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    mis: "",
    profilePic: null
  });
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  // Fetch user data and enrolled courses
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/users/me`;
        const response = await axios.get(URL, {
          headers: { 'authorization': `Bearer ${token}` },
          withCredentials: true
        });
        
        if (response.data.status === "success") {
          setUser(response.data.data.user);
          setRoler(response.data.data.roler);
          setFormData({
            name: response.data.data.user.name,
            email: response.data.data.user.email,
            department: response.data.data.user.department,
            mis: response.data.data.user.mis,
            profilePic: null
          });
        }
      } catch (error) {
        toast.error("Failed to load profile data");
        console.error("Profile fetch error:", error);
      }
    };
    
    const fetchEnrolledCourses = async () => {
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
        toast.error("Failed to load enrolled courses");
        console.error("Courses fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
    fetchEnrolledCourses();
  }, [token]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUploadSuccess = (url) => {
    setFormData(prev => ({
      ...prev,
      profilePic: url
    }));
  };
  

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/users/updateProfile`;
      
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      
      if (formData.profilePic) {
        formDataToSend.append('profilePic', formData.profilePic);
      }
      console.log(formData);
      const response = await axios.patch(URL, formData, {
        headers: { 
          'authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      
      if (response.data.status === "success") {
        setUser(response.data.data.user);
        toast.success("Profile updated successfully!");
        setEditMode(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      console.error("Update error:", error);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success("Logged out successfully!");
    navigate('/signin');
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-full bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-full bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-8 sm:px-10 sm:py-12">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="relative mb-6 sm:mb-0 sm:mr-8">
               {/* Using Avatar component instead of direct img */}
               <div className="flex items-center justify-center border-4 border-white rounded-full shadow-lg" style={{ width: '128px', height: '128px' }}>
                  <Avatar 
                    width={120} 
                    height={120} 
                    name={user?.name} 
                    imageUrl={user?.profilePic}
                    className="ring-transparent hover:ring-transparent"
                  />
                </div>
                {editMode && (
                  <div className="">
                    
                    <ImageUploader onUploadSuccess={handleUploadSuccess} />
                  </div>
                )}
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{user?.name}</h1>
                <div className="flex items-center justify-center sm:justify-start mt-2 text-white/80">
                  <HiOutlineAcademicCap className="w-5 h-5 mr-2" />
                  <span>{user?.role}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start mt-2 text-white/80">
                  <HiOutlineOfficeBuilding className="w-5 h-5 mr-2" />
                  <span>{roler?.department}</span>
                </div>
              </div>
              <div className="ml-auto mt-6 sm:mt-0">
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center px-4 py-2 bg-white text-indigo-600 rounded-lg shadow-md font-medium hover:bg-indigo-50"
                  >
                    <HiPencil className="w-5 h-5 mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={() => setEditMode(false)}
                    className="flex items-center px-4 py-2 bg-white text-gray-600 rounded-lg shadow-md font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Profile Content */}
          <div className="p-6 sm:p-8">
            {editMode ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div className="flex justify-end">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium transition duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Save Changes
                  </motion.button>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                {/* Student Information */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <HiOutlineUser className="w-5 h-5 mr-2 text-indigo-600" />
                    Student Information
                  </h2>
                  
                  <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <div className="flex items-center mt-1">
                        <HiOutlineMail className="w-5 h-5 text-gray-400 mr-2" />
                        <p className="text-gray-800">{user?.email}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">MIS Number</p>
                      <div className="flex items-center mt-1">
                        <HiOutlineIdentification className="w-5 h-5 text-gray-400 mr-2" />
                        <p className="text-gray-800">{roler?.mis}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <div className="flex items-center mt-1">
                        <HiOutlineOfficeBuilding className="w-5 h-5 text-gray-400 mr-2" />
                        <p className="text-gray-800">{roler?.department}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Account Status</p>
                      <div className="flex items-center mt-1">
                        <div className={`w-3 h-3 rounded-full ${user?.verifiedUser ? 'bg-green-500' : 'bg-yellow-500'} mr-2`}></div>
                        <p className="text-gray-800">{user?.verifiedUser ? 'Verified' : 'Unverified'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Enrolled Courses */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <FaGraduationCap className="w-5 h-5 mr-2 text-indigo-600" />
                    Enrolled Courses
                  </h2>
                  
                  {enrolledCourses.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <p className="text-gray-500">You are not enrolled in any courses yet.</p>
                      <button 
                        onClick={() => navigate('/courses')}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium transition duration-200 hover:bg-indigo-700"
                      >
                        Browse Courses
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {enrolledCourses.map((course) => (
                        <motion.div
                          key={course._id}
                          whileHover={{ y: -5 }}
                          className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="h-32 bg-gradient-to-r from-blue-400 to-indigo-500 relative">
                            {course.thumbnail && (
                              <img 
                                src={`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/uploads/${course.thumbnail}`} 
                                alt={course.title}
                                className="w-full h-full object-cover opacity-75"
                              />
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end">
                              <div className="p-4">
                                <span className="inline-block px-2 py-1 bg-indigo-600 text-xs text-white rounded">
                                  {course.category}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{course.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-3">{course.description}</p>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center text-sm text-gray-500">
                                <HiOutlineAcademicCap className="w-4 h-4 mr-1" />
                                <span>{course.faculty.name}</span>
                              </div>
                              <button
                                onClick={() => navigate(`/courses/${course._id}`)}
                                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                              >
                                View Course
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Logout Button */}
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition duration-200"
                  >
                    <HiOutlineLogout className="w-5 h-5 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentProfile;