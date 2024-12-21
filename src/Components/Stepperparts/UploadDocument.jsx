import React, { useState } from "react";

const UploadDocument = ({ setFormData, setIsSubmit }) => {
  const [studentIdImage, setStudentIdImage] = useState(null); // State for Student ID/Marksheets
  const [selfieImage, setSelfieImage] = useState(null); // State for Selfie

  // Handle image upload
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      if (type === "studentId") {
        setStudentIdImage(imageUrl);
        setFormData((prevFormData) => ({
          ...prevFormData,
          studentIdImage: file,
        }));
      } else if (type === "selfie") {
        setSelfieImage(imageUrl);
        setFormData((prevFormData) => ({
          ...prevFormData,
          selfieImage: file,
        }));
      }
    }
  };

  // Handle removing the image
  const handleRemoveImage = (type) => {
    if (type === "studentId") {
      setStudentIdImage(null);
      setFormData((prevFormData) => ({
        ...prevFormData,
        studentIdImage: null,
      }));
    } else if (type === "selfie") {
      setSelfieImage(null);
      setFormData((prevFormData) => ({
        ...prevFormData,
        selfieImage: null,
      }));
    }
  };

  return (
    <div className="flex flex-col items-center h-full">
      <div className="w-full flex flex-col items-center max-w-4xl p-6 bg-white rounded-lg h-[480px] overflow-y-scroll scrollbar-thumb-red">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800">Upload Documents</h1>

        {/* Subtitle */}
        <p className="mt-1 text-sm text-gray-500">
          Make sure to upload a clear picture before you upload your documents
        </p>

        {/* Upload Boxes */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          {/* Left Box - Student ID */}
          <div className="w-64 h-40 border border-gray-300 rounded-lg bg-gray-100 flex flex-col items-center justify-center relative">
            {studentIdImage ? (
              <img
                src={studentIdImage}
                alt="Student ID"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <p className="text-gray-500">Student Id / Marksheets</p>
            )}
            {!studentIdImage ? (
              <label
                htmlFor="studentIdInput"
                className="absolute bottom-2 px-3 py-1 text-sm rounded-sm bg-blue-500 text-white cursor-pointer"
              >
                Upload Image
              </label>
            ) : (
              <button
                onClick={() => handleRemoveImage("studentId")}
                className="absolute bottom-2 px-3 py-1 text-sm rounded-sm bg-red-500 text-white cursor-pointer"
              >
                Remove
              </button>
            )}
            <input
              id="studentIdInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, "studentId")}
            />
          </div>

          {/* Right Box - Selfie */}
          <div className="w-64 h-40 border border-gray-300 rounded-sm bg-gray-100 flex flex-col items-center justify-center relative">
            {selfieImage ? (
              <img
                src={selfieImage}
                alt="Selfie"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <p className="text-gray-500">Upload Your Selfie</p>
            )}
            {!selfieImage ? (
              <label
                htmlFor="selfieInput"
                className="absolute bottom-2 px-3 py-1 text-sm rounded-sm bg-blue-500 text-white cursor-pointer"
              >
                Upload Image
              </label>
            ) : (
              <button
                onClick={() => handleRemoveImage("selfie")}
                className="absolute bottom-2 px-3 py-1 text-sm rounded-sm bg-red-500 text-white cursor-pointer"
              >
                Remove
              </button>
            )}
            <input
              id="selfieInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, "selfie")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadDocument;
