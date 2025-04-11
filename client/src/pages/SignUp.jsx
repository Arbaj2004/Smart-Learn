import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    profilePic: ''
  });

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        if (value && !value.endsWith('@coeptech.ac.in')) {
          return 'Email must be from COEP Tech domain (@coeptech.ac.in)';
        }
        break;
      case 'password':
        if (value && value.length < 8) {
          return 'Password must be at least 8 characters long';
        }
        break;
      case 'passwordConfirm':
        if (value && value !== formData.password) {
          return 'Passwords do not match';
        }
        break;
      default:
        return '';
    }
    return '';
  };

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));

    if (name === 'password' && formData.passwordConfirm) {
      setErrors(prev => ({ ...prev, passwordConfirm: validateField('passwordConfirm', formData.passwordConfirm) }));
    }
  };

  const handleUploadSuccess = (url) => {
    setFormData(prev => ({ ...prev, profilePic: url }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = {
      email: validateField('email', formData.email),
      password: validateField('password', formData.password),
      passwordConfirm: validateField('passwordConfirm', formData.passwordConfirm)
    };
    setErrors(formErrors);
    if (Object.values(formErrors).some(error => error !== '')) {
      toast.error('Please fix all errors before submitting');
      return;
    }

    const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/users/signup`;
    try {
      const response = await axios.post(URL, formData, { withCredentials: true });
      if (response.data.status === "success") {
        toast.success("Registration successful");
        localStorage.setItem('token', response.data.token);
        setTimeout(() => {
          setFormData({ email: "", password: "", passwordConfirm: "", name: "", profilePic: "" });
        }, 1000);
        navigate('/verify-otp');
      }
    } catch (error) {
      toast.error(error.response.data.message || "Please check your email and password");
    }
  };

  const inputClass = "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
  
  return (
    <div className="min-h-full bg-gray-50 flex flex-col justify-center sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create a new account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or <Link to="/signin" className="font-medium text-indigo-600 hover:text-indigo-500">sign in to your account</Link>
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {['name', 'email', 'password', 'passwordConfirm'].map((field, index) => (
              <div key={index}>
                <label htmlFor={field} className="block text-sm font-medium text-gray-700">{field === 'passwordConfirm' ? 'Confirm Password' : field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <div className="mt-1 relative">
                  <input
                    id={field}
                    name={field}
                    type={(field.includes('password') && (field === 'password' ? showPassword : showConfirmPassword)) ? "text" : (field.includes('password') ? "password" : "text")}
                    required
                    value={formData[field]}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  {field.includes('password') && (
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => field === 'password' ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {field === 'password' ? (showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />) : (showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />)}
                    </button>
                  )}
                </div>
                {errors[field] && <p className="mt-1 text-sm text-red-500">{errors[field]}</p>}
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
              <div className="mt-1 p-2 border border-gray-300 rounded-md">
                <ImageUploader onUploadSuccess={handleUploadSuccess} />
              </div>
            </div>
            <div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Sign up</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
