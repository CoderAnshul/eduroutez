import React, { useState } from 'react';
import { useMutation } from 'react-query';
import axiosInstance from '../ApiFunctions/axios';

const StudentDocument = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    aadhaar: null,
    pan: null,
    education: {
      institute: '',
      program: '',
      degree: '',
      startDate: '',
      endDate: '',
      certificate: null,
      description: '',
    },
  });

  const toggleModal = () => {
    setShowModal(!showModal);

    if (!showModal) {
      // Disable scrolling when modal is open
      document.body.classList.add('overflow-hidden');
    } else {
      // Enable scrolling when modal is closed
      document.body.classList.remove('overflow-hidden');
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleEducationChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      education: {
        ...prev.education,
        [name]: files ? files[0] : value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalFormData = new FormData();

    // Append Aadhaar and PAN files
    if (formData.aadhaar) finalFormData.append('adharCardImage', formData.aadhaar);
    if (formData.pan) finalFormData.append('panCardImage', formData.pan);

    // Append education fields
    Object.keys(formData.education).forEach((key) => {
      finalFormData.append(key, formData.education[key]);
    });

    // Mock API call
    // console.log('Final FormData:',finalFormData);
    mutate(formData);
  };
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: async (formData) => {
      const endpoint =`${apiUrl}/student`;
      const response = await axiosInstance({
        url: `${endpoint}`,
        method:'post',
        data: formData,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    },

    onSuccess: () => {
      alert('Profile Updated successfully!');
      // document.getElementById('questionForm').reset();
      // setPreviewUrl(null);
      // router.push('/dashboard/counselor');
    },
    onError: () => {
      alert('Something went wrong');
    }
  });

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      {/* Main Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">My Documents</h2>
        <button
          onClick={toggleModal}
          className="px-4 py-2 border-2 border-red-600 text-red-600 font-medium text-sm rounded-md hover:bg-red-50 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-50 flex items-center gap-2"
        >
          <i className="fa fa-plus"></i> Add Education
        </button>
      </div>

      {/* Document Section */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <i className="fa fa-folder text-gray-500"></i>
          <span className="font-medium text-gray-700">Documents</span>
        </div>
        <hr className="border-t border-gray-300" />
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Add Education</h2>
              <button
                onClick={toggleModal}
                className="text-red-500 hover:text-red-600 text-xl"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Institute <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="institute"
                  placeholder="Daffodil International University"
                  onChange={handleEducationChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Program <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="program"
                  placeholder="Ex: Computer Science And Engineering"
                  onChange={handleEducationChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Degree <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="degree"
                  placeholder="Ex: Bachelor"
                  onChange={handleEducationChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    name="startDate"
                    onChange={handleEducationChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    onChange={handleEducationChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Certificate Image</label>
                <input
                  type="file"
                  name="certificate"
                  onChange={handleEducationChange}
                  className="w-full text-gray-700 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  onChange={handleEducationChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  rows="3"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Discard
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  onClick={toggleModal}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDocument;
