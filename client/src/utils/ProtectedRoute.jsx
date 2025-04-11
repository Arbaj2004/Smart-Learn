import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import StudentProfile from "../pages/StudentProfile";
import FacultyProfile from "../pages/FacultyProfile";
import AdminProfile from "../pages/AdminProfile";
import FacultyDashboard from "../pages/FacultyDashboard";
import SmartLearnDashboard from "../pages/StudentCoursesDashboard";

const ProtectedRoute = ({ allowedRoles,byPassRoute,path }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    if(allowedRoles=="user" && byPassRoute){
        return <Navigate to="/" replace />;
    }

    const checkAuth = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return <Navigate to="/" replace />;
        }

        try {
            const response = await axios.get(
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/users/me`,
                {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.status === "success") {
                setUser(response.data.data.user);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    if (loading) return <div>Loading...</div>; // Show a loader while checking auth
    if(!byPassRoute){
        if (!user || allowedRoles!=user.role ) {
            toast.error("You do not have permission to access this page");
            setTimeout(() => {
                
            }, 1000);
            return <Navigate to="/" replace />;
        }
        
    }
    if(path=='profile'){
        if(user && user.role==='Student'){
            return <StudentProfile />;
        }
        if(user && user.role==='Faculty'){
            return <FacultyProfile />;
        }
        if(user && user.role==='Admin'){
            return <AdminProfile />;
        }
        return <Navigate to="/" replace />;
    }else if(path=='dashboard'){
        if(user && user.role==='Student'){
            return <SmartLearnDashboard />;
        }
        if(user && user.role==='Faculty'){
            return <FacultyDashboard />;
        }
        if(user && user.role==='Admin'){
            return <AdminProfile />;
        }
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute;
