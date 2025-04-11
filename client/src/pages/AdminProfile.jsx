import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  HiOutlineUser, 
  HiOutlineMail, 
  HiPencil, 
  HiOutlineLogout,
  HiOutlineUserGroup,
  HiOutlineAcademicCap,
  HiOutlineClipboardCheck,
  HiOutlineChartSquareBar,
  HiOutlineUserAdd,
  HiOutlineUserRemove,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineSearch,
  HiOutlineUpload,
  HiOutlineDownload
} from "react-icons/hi";
import toast from "react-hot-toast";
import axios from "axios";
import Avatar from "../components/Avatar";
import ImageUploader from "../components/ImageUploader";
import Dashboard from "../components/Dashboard"; // Import the new Dashboard component

const AdminProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalCourses: 0,
    pendingApprovals: 0,
    activeEnrollments: 0
  });
  const [pendingFaculty, setPendingFaculty] = useState([]);
  const [allFaculty, setAllFaculty] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profilePic: null
  });
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  // Fetch admin data and system stats
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/users/me`;
        const response = await axios.get(URL, {
          headers: { 'authorization': `Bearer ${token}` },
          withCredentials: true
        });
        
        if (response.data.status === "success") {
          setUser(response.data.data.user);
          setFormData({
            name: response.data.data.user.name,
            email: response.data.data.user.email,
            profilePic: null
          });
        }
      } catch (error) {
        toast.error("Failed to load admin profile");
        console.error("Profile fetch error:", error);
      }
    };
    
    const fetchSystemStats = async () => {
      try {
        const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/admin/stats`;
        const response = await axios.get(URL, {
          headers: { 'authorization': `Bearer ${token}` },
          withCredentials: true
        });
        if (response.data.status === "success") {
          setStats(response.data.data);
        }
      } catch (error) {
        toast.error("Failed to load system statistics");
        console.error("Stats fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchPendingFaculty = async () => {
      try {
        const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/admin/unapproved-faculty`;
        const response = await axios.get(URL, {
          headers: { 'authorization': `Bearer ${token}` },
          withCredentials: true
        });
        
        if (response.data.status === "success") {
          setPendingFaculty(response.data.data.faculty);
        }
      } catch (error) {
        console.error("Pending faculty fetch error:", error);
      }
    };
    
    const fetchAllFaculty = async () => {
      try {
        const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/admin/all-faculty`;
        const response = await axios.get(URL, {
          headers: { 'authorization': `Bearer ${token}` },
          withCredentials: true
        });
        // console.info(response.data.data.faculty);
        
        if (response.data.status === "success") {
          setAllFaculty(response.data.data.faculty);
        }
      } catch (error) {
        console.error("All faculty fetch error:", error);
      }
    };
    
    fetchAdminData();
    fetchSystemStats();
    fetchPendingFaculty();
    fetchAllFaculty();
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
      
      const response = await axios.patch(URL, formDataToSend, {
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

  const handleFacultyAction = async (facultyId, action) => {
    try {
        var URL;
        var response;
        if(action=== 'approve'){
            URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/admin/approve-faculty/${facultyId}`;
             response = await axios.post(URL, {}, {
              headers: { 'authorization': `Bearer ${token}` },
              withCredentials: true
            });
        }else if(action === 'remove'){
            URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/admin/delete-faculty/${facultyId}`;
             response = await axios.delete(URL, {}, {
              headers: { 'authorization': `Bearer ${token}` },
              withCredentials: true
            });
        }
      
      if (response.data.status === "success") {
        toast.success(`Faculty ${action === 'approve' ? 'approved' : 'removed'} successfully!`);
        
        // Update the faculty lists
        if (action === 'approve') {
          setPendingFaculty(prevFaculty => prevFaculty.filter(faculty => faculty._id !== facultyId));
          // Refresh all faculty list
          const fetchAllFaculty = async () => {
            try {
              const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/admin/all-faculty`;
              const response = await axios.get(URL, {
                headers: { 'authorization': `Bearer ${token}` },
                withCredentials: true
              });
              
              if (response.data.status === "success") {
                setAllFaculty(response.data.data.faculty);
              }
            } catch (error) {
              console.error("All faculty fetch error:", error);
            }
          };
          fetchAllFaculty();
        } else if (action === 'remove') {
          setAllFaculty(prevFaculty => prevFaculty.filter(faculty => faculty._id !== facultyId));
        }
        
        // Update stats
        const fetchSystemStats = async () => {
          try {
            const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/admin/stats`;
            const response = await axios.get(URL, {
              headers: { 'authorization': `Bearer ${token}` },
              withCredentials: true
            });
            
            if (response.data.status === "success") {
              setStats(response.data.stats);
            }
          } catch (error) {
            console.error("Stats fetch error:", error);
          }
        };
        fetchSystemStats();
      }
    } catch (error) {
      toast.error(`Failed to ${action} faculty member`);
      console.error(`Faculty ${action} error:`, error);
    }
  };
  
  const handleImportStudents = async (e) => {
    e.preventDefault();
    
    if (!importFile) {
      toast.error("Please select a file to import");
      return;
    }
    
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/users/importStudents`;
      
      const formDataToSend = new FormData();
      formDataToSend.append('file', importFile);
      
      const response = await axios.post(URL, formDataToSend, {
        headers: { 
          'authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      
      
      if (response.data.status === "success") {
        toast.success(`${response.data.results} students imported successfully!`);
        setShowImportModal(false);
        setImportFile(null);
        
        // Update stats
        const fetchSystemStats = async () => {
          try {
            const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/admin/stats`;
            const response = await axios.get(URL, {
              headers: { 'authorization': `Bearer ${token}` },
              withCredentials: true
            });
            
            if (response.data.status === "success") {
              setStats(response.data.data);
            }
          } catch (error) {
            console.error("Stats fetch error:", error);
          }
        };
        fetchSystemStats();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to import students");
      console.error("Import students error:", error);
    }
  };

  const handleDownloadTemplate = () => {
    // In a real app, this would download a CSV template
    toast.success("Template downloaded successfully!");
  };
  
  const filteredFaculty = allFaculty.filter(faculty => 
    faculty.userId.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faculty.userId.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faculty.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-full bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-full bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-8 sm:px-10 sm:py-12">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="relative mb-6 sm:mb-0 sm:mr-8">
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
                  <HiOutlineUser className="w-5 h-5 mr-2" />
                  <span>System Administrator</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start mt-2 text-white/80">
                  <HiOutlineMail className="w-5 h-5 mr-2" />
                  <span>{user?.email}</span>
                </div>
              </div>
              <div className="ml-auto mt-6 sm:mt-0 flex space-x-3">
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center px-4 py-2 bg-white text-gray-800 rounded-lg shadow-md font-medium hover:bg-gray-50"
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
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition duration-200"
                >
                  <HiOutlineLogout className="w-5 h-5 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto py-4 px-6">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`whitespace-nowrap px-4 py-2 font-medium text-sm rounded-lg mr-4 ${
                  activeTab === "dashboard" 
                    ? "bg-indigo-100 text-indigo-700" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center">
                  <HiOutlineChartSquareBar className="w-5 h-5 mr-2" />
                  Dashboard
                </div>
              </button>
              <button
                onClick={() => setActiveTab("facultyApproval")}
                className={`whitespace-nowrap px-4 py-2 font-medium text-sm rounded-lg mr-4 flex items-center ${
                  activeTab === "facultyApproval" 
                    ? "bg-indigo-100 text-indigo-700" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center">
                  <HiOutlineClipboardCheck className="w-5 h-5 mr-2" />
                  Faculty Approval
                  {pendingFaculty.length > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {pendingFaculty.length}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab("manageFaculty")}
                className={`whitespace-nowrap px-4 py-2 font-medium text-sm rounded-lg mr-4 ${
                  activeTab === "manageFaculty" 
                    ? "bg-indigo-100 text-indigo-700" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center">
                  <HiOutlineAcademicCap className="w-5 h-5 mr-2" />
                  Manage Faculty
                </div>
              </button>
              <button
                onClick={() => setActiveTab("manageStudents")}
                className={`whitespace-nowrap px-4 py-2 font-medium text-sm rounded-lg mr-4 ${
                  activeTab === "manageStudents" 
                    ? "bg-indigo-100 text-indigo-700" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center">
                  <HiOutlineUserGroup className="w-5 h-5 mr-2" />
                  Manage Students
                </div>
              </button>
            </nav>
          </div>
          
          {/* Profile Content based on active tab */}
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
              <>
                {/* Dashboard Tab - Now using the separate Dashboard component */}
                {activeTab === "dashboard" && (
                  <Dashboard stats={stats} setShowImportModal={setShowImportModal} />
                )}

                {/* Faculty Approval Tab */}
                {activeTab === "facultyApproval" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                        <HiOutlineClipboardCheck className="w-6 h-6 mr-2 text-indigo-600" />
                        Pending Faculty Approvals
                      </h2>
                    </div>
                    
                    {pendingFaculty.length === 0 ? (
                      <div className="bg-gray-50 p-8 text-center rounded-lg">
                        <HiOutlineCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No Pending Approvals</h3>
                        <p className="text-gray-500">All faculty members have been reviewed</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Faculty Member
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Department
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Specialization
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Application Date
                              </th>
                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {pendingFaculty.map((faculty) => (
                              <tr key={faculty._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                      <Avatar 
                                        width={40} 
                                        height={40} 
                                        name={faculty.userId.name} 
                                        imageUrl={faculty.userId.profilePic}
                                        className="rounded-full"
                                      />
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{faculty.userId.name}</div>
                                      <div className="text-sm text-gray-500">{faculty.userId.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{faculty.department || 'Not specified'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{faculty.specialization || 'Not specified'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">
                                    {new Date(faculty.userId.createdAt).toLocaleDateString()}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex justify-end space-x-2">
                                    <button
                                      onClick={() => handleFacultyAction(faculty._id, 'approve')}
                                      className="bg-green-100 text-green-700 px-3 py-1 rounded-md hover:bg-green-200 transition duration-200"
                                    >
                                      <div className="flex items-center">
                                        <HiOutlineCheckCircle className="w-4 h-4 mr-1" />
                                        Approve
                                      </div>
                                    </button>
                                    <button
                                      onClick={() => handleFacultyAction(faculty._id, 'reject')}
                                      className="bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 transition duration-200"
                                    >
                                      <div className="flex items-center">
                                        <HiOutlineExclamationCircle className="w-4 h-4 mr-1" />
                                        Reject
                                      </div>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Manage Faculty Tab */}
                {activeTab === "manageFaculty" && (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-4 md:mb-0">
                        <HiOutlineAcademicCap className="w-6 h-6 mr-2 text-indigo-600" />
                        Manage Faculty
                      </h2>
                      <div className="w-full md:w-64">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search faculty..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <HiOutlineSearch className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {filteredFaculty.length === 0 ? (
                      <div className="bg-gray-50 p-8 text-center rounded-lg">
                        <HiOutlineExclamationCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No Faculty Found</h3>
                        <p className="text-gray-500">No faculty members match your search criteria</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Faculty Member
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Department
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Specialization
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Joined
                              </th>
                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {filteredFaculty.map((faculty) => (
                              <tr key={faculty._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                      <Avatar 
                                        width={40} 
                                        height={40} 
                                        name={faculty.userId.name} 
                                        imageUrl={faculty.userId.profilePic}
                                        className="rounded-full"
                                      />
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{faculty.userId.name}</div>
                                      <div className="text-sm text-gray-500">{faculty.userId.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{faculty.department || 'Not specified'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{faculty.specialization || 'Not specified'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">
                                    {new Date(faculty.userId.createdAt).toLocaleDateString()}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button
                                    onClick={() => handleFacultyAction(faculty._id, 'remove')}
                                    className="bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 transition duration-200"
                                  >
                                    <div className="flex items-center">
                                      <HiOutlineUserRemove className="w-4 h-4 mr-1" />
                                      Remove
                                    </div>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Manage Students Tab */}
                {activeTab === "manageStudents" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                        <HiOutlineUserGroup className="w-6 h-6 mr-2 text-indigo-600" />
                        Manage Students
                      </h2>
                      <button
                        onClick={() => setShowImportModal(true)}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition duration-200"
                      >
                        <HiOutlineUserAdd className="w-5 h-5 mr-2" />
                        Import Students
                      </button>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Students</h3>
                          <p className="text-3xl font-bold text-indigo-600">{stats.totalStudents}</p>
                          <p className="text-sm text-gray-500 mt-1">Currently enrolled students</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Active Enrollments</h3>
                          {/* <p className="text-3xl font-bold text-indigo-600">{stats.activeEnrollments}</p> */}
                          <p className="text-sm text-gray-500 mt-1">Course enrollments this term</p>
                        </div>
                      </div>
                      
                      <div className="mt-6 text-center">
                        <p className="text-gray-600">Use the import functionality to add students in bulk.</p>
                        <p className="text-gray-600 mt-2">
                          Please ensure your CSV file follows the required format.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">Import Students</h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleImportStudents} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CSV File
                </label>
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <HiOutlineUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={(e) => setImportFile(e.target.files[0])}
                          accept=".csv"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      CSV up to 10MB
                    </p>
                    {importFile && (
                      <p className="text-sm text-indigo-600">
                        Selected file: {importFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <HiOutlineDownload className="mr-2 h-5 w-5" />
                  Download Template
                </button>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                >
                  Import
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;