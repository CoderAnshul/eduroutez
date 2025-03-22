import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Filter = ({ filterSections, handleFilterChange, selectedFilters, onFiltersChanged }) => {
  const [openSections, setOpenSections] = useState(
    filterSections.map(() => true)
  );

  const navigate = useNavigate();
  const location = useLocation();

  // Change all filter values to arrays for multi-select
  const [selectedStreams, setSelectedStreams] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedOrganisationTypes, setSelectedOrganisationTypes] = useState([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [selectedFees, setSelectedFees] = useState([]);
  const [selectedExams, setSelectedExams] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  
  // Ref to track if we need to update URL
  const shouldUpdateUrl = useRef(false);
  
  // Ref to store previous URL search params
  const prevSearchParams = useRef(location.search);
  
  // Initialize filters from URL parameters when component mounts or URL changes
  useEffect(() => {
    // Skip URL update after initialization
    shouldUpdateUrl.current = false;
    
    const params = new URLSearchParams(location.search);
    
    // Handle all parameters as multi-select with comma separation
    const streamParam = params.get("stream");
    setSelectedStreams(streamParam ? streamParam.split(",") : []);
    
    const cityParam = params.get("city");
    setSelectedCities(cityParam ? cityParam.split(",") : []);
    
    const stateParam = params.get("state");
    setSelectedStates(stateParam ? stateParam.split(",") : []);
    
    const orgTypeParam = params.get("organisationType");
    setSelectedOrganisationTypes(orgTypeParam ? orgTypeParam.split(",") : []);
    
    const specParam = params.get("specialization");
    setSelectedSpecializations(specParam ? specParam.split(",") : []);
    
    const feesParam = params.get("Fees");
    setSelectedFees(feesParam ? feesParam.split(",") : []);
    
    const examParam = params.get("Exam");
    setSelectedExams(examParam ? examParam.split(",") : []);
    
    const ratingsParam = params.get("Ratings");
    setSelectedRatings(ratingsParam ? ratingsParam.split(",") : []);
    
    // Update the prev search params ref
    prevSearchParams.current = location.search;
  }, [location.search]);
  
  // Separate effect for updating URL and notifying parent
  useEffect(() => {
    // Skip URL update if we're just initializing from URL
    if (!shouldUpdateUrl.current) {
      return;
    }
    
    // Create query params
    const queryParams = new URLSearchParams();
    if (selectedStreams.length > 0) queryParams.set("stream", selectedStreams.join(","));
    if (selectedCities.length > 0) queryParams.set("city", selectedCities.join(","));
    if (selectedStates.length > 0) queryParams.set("state", selectedStates.join(","));
    if (selectedOrganisationTypes.length > 0) queryParams.set("organisationType", selectedOrganisationTypes.join(","));
    if (selectedSpecializations.length > 0) queryParams.set("specialization", selectedSpecializations.join(","));
    if (selectedFees.length > 0) queryParams.set("Fees", selectedFees.join(","));
    if (selectedExams.length > 0) queryParams.set("Exam", selectedExams.join(","));
    if (selectedRatings.length > 0) queryParams.set("Ratings", selectedRatings.join(","));
    
    // Only update URL if it actually changed
    const newSearchParams = queryParams.toString();
    if (newSearchParams !== prevSearchParams.current.substring(1)) {
      navigate(`?${newSearchParams}`, { replace: true });
      prevSearchParams.current = `?${newSearchParams}`;
    }
    
    // Create filters object for API
    const apiFilters = {};
    if (selectedStreams.length > 0) apiFilters.streams = selectedStreams;
    if (selectedCities.length > 0) apiFilters.city = selectedCities;
    if (selectedStates.length > 0) apiFilters.state = selectedStates;
    if (selectedOrganisationTypes.length > 0) apiFilters.organisationType = selectedOrganisationTypes;
    if (selectedSpecializations.length > 0) apiFilters.specialization = selectedSpecializations;
    if (selectedFees.length > 0) apiFilters.Fees = selectedFees;
    if (selectedExams.length > 0) apiFilters.Exam = selectedExams;
    if (selectedRatings.length > 0) apiFilters.Ratings = selectedRatings;
    
    // Notify parent of filter changes
    if (onFiltersChanged) {
      onFiltersChanged(apiFilters);
    }
  }, [
    selectedStreams, 
    selectedCities, 
    selectedStates, 
    selectedOrganisationTypes, 
    selectedSpecializations,
    selectedFees,
    selectedExams,
    selectedRatings,
    navigate,
    onFiltersChanged
  ]);

  const toggleSection = (index) => {
    setOpenSections((prev) =>
      prev.map((isOpen, i) => (i === index ? !isOpen : isOpen))
    );
  };

  // Updated to handle all filters as multi-select
  const handleCheckboxChange = (sectionTitle, item) => {
    // Set flag to update URL on next effect run
    shouldUpdateUrl.current = true;
    
    const sectionLower = sectionTitle.toLowerCase();
    
    // Handle all filter types as multi-select
    if (sectionLower === "streams" || sectionLower === "stream") {
      toggleArrayItem(selectedStreams, setSelectedStreams, item);
    } 
    else if (sectionLower === "city") {
      toggleArrayItem(selectedCities, setSelectedCities, item);
    } 
    else if (sectionLower === "state") {
      toggleArrayItem(selectedStates, setSelectedStates, item);
    }
    else if (sectionLower === "organisationtype") {
      toggleArrayItem(selectedOrganisationTypes, setSelectedOrganisationTypes, item);
    }
    else if (sectionLower === "specialization") {
      toggleArrayItem(selectedSpecializations, setSelectedSpecializations, item);
    }
    else if (sectionLower === "fees") {
      toggleArrayItem(selectedFees, setSelectedFees, item);
    }
    else if (sectionLower === "exam") {
      toggleArrayItem(selectedExams, setSelectedExams, item);
    }
    else if (sectionLower === "ratings") {
      toggleArrayItem(selectedRatings, setSelectedRatings, item);
    }
    
    // Call parent component's handleFilterChange
    if (handleFilterChange) {
      handleFilterChange(sectionTitle, item);
    }
  };
  
  // Helper function to toggle items in array
  const toggleArrayItem = (array, setArray, item) => {
    const isSelected = array.includes(item);
    if (isSelected) {
      setArray(array.filter(element => element !== item));
    } else {
      setArray([...array, item]);
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
                  
                  // Check if item is selected based on section type
                  if (sectionLower === "streams" || sectionLower === "stream") {
                    isChecked = selectedStreams.includes(item);
                  } else if (sectionLower === "city") {
                    isChecked = selectedCities.includes(item);
                  } else if (sectionLower === "state") {
                    isChecked = selectedStates.includes(item);
                  } else if (sectionLower === "organisationtype") {
                    isChecked = selectedOrganisationTypes.includes(item);
                  } else if (sectionLower === "specialization") {
                    isChecked = selectedSpecializations.includes(item);
                  } else if (sectionLower === "fees") {
                    isChecked = selectedFees.includes(item);
                  } else if (sectionLower === "exam") {
                    isChecked = selectedExams.includes(item);
                  } else if (sectionLower === "ratings") {
                    isChecked = selectedRatings.includes(item);
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