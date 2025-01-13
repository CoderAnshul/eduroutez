import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useMutation } from "react-query";

const EditProfile = () => {
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    dob: '',
    gender: '',
    designation: '',
    about: '',
    address: '',
    country: ''
  });
  const [message, setMessage] = useState('');

  // Fetch user points and initial profile data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = Cookies.get('userId'); // Get user ID from cookies
        if (!userId) throw new Error("User ID not found in cookies");

        const response = await axios.get("http://localhost:4001/api/v1/user/", {
          withCredentials: true,
        });

        setUserData({
          name: response.data.data.name,
          phone: response.data.data.contact_number,
          dob: response.data.data.dob,
          gender: response.data.data.gender,
          designation: response.data.data.designation,
          about: response.data.data.about,
          address: response.data.data.address,
          country: response.data.data.country,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage("Failed to fetch user data.");
      }
    };

    fetchUserData();
  }, []);

  const apiUrl = import.meta.env.VITE_BASE_URL;
  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: async (finalFormData) => {
      const endpoint = `${apiUrl}/student`;
      const response = await axios.post(endpoint, finalFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: () => {
      alert('Profile Updated successfully!');
    },
    onError: () => {
      alert('Something went wrong');
    },
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const finalFormData = new FormData();
    finalFormData.append("name", userData.name);
    finalFormData.append("phone", userData.phone);
    finalFormData.append("dob", userData.dob);
    finalFormData.append("gender", userData.gender);
    finalFormData.append("designation", userData.designation);
    finalFormData.append("about", userData.about);
    finalFormData.append("address", userData.address);
    finalFormData.append("country", userData.country);

    mutate(finalFormData); // Call the mutation to update profile
  };

  return (
    <div className="p-2 md:p-2 border border-gray-300 rounded-lg">
      <div className="max-w-6xl mx-auto bg-gray-50 rounded-lg shadow-md p-8">
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
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={userData.phone}
                  onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-2">
                  Date Of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={userData.dob}
                  onChange={(e) => setUserData({ ...userData, dob: e.target.value })}
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  value={userData.gender}
                  onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
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
                  value={userData.designation}
                  onChange={(e) => setUserData({ ...userData, designation: e.target.value })}
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-2">About</label>
                <textarea
                  value={userData.about}
                  onChange={(e) => setUserData({ ...userData, about: e.target.value })}
                  className="w-full border rounded px-4 py-2"
                  rows="4"
                />
              </div>
              <div>
                <label className="block font-medium mb-2">Profile Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded w-full h-32 flex items-center justify-center">
                  <div className="text-gray-500">Upload Image</div>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  NB: Profile size will 100px x 100px and not more than 1MB.
                </p>
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
                  value={userData.address}
                  onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div>
                <label className="block font-medium mb-2">Country</label>
                <select
                  value={userData.country}
                  onChange={(e) => setUserData({ ...userData, country: e.target.value })}
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
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save & Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
