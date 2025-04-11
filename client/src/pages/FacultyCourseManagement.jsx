import { useState, useEffect } from 'react';
import { Book, Clock, ChevronRight, Filter, Search, Download, Check, X } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const ManageAssignments = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [course, setCourse] = useState(null);

  useEffect(() => {
    fetchCourseData();
    fetchAssignments();
  }, [courseId]);

  useEffect(() => {
    if (selectedAssignment) {
      fetchSubmissions(selectedAssignment._id);
    }
  }, [selectedAssignment]);

  const fetchCourseData = async () => {
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/courses/${courseId}`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        withCredentials: true
      });
      if (response.data.status === "success") {
        setCourse(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch course details");
    }
  };

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/assignments/${courseId}`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        withCredentials: true
      });
      
      console.log(response.data.data);
      if (response.data.status === "success") {
        setAssignments(response.data.data);
        // If there are assignments, select the first one by default
        if (response.data.data.length > 0) {
          setSelectedAssignment(response.data.data.assignments[0]);
        }
      } else {
        toast.error("Failed to fetch assignments");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching assignments");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async (assignmentId) => {
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/assignments/submissions/${assignmentId}`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        withCredentials: true
      });
      
      if (response.data.status === "success") {
        setSubmissions(response.data.data);
      } else {
        toast.error("Failed to fetch submissions");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching submissions");
    }
  };

  const handleAssignmentSelect = (assignment) => {
    setSelectedAssignment(assignment);
  };

  const handleGradeSubmission = async (submissionId, grade) => {
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/assignments/grade/${submissionId}`;
      const response = await axios.patch(URL, 
        { grade, status: "Graded" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          withCredentials: true
        }
      );
      
      if (response.data.status === "success") {
        toast.success("Submission graded successfully");
        // Update the submissions list
        const updatedSubmissions = submissions.map(sub => 
          sub._id === submissionId ? { ...sub, grade, status: "Graded" } : sub
        );
        setSubmissions(updatedSubmissions);
      } else {
        toast.error("Failed to grade submission");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error grading submission");
    }
  };

  // Filter submissions based on search term and status
  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        submission._id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || submission.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-indigo-600">SmartLearn</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/dashboard" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Dashboard
                </Link>
                <Link to={`/courses/${courseId}`} className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Course Details
                </Link>
                <Link to={`/courses/${courseId}/assignments`} className="border-indigo-500 text-indigo-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Assignments
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  {course?.title || 'Course'} - Assignments
                </h2>
              </div>
              <div className="mt-4 flex md:mt-0 md:ml-4">
                <Link
                  to={`/assignment/${courseId}/new`}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create Assignment
                </Link>
              </div>
            </div>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="text-indigo-600 text-lg">Loading assignments...</div>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row mt-5">
                {/* Assignments List */}
                <div className="w-full lg:w-1/3 bg-white shadow overflow-hidden sm:rounded-md mb-5 lg:mb-0 lg:mr-5">
                  <div className="px-4 py-5 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Assignments
                    </h3>
                  </div>
                  <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                    {assignments.length > 0 ? (
                      assignments.map((assignment) => (
                        <li key={assignment._id}>
                          <button
                            onClick={() => handleAssignmentSelect(assignment)}
                            className={`w-full text-left block hover:bg-gray-50 px-4 py-4 sm:px-6 ${selectedAssignment?._id === assignment._id ? 'bg-indigo-50' : ''}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="sm:flex sm:justify-between w-full">
                                <div className="mb-2 sm:mb-0">
                                  <p className={`text-sm font-medium ${selectedAssignment?._id === assignment._id ? 'text-indigo-600' : 'text-indigo-600'}`}>
                                    {assignment.title}
                                  </p>
                                  <div className="flex items-center text-sm text-gray-500 mt-1">
                                    <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                    <p>Due: {formatDate(assignment.dueDate)} at {assignment.dueTime}</p>
                                  </div>
                                </div>
                                <div className="sm:ml-2 flex-shrink-0 flex">
                                  <ChevronRight className={`h-5 w-5 text-gray-400 ${selectedAssignment?._id === assignment._id ? 'transform rotate-90' : ''}`} />
                                </div>
                              </div>
                            </div>
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-5 text-center text-sm text-gray-500">
                        No assignments created for this course yet.
                      </li>
                    )}
                  </ul>
                </div>
                
                {/* Submissions */}
                <div className="flex-1 bg-white shadow sm:rounded-md">
                  {selectedAssignment ? (
                    <>
                      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                          <h3 className="text-lg leading-6 font-medium text-gray-900">
                            {selectedAssignment.title}: Submissions
                          </h3>
                          <p className="mt-2 sm:mt-0 text-sm text-gray-500">
                            Max Marks: {selectedAssignment.maxMarks}
                          </p>
                        </div>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                          Due: {formatDate(selectedAssignment.dueDate)} at {selectedAssignment.dueTime}
                        </p>
                      </div>
                      
                      <div className="px-4 py-3 border-b border-gray-200 sm:px-6 bg-gray-50">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="relative rounded-md shadow-sm flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                              placeholder="Search by student name"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                          <div className="relative inline-block">
                            <select
                              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                              value={filterStatus}
                              onChange={(e) => setFilterStatus(e.target.value)}
                            >
                              <option value="all">All Statuses</option>
                              <option value="Pending">Pending</option>
                              <option value="Submitted">Submitted</option>
                              <option value="Graded">Graded</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                              <Filter className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Student
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Submitted At
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Plagiarism Score
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Grade
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {filteredSubmissions.length > 0 ? (
                              filteredSubmissions.map((submission) => (
                                <tr key={submission._id}>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                        <span className="text-indigo-600 font-medium">
                                          {submission.userId?.name?.charAt(0) || 'S'}
                                        </span>
                                      </div>
                                      <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                          {submission.userId?.name || 'Student Name'}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          {submission.userId?.email || 'student@example.com'}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                      {submission.submittedAt ? formatDate(submission.submittedAt) : 'Not submitted'}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                      ${submission.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                        submission.status === 'Submitted' ? 'bg-blue-100 text-blue-800' : 
                                        'bg-green-100 text-green-800'}`}>
                                      {submission.status}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {submission.plagiarismScore || 0}%
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {submission.status === 'Graded' ? (
                                      <span className="text-sm text-gray-900">
                                        {submission.grade} / {selectedAssignment.maxMarks}
                                      </span>
                                    ) : (
                                      <input
                                        type="number"
                                        min="0"
                                        max={selectedAssignment.maxMarks}
                                        className="w-16 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                                        placeholder="0"
                                        value={submission.grade || ''}
                                        onChange={(e) => {
                                          const updatedSubmissions = submissions.map(sub => 
                                            sub._id === submission._id ? 
                                            { ...sub, grade: Math.min(parseInt(e.target.value) || 0, selectedAssignment.maxMarks) } : 
                                            sub
                                          );
                                          setSubmissions(updatedSubmissions);
                                        }}
                                      />
                                    )}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                      <a 
                                        href={submission.fileUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 hover:text-indigo-900"
                                      >
                                        <Download className="h-5 w-5" />
                                      </a>
                                      {submission.status !== 'Graded' && (
                                        <button
                                          onClick={() => handleGradeSubmission(submission._id, submission.grade)}
                                          className="text-green-600 hover:text-green-900"
                                        >
                                          <Check className="h-5 w-5" />
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                  {searchTerm || filterStatus !== 'all' ? 
                                    'No submissions match your search or filter' : 
                                    'No submissions received for this assignment yet'}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <Book className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No Assignment Selected</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Select an assignment from the list to view submissions.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageAssignments;