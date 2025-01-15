import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import axiosInstance from "../ApiFunctions/axios";
import Cookies from "js-cookie";
import axios from "axios";

const VITE_BASE_URL=import.meta.env.VITE_BASE_URL;

// Fetch the user data
const fetchUserData = async () => {
  const userId = Cookies.get('userId');
  if (!userId) {
    throw new Error("User ID not found in cookies");
  }
  const response = await axios.get(`${VITE_BASE_URL}/user/`, {
    withCredentials: 'include',
  });
  return response.data.data;
};

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dateOfBirth: "",
    gender: "Male",
    designation: "",
    about: "",
    address: "",
    country: "",
  });

  const apiUrl = import.meta.env.VITE_BASE_URL;

  // Fetch user data
  const { data: userData, isLoading } = useQuery("userData", fetchUserData, {
    onSuccess: (data) => {
      setFormData({
        name: data.name,
        phone: data.contact_number,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        designation: data.designation,
        about: data.about,
        address: data.address,
        country: data.country,
      });
    },
    onError: (error) => {
      alert("Error fetching user data: " + error.message);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = Cookies.get('userId');
      if (!userId) {
        throw new Error("User ID not found in cookies");
      }
      const updatedForm = { ...formData, email: Cookies.get('email')?.replace(/^"|"$/g, '') };
      mutate({ userId, updatedForm });
    } catch (error) {
      alert("Some error occurred!");
    }
  };

  const { mutate, isLoading: isSubmitting } = useMutation({
    mutationFn: async ({ userId, updatedForm }) => {
      const endpoint = `${apiUrl}/user/${userId}`; // PATCH request URL
      const response = await axiosInstance.patch(endpoint, updatedForm, { // Use PATCH here
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: () => {
      alert("Profile updated successfully!");
    },
    onError: () => {
      alert("Something went wrong");
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-2 md:p-2 rounded-lg">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold mb-6">My Profile</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              <div className="mb-4">
                <label className="block font-medium mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Anshul Sharma"
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="7999967578"
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-2">
                  Date Of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            {/* About Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">About Information</h2>
              <div className="mb-4">
                <label className="block font-medium mb-2">Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="UI/UX Designer | Product Designer | Mobile App Expert"
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-2">About</label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  placeholder="About Myself"
                  className="w-full border rounded px-4 py-2"
                  rows="4"
                />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter Your Address"
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div>
                <label className="block font-medium mb-2">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                >
                  <option>Select Country...</option>
                  <option>India</option>
                  <option>USA</option>
                  <option>UK</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8">
            <button
              type="submit"
              className="px-6 py-3 bg-red-500 text-white font-semibold rounded shadow-md hover:bg-red-600 transition"
            >
              Save & Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
