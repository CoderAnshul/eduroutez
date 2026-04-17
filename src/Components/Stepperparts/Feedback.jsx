import React, { useState } from "react";

const formSections = [
  {
    title: "Select Industry Exposure (Choose As Applicable)",
    options: [
      "Guest lecture by visiting faculty",
      "Internship",
      "No practical exposure",
      "Research projects",
    ],
  },
  {
    title: "Select Your Academic Schedule (Choose As Applicable)",
    options: [
      "Less than 15 lectures per week",
      "More than 15 lectures per week",
      "Around 5-6 lectures per week",
      "More than 20 lectures per week",
    ],
  },
  {
    title: "Select Your Academic Schedule (Choose As Applicable)",
    options: ["Off-campus and unstructured", "Flexible working hours"],
  },
  {
    title: "Select The Entrepreneurship Level (Choose As Applicable)",
    options: ["Not active", "Highly active"],
  },
  {
    title: "Select The Test And Exam Patterns (Choose As Applicable)",
    options: ["Weekly", "Semester", "Monthly", "Annual"],
  },
  {
    title: "Select The Dress Code On Campus (Choose As Applicable)",
    options: ["Uniform", "No dress code", "Flexible dress code"],
  },
  {
    title: "Select Sports Facilities At Your College (Choose As Applicable)",
    options: [
      "Multiple sports grounds",
      "No sports grounds",
      "Coaching is provided",
      "No coaching is provided",
    ],
  },
  {
    title: "Select The Placement Level (Choose As Applicable)",
    options: [
      "Extensive placement process",
      "Few placement drives",
      "Non-functional placement",
      "High-salary range offered",
    ],
  },
  {
    title: "Select Teaching Methodology At College (Choose As Applicable)",
    options: [
      "Lectures are the session plan",
      "Additional student clearing sessions",
      "Deviation from the session plan",
      "Project Assignment, Workshops, Study Tools, Industrial Visit",
    ],
  },
  {
    title: "Select The Library Level (Choose As Applicable)",
    options: [
      "Out-dated textbooks available",
      "Limited books available",
      "No books available",
    ],
  },
  {
    title: "Select The Events Calendar For The College (Choose As Applicable)",
    options: [
      "2-3 events per week",
      "No scheduled plan",
      "Workshops and seminars are conducted regularly",
      "Annual event calendar followed",
    ],
  },
  {
    title: "Select Support Services For Students On Campus",
    options: [
      "Dedicated teachers/student reps are available",
      "Low designed teachers/student reps are available",
    ],
  },
  {
    title: "Select Your Hostel Mess Food Quality (Choose As Applicable)",
    options: [
      "Healthy and quality food",
      "No food items are available",
      "Unhealthy and hygienic food",
      "Nutrient’s best diet plan available",
    ],
  },
  {
    title: "Select Your Hostel Mess Food Quality (Choose As Applicable)",
    options: [
      "All modes of transport available",
      "Limited modes of transport available",
    ],
  },
];

const Feedback = ({ formData, setFormData, setIsSubmit }) => {
  const [formState, setFormState] = useState({});

  const handleChange = (sectionTitle, option) => {
    setFormState((prevState) => ({
      ...prevState,
      [sectionTitle]: {
        ...prevState[sectionTitle],
        [option]: !prevState[sectionTitle]?.[option], // Toggle option
      },
    }));

    setFormData((prevState) => ({
      ...prevState,
      [sectionTitle]: {
        ...prevState[sectionTitle],
        [option]: !prevState[sectionTitle]?.[option], // Toggle option
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // setFormData({ ...formState });
    console.log("done1");
    setIsSubmit(true);
    console.log("done");
    console.log("Form Data Submitted:", formState);
  };

  return (
    <div className="flex flex-col items-center justify-start h-full overflow-x-hidden pt-4">
      <div className="w-full flex-1 flex flex-col max-w-4xl p-6 bg-white rounded-lg overflow-y-auto scrollbar-thumb-red">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-[#b82025]">
          Your Experience Survey
        </h1>

        {/* Form */}
        <form
          className="mt-8 space-y-6 mx-auto md:px-10 mb-10 w-full"
          onSubmit={handleSubmit}
        >
          {formSections.map((section, index) => (
            <div 
              key={index} 
              className="bg-gray-50/50 p-6 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:bg-white group"
            >
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#b82025] rounded-full inline-block"></span>
                {section.title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 mt-4">
                {section.options.map((option, i) => (
                  <label 
                    key={i} 
                    className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group/label"
                  >
                    <input
                      type="checkbox"
                      className="w-5 h-5 mr-3 accent-[#b82025] cursor-pointer"
                      checked={formData[section.title]?.[option] || false}
                      onChange={() => handleChange(section.title, option)}
                    />
                    <span className="text-gray-600 group-hover/label:text-gray-900 font-medium">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          {/* <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Submit
          </button> */}
        </form>
      </div>
    </div>
  );
};

export default Feedback;
