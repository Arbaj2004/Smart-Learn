//faculty wise courses /fac/course
//resources
//faculty assignment
// view course for student before enrollment
// enrolled courses
// all courses
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Import Navbar
import NotFound from './pages/NotFound';
import HomePage from './pages/Home';
import SignUp from './pages/Signup';
import SignIn from './pages/SignIn';
import VerifyOtp from './pages/VerifyOtp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { Toaster } from "react-hot-toast";
import ImportStudents from './pages/ImportStudents';
import ProtectedRoute from './utils/ProtectedRoute';
import ApproveFaculty from './pages/ApproveFaculty';
import StudentProfile from './pages/StudentProfile';
import FacultyProfile from './pages/FacultyProfile';
import AdminProfile from './pages/AdminProfile';
import CreateCourse from './pages/CreateCourse';
import ViewCourse from './pages/ViewCourse';
import FacultyCourseManagement from './pages/FacultyCourseManagement';
import SmartLearnDashboard from './pages/StudentCoursesDashboard';
import CreateAssignment from './pages/CreateAssignment';
import ViewAssignment from './pages/ViewAssignment';
import TicketPage from './pages/TicketPage';
import ResponseTicket from './pages/ResponseTicket';
import ManageAssignments from './pages/ManageAssignment';
import FacultyDashboard from './pages/FacultyDashboard';

const App = () => {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex flex-col fixed inset-0"> 
        <Navbar />
        <div className="flex-1 overflow-auto">
          <Routes>  
            <Route path="/" element={<HomePage/>} />
            <Route path="/signup" element={<SignUp/>} />
            <Route path="/signin" element={<SignIn/>} />
            <Route path="/verify-otp" element={<VerifyOtp/>} />
            <Route path="/forgot-password" element={<ForgotPassword/>} />
            <Route path="/reset-password/:id" element={<ResetPassword/>} />
            <Route element={<ProtectedRoute allowedRoles={["Admin"]} byPassRoute={false} path={"add-students"}/>}>
              <Route path="/add-students" element={<ImportStudents />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["Admin"]} byPassRoute={false} path={"approve-facs"}/>}>
              <Route path="/approve-faculty" element={<ApproveFaculty />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["Student"]} byPassRoute={true} path={"profile"}/>}>
              <Route path="/profile" element={<StudentProfile />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["Faculty"]} byPassRoute={true} path={"profile"}/>}>
              <Route path="/profile" element={<FacultyProfile />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["Admin"]} byPassRoute={true} path={"profile"}/>}>
              <Route path="/profile" element={<AdminProfile />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["Faculty"]} byPassRoute={false} path={"create-course"}/>}>
              <Route path="/create-course" element={<CreateCourse />} />
            </Route>
            <Route path="/courses" element={<SmartLearnDashboard/>} />
            <Route path="/courses/faculty" element={<FacultyDashboard/>} />
            <Route path="/courses/:courseId" element={<ViewCourse/>} />
            <Route path="/courses/:courseId/edit" element={<FacultyCourseManagement/>} />
            <Route path="/course/:courseId" element={<ManageAssignments/>} />
            <Route path="/assignment/:courseId/new" element={<CreateAssignment/>} />
            <Route path="/student/assignment/:assignmentId" element={<ViewAssignment/>} />

            <Route path="/ticket" element={<TicketPage/>} />
            <Route path="/ticket/:ticketId" element={<ResponseTicket/>} />

            <Route element={<ProtectedRoute allowedRoles={["Student"]} byPassRoute={true} path={"dashboard"}/>}>
              <Route path="/dashboard" element={<SmartLearnDashboard />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["Faculty"]} byPassRoute={true} path={"dashboard"}/>}>
              <Route path="/dashboard" element={<FacultyDashboard />} />
            </Route>



            <Route path="/*" element={<NotFound/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
