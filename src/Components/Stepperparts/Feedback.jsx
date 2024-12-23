import React, { useState } from 'react'

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

const Feedback = ({ setFormData, setIsSubmit }) => {
  const [formState, setFormState] = useState({});

  const handleChange = (sectionTitle, option) => {
    setFormState((prevState) => ({
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
    console.log('done1');
    setIsSubmit(true);
    console.log('done');
    console.log('Form Data Submitted:', formState);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full overflow-x-hidden">
      <div className="w-full flex flex-col max-w-4xl items-center md:block p-6 bg-white rounded-lg h-[480px] overflow-y-scroll scrollbar-thumb-red">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-center text-gray-800">
          Social Links
        </h1>
        <p className="mt-1 text-sm text-center text-gray-500">
          Check twice before you paste your social handle's link
        </p>

        {/* Form */}
        <form className="mt-14 space-y-8 mx-auto md:px-10" onSubmit={handleSubmit}>
          {formSections.map((section, index) => (
            <div key={index}>
              <h2 className="text-lg font-medium text-gray-700">{section.title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                {section.options.map((option, i) => (
                  <label key={i} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2 border-gray-300 focus:ring-blue-500"
                      checked={formState[section.title]?.[option] || false}
                      onChange={() => handleChange(section.title, option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
