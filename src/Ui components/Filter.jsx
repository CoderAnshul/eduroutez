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

  // Ref to track if this is the initial mount (to prevent duplicate filter notifications)
  const isInitialMount = useRef(true);

  // Initialize filters from URL parameters when component mounts or URL changes
  useEffect(() => {
    // Skip URL update after initialization
    shouldUpdateUrl.current = false;

    const params = new URLSearchParams(location.search);

    // Handle all parameters as multi-select with comma separation
    const streamParam = params.get("stream");
    const streams = streamParam ? streamParam.split(",").map(s => s.trim()).filter(Boolean) : [];
    setSelectedStreams(streams);

    const cityParam = params.get("city");
    const cities = cityParam ? cityParam.split(",").map(c => c.trim()).filter(Boolean) : [];
    setSelectedCities(cities);

    const stateParam = params.get("state");
    const states = stateParam ? stateParam.split(",").map(s => s.trim()).filter(Boolean) : [];
    setSelectedStates(states);

    const orgTypeParam = params.get("organisationType");
    const orgTypes = orgTypeParam ? orgTypeParam.split(",").map(o => o.trim()).filter(Boolean) : [];
    setSelectedOrganisationTypes(orgTypes);

    const specParam = params.get("specialization");
    const specializations = specParam ? specParam.split(",").map(s => s.trim()).filter(Boolean) : [];
    setSelectedSpecializations(specializations);

    const feesParam = params.get("Fees");
    const fees = feesParam ? feesParam.split(",").map(f => f.trim()).filter(Boolean) : [];
    setSelectedFees(fees);

    const examParam = params.get("Exam");
    const exams = examParam ? examParam.split(",").map(e => e.trim()).filter(Boolean) : [];
    setSelectedExams(exams);

    const ratingsParam = params.get("Ratings");
    const ratings = ratingsParam ? ratingsParam.split(",").map(r => r.trim()).filter(Boolean) : [];
    setSelectedRatings(ratings);

    // Debug: Log filter states to help identify issues
    console.log("Filter states initialized from URL:", {
      streams,
      cities,
      states,
      orgTypes,
      specializations,
      fees,
      exams,
      ratings,
      url: location.search
    });

    // Update the prev search params ref
    prevSearchParams.current = location.search;

    // Notify parent component about filters from URL so it can fetch results
    // This is important for page refresh scenarios AND external navigation (e.g. from navbar)
    const apiFilters = {};
    if (streams.length > 0) apiFilters.streams = streams;
    if (cities.length > 0) apiFilters.city = cities;
    if (states.length > 0) apiFilters.state = states;
    if (orgTypes.length > 0) apiFilters.organisationType = orgTypes;
    if (specializations.length > 0) apiFilters.specialization = specializations;
    if (fees.length > 0) apiFilters.Fees = fees;
    if (exams.length > 0) apiFilters.Exam = exams;
    if (ratings.length > 0) apiFilters.Ratings = ratings;

    if (onFiltersChanged) {
      // If it's the initial mount or an external URL change (not triggered by this component)
      if (isInitialMount.current || !shouldUpdateUrl.current) {
        console.log("External URL change or initial mount detected, notifying parent:", apiFilters);
        // Use setTimeout to avoid calling during render or state updates
        setTimeout(() => {
          onFiltersChanged(apiFilters);
        }, 0);
      }
    }

    // Always mark initial mount as complete after first run
    isInitialMount.current = false;
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

  // Helper function to toggle items in array (case-insensitive)
  const toggleArrayItem = (array, setArray, item) => {
    // Find if item exists (case-insensitive)
    const itemIndex = array.findIndex(
      element => element.toLowerCase().trim() === item.toLowerCase().trim()
    );

    if (itemIndex !== -1) {
      // Item exists, remove it
      setArray(array.filter((_, index) => index !== itemIndex));
    } else {
      // Item doesn't exist, add it (use the original item name from the list)
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
              className={`w-5 h-5 transition-transform ${openSections[index] ? "transform rotate-180" : ""
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
            className={`overflow-y-scroll transition-all duration-300 ${openSections[index] ? "max-h-80" : "max-h-0"
              }`}
          >
            <div className="p-4 space-y-3">
              {section.items.length > 0 ? (
                section.items.map((item, idx) => {
                  const sectionLower = section.title.toLowerCase();
                  let isChecked = false;

                  // Helper function to check if item matches (case-insensitive)
                  const itemMatches = (selectedArray, itemToCheck) => {
                    return selectedArray.some(selected =>
                      selected.toLowerCase().trim() === itemToCheck.toLowerCase().trim()
                    );
                  };

                  // Check if item is selected based on section type (case-insensitive)
                  if (sectionLower === "streams" || sectionLower === "stream") {
                    isChecked = itemMatches(selectedStreams, item);
                  } else if (sectionLower === "city") {
                    isChecked = itemMatches(selectedCities, item);
                  } else if (sectionLower === "state") {
                    isChecked = itemMatches(selectedStates, item);
                  } else if (sectionLower === "organisationtype") {
                    isChecked = itemMatches(selectedOrganisationTypes, item);
                  } else if (sectionLower === "specialization") {
                    isChecked = itemMatches(selectedSpecializations, item);
                  } else if (sectionLower === "fees") {
                    isChecked = itemMatches(selectedFees, item);
                  } else if (sectionLower === "exam") {
                    isChecked = itemMatches(selectedExams, item);
                  } else if (sectionLower === "ratings") {
                    isChecked = itemMatches(selectedRatings, item);
                  }

                  return (
                    <label
                      key={idx}
                      className={`flex items-center text-sm cursor-pointer hover:ml-1 transition-all ${isChecked
                          ? "text-red-600 font-semibold bg-red-50 px-2 py-1 rounded"
                          : "text-gray-600 hover:text-red-500"
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCheckboxChange(section.title, item)}
                        className={`w-4 h-4 border-gray-300 rounded focus:ring-red-400 ${isChecked
                            ? "text-red-600 border-red-500"
                            : "text-blue-500"
                          }`}
                      />
                      <span className={`ml-2 ${isChecked ? "font-semibold" : ""}`}>
                        {item}
                      </span>
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