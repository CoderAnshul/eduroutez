import React, { useState, useEffect } from "react";
import { toast,ToastContainer } from "react-toastify";
import axiosInstance from "../../ApiFunctions/axios";
import loadRazorpayScript from "../../loadRazorpayScript";

const ScheduleCallPopup = ({ isOpen, onClose, counselor, onLoginOpen }) => {
  const [formData, setFormData] = useState({
    date: "",
    timeSlot: "",
    counselorId: counselor?._id ?? "",
    studentId: localStorage.getItem("userId"),
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [counselorSchedule, setCounselorSchedule] = useState(null);

  const apiUrl = import.meta.env.VITE_BASE_URL;

  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem("accessToken");

  // Fetch counselor's schedule
  useEffect(() => {
    const fetchCounselorSchedule = async () => {
      try {
        const response = await axiosInstance.get(`${apiUrl}/counselorslots/${counselor?.email ?? ""}`);
        if (response.data?.data) {
          setCounselorSchedule(response.data.data);
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

  // Generate time slots based on selected date
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
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.date || !formData.timeSlot) {
      toast.error("Please fill in all fields");
      return;
    }

    // Check if the user is logged in
    if (!isLoggedIn) {
      toast.error("You must be logged in to book a slot.");
      onLoginOpen(); 
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error("Failed to load payment gateway. Please try again.");
      return;
    }

    const options = {
      key: "rzp_test_1DP5mmOlF5G5ag", // Replace with your Razorpay Key
      amount: 50000, // 500 Rs in paise
      currency: "INR",
      name: "Your App Name",
      description: "Slot Booking Fee",
      handler: async function (response) {
        try {
          const bookingResponse = await axiosInstance.post(
            `${apiUrl}/bookslot`,
            {
              date: formData.date,
              slot: formData.timeSlot,
              counselorId: counselor._id,
              studentId: formData.studentEmail,
              paymentId: response.razorpay_payment_id,
            },
            {
              headers: {
                "Content-Type": "application/json",
                "x-access-token": localStorage.getItem("accessToken"),
                "x-refresh-token": localStorage.getItem("refreshToken"),
              },
            }
          );

          if (bookingResponse) {
            onClose();
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
  };

  if (!isOpen) return null;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed p-4 inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Schedule Call</h2>
          <button onClick={onClose} className="text-red-500 hover:text-red-700">
            <i className="fa fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Schedule Call Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={today}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Time Slots <span className="text-red-500">*</span>
            </label>
            {availableSlots.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                {availableSlots.map((time) => (
                  <label key={time} className="flex items-center">
                    <input
                      type="radio"
                      name="timeSlot"
                      value={time}
                      checked={formData.timeSlot === time}
                      onChange={handleChange}
                      className="mr-2"
                      required
                    />
                    {time}
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                {formData.date ? "No slots available for selected date" : "Please select a date to view available slots"}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Discard
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              disabled={!formData.date || !formData.timeSlot}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ScheduleCallPopup;
