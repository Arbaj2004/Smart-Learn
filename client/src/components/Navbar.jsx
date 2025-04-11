import React, { useState,useEffect, useRef } from 'react';
import { BookOpen, Menu, X } from 'lucide-react';
import { HiOutlineLogout } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import Avatar from './Avatar';
import { logout } from '../redux/userSlice';
import { Link, useNavigate } from 'react-router-dom';

const SmartLearnNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    // Attach event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    checkAuth();
  }, [user]);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      handleLogout();
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/users/me`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.status === 'success') {
        setIsAuthenticated(true);
        dispatch({
          type: 'user/setUser',
          payload: response.data.data.user,
        });
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      handleLogout();
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/users/logout`,
          {},
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      dispatch(logout());
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      navigate('/signin');
    }
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <a href="/#home" className="ml-2 text-2xl font-bold text-gray-900">
                SmartLearn
              </a>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <a href="/#features" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Features
              </a>
              <a href="/#faculty" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                For faculty
              </a>
              <a href="/#students" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                For Students
              </a>
              <a href="/#testimonials" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Testimonials
              </a>
            </div>
          </div>
          <div className="flex items-center relative">
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span className="text-gray-600 px-3 py-2 rounded-md text-lg font-medium">
          Hello, {user.name?.split(' ')[0]}
        </span>
        <Avatar width={40} height={40} name={user.name} imageUrl={user.profilePic} />
      </div>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 top-full z-50">
          <Link
            to="/profile"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200 text-lg font-medium"
          >
            <CgProfile className="w-5 h-5 mr-2" />
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200 text-lg font-medium"
          >
            <HiOutlineLogout className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      )}
              </div>
            ) : (
              <div className="hidden md:flex md:items-center md:space-x-6">
              <a href='/signin' className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md text-sm font-medium mr-2">Login</a>
            <a href='/signup' className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium">Sign Up</a>
           
                </div>
            )}
            <div className="md:hidden ml-2">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#features" className="block text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-base font-medium">
              Features
            </a>
            <a href="#faculty" className="block text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-base font-medium">
              For faculty
            </a>
            <a href="#students" className="block text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-base font-medium">
              For Students
            </a>
            <a href="#testimonials" className="block text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-base font-medium">
              Testimonials
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default SmartLearnNavbar;
