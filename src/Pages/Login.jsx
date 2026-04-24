import React, { useState } from "react";
import fb from "../assets/Images/fb.png";
import google from "../assets/Images/google.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { Eye, EyeOff, X } from "lucide-react";
import logo from "../assets/Images/logo.png";

const Login = ({ isMode, onSwitch, onClose }) => {
  const isPopupMode = isMode === "popup";
  const [showRolePopup, setShowRolePopup] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const location = useLocation();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_BASE_URL;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });

    if (id === "email") {
      if (value && !validateEmail(value)) {
        setEmailError("Please enter a valid email address");
      } else {
        setEmailError("");
      }
    }
  };

  const mutation = useMutation({
    mutationFn: async (credentials) => {
      try {
        const response = await axios.post(
          `${apiUrl}/login`,
          { ...credentials, isStudent: true },
          {
            headers: {
              "Content-Type": "application/json",
              'x-access-token': localStorage.getItem('accessToken'),
              'x-refresh-token': localStorage.getItem('refreshToken')
            },
          }
        );
        return response.data;
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Login failed. Please try again.";
        throw new Error(errorMessage);
      }
    },
    onSuccess: (data) => {
      console.log("Data", data);


      const role = data?.data?.user?.role;
      // Only store in localStorage if role is student
      if (role === 'student') {
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('userId', data?.data?.user?._id);
        localStorage.setItem('role', data?.data?.user?.role);
        localStorage.setItem('email', data?.data?.user?.email);
        localStorage.setItem('refreshToken', data.data.refreshToken);
      }

      toast.success("Logged in successfully!");

      if (role !== 'student') {
        // Only redirect to admin for true admin roles
        if (role === 'admin' || role === 'superadmin') {
          window.location.href = "https://admin.eduroutez.com/";
        } else {
          setShowRolePopup(true);
        }
        return;
      }

      // Check for pending application
      const pendingApplication = sessionStorage.getItem('pendingApplication');
      const redirectAfterLogin = sessionStorage.getItem('redirectAfterLogin');

      // Check for pending webinar link
      const pendingWebinarLink = sessionStorage.getItem('pendingWebinarLink');

      if (pendingWebinarLink) {
        // Clear the stored link
        sessionStorage.removeItem('pendingWebinarLink');
        // Open the webinar in a new tab
        window.open(pendingWebinarLink, '_blank');
        // Navigate or close
        if (isMode === 'popup' && onClose) {
          onClose();
        } else {
          navigate("/");
        }
      } else if (redirectAfterLogin) {
        // Clear the stored redirect URL
        sessionStorage.removeItem('redirectAfterLogin');
        // Navigate back to the institute page
        navigate(redirectAfterLogin);
        // If not in popup mode, we've already navigated away.
        // If in popup mode, navigating away already effectively closes the popup
        // because the URL is no longer /login. Calling onClose() (which often calls navigate(-1))
        // would take us back to /login and re-open the popup!
      } else {
        // Default navigation for students
        if (isMode === 'popup' && onClose) {
          onClose();
        } else {
          navigate("/");
        }
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  // Rest of the component remains the same...
  return (
    <div
      className={isPopupMode ? "w-full" : "w-full flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8"}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl flex py-6 sm:py-8 flex-col justify-center items-center px-5 sm:px-8 overflow-y-auto max-h-[92vh]">
        <div className="w-full flex items-center justify-center mb-5 relative">
          <img src={logo} alt="Eduroutez" className="h-10 w-auto mx-auto" />
          <button
            type="button"
            onClick={() => (isMode === "popup" && onClose ? onClose() : navigate("/"))}
            className="absolute right-0 top-0 absolute right-0 text-gray-500 hover:text-gray-700"
            aria-label="Close login"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-center opacity-80 mb-2">
          Log in
        </h1>
        <p className="text-gray-500 mb-8 text-center">
          Welcome back! Please enter your details
        </p>
        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              placeholder="Enter your email "
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${emailError ? "border-red-500 focus:ring-red-500" : "focus:ring-red-500"
                }`}
              value={formData.email}
              onChange={handleChange}
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1">{emailError}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 pr-10"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-red-500"
              />
              <span className="ml-2 text-sm">Remember for 30 days</span>
            </label>
            <Link
              to="/forgotpassword"
              className="text-sm text-yellow-500 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full bg-red-700 text-white py-2 rounded-lg font-semibold hover:bg-red-800"
          >
            Log in
          </button>
          <button
            type="button"
            className="w-full bg-black text-white py-2 rounded-lg font-semibold mt-4 hover:bg-gray-800"
          >
            Guest
          </button>
        </form>
        <div className="my-6 flex items-center">
          <span className="w-1/2 h-px bg-gray-300"></span>
          <span className="mx-2 text-gray-500 whitespace-nowrap text-sm">
            Or Login with
          </span>
          <span className="w-1/2 h-px bg-gray-300"></span>
        </div>
        <div className="flex justify-center gap-4">
          <button className="w-10 h-10 flex justify-center border-2 shadow-md items-center bg-white rounded-full hover:bg-gray-200">
            <img src={fb} className="h-7" alt="facebook icon" />
          </button>
          <button className="w-10 h-10 flex justify-center border-2 shadow-md items-center rounded-full bg-white hover:bg-gray-200">
            <img src={google} className="h-6" alt="google icon" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          {isMode === 'popup' ? (
            <button
              onClick={onSwitch}
              type="button"
              className="text-red-500 font-medium hover:underline"
            >
              Sign up
            </button>
          ) : (
            <Link
              to="/signup"
              state={{ backgroundLocation: location.state?.backgroundLocation || location }}
              className="text-red-500 font-medium hover:underline"
            >
              Sign up
            </Link>
          )}
        </p>

        {/* Role popup for institute/counsellor */}
        {showRolePopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl transform transition-all">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-slate-800">Login Info</h2>
                <button onClick={() => {
                  setShowRolePopup(false);
                  if (isMode === "popup" && onClose) onClose();
                }} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <p className="text-slate-600 mb-8 font-medium leading-relaxed">
                Please log in to the correct portal for your role (Institute or Counsellor). You cannot access the admin dashboard from here.<br/>
                <span className="block mt-4">Go to: <a href="https://admin.eduroutez.com/" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Admin/Counsellor Portal</a> </span>
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    setShowRolePopup(false);
                    if (isMode === "popup" && onClose) onClose();
                  }}
                  className="w-full bg-[#b82025] text-white font-black py-4 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
