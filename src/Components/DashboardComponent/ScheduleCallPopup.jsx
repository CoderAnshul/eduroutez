import React, { useState } from "react";
import axios from "axios"; // Install axios if not already installed
import { toast } from "react-toastify";
import axiosInstance from "../../ApiFunctions/axios";

const ScheduleCallPopup = ({ isOpen, onClose,counselor }) => {
  if (!isOpen) return null;

  console.log('counselor.email',counselor);
  const [formData, setFormData] = useState({
    date: "",
    timeSlot: "",
    email:counselor.email,
    studentEmail:localStorage.getItem('email')
  });

  const apiUrl=import.meta.env.VITE_BASE_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.date || !formData.timeSlot) {
      alert("Please fill in all fields");
      return;
    }

    try {
console.log("Form data:", formData);
const response = await axiosInstance.post(
  `${apiUrl}/bookslot`,
  { date: formData.date, slot: formData.timeSlot, email: formData.email, studentEmail: formData.studentEmail },
  {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem('accessToken'),
      'x-refresh-token': localStorage.getItem('refreshToken')
    }
  }
);
console.log(response);
if (response.status === 200) {
  toast.success("Slot booked successfully!");
  onClose();
} else if (response.status === 401) {
  toast.error("Unauthorized. Please log in again.");
}
    } catch (error) {
      console.error("Error booking slot:", error.message);
      alert("Failed to book the slot. Please try again.");
    }
  };

  if (!isOpen) return null;

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
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Time Slots <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                "15:39",
                "16:09",
                "17:09",
                "17:39",
                "18:09",
                "18:39",
                "19:09",
                "19:39",
                "20:09",
                "20:39",
                "21:09",
              ].map((time) => (
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
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
            >
              Discard
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleCallPopup;
