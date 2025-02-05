import React, { useState } from "react";
import Rating from "@mui/material/Rating";

const InputReview = ({ setFormData, setIsSubmit }) => {
  const [ratings, setRatings] = useState({
    placementStars: 0,
    facultyStars: 0,
    campusLifeStars: 0,
    suggestionsStars: 0,
  });

  const [errors, setErrors] = useState({
    placementDescription: "",
    facultyDescription: "",
    campusLifeDescription: "",
    suggestionDescription: "",
  });

  const handleRatingChange = (category, newValue) => {
    setRatings((prev) => {
      const updatedRatings = { ...prev, [category]: newValue };
      setFormData((prevFormData) => ({
        ...prevFormData,
        ratings: updatedRatings,
      }));
      return updatedRatings;
    });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));

    if (value.length < 100) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: "Description must be at least 100 characters long.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: "",
      }));
    }
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col items-center h-full">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg h-[480px] overflow-y-scroll scrollbar-thumb-red">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold">Write Review</h1>
          <p className="text-sm text-gray-500 mt-2">
            Ensure Your Review Is Original, Descriptive, Concise, And Free From
            Slang, Abusive Language, Or Copied Content.
          </p>
        </div>

        {/* Form Section */}
        <form className="space-y-8">
          {/* Review Title */}
          <div>
            <label
              htmlFor="reviewTitle"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Give Your Review A Title
            </label>
            <input
              type="text"
              id="reviewTitle"
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300 focus:outline-none"
              placeholder="Enter your review title"
            />
          </div>

          {/* Placements */}
          <div>
            <label
              htmlFor="placements"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Placements
            </label>
            <Rating
              value={ratings.placements}
              onChange={(event, newValue) =>
                handleRatingChange("placementStars", newValue)
              }
            />
            <textarea
              id="placementDescription"
              onChange={handleInputChange}
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300 focus:outline-none mt-2"
              placeholder="Write your review on placements..."
            ></textarea>
            {errors.placementDescription && (
              <p className="text-red-500 text-sm mt-1">
                {errors.placementDescription}
              </p>
            )}
          </div>

          {/* Faculty / Course Content */}
          <div>
            <label
              htmlFor="facultyStars"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Faculty / Course Content
            </label>
            <Rating
              value={ratings.faculty}
              onChange={(event, newValue) =>
                handleRatingChange("facultyStars", newValue)
              }
            />
            <textarea
              id="facultyDescription"
              onChange={handleInputChange}
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300 focus:outline-none mt-2"
              placeholder="Write your review on faculty or course content..."
            ></textarea>
            {errors.facultyDescription && (
              <p className="text-red-500 text-sm mt-1">
                {errors.facultyDescription}
              </p>
            )}
          </div>

          {/* Campus / Hostel */}
          <div>
            <label
              htmlFor="campusLifeStars"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Campus / Hostel
            </label>
            <Rating
              value={ratings.campus}
              onChange={(event, newValue) =>
                handleRatingChange("campusLifeStars", newValue)
              }
            />
            <textarea
              id="campusLifeDescription"
              onChange={handleInputChange}
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300 focus:outline-none mt-2"
              placeholder="Write your review on campus or hostel..."
            ></textarea>
            {errors.campusLifeDescription && (
              <p className="text-red-500 text-sm mt-1">
                {errors.campusLifeDescription}
              </p>
            )}
          </div>

          {/* Suggestions */}
          <div>
            <label
              htmlFor="suggestions"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Suggestions
            </label>
            <Rating
              value={ratings.suggestions}
              onChange={(event, newValue) =>
                handleRatingChange("suggestionsStars", newValue)
              }
            />
            <textarea
              id="suggestionDescription"
              onChange={handleInputChange}
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300 focus:outline-none mt-2"
              placeholder="Write your suggestions..."
            ></textarea>
            {errors.suggestionDescription && (
              <p className="text-red-500 text-sm mt-1">
                {errors.suggestionDescription}
              </p>
            )}
          </div>

          {/* Recommendation */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Would you recommend others to take admission in your college?
            </p>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="recommendation"
                  value={true}
                  onChange={handleRadioChange}
                  className="w-4 h-4 border-gray-300 focus:ring focus:ring-indigo-300"
                />
                Yes
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="recommendation"
                  value={false}
                  onChange={handleRadioChange}
                  className="w-4 h-4 border-gray-300 focus:ring focus:ring-indigo-300"
                />
                No
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputReview;
