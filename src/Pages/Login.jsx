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
import { useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

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
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_BASE_URL;

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleAuthSuccess = (data) => {
    const role = data?.data?.user?.role;
    if (role === 'student') {
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('userId', data?.data?.user?._id);
      localStorage.setItem('role', data?.data?.user?.role);
      localStorage.setItem('email', data?.data?.user?.email);
      localStorage.setItem('refreshToken', data.data.refreshToken);
    }

    toast.success("Logged in successfully!");

    if (role !== 'student') {
      if (role === 'admin' || role === 'superadmin') {
        window.location.href = "https://admin.eduroutez.com/";
      } else {
        setShowRolePopup(true);
      }
      return;
    }

    const pendingWebinarLink = sessionStorage.getItem('pendingWebinarLink');
    const redirectAfterLogin = sessionStorage.getItem('redirectAfterLogin');

    if (pendingWebinarLink) {
      sessionStorage.removeItem('pendingWebinarLink');
      window.open(pendingWebinarLink, '_blank');
      if (isMode === 'popup' && onClose) onClose();
      else navigate("/");
    } else if (redirectAfterLogin) {
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(redirectAfterLogin);
    } else {
      if (isMode === 'popup' && onClose) onClose();
      else navigate("/");
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
            },
          }
        );
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || "Login failed");
      }
    },
    onSuccess: (data) => handleAuthSuccess(data),
    onError: (error) => toast.error(error.message),
  });

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.post(`${apiUrl}/google-login`, {
          idToken: tokenResponse.access_token, // Note: depending on setup, this might be access_token or id_token
        });
        if (res.data.success) handleAuthSuccess(res.data);
      } catch (error) {
        toast.error("Google login failed");
      }
    },
    onError: () => toast.error("Google login failed"),
  });

  const responseFacebook = async (response) => {
    if (response.accessToken) {
      try {
        const res = await axios.post(`${apiUrl}/facebook-login`, {
          accessToken: response.accessToken,
        });
        if (res.data.success) handleAuthSuccess(res.data);
      } catch (error) {
        toast.error("Facebook login failed");
      }
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    if (id === "email") {
      setEmailError(value && !validateEmail(value) ? "Please enter a valid email address" : "");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className={isPopupMode ? "w-full" : "w-full flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8"}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl flex py-6 sm:py-8 flex-col justify-center items-center px-5 sm:px-8 overflow-y-auto max-h-[92vh]">
        <div className="w-full flex items-center justify-center mb-5 relative">
          <img src={logo} alt="Eduroutez" className="h-10 w-auto mx-auto" />
          <button
            type="button"
            onClick={() => (isMode === "popup" && onClose ? onClose() : navigate("/"))}
            className="absolute right-0 top-0 text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-center opacity-80 mb-2">Log in</h1>
        <p className="text-gray-500 mb-8 text-center">Welcome back! Please enter your details</p>
        
        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              placeholder="Enter your email"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${emailError ? "border-red-500 focus:ring-red-500" : "focus:ring-red-500"}`}
              value={formData.email}
              onChange={handleChange}
            />
            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
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
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox text-red-500" />
              <span className="ml-2 text-sm">Remember for 30 days</span>
            </label>
            <Link to="/forgotpassword" className="text-sm text-yellow-500 hover:underline">Forgot Password?</Link>
          </div>
          <button type="submit" className="w-full bg-red-700 text-white py-2 rounded-lg font-semibold hover:bg-red-800 transition-colors">
            {mutation.isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="my-6 flex items-center w-full">
          <span className="flex-grow h-px bg-gray-300"></span>
          <span className="mx-4 text-gray-500 whitespace-nowrap text-sm">Or Login with</span>
          <span className="flex-grow h-px bg-gray-300"></span>
        </div>

        <div className="flex justify-center gap-6">
          <FacebookLogin
            appId={import.meta.env.VITE_FACEBOOK_APP_ID || "YOUR_FB_APP_ID"}
            callback={responseFacebook}
            render={renderProps => (
              <button 
                onClick={renderProps.onClick}
                className="w-12 h-12 flex justify-center border border-gray-200 shadow-sm items-center bg-white rounded-full hover:bg-gray-50 transition-all hover:scale-110"
              >
                <img src={fb} className="h-7 w-7" alt="facebook icon" />
              </button>
            )}
          />
          
          <button 
            onClick={() => googleLogin()}
            className="w-12 h-12 flex justify-center border border-gray-200 shadow-sm items-center rounded-full bg-white hover:bg-gray-50 transition-all hover:scale-110"
          >
            <img src={google} className="h-6 w-6" alt="google icon" />
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          Don't have an account?{" "}
          {isMode === 'popup' ? (
            <button onClick={onSwitch} type="button" className="text-red-500 font-bold hover:underline">Sign up</button>
          ) : (
            <Link to="/signup" className="text-red-500 font-bold hover:underline">Sign up</Link>
          )}
        </p>

        {showRolePopup && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Login Info</h2>
                <button onClick={() => { setShowRolePopup(false); if (isMode === "popup" && onClose) onClose(); }} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <p className="text-gray-600 mb-8 font-medium">
                Please log in to the correct portal for your role. You cannot access the student dashboard as an Institute or Counselor.
              </p>
              <button 
                onClick={() => { setShowRolePopup(false); if (isMode === "popup" && onClose) onClose(); }}
                className="w-full bg-[#b82025] text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-all active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
