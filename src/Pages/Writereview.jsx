import  { useEffect, useState } from "react";
import PersonalInfo from "../Components/Stepperparts/PersonalInfo";
// import VerifyDetails from "../Components/Stepperparts/VerifyDetails";
import InputReview from "../Components/Stepperparts/InputReview";
import UploadDocument from "../Components/Stepperparts/UploadDocument";
import SocialLinks from "../Components/Stepperparts/SocialLinks";
import Feedback from "../Components/Stepperparts/Feedback";
import { Link } from "react-router-dom";
import {createReview} from '../ApiFunctions/api';
import { useQuery } from "react-query";
import { useSelector } from 'react-redux';
// import { useMutation, useQuery } from '@tanstack/react-query';

const Writereview = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [formData,setFormData]=useState({});
  const [isSubmit,setIsSubmit]=useState(false);

  const submit = useSelector(store=> store.input.allFields)
  // console.log("submit" + submit)


  // Total Steps
  const steps = [
    "Personal Info",
    "Verify Details",
    "Write Review",
    "Upload Document",
    "Social Links",
    "Feedback",
  ];

  // Move to the next step
  const nextStep = () => {
    if (currentStep < steps.length) {
      if(!submit){
        alert("All fields are required")
      }else{
        setCurrentStep(currentStep + 1);
      }
       
    } else {
      handleSubmit(formData);
      setIsModalOpen(true); // Open modal when "Submit" is clicked
    }
  };

  const { data, isLoading, isError, error } = useQuery(
    ["review", formData],
    () => createReview(formData),
    {
        enabled: !!formData && isSubmit, // Only run the query when formData is set and submitting
        onSuccess: () => {
            // Reset formData after success
            setFormData(null);
            setIsSubmit(false);
        },
        onError: () => {
            setIsSubmit(false);
        }
    }
);

// Handle submit
const handleSubmit = (newFormData) => {
    setFormData(newFormData); // Set the form data for query to trigger
    setIsSubmit(true); // Start submitting
};

// You can handle states like loading, error, success here
if (isLoading) {
    console.log("Loading review creation...");
}

if (isError) {
    console.error("Error creating review:", error);
}

if (data) {
    console.log("Review created successfully:", data);
}


  // Move to the previous step
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Render Step Components
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfo setFormData={setFormData} setIsSubmit={setIsSubmit} />;
      // case 2:
      //   return <VerifyDetails />;
      case 2:
        return <InputReview setFormData={setFormData} setIsSubmit={setIsSubmit}/>;
      case 3:
        return <UploadDocument setFormData={setFormData} setIsSubmit={setIsSubmit}/>;
      case 4:
        return <SocialLinks setFormData={setFormData} setIsSubmit={setIsSubmit}/>;
      case 5:
        return <Feedback setFormData={setFormData} setIsSubmit={setIsSubmit}/>;
      default:
        return null;
    }
  };

  console.log(formData);
  console.log(isSubmit);

  useEffect(() => {
    if(isSubmit){
      console.log(formData);
    }
  }, [isSubmit])
  

  return (
    <div className="p-3 h-[600px] pb-14 bg-white relative flex flex-col">
      {/* Step Content */}
      <div className=" p-2 md:p-6 rounded h-[300px] relative overflow-hidden shadow flex-1">
        {renderStepContent()}
      </div>

      {/* Stepper Bar and Navigation Buttons */}
      <div className="absolute bottom-0 left-0 w-full bg-white border-t shadow-md">
        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-300 relative">
          <div
            className="h-2 bg-red-500 transition-all duration-500 ease-in-out"
            style={{
              width: `${(currentStep / steps.length) * 100}%`,
            }}
          ></div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between px-6 py-4">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-4 py-2 ${
              currentStep === 1 ? "bg-gray-300" : "bg-gray-500"
            } text-white rounded`}
          >
            Previous
          </button>
          <button
            onClick={nextStep}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            {currentStep === steps.length ? "Submit" : "Next"}
          </button>
        </div>
      </div>

      {/* Modal for Submission */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold text-gray-800">
              Review Submitted!
            </h2>
            <p className="mt-2 text-gray-600">
              Thank you for submitting your review. We appreciate your
              feedback!
            </p>
           <div className="flex justify-center">
           <Link to='/'>
           <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Go Home
            </button>
           </Link>
           </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Writereview;
