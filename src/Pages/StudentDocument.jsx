import React, { useState } from 'react';
import { useMutation } from 'react-query';
import axiosInstance from '../ApiFunctions/axios';

const StudentDocument = () => {
  const [formData, setFormData] = useState({
    aadhaar: null,
    pan: null,
  });

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalFormData = new FormData();

    // Append Aadhaar and PAN files
    if (formData.aadhaar) finalFormData.append('adharCardImage', formData.aadhaar);
    if (formData.pan) finalFormData.append('panCardImage', formData.pan);

    // Mock API call
    mutate(finalFormData);
  };

  const apiUrl = import.meta.env.VITE_BASE_URL;
  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: async (finalFormData) => {
      const endpoint = `${apiUrl}/student`;
      const response = await axiosInstance({
        url: endpoint,
        method: 'post',
        data: finalFormData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-access-token': localStorage.getItem('accessToken'),
          'x-refresh-token': localStorage.getItem('refreshToken'),
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

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      {/* Main Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">My Documents</h2>
      </div>

      {/* Aadhaar and PAN Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Card</label>
          <input
            type="file"
            name="aadhaar"
            onChange={handleFileChange}
            className="block w-full text-gray-700 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">PAN Card</label>
          <input
            type="file"
            name="pan"
            onChange={handleFileChange}
            className="block w-full text-gray-700 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 px-4 py-2 bg-red-600 text-white font-medium text-sm rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-50"
      >
        Upload Documents
      </button>
    </div>
  );
};

export default StudentDocument;
