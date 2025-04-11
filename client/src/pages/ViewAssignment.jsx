import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  HiOutlineCalendar, 
  HiOutlineClipboardList,
  HiOutlineDocumentText,
  HiOutlineChevronLeft,
  HiOutlineInformationCircle,
  HiOutlineUpload,
  HiOutlineDocument,
  HiOutlineTrash,
  HiOutlinePaperClip,
  HiOutlineExclamation
} from "react-icons/hi";
import toast from "react-hot-toast";
import axios from "axios";

const ViewAssignment = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState(null);
  const [submissionFile, setSubmissionFile] = useState(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  
  useEffect(() => {
    fetchAssignmentDetails();
    fetchSubmissionStatus();
  }, [assignmentId]);
  
  const fetchAssignmentDetails = async () => {
    setLoading(true);
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/assignments/assignment/${assignmentId}`;
      const response = await axios.get(URL, {
        headers: { 'authorization': `Bearer ${token}` },
        withCredentials: true
      });

      if (response.data.status === "success") {
        setAssignment(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch assignment details. Please try again.");
      console.error("Error fetching assignment:", error);
      navigate("/student/courses");
    } finally {
      setLoading(false);
    }
  };
  
  const fetchSubmissionStatus = async () => {
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/assignments/fetch-submission-details/${assignmentId}`;
      const response = await axios.get(URL, {
        headers: { 'authorization': `Bearer ${token}` },
        withCredentials: true
      });
      console.log(">>>",response.data.data);
      if (response.data.status === "success" && response.data.data) {
        setSubmission(response.data.data);
        setAlreadySubmitted(true);
      }
    } catch (error) {
      console.error("Error fetching submission status:", error);
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleFileChange = (e) => {
    setSubmissionFile(e.target.files[0]);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!submissionFile) {
      toast.error("Please select a file to submit");
      return;
    }
    
    setSubmitting(true);
    
    const formData = new FormData();
    formData.append('file', submissionFile);
    formData.append('assignmentId', assignmentId);
    formData.append('comment', comment);
    
    try {
      const uploadURL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/dropbox/upload`;
      const uploadResponse = await axios.post(uploadURL, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'authorization': `Bearer ${token}`
        }
      });
      
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/assignments/submit`;
      const response = await axios.post(URL, {
        assignmentId,
        fileUrl: uploadResponse.data.response.sharedLink,
        comment
      }, {
        headers: { 
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.status === "success") {
        toast.success("Assignment submitted successfully!");
        setSubmission(response.data.data);
        setAlreadySubmitted(true);
        setSubmissionFile(null);
        setComment("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit assignment. Please try again.");
      console.error("Error submitting assignment:", error);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDeleteSubmission = async () => {
    if (!window.confirm("Are you sure you want to delete your submission? You will need to submit again.")) {
      return;
    }
    
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/assignments/submission/${submission._id}`;
      const response = await axios.delete(URL, {
        headers: { 'authorization': `Bearer ${token}` },
        withCredentials: true
      });
      
      if (response.data.status === "success") {
        toast.success("Submission deleted successfully");
        setSubmission(null);
        setAlreadySubmitted(false);
      }
    } catch (error) {
      toast.error("Failed to delete submission. Please try again.");
      console.error("Error deleting submission:", error);
    }
  };
  
  const isSubmissionLate = () => {
    if (!assignment || !submission) return false;
    
    const dueDate = new Date(assignment.dueDate);
    const submittedDate = new Date(submission.submittedAt);
    
    return submittedDate > dueDate;
  };
  
  const isDeadlinePassed = () => {
    if (!assignment) return false;
    
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    
    return now > dueDate;
  };
  
  if (loading) {
    return (
      <div className="min-h-full bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (!assignment) {
    return (
      <div className="min-h-full bg-gray-50 flex justify-center items-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm max-w-md">
          <HiOutlineInformationCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Assignment not found</h3>
          <p className="mt-1 text-gray-500">
            The assignment you're looking for doesn't exist or you don't have access to it.
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
        className="max-w-4xl mx-auto"
      >
        {/* Back Navigation */}
        <button
          onClick={() => navigate(`/student/course/${assignment.course}`)}
          className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 font-medium focus:outline-none"
        >
          <HiOutlineChevronLeft className="mr-1 h-5 w-5" />
          Back to Course
        </button>
        
        {/* Assignment Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start">
            <div className="bg-indigo-100 rounded-full p-3 mr-4">
              <HiOutlineClipboardList className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{assignment.title}</h1>
              
              <div className="flex flex-wrap gap-3 mt-2">
                <div className="bg-gray-50 px-3 py-1 rounded-lg flex items-center">
                  <HiOutlineDocumentText className="mr-2 h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {assignment.courseCode || "Course Code"}
                  </span>
                </div>
                <div className="bg-gray-50 px-3 py-1 rounded-lg flex items-center">
                  <HiOutlineCalendar className="mr-2 h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Due: {formatDate(assignment.dueDate)}
                  </span>
                </div>
                
                {isDeadlinePassed() && !alreadySubmitted && (
                  <div className="bg-red-50 px-3 py-1 rounded-lg flex items-center">
                    <HiOutlineExclamation className="mr-2 h-5 w-5 text-red-500" />
                    <span className="text-sm font-medium text-red-700">
                      Deadline Passed
                    </span>
                  </div>
                )}
                
                {alreadySubmitted && isSubmissionLate() && (
                  <div className="bg-yellow-50 px-3 py-1 rounded-lg flex items-center">
                    <HiOutlineExclamation className="mr-2 h-5 w-5 text-yellow-500" />
                    <span className="text-sm font-medium text-yellow-700">
                      Submitted Late
                    </span>
                  </div>
                )}
                
                {alreadySubmitted && !isSubmissionLate() && (
                  <div className="bg-green-50 px-3 py-1 rounded-lg flex items-center">
                    <HiOutlineCalendar className="mr-2 h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium text-green-700">
                      Submitted On Time
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Assignment Body */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Assignment Details</h2>
          <div className="prose max-w-none text-gray-600 mb-6">
            <p>{assignment.description}</p>
          </div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Assignment Instructions</h2>
          <div className="prose max-w-none text-gray-600 mb-6">
            <p>{assignment.instructions}</p>
          </div>
          
          {assignment.attachments && assignment.attachments.length > 0 && (
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-900 mb-3">Attachments</h3>
              <div className="space-y-2">
                {assignment.attachments.map((attachment, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                    <div className="flex items-center">
                      <HiOutlineDocument className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-gray-700">{attachment.name || `Attachment ${index + 1}`}</span>
                    </div>
                    <a 
                      href={attachment.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 flex items-center text-sm font-medium"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Submission Status */}
        {alreadySubmitted && submission && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Your Submission</h2>
              <button
                onClick={handleDeleteSubmission}
                className="text-red-600 hover:text-red-800 flex items-center text-sm font-medium"
              >
                <HiOutlineTrash className="mr-1 h-4 w-4" />
                Delete Submission
              </button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-700">Submitted on</p>
                  <p className="text-gray-600">{formatDate(submission.submittedAt)}</p>
                </div>
                
                {submission.grade ? (
                  <div className="bg-green-50 px-4 py-2 rounded-lg">
                    <p className="font-medium text-gray-700">Grade</p>
                    <p className="text-xl font-bold text-green-600">{submission.grade}/100</p>
                  </div>
                ) : (
                  <div className="bg-yellow-50 px-4 py-2 rounded-lg">
                    <p className="text-yellow-700 font-medium">Not Graded Yet</p>
                  </div>
                )}
              </div>
            </div>
            
            {submission.fileUrl && (
              <div className="mb-4">
                <h3 className="text-md font-medium text-gray-900 mb-2">Submitted File</h3>
                <div className="space-y-2">
                  <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                    <div className="flex items-center">
                      <HiOutlineDocument className="h-5 w-5 text-gray-500 mr-2" />
                      <a href={submission.fileUrl}  target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{submission.fileUrl.split('/').pop().split('?')[0] || 'File'}</a>
                    </div>
                    
                  </div>
                </div>
              </div>
            )}
            
            {submission.comment && (
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-2">Your Comment</h3>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-700">{submission.comment}</p>
                </div>
              </div>
            )}
            
            {submission.feedback && (
              <div className="mt-4">
                <h3 className="text-md font-medium text-gray-900 mb-2">Instructor Feedback</h3>
                <div className="bg-indigo-50 p-3 rounded-lg">
                  <p className="text-gray-700">{submission.feedback}</p>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Submit Assignment Form */}
        {!alreadySubmitted && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Submit Your Assignment</h2>
            
            {isDeadlinePassed() ? (
              <div className="bg-red-50 p-4 rounded-lg flex items-start">
                <HiOutlineExclamation className="h-6 w-6 text-red-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-red-800">Deadline has passed</h3>
                  <p className="text-red-700 mt-1">
                    The deadline for this assignment was {formatDate(assignment.dueDate)}. 
                    Please contact your instructor if you need to make a late submission.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Assignment File
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg px-6 py-8 text-center">
                    <div className="space-y-2">
                      <div className="flex justify-center">
                        <HiOutlineUpload className="h-10 w-10 text-gray-400" />
                      </div>
                      <div className="text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-indigo-50 rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                          <span>Upload a file</span>
                          <input 
                            id="file-upload" 
                            name="file-upload" 
                            type="file" 
                            className="sr-only" 
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, DOC, DOCX, or other file formats up to 10MB
                      </p>
                    </div>
                    
                    {submissionFile && (
                      <div className="mt-4 flex items-center p-2 bg-indigo-50 rounded-lg">
                        <HiOutlinePaperClip className="h-5 w-5 text-indigo-500 mr-2" />
                        <span className="text-sm font-medium text-indigo-700 truncate">
                          {submissionFile.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                    Comments (Optional)
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    rows={3}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Add any comments about your submission..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={submitting || !submissionFile}
                  className={`inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                    submitting || !submissionFile
                      ? "bg-indigo-300 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  }`}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <HiOutlineUpload className="mr-2 h-4 w-4" />
                      Submit Assignment
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ViewAssignment;