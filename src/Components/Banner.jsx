import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setInput } from "../config/inputSlice";
import axios from "axios";
import Promotions from "../Pages/CoursePromotions"; // Import the Promotions component

const Banner = () => {
  const [inputField, setInputField] = useState("");
  const [searchType, setSearchType] = useState("course");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const baseURL = import.meta.env.VITE_BASE_URL;

  // Fetch suggestions based on input
  useEffect(() => {
    let isMounted = true;

    const fetchSuggestions = async () => {
      if (inputField.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);
      try {
        const endpoint =
          searchType === "counsellor" ? "counselors" : "institutes";
        console.log("Fetching from:", `${baseURL}/${endpoint}`);

        const response = await axios.get(`${baseURL}/${endpoint}`);
        console.log("API Response:", response.data);

        if (!isMounted) return;

        if (response.data?.data?.result) {
          const searchRegex = new RegExp(inputField, "i");
          let filteredResults = [];

          if (searchType === "counsellor") {
            filteredResults = response.data.data.result.filter(
              (counselor) =>
                searchRegex.test(counselor.firstname) ||
                searchRegex.test(counselor.lastname) ||
                (counselor.specialization &&
                  searchRegex.test(counselor.specialization))
            );
          } else if (searchType === "course") {
            // Extract all courses from institutes and flatten them into a single array
            filteredResults = response.data.data.result.reduce(
              (courses, institute) => {
                if (institute.courses) {
                  const matchingCourses = institute.courses
                    .filter((course) => searchRegex.test(course.courseTitle))
                    .map((course) => ({
                      courseTitle: course.courseTitle,
                      instituteName: institute.instituteName,
                      city: institute.city,
                      instituteId: institute._id,
                    }));
                  return [...courses, ...matchingCourses];
                }
                return courses;
              },
              []
            );
          } else {
            filteredResults = response.data.data.result.filter((institute) =>
              searchRegex.test(institute.instituteName)
            );
          }

          console.log("Filtered Results:", filteredResults);

          setSuggestions(filteredResults);
          setShowSuggestions(filteredResults.length > 0);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        if (isMounted) {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);

    return () => {
      isMounted = false;
      clearTimeout(debounceTimer);
    };
  }, [inputField, searchType, baseURL]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputField(value);
    if (value.length >= 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // In Banner.jsx
const handleSuggestionClick = (suggestion) => {
  if (searchType === "course") {
    setInputField(suggestion.courseTitle);
    dispatch(setInput(suggestion.courseTitle));
    navigate("/searchpage");
  } else if (searchType === "counsellor") {
    setInputField(suggestion.firstname + " " + suggestion.lastname);
    navigate(`/counselor?name=${encodeURIComponent(suggestion.firstname + " " + suggestion.lastname)}`);
  } else {
    // For institutes, include a search flag to indicate this came from search
    setInputField(suggestion.instituteName);
    dispatch(setInput(suggestion.instituteName));
    navigate("/searchpage?fromSearch=true");
  }
  setShowSuggestions(false);
};

const handleBtnClick = () => {
  if (inputField === "") {
    alert("Please enter something");
    return;
  }

  if (searchType === "counsellor") {
    navigate(`/counselor?name=${encodeURIComponent(inputField)}`);
  } else {
    dispatch(setInput(inputField));
    navigate("/searchpage?fromSearch=true");
  }
};

  return (
    // <div className="h-[480px] w-full relative">
    <div className="h-fit min-h-56 max-h-96 w-full relative mb-8 overflow-hidden">
      {/* Dynamic Promotions component instead of static banners */}
      <Promotions location="HOME_MAIN_PAGE" className="!h-full min-h-56 !mt-0" />

      <div className="h-full w-full bg-[#00000049] p-2 absolute top-0  z-10 flex flex-col items-center justify-center">
        <h1 className="text-4xl text-white text-center font-semibold mb-5">
          {searchType === "counsellor"
            ? "Find Expert Education Counsellors"
            : "Find Over 5000+ Colleges in India"}
        </h1>

        <div className="relative max-w-[800px] w-full">
          <div className="search ml-5 max-sm:ml-0 mr-5 h-12 bg-white border-[1.5px] relative border-gray-500 rounded-lg items-center gap-2 w-full max-lg:w-[95%] overflow-hidden flex">
            <select
              className="h-full max-sm:w-20 bg-gray-100 border-r border-gray-300 px-2 text-sm outline-none cursor-pointer"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="institute">Institute</option>
              <option value="course">Course</option>
              <option value="counsellor">Counsellor</option>
            </select>

            <div className="flex items-center w-4/5 pl-4 max-sm:pl-1 py-2 gap-3">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                className="text-sm w-1/2 max-lg:3/5 outline-none"
                type="text"
                value={inputField}
                onChange={handleInputChange}
                placeholder={
                  searchType === "counsellor"
                    ? "Search for counsellor names..."
                    : searchType === "course"
                    ? "Search for courses..."
                    : "Search for institutes..."
                }
              />
            </div>

            <button
              className="!h-full right-0 !rounded-sm w-1/5 max-sm:w-1/6 absolute top-0 bg-[#b82025] min-w-24 hover:bg-red-400 hover:scale-105 transition-all text-white"
              onClick={handleBtnClick}
            >
              Search
            </button>
          </div>

          {/* Suggestions dropdown with loading state */}
          {showSuggestions && (
            <div className="absolute ml-5 mr-5 mt-1 w-[calc(100%-40px)] bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto">
              {isLoading ? (
                <div className="px-4 py-2 text-gray-500">Loading...</div>
              ) : suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="font-medium">
                      {searchType === "course"
                        ? suggestion.courseTitle
                        : searchType === "counsellor"
                        ? suggestion.firstname + " " + suggestion.lastname
                        : suggestion.instituteName}
                    </div>
                    {searchType === "course" && (
                      <div className="text-sm text-gray-600">
                        {suggestion.instituteName} - {suggestion.cityName}
                      </div>
                    )}
                    {searchType === "counsellor" &&
                      suggestion.specialization && (
                        <div className="text-sm text-gray-600">
                          {suggestion.specialization}
                        </div>
                      )}
                    {searchType === "institute" && suggestion.cityName && (
                      <div className="text-sm text-gray-600">
                        {suggestion.cityName}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">No results found</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Banner;
