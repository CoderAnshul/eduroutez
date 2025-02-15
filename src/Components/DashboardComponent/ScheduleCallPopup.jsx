import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import {Link} from "react-router-dom";

const ScheduleCallPopup = ({ isOpen, onClose, counselor }) => {
  const [formData, setFormData] = useState({
    date: "",
    timeSlot: "",
    counselorId: counselor?._id ?? "",
    studentId: localStorage.getItem("userId"),
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [counselorSchedule, setCounselorSchedule] = useState(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const apiUrl = import.meta.env.VITE_BASE_URL;
  const isLoggedIn = !!localStorage.getItem("accessToken");

  useEffect(() => {
    const loadRazorpayScript = () => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => console.log("Razorpay script loaded");
        script.onerror = () => console.error("Failed to load Razorpay script");
        document.body.appendChild(script);
    };

    loadRazorpayScript();

    const fetchCounselorSchedule = async () => {
      try {
        const response = await fetch(`${apiUrl}/counselorslots/${counselor?.email ?? ""}`);
        const data = await response.json();
        if (data?.data) {
          setCounselorSchedule(data.data);
        }
      } catch (error) {
        console.error("Error fetching counselor schedule:", error);
        toast.error("Failed to fetch counselor's schedule");
      }
    };

    if (isOpen) {
      fetchCounselorSchedule();
    }
  }, [isOpen, counselor?.email, apiUrl]);

  useEffect(() => {
    if (!formData.date || !counselorSchedule) return;

    const generateTimeSlots = () => {
      const date = new Date(formData.date);
      const dayOfWeek = date.getDay();
      const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
      const currentDay = days[dayOfWeek];

      const startTime = counselorSchedule?.[`${currentDay}Start`] ?? "";
      const endTime = counselorSchedule?.[`${currentDay}End`] ?? "";

      if (!startTime || !endTime) {
        setAvailableSlots([]);
        return;
      }

      const slots = [];
      let currentTime = new Date(`2000-01-01T${startTime}`);
      const endDateTime = new Date(`2000-01-01T${endTime}`);

      while (currentTime < endDateTime) {
        const timeString = currentTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        slots.push(timeString);
        currentTime.setMinutes(currentTime.getMinutes() + 30);
      }

      setAvailableSlots(slots);
    };

    generateTimeSlots();
  }, [formData.date, counselorSchedule]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.date || !formData.timeSlot) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!isLoggedIn) {
      setShowLoginDialog(true);
      return;
    }

    try {
      const options = {
        key: "rzp_test_1DP5mmOlF5G5ag",
        amount: 50000,
        currency: "INR",
        name: "Your App Name",
        description: "Slot Booking Fee",
        handler: async (response) => {
          try {
            const bookingResponse = await fetch(`${apiUrl}/bookslot`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem("accessToken"),
                'x-refresh-token': localStorage.getItem("refreshToken"),
              },
              body: JSON.stringify({
                date: formData.date,
                slot: formData.timeSlot,
                counselorId: counselor._id,
                studentId: formData.studentId,
                paymentId: response.razorpay_payment_id,
              }),
            });

            if (bookingResponse.ok) {
              toast.success("Slot booked successfully!");
            } else {
              toast.error("Failed to book slot after payment.");
            }
          } catch (error) {
            console.error("Error booking slot:", error);
            toast.error("Booking failed. Please contact support.");
          }
        },
        prefill: {
          email: formData.studentEmail,
          contact: formData.phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.log('erroe',error.message)
      toast.error("Payment initialization failed. Please try again.");
    }
  };

  if (!isOpen) return null;

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Schedule Call</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Schedule Call Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={today}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Time Slots <span className="text-red-500">*</span>
              </label>
              {availableSlots.length > 0 ? (
                <div className="mt-2 grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                  {availableSlots.map((time) => (
                    <label key={time} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="timeSlot"
                        value={time}
                        checked={formData.timeSlot === time}
                        onChange={handleChange}
                        className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                        required
                      />
                      <span className="text-sm text-gray-900">{time}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-gray-500">
                  {formData.date 
                    ? "No slots available for selected date" 
                    : "Please select a date to view available slots"}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formData.date || !formData.timeSlot}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Book Slot
              </button>
            </div>
          </form>
        </div>
      </div>

      {showLoginDialog && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-12 rounded-lg shadow-2xl transform transition-all duration-300 scale-95 hover:scale-100 w-1/3">
            <h3 className="text-2xl font-semibold mb-8 text-center text-gray-800">
              Hey there! You'll need to log in first to book a session with our counselor. This helps us provide you with the best possible experience.
            </h3>
            
            <div className="flex justify-center space-x-6">
              <button
                type="button"
                onClick={() => setShowLoginDialog(false)}
                className="bg-gray-600 text-white px-8 py-4 rounded-lg shadow-lg transition-all duration-300 hover:bg-gray-700 focus:outline-none"
              >
                Close
              </button>
              <Link
          to="/login"
          onClick={() => setShowLoginDialog(false)}
          className="bg-red-600 text-white px-8 py-4 rounded-lg shadow-lg transition-all duration-300 hover:bg-red-700 focus:outline-none"
        >
          Log In
        </Link>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </>
  );
};

export default ScheduleCallPopup;