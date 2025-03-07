import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "react-query";
import axiosInstance from "../ApiFunctions/axios";
import { useNavigate } from 'react-router-dom';
import loginandSignupbg from "../assets/Images/loginandSignupbg.png";
import fb from "../assets/Images/fb.png";
import google from "../assets/Images/google.png";
import { toast } from "react-toastify";

const Signup = () => {
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(90); // 90-second countdown
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const roleTypes = [
    { value: 'institute', label: 'University/College Institute' },
    { value: 'counsellor', label: 'Counsellor' },
    { value: 'student', label: 'Student' },
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact_number: "",
    country: "",
    city: "",
    state: "",
    password: "",
    confirmPassword: "",
    referal_Code: "",
    role: "",
    // Store the name values separately for display purposes
    countryName: "",
    stateName: "",
    cityName: ""
  });

  const [role, setRole] = useState("");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:4001/api/v1';

  // Fetch all countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axiosInstance.get(`${apiUrl}/countries`);
        setCountries(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch countries:", err);
        toast.error("Failed to fetch countries");
      }
    };
    fetchCountries();
  }, [apiUrl]);

  // Fetch states when a country is selected
  useEffect(() => {
    const fetchStates = async () => {
      if (!formData.country) {
        setStates([]);
        return;
      }
      
      try {
        // Find the selected country to get its ISO code
        const selectedCountry = countries.find(country => country.id.toString() === formData.country.toString());
        if (selectedCountry) {
          const res = await axiosInstance.post(`${apiUrl}/states-by-country`, {
            countryCode: selectedCountry.iso2
          });
          setStates(res.data?.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch states:", err);
        toast.error("Failed to fetch states");
      }
    };
    
    if (countries.length > 0 && formData.country) {
      fetchStates();
    }
  }, [formData.country, countries, apiUrl]);

  // Fetch cities when a state is selected
  useEffect(() => {
    const fetchCities = async () => {
      if (!formData.state || !formData.country) {
        setCities([]);
        return;
      }
      
      try {
        // Get the country and state ISO codes for the API request
        const selectedCountry = countries.find(country => country.id.toString() === formData.country.toString());
        const selectedState = states.find(state => state.id.toString() === formData.state.toString());
        
        if (selectedCountry && selectedState) {
          const res = await axiosInstance.post(`${apiUrl}/cities-by-state`, {
            countryCode: selectedCountry.iso2,
            stateCode: selectedState.iso2
          });
          setCities(res.data?.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch cities:", err);
        toast.error("Failed to fetch cities");
      }
    };
    
    if (states.length > 0 && formData.state) {
      fetchCities();
    }
  }, [formData.state, formData.country, countries, states, apiUrl]);

  useEffect(() => {
    if (showOtpDialog) {
      setTimer(90);
      setCanResend(false);
    }
  }, [showOtpDialog]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const sendOtpMutation = useMutation({
    mutationFn: async (credentials) => {
      setIsLoading(true);
      const response = await axiosInstance.post(
        `${apiUrl}/send-otp`,
        {
          email: credentials.email,
          contact_number: credentials.contact_number
        }
      );
      return response.data;
    },
    onSuccess: () => {
      setIsLoading(false);
      toast.success("OTP sent successfully");
      setShowOtpDialog(true);
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  });

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const signupMutation = useMutation({
    mutationFn: async (credentials) => {
      setIsLoading(true);
      const response = await axiosInstance.post(
        `${apiUrl}/signup`,
        {
          ...credentials,
          otp: credentials.otp.join('') // Convert OTP array to string
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      setIsLoading(false);
      toast.success("Registered successfully");
      localStorage.setItem('accessToken', JSON.stringify(data.data.accessToken));
      localStorage.setItem('userId', data?.data?.user?._id);
      localStorage.setItem('role', data?.data?.user?.role);
      localStorage.setItem('email', data?.data?.user?.email);      
      localStorage.setItem('accessToken', JSON.stringify(data.data.accessToken));
      
      if(data?.data?.user?.role === 'student') {
        navigate('/');
      } else {
        window.location.href = "https://admin.eduroutez.com/";
      }
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(error.response?.data?.message || "Failed to sign up");
    }
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    
    if (id === "country") {
      // Find the selected country to get its name
      const selectedCountry = countries.find(country => country.id.toString() === value);
      
      setFormData({ 
        ...formData, 
        [id]: value, 
        countryName: selectedCountry?.name || "",
        state: "", // Reset dependent fields
        stateName: "",
        city: "",
        cityName: "" 
      });
    } else if (id === "state") {
      // Find the selected state to get its name
      const selectedState = states.find(state => state.id.toString() === value);
      
      setFormData({ 
        ...formData, 
        [id]: value,
        stateName: selectedState?.name || "",
        city: "", // Reset city when state changes
        cityName: ""
      });
    } else if (id === "city") {
      // Find the selected city to get its name
      const selectedCity = cities.find(city => city.id.toString() === value);
      
      setFormData({
        ...formData,
        [id]: value,
        cityName: selectedCity?.name || ""
      });
    } else {
      // Normal field update
      setFormData({ ...formData, [id]: value });
      if (id === 'role') setRole(value);
    }
  };

  const validateForm = () => {
    if (!formData.email || !formData.contact_number) {
      toast.error("Please enter both email and phone number");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    if (!formData.name || !formData.role || !formData.country || !formData.state || !formData.city) {
      toast.error("Please fill all required fields");
      return false;
    }
    return true;
  };

  const handleSendOtp = () => {
    if (validateForm()) {
      sendOtpMutation.mutate(formData);
    }
  };

  const handleVerifyOtp = () => {
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }
    
    // Create the payload with nested location objects
    const { confirmPassword, countryName, stateName, cityName, ...signupData } = formData;
    
    // Add location info as objects
    const signupPayload = {
      ...signupData,
      otp,
    };
    
    // Add country, state, city as structured objects similar to ProfilePage
    if (formData.country) {
      const selectedCountry = countries.find(country => country.id.toString() === formData.country.toString());
      if (selectedCountry) {
        signupPayload.country = {
          name: selectedCountry.name,
          iso2: selectedCountry.iso2
        };
      }
    }
    
    if (formData.state) {
      const selectedState = states.find(state => state.id.toString() === formData.state.toString());
      if (selectedState) {
        signupPayload.state = {
          name: selectedState.name,
          iso2: selectedState.iso2
        };
      }
    }
    
    if (formData.city) {
      const selectedCity = cities.find(city => city.id.toString() === formData.city.toString());
      if (selectedCity) {
        signupPayload.city = {
          name: selectedCity.name
        };
      }
    }
    
    signupMutation.mutate(signupPayload);
  };

  const roleSpecificLabel = role === 'institute'
    ? 'Institute Name'
    : role === 'counsellor'
    ? 'Counsellor Name'
    : 'Name';

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-1/2 bg-red-700 hidden text-white sm:flex flex-col justify-center items-center px-10">
        <h1 className="text-4xl lg:text-[45px] lg:font-semibold font-bold mb-4 w-11/12 text-start">
          Join Us
        </h1>
        <p className="text-lg mb-6 w-11/12">
          We're excited to have you here—start your journey with us today!
        </p>
        <img
          src={loginandSignupbg}
          alt="Signup Illustration"
          className="w-4/5 max-w-[350px]"
        />
      </div>

      {/* Right Section */}
      <div className="w-full sm:w-1/2 flex py-10 md:py-4 flex-col justify-start overflow-y-scroll items-center px-10">
        <h1 className="text-[50px] font-bold text-start opacity-80 leading-[50px]">Register Now</h1>
        <p className="text-gray-500 mb-8">
          Please fill in the form to create an account
        </p>

        <form className="w-full max-w-sm" onSubmit={(e) => e.preventDefault()}>
          {/* Role Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="role">
              Role *
            </label>
            <select
              id="role"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Your Role</option>
              {roleTypes.map((roleType) => (
                <option key={roleType.value} value={roleType.value}>
                  {roleType.label}
                </option>
              ))}
            </select>
          </div>

          {/* Name Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              {roleSpecificLabel} *
            </label>
            <input
              type="text"
              id="name"
              placeholder={`Enter your ${roleSpecificLabel.toLowerCase()}`}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Country Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Country *</label>
            <select
              id="country"
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.country}
              onChange={handleChange}
              required
            >
              <option value="">Select a Country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* State Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">State *</label>
            <select
              id="state"
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.state}
              onChange={handleChange}
              required
              disabled={!formData.country}
            >
              <option value="">Select a State</option>
              {states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          {/* City Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">City *</label>
            <select
              id="city"
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.city}
              onChange={handleChange}
              required
              disabled={!formData.state}
            >
              <option value="">Select a City</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone Number Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Phone Number *</label>
            <input
              type="tel"
              id="contact_number"
              placeholder="Enter your phone number"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={formData.contact_number}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password *</label>
            <input
              type="password"
              id="password"
              placeholder="Create a password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Confirm Password Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* Referral Code Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Referral Code</label>
            <input
              type="text"
              id="referal_Code"
              placeholder="Enter your Referral Code"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={formData.referal_Code}
              onChange={handleChange}
            />
          </div>

          <button
            type="button"
            className="w-full bg-red-700 text-white py-2 rounded-lg font-semibold hover:bg-red-800 disabled:bg-red-400"
            onClick={handleSendOtp}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Sign Up"}
          </button>
        </form>

        {/* Social Login Section */}
        <div className="my-6 flex items-center">
          <span className="w-1/2 h-px bg-gray-300"></span>
          <span className="mx-2 text-gray-500 whitespace-nowrap text-sm">Or Sign Up with</span>
          <span className="w-1/2 h-px bg-gray-300"></span>
        </div>
        
        <div className="flex justify-center gap-4">
          <button className="w-10 h-10 flex justify-center border-2 shadow-md items-center bg-white rounded-full hover:bg-gray-200">
            <img src={fb} className="h-7" alt="Facebook icon" />
          </button>
          <button className="w-10 h-10 flex justify-center border-2 shadow-md items-center rounded-full bg-white hover:bg-gray-200">
            <img src={google} className="h-6" alt="Google icon" />
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-red-500 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>

      {/* OTP Dialog */}
      {
        showOtpDialog && (
          <div className="fixed inset-0 flex p-12 items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-96">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Verify OTP</h2>
                <button onClick={() => setShowOtpDialog(false)} className="text-gray-500 hover:text-gray-700 text-xl">
                  ×
                </button>
              </div>
    
              <p className="text-gray-600 text-sm mb-4">Please enter the OTP sent to your email and phone number.</p>
    
              {/* OTP Inputs */}
              <div className="flex justify-center gap-3 mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                  />
                ))}
              </div>
    
              {/* Countdown Timer & Resend OTP */}
              <div className="text-center text-sm text-gray-600 mb-4">
                {canResend ? (
                  <button onClick={() => { handleSendOtp(); setTimer(90); setCanResend(false); }} className="text-red-600 hover:underline">
                    Resend OTP
                  </button>
                ) : (
                  `Resend OTP in ${timer}s`
                )}
              </div>
    
              {/* Buttons */}
              <div className="flex justify-between">
                <button onClick={() => setShowOtpDialog(false)} className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition">
                  Cancel
                </button>
                <button onClick={handleVerifyOtp} className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition">
                  Verify OTP
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}

export default Signup;