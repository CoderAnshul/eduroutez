import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PersonalInfo from "../Components/Stepperparts/PersonalInfo";
// import VerifyDetails from "../Components/Stepperparts/VerifyDetails";
import InputReview from "../Components/Stepperparts/InputReview";
import UploadDocument from "../Components/Stepperparts/UploadDocument";
import SocialLinks from "../Components/Stepperparts/SocialLinks";
import Feedback from "../Components/Stepperparts/Feedback";
import { Link } from "react-router-dom";
import { createReview } from "../ApiFunctions/api";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import Promotions from "./CoursePromotions";
import successImage from "../assets/Images/check.png";

const Writereview = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [formData, setFormData] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  console.log("Form Data:");
  console.log(formData);
  const submit = useSelector((store) => store.input.allFields);

  const steps = [
    "Personal Info",
    "Verify Details",
    "Write Review",
    "Upload Document",
    "Social Links",
    "Feedback",
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      if (!submit) {
        toast.error("All fields are required");
      } else {
        setCurrentStep(currentStep + 1);
      }
    } else if (currentStep === steps.length - 1) {
      const errors = handleSubmit(formData);
      if (!errors) {
        setIsModalOpen(true); // Open the modal only after successful submission
      }
    }
  };

  const { data, isLoading, isError, error } = useQuery(
    ["review", formData],
    () => createReview(formData),
    {
      enabled: !!formData && isSubmit,
      onSuccess: () => {
        toast.success("Review created successfully!");
        setFormData(null);
        setIsModalOpen(true);

        setIsSubmit(false);
      },
      onError: () => {
        toast.error("Error creating review");
        setIsSubmit(false);
      },
    }
  );

  const handleSubmit = (newFormData) => {
    console.log("Submitting form data:", newFormData);
    const validateForm = () => {
      const newErrors = {
        reviewTitle: !newFormData.reviewTitle?.trim()
          ? "Review title is required"
          : "",
        placementDescription: !newFormData.placementDescription?.trim()
          ? "Placement description is required"
          : newFormData.placementDescription?.length < 100
          ? "Placement description must be at least 100 characters"
          : "",
        facultyDescription: !newFormData.facultyDescription?.trim()
          ? "Faculty description is required"
          : newFormData.facultyDescription?.length < 100
          ? "Faculty description must be at least 100 characters"
          : "",
        campusLifeDescription: !newFormData.campusLifeDescription?.trim()
          ? "Campus description is required"
          : newFormData.campusLifeDescription?.length < 100
          ? "Campus description must be at least 100 characters"
          : "",
        suggestionDescription: !newFormData.suggestionDescription?.trim()
          ? "Suggestions are required"
          : newFormData.suggestionDescription?.length < 100
          ? "Suggestions must be at least 100 characters"
          : "",
        recommendation: !newFormData.recommendation
          ? "Recommendation is required"
          : "",
      };

      return newErrors;
    };

    const errors = validateForm();
    const hasErrors = Object.values(errors).some((error) => error !== "");

    if (hasErrors) {
      toast.error("Please fill in all required fields correctly.");
      console.error("Validation Errors:", errors);
      return errors;
    }

    setFormData(newFormData);
    setIsSubmit(false);
    return null;
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfo
            formData={formData}
            setFormData={setFormData}
            setIsSubmit={setIsSubmit}
          />
        );
      case 2:
        return (
          <InputReview
            formData={formData}
            setFormData={setFormData}
            setIsSubmit={setIsSubmit}
          />
        );
      case 3:
        return (
          <UploadDocument
            formData={formData}
            setFormData={setFormData}
            setIsSubmit={setIsSubmit}
          />
        );
      case 4:
        return (
          <SocialLinks
            formData={formData}
            setFormData={setFormData}
            setIsSubmit={setIsSubmit}
          />
        );
      case 5:
        return (
          <Feedback
            formData={formData}
            setFormData={setFormData}
            setIsSubmit={setIsSubmit}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (isSubmit) {
      console.log(formData);
    }
  }, [isSubmit]);

  return (
    <>
      <ToastContainer />
      <div className="w-full items-center max-w-4xl h-[90px] overflow-hidden mx-auto">
        <Promotions location="REVIEW_PAGE" className="h-[90px]" />
      </div>
      <div className="p-3 h-fit pb-14 bg-white relative flex flex-col">
        <div className=" p-2 md:p-6 rounded h-full relative  shadow flex-1">
          {renderStepContent()}
        </div>

        <div className="absolute bottom-0 left-0 w-full bg-white border-t shadow-md">
          <div className="w-full h-2 bg-gray-300 relative">
            <div
              className="h-2 bg-red-500 transition-all duration-500 ease-in-out"
              style={{
                width: `${(currentStep / steps.length) * 100}%`,
              }}
            ></div>
          </div>

          <div className="flex justify-between px-6 py-4">
            <button
              onClick={prevStep}
              disabled={currentStep == 1}
              className={`px-4 py-2 ${
                currentStep == 1 ? "bg-gray-300" : "bg-gray-500"
              } text-white rounded`}
            >
              Previous
            </button>
            <button
              onClick={nextStep}
              className={`px-4 py-2 ${
                currentStep == steps.length - 1
                  ? "px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                  : "px-4 py-2 bg-red-500 text-white rounded"
              }`}
            >
              {currentStep == steps.length - 1 ? "Submit" : "Next"}
            </button>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white flex flex-col items-center  pt-10 rounded-lg shadow-lg p-6 w-96">
              <img className="h-20 w-20 mb-4" src={successImage} />
              <h2 className="text-2xl font-bold text-gray-800">Thank you!</h2>
              <p className="mt-2 text-center  text-gray-600">
                Thank you for submitting your review. We appreciate your
                feedback!
              </p>
              <div className="flex mt-4 justify-center">
                <Link to="/">
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
    </>
  );
};

export default Writereview;
