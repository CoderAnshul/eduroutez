import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'react-query';
import axiosInstance from '../ApiFunctions/axios';

const StudentDocument = () => {
  const [formData, setFormData] = useState({
    aadhaar: null,
    pan: null,
    profilePicture: null,
    aadhaarPreview: null,
    panPreview: null,
    profilePicturePreview: null,
  });

  const apiUrl = import.meta.env.VITE_BASE_URL;
  const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL;

  // Fetch student data
  const { data, isLoading, error } = useQuery('studentData', async () => {
    const userId = localStorage.getItem('userId');
    const response = await axiosInstance.get(`${apiUrl}/student/${userId}`, {
      headers: {
        'x-access-token': localStorage.getItem('accessToken'),
        'x-refresh-token': localStorage.getItem('refreshToken'),
      },
      withCredentials: true,
    });
    return response.data;
  });

  // Set initial previews from backend
  useEffect(() => {
    if (data?.data) {
      const initialFormData = {
        aadhaarPreview: data.data.adharCardImage 
          ? `${imageBaseUrl}/${data.data.adharCardImage}` 
          : null,
        panPreview: data.data.panCardImage 
          ? `${imageBaseUrl}/${data.data.panCardImage}` 
          : null,
        profilePicturePreview: data.data.profilePicture 
          ? `${imageBaseUrl}/${data.data.profilePicture}` 
          : null,
        aadhaar: null,
        pan: null,
        profilePicture: null
      };
      setFormData(initialFormData);
    }
  }, [data]);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    
    setFormData((prev) => ({
      ...prev, 
      [name]: file,
      [`${name}Preview`]: file ? URL.createObjectURL(file) : prev[`${name}Preview`]
    }));
  };

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
      alert('Documents uploaded successfully!');
    },
    onError: () => {
      alert('Upload failed');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalFormData = new FormData();
    
    if (formData.aadhaar) finalFormData.append('adharCardImage', formData.aadhaar);
    if (formData.pan) finalFormData.append('panCardImage', formData.pan);
    if (formData.profilePicture) finalFormData.append('profilePicture', formData.profilePicture);
    
    mutate(finalFormData);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading documents</div>;

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Documents</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Card</label>
          <input
            type="file"
            name="aadhaar"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.pdf"
            className="block w-full text-gray-700 border border-gray-300 rounded-md shadow-sm"
          />
          {formData.aadhaarPreview && (
            <div className="mt-2">
              <img 
                src={formData.aadhaarPreview} 
                alt="Aadhaar Card Preview" 
                className="max-h-48 w-auto object-contain rounded-md"
              />
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">PAN Card</label>
          <input
            type="file"
            name="pan"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.pdf"
            className="block w-full text-gray-700 border border-gray-300 rounded-md shadow-sm"
          />
          {formData.panPreview && (
            <div className="mt-2">
              <img 
                src={formData.panPreview} 
                alt="PAN Card Preview" 
                className="max-h-48 w-auto object-contain rounded-md"
              />
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
          <input
            type="file"
            name="profilePicture"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png"
            className="block w-full text-gray-700 border border-gray-300 rounded-md shadow-sm"
          />
          {formData.profilePicturePreview && (
            <div className="mt-2">
              <img 
                src={formData.profilePicturePreview} 
                alt="Profile Picture Preview" 
                className="max-h-48 w-auto object-contain rounded-md"
              />
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting || (!formData.aadhaar && !formData.pan && !formData.profilePicture)}
        className="mt-6 px-4 py-2 bg-red-600 text-white font-medium text-sm rounded-md hover:bg-red-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Uploading...' : 'Upload Documents'}
      </button>
    </div>
  );
};

export default StudentDocument;
