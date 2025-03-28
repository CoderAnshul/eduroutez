import React, { useState } from "react";

const UploadDocument = ({ formData, setFormData, setIsSubmit }) => {
  const [studentIdImage, setStudentIdImage] = useState(
    formData?.studentIdImage || null
  ); // State for Student ID/Marksheets
  const [selfieImage, setSelfieImage] = useState(null); // State for Selfie
  const [studentIdPreview, setStudentIdPreview] = useState(
    formData?.studentIdPreview || null
  ); // State for Student ID Preview
  const [selfiePreview, setSelfiePreview] = useState(
    formData?.selfiePreview || null
  ); // State for Selfie Preview

  const handleImageUpload = (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Read the file as data URL
      reader.onloadend = () => {
        if (type === "studentId") {
          setStudentIdImage(file);
          setStudentIdPreview(reader.result);
          // Set the preview for studentIdImage
          setFormData((prevFormData) => ({
            ...prevFormData,
            studentIdImage: file,
            studentIdPreview: reader.result, // Store preview in formData
          }));
        } else if (type === "selfie") {
          setSelfieImage(file);
          setSelfiePreview(reader.result); // Set the preview for selfieImage
          setFormData((prevFormData) => ({
            ...prevFormData,
            selfieImage: file,
            selfiePreview: reader.result, // Store preview in formData
          }));
        }
      };
    }
  };

  // Handle removing the image
  const handleRemoveImage = (type) => {
    if (type === "studentId") {
      setStudentIdImage(null);
      setStudentIdPreview(null); // Clear the preview
      setFormData((prevFormData) => ({
        ...prevFormData,
        studentIdImage: null,
      }));
    } else if (type === "selfie") {
      setSelfieImage(null);
      setSelfiePreview(null); // Clear the preview
      setFormData((prevFormData) => ({
        ...prevFormData,
        selfieImage: null,
      }));
    }
  };

  return (
    <div className="flex flex-col items-center h-full">
      <div className="w-full flex flex-col items-center p-6 bg-white rounded-lg h-[480px] overflow-y-scroll scrollbar-thumb-red">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800">
          Upload Documents
        </h1>

        {/* Subtitle */}
        <p className="mt-1 text-sm text-gray-500">
          Make sure to upload a clear picture before you upload your documents
        </p>

        {/* Upload Boxes */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          {/* Left Box - Student ID */}
          <div className="w-64 h-40 border border-gray-300 rounded-lg bg-gray-100 flex flex-col items-center justify-center relative">
            {studentIdPreview ? (
              <img
                src={studentIdPreview || formData?.studentIdPreview}
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
                className="absolute bottom-2 px-3 py-1 text-sm rounded-sm bg-[#b82025] text-white cursor-pointer"
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
            {selfiePreview ? (
              <img
                src={selfiePreview || formData?.selfiePreview}
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
                className="absolute bottom-2 px-3 py-1 text-sm rounded-sm bg-[#b82025] text-white cursor-pointer"
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
