import React from "react";
import { 
  HiOutlineUserGroup, 
  HiOutlineAcademicCap, 
  HiOutlineClipboardCheck, 
  HiOutlineDocumentAdd,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineChartSquareBar
} from "react-icons/hi";

const Dashboard = ({ stats, setShowImportModal }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <HiOutlineChartSquareBar className="w-6 h-6 mr-2 text-indigo-600" />
          SmartLearn Dashboard
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <HiOutlineUserGroup className="w-8 h-8" />
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500 text-sm">Total Students</h3>
                <div className="flex items-end space-x-1">
                  <p className="text-2xl font-bold text-gray-800">{stats.totalStudents}</p>
                  <p className="text-green-500 flex items-center text-sm">
                    <span>+2%</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <HiOutlineAcademicCap className="w-8 h-8" />
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500 text-sm">Faculty Members</h3>
                <div className="flex items-end space-x-1">
                  <p className="text-2xl font-bold text-gray-800">{stats.totalFaculty}</p>
                  <p className="text-green-500 flex items-center text-sm">
                    <span>+5%</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                <HiOutlineClipboardCheck className="w-8 h-8" />
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500 text-sm">Total Courses</h3>
                <div className="flex items-end space-x-1">
                  <p className="text-2xl font-bold text-gray-800">{stats.totalCourses}</p>
                  <p className="text-green-500 flex items-center text-sm">
                    <span>+8%</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <HiOutlineExclamationCircle className="w-8 h-8" />
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500 text-sm">Pending Approvals</h3>
                <p className="text-2xl font-bold text-gray-800">{stats.pendingApprovals}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <HiOutlineCheckCircle className="w-8 h-8" />
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500 text-sm">Active Enrollments</h3>
                <p className="text-2xl font-bold text-gray-800">{stats.activeEnrollments}</p>
              </div>
            </div>
          </div>
          
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-xl shadow-sm cursor-pointer"
            onClick={() => setShowImportModal(true)}
          >
            <div className="flex items-center text-white">
              <div className="p-3 rounded-full bg-white bg-opacity-20">
                <HiOutlineDocumentAdd className="w-8 h-8" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium">Import Students</h3>
                <p className="text-sm opacity-80 mt-1">
                  Add multiple students via CSV file
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">System Overview</h2>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Student Registrations</span>
                <span className="text-sm font-medium text-gray-700">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "85%" }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Course Completions</span>
                <span className="text-sm font-medium text-gray-700">70%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: "70%" }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">System Usage</span>
                <span className="text-sm font-medium text-gray-700">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: "92%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;