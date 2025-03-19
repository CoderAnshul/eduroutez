import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Filter = ({ filterSections, handleFilterChange, selectedFilters, onFiltersChanged }) => {
  const [openSections, setOpenSections] = useState(
    filterSections.map(() => true)
  );

  const navigate = useNavigate();
  const location = useLocation();

  // Create state variables for each filter type
  const [selectedStreams, setSelectedStreams] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedOrganisationType, setSelectedOrganisationType] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedFees, setSelectedFees] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedRatings, setSelectedRatings] = useState("");
  
  // Initialize filters from URL parameters when component mounts
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // Handle stream parameter (multi-select)
    const streamParam = params.get("stream");
    if (streamParam) {
      const streams = streamParam.split(",");
      setSelectedStreams(streams);
    }
    
    // Handle single-select parameters
    if (params.get("city")) setSelectedCity(params.get("city"));
    if (params.get("state")) setSelectedState(params.get("state"));
    if (params.get("organisationType")) setSelectedOrganisationType(params.get("organisationType"));
    if (params.get("specialization")) setSelectedSpecialization(params.get("specialization"));
    if (params.get("Fees")) setSelectedFees(params.get("Fees"));
    if (params.get("Exam")) setSelectedExam(params.get("Exam"));
    if (params.get("Ratings")) setSelectedRatings(params.get("Ratings"));
  }, [location.search]);
  
  // Initialize local state from selectedFilters prop when it changes
  useEffect(() => {
    // Don't update if initialized with empty values
    if (!selectedStreams.length && !selectedCity && !selectedState && 
        !selectedOrganisationType && !selectedSpecialization && !selectedFees && 
        !selectedExam && !selectedRatings) {
      return;
    }
    
    // Create filter object for API
    const apiFilters = {};
    if (selectedStreams.length > 0) apiFilters.streams = selectedStreams;
    if (selectedCity) apiFilters.city = [selectedCity];
    if (selectedState) apiFilters.state = [selectedState];
    if (selectedOrganisationType) apiFilters.organisationType = [selectedOrganisationType];
    if (selectedSpecialization) apiFilters.specialization = [selectedSpecialization];
    if (selectedFees) apiFilters.Fees = [selectedFees];
    if (selectedExam) apiFilters.Exam = [selectedExam];
    if (selectedRatings) apiFilters.Ratings = [selectedRatings];
    
    // Update URL without reloading
    const queryParams = new URLSearchParams();
    if (selectedStreams.length > 0) queryParams.set("stream", selectedStreams.join(","));
    if (selectedCity) queryParams.set("city", selectedCity);
    if (selectedState) queryParams.set("state", selectedState);
    if (selectedOrganisationType) queryParams.set("organisationType", selectedOrganisationType);
    if (selectedSpecialization) queryParams.set("specialization", selectedSpecialization);
    if (selectedFees) queryParams.set("Fees", selectedFees);
    if (selectedExam) queryParams.set("Exam", selectedExam);
    if (selectedRatings) queryParams.set("Ratings", selectedRatings);
    
    navigate(`?${queryParams.toString()}`, { replace: true });
    
    // Add a condition to prevent the feedback loop
    const currentFilters = JSON.stringify(selectedFilters);
    const newFilters = JSON.stringify(apiFilters);
    
    // Only notify parent if filters actually changed
    if (onFiltersChanged && currentFilters !== newFilters) {
      onFiltersChanged(apiFilters);
    }
  }, [
    selectedStreams, 
    selectedCity, 
    selectedState, 
    selectedOrganisationType, 
    selectedSpecialization,
    selectedFees,
    selectedExam,
    selectedRatings,
    // Add this dependency:
    selectedFilters
  ]);

  const toggleSection = (index) => {
    setOpenSections((prev) =>
      prev.map((isOpen, i) => (i === index ? !isOpen : isOpen))
    );
  };

  const handleCheckboxChange = (sectionTitle, item) => {
    const sectionLower = sectionTitle.toLowerCase();
    
    // Handle streams (multi-select)
    if (sectionLower === "streams" || sectionLower === "stream") {
      const isSelected = selectedStreams.includes(item);
      let updatedStreams;
      
      if (isSelected) {
        updatedStreams = selectedStreams.filter((stream) => stream !== item);
      } else {
        updatedStreams = [...selectedStreams, item];
      }
      
      setSelectedStreams(updatedStreams);
    } 
    // Handle other filter types (all single-select)
    else if (sectionLower === "city") {
      setSelectedCity(selectedCity === item ? "" : item);
    } 
    else if (sectionLower === "state") {
      setSelectedState(selectedState === item ? "" : item);
    }
    else if (sectionLower === "organisationtype") {
      setSelectedOrganisationType(selectedOrganisationType === item ? "" : item);
    }
    else if (sectionLower === "specialization") {
      setSelectedSpecialization(selectedSpecialization === item ? "" : item);
    }
    else if (sectionLower === "fees") {
      setSelectedFees(selectedFees === item ? "" : item);
    }
    else if (sectionLower === "exam") {
      setSelectedExam(selectedExam === item ? "" : item);
    }
    else if (sectionLower === "ratings") {
      setSelectedRatings(selectedRatings === item ? "" : item);
    }
    
    // Call parent component's handleFilterChange
    if (handleFilterChange) {
      handleFilterChange(sectionTitle, item);
    }
  };

  return (
    <div className="space-y-2">
      {filterSections.map((section, index) => (
        <div
          key={index}
          className="border border-gray-300 rounded-lg overflow-hidden"
        >
          <button
            className="flex justify-between items-center w-full bg-white p-4 hover:bg-gray-50"
            onClick={() => toggleSection(index)}
          >
            <span className="font-medium capitalize">{section.title}</span>
            <svg
              className={`w-5 h-5 transition-transform ${
                openSections[index] ? "transform rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>

          <div
            className={`overflow-y-scroll transition-all duration-300 ${
              openSections[index] ? "max-h-80" : "max-h-0"
            }`}
          >
            <div className="p-4 space-y-3">
              {section.items.length > 0 ? (
                section.items.map((item, idx) => {
                  const sectionLower = section.title.toLowerCase();
                  let isChecked = false;
                  
                  if (sectionLower === "streams" || sectionLower === "stream") {
                    isChecked = selectedStreams.includes(item);
                  } else if (sectionLower === "city") {
                    isChecked = selectedCity === item;
                  } else if (sectionLower === "state") {
                    isChecked = selectedState === item;
                  } else if (sectionLower === "organisationtype") {
                    isChecked = selectedOrganisationType === item;
                  } else if (sectionLower === "specialization") {
                    isChecked = selectedSpecialization === item;
                  } else if (sectionLower === "fees") {
                    isChecked = selectedFees === item;
                  } else if (sectionLower === "exam") {
                    isChecked = selectedExam === item;
                  } else if (sectionLower === "ratings") {
                    isChecked = selectedRatings === item;
                  }
                  
                  return (
                    <label
                      key={idx}
                      className="flex items-center text-sm text-gray-600 cursor-pointer hover:text-red-500 hover:ml-1 transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCheckboxChange(section.title, item)}
                        className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
                      />
                      <span className="ml-2">{item}</span>
                    </label>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500">No items found</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Filter;