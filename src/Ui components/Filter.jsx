import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Filter = ({ filterSections, handleFilterChange, onFiltersChanged }) => {
  const [openSections, setOpenSections] = useState(
    filterSections.map(() => true)
  );

  const navigate = useNavigate();
  const location = useLocation();

  // Get parameters from URL
  const getParamFromURL = (param) => {
    const queryParams = new URLSearchParams(location.search);
    return param === "stream" 
      ? queryParams.get(param)?.split(",") || []
      : queryParams.get(param) || "";
  };

  const [selectedStreams, setSelectedStreams] = useState(getParamFromURL("stream"));
  const [selectedCity, setSelectedCity] = useState(getParamFromURL("city"));
  const [selectedState, setSelectedState] = useState(getParamFromURL("state"));

  // Find all selected values across all filter types
  const getAllSelectedValues = () => {
    const allSelected = [...selectedStreams];
    if (selectedCity) allSelected.push(selectedCity);
    if (selectedState) allSelected.push(selectedState);
    return allSelected;
  };

  // Update URL when any selection changes
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    
    // Handle streams (multi-select)
    if (selectedStreams.length > 0) {
      queryParams.set("stream", selectedStreams.join(","));
    } else {
      queryParams.delete("stream");
    }
    
    // Handle city (single select)
    if (selectedCity) {
      queryParams.set("city", selectedCity);
    } else {
      queryParams.delete("city");
    }
    
    // Handle state (single select)
    if (selectedState) {
      queryParams.set("state", selectedState);
    } else {
      queryParams.delete("state");
    }
    
    navigate(`?${queryParams.toString()}`, { replace: true });
    
    // Create API filter object with all selected filters
    const apiFilters = {};
    if (selectedStreams.length > 0) apiFilters.streams = selectedStreams;
    if (selectedCity) apiFilters.city = selectedCity;
    if (selectedState) apiFilters.state = selectedState;
    
    // Pass the complete filters object to parent component
    if (onFiltersChanged) {
      onFiltersChanged(apiFilters);
    }
  }, [selectedStreams, selectedCity, selectedState, navigate, location.search]);

  // Initialize component by firing handleFilterChange for URL params
  useEffect(() => {
    // Find the corresponding section for each parameter
    filterSections.forEach(section => {
      const sectionTitle = section.title.toLowerCase();
      
      if (sectionTitle === "streams" || sectionTitle === "stream") {
        selectedStreams.forEach(stream => {
          if (section.items.includes(stream)) {
            handleFilterChange(section.title, stream);
          }
        });
      }
      
      if (sectionTitle === "cities" || sectionTitle === "city") {
        if (selectedCity && section.items.includes(selectedCity)) {
          handleFilterChange(section.title, selectedCity);
        }
      }
      
      if (sectionTitle === "states" || sectionTitle === "state") {
        if (selectedState && section.items.includes(selectedState)) {
          handleFilterChange(section.title, selectedState);
        }
      }
    });
    
    // Also trigger API filters when component initializes
    const initialApiFilters = {};
    if (selectedStreams.length > 0) initialApiFilters.streams = selectedStreams;
    if (selectedCity) initialApiFilters.city = selectedCity;
    if (selectedState) initialApiFilters.state = selectedState;
    
    if (onFiltersChanged && (selectedStreams.length > 0 || selectedCity || selectedState)) {
      onFiltersChanged(initialApiFilters);
    }
  }, []);

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
    // Handle city (single-select)
    else if (sectionLower === "cities" || sectionLower === "city") {
      setSelectedCity(selectedCity === item ? "" : item);
    } 
    // Handle state (single-select)
    else if (sectionLower === "states" || sectionLower === "state") {
      setSelectedState(selectedState === item ? "" : item);
    }
    
    handleFilterChange(sectionTitle, item);
  };

  return (
    <div className="space-y-2">
      {filterSections.map((section, index) => (
        <div key={index} className="w-full border rounded-lg">
          <button
            onClick={() => toggleSection(index)}
            className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 text-sm font-medium text-gray-700"
          >
            <span>{section.title}</span>
            <svg
              className={`h-5 w-5 transform transition-transform ${
                openSections[index] ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
                  } else if (sectionLower === "cities" || sectionLower === "city") {
                    isChecked = selectedCity === item;
                  } else if (sectionLower === "states" || sectionLower === "state") {
                    isChecked = selectedState === item;
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