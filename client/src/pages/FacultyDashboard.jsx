import { useState, useEffect } from 'react';
import { Calendar, Book, Users, Settings, Plus, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const FacultyDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.currentUser);
  
  useEffect(() => {
    fetchCourses();
  }, []);
  
  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/faculty/courses`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        withCredentials: true
      });
      console.log(response.data.data);
      
      if (response.data.status === "success") {
        setCourses(response.data.data);
      } else {
        toast.error("Failed to fetch courses");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching courses");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateCourse = () => {
    navigate('/create-course');
  };
  
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="min-h-full bg-gray-50">
      {/* Header */}
      
      {/* Main content */}
      <div className="py-10">
        <header className='flex mx-auto justify-between items-center px-40'>
          <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Faculty Dashboard</h1>
          </div>
          <div >
            <button
            type="button"
            onClick={handleCreateCourse}
            className="flex items-center max-w-7xl  px-4 sm:px-6 lg:px-8 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
            <Plus className="h-5 w-5 mr-2" />
            Create Course
            </button>
        </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Dashboard Content */}
            <div className="mt-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-64 bg-white shadow rounded-lg p-4">
                  <nav className="mt-5">
                    <div className="px-2 space-y-1">
                      <Link to="/dashboard" className="bg-indigo-50 text-indigo-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                        <Book className="text-indigo-600 mr-3 h-6 w-6" />
                        My Courses
                      </Link>
                      <Link to="/calendar" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                        <Calendar className="text-gray-400 group-hover:text-gray-500 mr-3 h-6 w-6" />
                        Calendar
                      </Link>
                      <Link to="/students" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                        <Users className="text-gray-400 group-hover:text-gray-500 mr-3 h-6 w-6" />
                        Students
                      </Link>
                      <Link to="/settings" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                        <Settings className="text-gray-400 group-hover:text-gray-500 mr-3 h-6 w-6" />
                        Settings
                      </Link>
                    </div>
                  </nav>
                </div>
                
                {/* Main Content */}
                <div className="flex-1">
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                      <div className="flex flex-col sm:flex-row justify-between">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          My Courses
                        </h3>
                        <div className="mt-3 sm:mt-0 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            placeholder="Search courses"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {isLoading ? (
                      <div className="text-center py-12">
                        <div className="text-indigo-600 text-lg">Loading courses...</div>
                      </div>
                    ) : filteredCourses.length > 0 ? (
                      <ul className="divide-y divide-gray-200">
                        {filteredCourses.map((course) => (
                          <li key={course._id} className="hover:bg-gray-50">
                            <Link to={`/courses/${course._id}/edit`} className="block">
                              <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                      <Book className="h-6 w-6 text-indigo-600" />
                                    </div>
                                    <div className="ml-4">
                                      <p className="text-sm font-medium text-indigo-600">{course.title}</p>
                                      <p className="text-xs text-gray-500">{course.courseCode || 'No course code'}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="flex space-x-2">
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        {course.status || 'Active'}
                                      </span>
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        {course.studentsEnrolled?.length || 0} Students
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-12">
                        <Book className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No courses found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {searchTerm ? 'Try a different search term' : 'Get started by creating a new course.'}
                        </p>
                        <div className="mt-6">
                          <button
                            type="button"
                            onClick={handleCreateCourse}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            <Plus className="h-5 w-5 mr-2" />
                            Create Course
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Stats Section */}
                  <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                            <Book className="h-6 w-6 text-indigo-600" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">Total Courses</dt>
                              <dd>
                                <div className="text-lg font-medium text-gray-900">{courses.length}</div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                            <Users className="h-6 w-6 text-indigo-600" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                              <dd>
                                <div className="text-lg font-medium text-gray-900">
                                  {courses.reduce((acc, course) => acc + (course.studentsEnrolled?.length || 0), 0)}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                            <Calendar className="h-6 w-6 text-indigo-600" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">Upcoming Sessions</dt>
                              <dd>
                                <div className="text-lg font-medium text-gray-900">5</div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FacultyDashboard;