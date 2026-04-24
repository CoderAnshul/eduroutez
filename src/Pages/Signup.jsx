import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useMutation } from "react-query";
import axiosInstance from "../ApiFunctions/axios";
import { useNavigate } from "react-router-dom";
import fb from "../assets/Images/fb.png";
import google from "../assets/Images/google.png";
import { toast } from "react-toastify";
import PasswordStrength from "../Components/PasswordStrength";
import { Eye, EyeOff, X } from "lucide-react";
import GuidanceTestPopup from "../Components/GuidanceTestPopup";
import ScheduleTestPopup from "../Components/ScheduleTestPopup";
import ScheduleConfirmationPopup from "../Components/ScheduleConfirmationPopup";
import loadRazorpayScript from "../loadRazorpayScript";
import logo from "../assets/Images/logo.png";
import { useLocation } from "react-router-dom";

const Signup = ({ isMode, onSwitch, onClose }) => {
  const isPopupMode = isMode === "popup";
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  // Popups for counsellor flow
  const [showGuidancePopup, setShowGuidancePopup] = useState(false);
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [showRolePopup, setShowRolePopup] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpInputRefs = useRef([]);
  const [timer, setTimer] = useState(90); // 90-second countdown
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone) => {
    return /^\d{10}$/.test(phone);
  };

  const closeAllFlowPopups = () => {
    setShowOtpDialog(false);
    setShowGuidancePopup(false);
    setShowSchedulePopup(false);
    setShowConfirmationPopup(false);
  };

  const openExclusivePopup = (popupName) => {
    closeAllFlowPopups();

    if (popupName === "otp") setShowOtpDialog(true);
    if (popupName === "guidance") setShowGuidancePopup(true);
    if (popupName === "schedule") setShowSchedulePopup(true);
    if (popupName === "confirmation") setShowConfirmationPopup(true);
  };

  const roleTypes = [
    { value: "institute", label: "University/College/Institute" },
    { value: "counsellor", label: "Counsellor" },
    { value: "student", label: "Student" },
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
    referralCode: "",
    role: "",
    // Store the name values separately for display purposes
    countryName: "",
    stateName: "",
    cityName: "",
  });

  // Remove separate role state, use formData.role directly
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const apiUrl =
    import.meta.env.VITE_BASE_URL || "http://localhost:4001/api/v1";
  const [searchParams] = useSearchParams();

  // Prefill referral code from ?ref= query param (e.g. /signup?ref=ABC123)
  useEffect(() => {
    const refFromUrl = searchParams.get("ref");
    if (refFromUrl) {
      setFormData((prev) => ({
        ...prev,
        referralCode: prev.referralCode || refFromUrl,
      }));
    }
  }, [searchParams]);

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
        const selectedCountry = countries.find(
          (country) => country.id.toString() === formData.country.toString()
        );
        if (selectedCountry) {
          const res = await axiosInstance.post(`${apiUrl}/states-by-country`, {
            countryCode: selectedCountry.iso2,
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
        const selectedCountry = countries.find(
          (country) => country.id.toString() === formData.country.toString()
        );
        const selectedState = states.find(
          (state) => state.id.toString() === formData.state.toString()
        );

        if (selectedCountry && selectedState) {
          const res = await axiosInstance.post(`${apiUrl}/cities-by-state`, {
            countryCode: selectedCountry.iso2,
            stateCode: selectedState.iso2,
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
      // Reset OTP when dialog opens
      setOtp(["", "", "", "", "", ""]);
      // Focus first OTP input when dialog opens
      setTimeout(() => {
        const firstInput = otpInputRefs.current[0];
        if (firstInput) {
          firstInput.focus();
          firstInput.select();
        }
      }, 150);
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
      const response = await axiosInstance.post(`${apiUrl}/send-otp`, {
        email: credentials.email,
        contact_number: credentials.contact_number,
      });
      return response.data;
    },
    onSuccess: () => {
      setIsLoading(false);
      toast.success("OTP sent successfully");
      openExclusivePopup("otp");
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(error.response?.data?.message || "Failed to send OTP");
    },
  });

  const handleOtpChange = (index, e) => {
    const value = e.target.value;

    // Only allow numbers
    if (value && !/^[0-9]$/.test(value)) {
      e.target.value = otp[index]; // Reset to previous value
      return;
    }

    // Only allow single digit - take the last character if multiple entered
    const digit = value.slice(-1);

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Move to next input automatically when a digit is entered
    if (digit && index < otp.length - 1) {
      // Use requestAnimationFrame for better focus handling
      requestAnimationFrame(() => {
        const nextInput = otpInputRefs.current[index + 1];
        if (nextInput) {
          nextInput.focus();
          nextInput.select(); // Select the text for easy replacement
        }
      });
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Handle backspace - move to previous input if current is empty
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        e.preventDefault();
        const prevInput = otpInputRefs.current[index - 1];
        if (prevInput) {
          prevInput.focus();
          prevInput.select();
        }
      } else if (otp[index]) {
        // Clear current input on backspace
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }

    // Handle arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      const prevInput = otpInputRefs.current[index - 1];
      if (prevInput) {
        prevInput.focus();
        prevInput.select();
      }
    }
    if (e.key === "ArrowRight" && index < otp.length - 1) {
      e.preventDefault();
      const nextInput = otpInputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      }
    }

    // Handle delete key
    if (e.key === "Delete") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedNumbers = pastedData.replace(/[^\d]/g, '').split('').slice(0, 6);

    if (pastedNumbers.length > 0) {
      const newOtp = [...otp];
      pastedNumbers.forEach((num, index) => {
        if (index < otp.length) {
          newOtp[index] = num;
        }
      });
      setOtp(newOtp);

      // Focus the next empty input or the last one
      const nextEmptyIndex = newOtp.findIndex((val, idx) => !val && idx >= pastedNumbers.length);
      const focusIndex = nextEmptyIndex === -1 ? Math.min(pastedNumbers.length - 1, otp.length - 1) : nextEmptyIndex;
      setTimeout(() => {
        otpInputRefs.current[focusIndex]?.focus();
      }, 0);
    }
  };

  const signupMutation = useMutation({
    mutationFn: async (credentials) => {
      setIsLoading(true);
      const response = await axiosInstance.post(
        `${apiUrl}/signup`,
        {
          ...credentials,
          otp: credentials.otp.join(""), // Convert OTP array to string
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      setIsLoading(false);
      toast.success("Registered successfully");
      closeAllFlowPopups();

      const role = data?.data?.user?.role;
      // Only store in localStorage if role is student
      if (role === "student") {
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("userId", data?.data?.user?._id);
        localStorage.setItem("role", data?.data?.user?.role);
        localStorage.setItem("email", data?.data?.user?.email);
      }

      if (role === "student") {
        if (isMode === 'popup' && onClose) {
           onClose();
        } else {
           navigate("/");
        }
      } else if (role === "counsellor" || role === "admin" || role === "superadmin" || role === "institute") {
        setShowRolePopup(true);
      } else {
        window.location.href = "https://admin.eduroutez.com/";
      }
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(error.response?.data?.message || "Failed to sign up");
    },
  });

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === "country") {
      // Find the selected country to get its name
      const selectedCountry = countries.find(
        (country) => country.id.toString() === value
      );

      setFormData({
        ...formData,
        [id]: value,
        countryName: selectedCountry?.name || "",
        state: "", // Reset dependent fields
        stateName: "",
        city: "",
        cityName: "",
      });
    } else if (id === "state") {
      // Find the selected state to get its name
      const selectedState = states.find(
        (state) => state.id.toString() === value
      );

      setFormData({
        ...formData,
        [id]: value,
        stateName: selectedState?.name || "",
        city: "", // Reset city when state changes
        cityName: "",
      });
    } else if (id === "city") {
      // Find the selected city to get its name
      const selectedCity = cities.find((city) => city.id.toString() === value);

      setFormData({
        ...formData,
        [id]: value,
        cityName: selectedCity?.name || "",
      });
    } else {
      // Normal field update
      setFormData({ ...formData, [id]: value });

      if (id === "email") {
        if (value && !validateEmail(value)) {
          setEmailError("Please enter a valid email address");
        } else {
          setEmailError("");
        }
      }

      if (id === "contact_number") {
        if (value && !validatePhone(value)) {
          setPhoneError("Phone number must be exactly 10 digits");
        } else {
          setPhoneError("");
        }
      }
    }
  };

  const validateForm = () => {
    if (!isPasswordValid) {
      toast.error("Please make your password strong first by fulfilling all requirements");
      return false;
    }
    if (isMode !== "popup" && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    if (!formData.email || !formData.contact_number) {
      toast.error("Please enter both email and phone number");
      return false;
    }
    if (emailError) {
      toast.error("Please fix the email error first");
      return false;
    }
    if (phoneError) {
      toast.error("Please fix the phone number error first");
      return false;
    }
    if (
      !formData.name ||
      !formData.role
    ) {
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
    const joinedOtp = otp.join("").trim();
    if (joinedOtp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    // Create the payload with nested location objects
    const { confirmPassword, countryName, stateName, cityName, ...signupData } =
      formData;

    // Add location info as objects
    const signupPayload = {
      ...signupData,
      otp,
    };

    // Add country, state, city as structured objects similar to ProfilePage
    if (formData.country) {
      const selectedCountry = countries.find(
        (country) => country.id.toString() === formData.country.toString()
      );
      if (selectedCountry) {
        signupPayload.country = {
          name: selectedCountry.name,
          iso2: selectedCountry.iso2,
        };
      }
    }

    if (formData.state) {
      const selectedState = states.find(
        (state) => state.id.toString() === formData.state.toString()
      );
      if (selectedState) {
        signupPayload.state = {
          name: selectedState.name,
          iso2: selectedState.iso2,
        };
      }
    }

    if (formData.city) {
      const selectedCity = cities.find(
        (city) => city.id.toString() === formData.city.toString()
      );
      if (selectedCity) {
        signupPayload.city = {
          name: selectedCity.name,
        };
      }
    }

    signupMutation.mutate(signupPayload);
  };

  const roleSpecificLabel =
    formData.role === "institute"
      ? "Institute Name"
      : formData.role === "counsellor"
        ? "Counsellor Name"
        : "Name";

  // Combined payment handler for both immediate test and schedule later
  const handleGuidancePayment = async (onSuccess) => {
    setIsLoading(true);
    const res = await loadRazorpayScript();

    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      setIsLoading(false);
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SPTvNCnEWS87X0",
      amount: 99 * 100, // Amount in paise
      currency: "INR",
      name: "Eduroutez",
      description: "Counselor Certification Test Fee",
      image: "/logo.png",
      handler: async function (response) {
        try {
          const paymentData = {
            amount: 99,
            transactionId: response.razorpay_payment_id,
            status: "success",
          };

          const apiResponse = await axiosInstance.post(
            `${apiUrl}/counselor-test/record-payment`,
            paymentData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );

          if (apiResponse.data.success || apiResponse.status === 200) {
            toast.success("Payment successful!");
            onSuccess();
          }
        } catch (error) {
          console.error("Error recording payment:", error);
          toast.error("Failed to record payment. Please contact support.");
        }
      },
      prefill: {
        name: formData.name || localStorage.getItem("userName") || "",
        email: formData.email || localStorage.getItem("email")?.replace(/^"|"$/g, "") || "",
      },
      theme: {
        color: "#b82025",
      },
      modal: {
        ondismiss: function () {
          setIsLoading(false);
        }
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    setIsLoading(false);
  };

  // Handler for schedule later button in GuidanceTestPopup
  const handleScheduleLater = () => {
    handleGuidancePayment(() => {
      openExclusivePopup("schedule");
    });
  };

  // Handler for payment button in GuidanceTestPopup (Pay & Give Test Now)
  const handleGuidancePay = () => {
    handleGuidancePayment(() => {
      closeAllFlowPopups();
      navigate("/counselor-test/exam");
    });
  };

  // Handler for scheduling test
  const handleScheduleTest = async (date, time) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axiosInstance.post(
        "/counselor/schedule-test",
        {
          date: date,
          slot: time,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Test scheduled successfully!");
    } catch (err) {
      toast.error("Failed to schedule test");
    }
    openExclusivePopup("confirmation");
  };

  const isFlowPopupOpen =
    showOtpDialog || showGuidancePopup || showSchedulePopup || showConfirmationPopup || showRolePopup;

  return (
    <div
      className={isPopupMode ? "w-full" : "w-full flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8"}
    >
      {!isFlowPopupOpen && (
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl flex py-6 sm:py-8 flex-col justify-start overflow-y-auto items-center px-5 sm:px-8 max-h-[92vh]">
        <div className="w-full flex items-center justify-center mb-5 relative">
          <img src={logo} alt="Eduroutez" className="h-10 w-auto mx-auto" />
          <button
            type="button"
            onClick={() => (isMode === "popup" && onClose ? onClose() : navigate("/"))}
            className="absolute right-0 top-0 text-gray-500 hover:text-gray-700"
            aria-label="Close signup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-center opacity-90 leading-tight mb-3">
          Register Now
        </h1>
        <p className="text-gray-500 mb-8 text-center">
          Please fill in the form to create an account
        </p>

        <form className="w-full max-w-sm" onSubmit={(e) => e.preventDefault()}>
          {/* Role Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="role">
              Who you are *
            </label>
            <select
              id="role"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Who you are</option>
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
              Name *
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

          {/* Location Selection */}
          {isMode !== "popup" && (
            <>
              {/* Country Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Country</label>
                <select
                  id="country"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={formData.country}
                  onChange={handleChange}
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
                <label className="block text-sm font-medium mb-1">State</label>
                <select
                  id="state"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={formData.state}
                  onChange={handleChange}
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
                <label className="block text-sm font-medium mb-1">City</label>
                <select
                  id="city"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={formData.city}
                  onChange={handleChange}
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
            </>
          )}

          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${emailError ? "border-red-500 focus:ring-red-500" : "focus:ring-red-500"
                }`}
              value={formData.email}
              onChange={handleChange}
              required
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1">{emailError}</p>
            )}
          </div>

          {/* Contact Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Contact *
            </label>
            <input
              type="tel"
              id="contact_number"
              placeholder="Enter your contact number"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${phoneError ? "border-red-500 focus:ring-red-500" : "focus:ring-red-500"
                }`}
              value={formData.contact_number}
              onChange={handleChange}
              required
            />
            {phoneError && (
              <p className="text-red-500 text-xs mt-1">{phoneError}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Create a password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 pr-10"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-[10px] text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <PasswordStrength
              password={formData.password}
              onValidationChange={(isValid) => setIsPasswordValid(isValid)}
            />
          </div>

          {/* Confirm Password Field */}
          {isMode !== "popup" && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 pr-10"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          )}

          {formData.role === "student" && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Referral Code
              </label>
              <input
                type="text"
                id="referralCode"
                placeholder="Enter your Referral Code"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.referralCode}
                onChange={handleChange}
              />
            </div>
          )}

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
          <span className="mx-2 text-gray-500 whitespace-nowrap text-sm">
            Or Sign Up with
          </span>
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
          Already have an account?{" "}
          {isMode === 'popup' ? (
            <button
              onClick={onSwitch}
              type="button"
              className="text-red-500 font-medium hover:underline"
            >
              Log in
            </button>
          ) : (
            <Link
              to="/login"
              state={{ backgroundLocation: location.state?.backgroundLocation || location }}
              className="text-red-500 font-medium hover:underline"
            >
              Log in
            </Link>
          )}
        </p>
      </div>
      )}

      {/* OTP Dialog */}
      {showOtpDialog && (
        <div className="fixed inset-0 z-[11000] flex items-center justify-center bg-slate-950/65 backdrop-blur-[2px] px-4 py-6 sm:px-6">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_30px_90px_rgba(15,23,42,0.35)] sm:p-6">
            {/* Header */}
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Verify OTP</h2>
                <p className="mt-1 text-sm text-slate-500">Secure verification for your signup</p>
              </div>
              <button
                onClick={() => setShowOtpDialog(false)}
                className="h-9 w-9 rounded-full text-gray-500 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close OTP popup"
              >
                <X className="mx-auto h-4 w-4" />
              </button>
            </div>

            <p className="mb-6 text-sm leading-relaxed text-slate-600">
              Please enter the OTP sent to your email and phone number.
            </p>

            {/* OTP Inputs */}
            <div className="mb-6 flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  ref={(el) => {
                    if (el) otpInputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={handleOtpPaste}
                  onFocus={(e) => e.target.select()}
                  className="h-12 w-12 rounded-xl border border-slate-300 bg-slate-50 text-center text-xl font-bold text-slate-800 transition focus:border-[#b82025] focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/40 sm:h-14 sm:w-14"
                  autoComplete="off"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {/* Countdown Timer & Resend OTP */}
            <div className="mb-6 text-center text-sm text-slate-600">
              {canResend ? (
                <button
                  onClick={() => {
                    handleSendOtp();
                    setTimer(90);
                    setCanResend(false);
                  }}
                  className="font-semibold text-[#b82025] hover:underline"
                >
                  Resend OTP
                </button>
              ) : (
                `Resend OTP in ${timer}s`
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-between gap-3">
              <button
                onClick={() => setShowOtpDialog(false)}
                className="w-1/2 rounded-xl border border-slate-300 bg-slate-100 px-4 py-2.5 font-medium text-slate-700 transition hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyOtp}
                className="w-1/2 rounded-xl bg-[#b82025] px-4 py-2.5 font-semibold text-white shadow-lg shadow-red-900/20 transition hover:bg-[#a11d21]"
              >
                Verify OTP
              </button>
            </div>
          </div>
        </div>
      )}
    {/* Guidance Test and Scheduling Popups for Counsellor */}
    <GuidanceTestPopup
      open={showGuidancePopup}
      onClose={() => setShowGuidancePopup(false)}
      onScheduleLater={handleScheduleLater}
      onPay={handleGuidancePay}
    />
    <ScheduleTestPopup
      open={showSchedulePopup}
      onClose={() => setShowSchedulePopup(false)}
      onSchedule={handleScheduleTest}
    />
    <ScheduleConfirmationPopup
      open={showConfirmationPopup}
      onClose={() => setShowConfirmationPopup(false)}
    />

    {/* Role popup for counsellor/admin */}
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
            Please log in to the correct portal for your role (Admin, Counsellor, or Institute).<br/>
            You cannot access this panel as a {formData.role} user.<br/>
            <span className="block mt-4">Go to: <a href="https://admin.eduroutez.com/" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Admin/Counsellor/Institute Portal</a> </span>
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
  );
  // Handler for schedule later button in GuidanceTestPopup
  // (already defined above the return statement)
};

export default Signup;
