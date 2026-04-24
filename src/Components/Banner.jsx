import { useState, useEffect } from "react";
import useModal from "./Modal/useModal";
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
  const [isSearching, setIsSearching] = useState(false);
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isBannerLoading, setIsBannerLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showAlert } = useModal();
  const baseURL = import.meta.env.VITE_BASE_URL;
  const imageUrl = import.meta.env.VITE_IMAGE_BASE_URL;

  // Fetch homepage banners from /banners API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setIsBannerLoading(true);
        const accessToken = localStorage.getItem("accessToken");

        const response = await axios.get(`${baseURL}/banners`, {
          headers: {
            "Content-Type": "application/json",
            ...(accessToken
              ? { Authorization: `Bearer ${accessToken}` }
              : {}),
          },
        });

        // According to the latest sample response, banners are in response.data.data.result
        const rawData = response?.data?.data?.result;

        if (Array.isArray(rawData) && rawData.length > 0) {
          const validBanners = rawData.filter(
            (item) => item && Array.isArray(item.images) && item.images.length > 0
          );

          setBanners(validBanners);
          setCurrentBannerIndex(0);
        } else {
          setBanners([]);
        }
      } catch (error) {
        console.error("Error fetching banner:", error);
        setBanners([]);
      } finally {
        setIsBannerLoading(false);
      }
    };

    fetchBanners();
  }, [baseURL]);

  // Auto-slide banners if more than one is available
  useEffect(() => {
    if (!banners || banners.length <= 1) return;

    const intervalId = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // 5 seconds per slide

    return () => clearInterval(intervalId);
  }, [banners]);

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
        let filteredResults = [];

        if (searchType === "course") {
          // Dedicated course search
          const response = await axios.get(
            `${baseURL}/courses?search=${encodeURIComponent(inputField)}&limit=20&page=0`
          );
          console.log("Course API Response:", response.data);

          if (!isMounted) return;

          const courseResult = response.data?.data?.result || response.data?.result || [];
          filteredResults = courseResult.map((course) => {
            const inst = course.institute || {};
            const cityData = course.city || inst.city || "";
            const cityName = typeof cityData === "object" ? cityData.name : cityData;

            return {
              courseTitle: course.courseTitle || course.name || "Untitled Course",
              instituteName: inst.instituteName || course.instituteName || "",
              cityName: cityName || "",
              courseId: course._id,
              slug: course.slug,
            };
          });
        } else if (searchType === "counsellor") {
          // Dedicated counsellor search
          const response = await axios.get(
            `${baseURL}/counselors?search=${encodeURIComponent(inputField)}&limit=20&page=1`
          );
          console.log("Counsellor API Response:", response.data);

          if (!isMounted) return;

          const counsellorResult = response.data?.data?.result || response.data?.result || [];
          filteredResults = counsellorResult.map((counselor) => ({
            firstname: counselor.firstname,
            lastname: counselor.lastname,
            specialization: counselor.specialization,
            _id: counselor._id,
          }));
        } else {
          // Institute search using searchFields
          const searchFields = JSON.stringify({ instituteName: inputField });
          const response = await axios.get(`${baseURL}/institutes`, {
            params: { searchFields, limit: 20, page: 1 },
          });
          console.log("Institute API Response:", response.data);

          if (!isMounted) return;

          const instituteResult = response.data?.data?.result || response.data?.result || [];
          filteredResults = instituteResult.map((institute) => {
            const cityData = institute.city || "";
            const cityName = typeof cityData === "object" ? cityData.name : cityData;
            return {
              instituteName: institute.instituteName,
              cityName: cityName || "",
              slug: institute.slug,
              _id: institute._id,
            };
          });
        }

        if (!isMounted) return;
        console.log("Filtered Results:", filteredResults);
        setSuggestions(filteredResults);
        setShowSuggestions(filteredResults.length > 0);
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

    // Increased debounce time to reduce API calls
    const debounceTimer = setTimeout(fetchSuggestions, 500);

    return () => {
      isMounted = false;
      clearTimeout(debounceTimer);
    };
  }, [inputField, searchType, baseURL]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputField(value);
  };

  // In Banner.jsx
  const handleSuggestionClick = (suggestion) => {
    if (searchType === "course") {
      setInputField(suggestion.courseTitle);
      dispatch(setInput(suggestion.courseTitle));
      navigate("/searchpage?fromSearch=true&searchType=course");
    } else if (searchType === "counsellor") {
      setInputField(suggestion.firstname + " " + suggestion.lastname);
      navigate(`/counselor?name=${encodeURIComponent(suggestion.firstname + " " + suggestion.lastname)}`);
    } else {
      // For institutes, include a search flag to indicate this came from search
      setInputField(suggestion.instituteName);
      dispatch(setInput(suggestion.instituteName));
      navigate("/searchpage?fromSearch=true&searchType=institute");
    }
    setShowSuggestions(false);
  };

  const handleBtnClick = async () => {
    if (inputField === "") {
      showAlert("Please enter something");
      return;
    }

    setIsSearching(true);

    // Navigate immediately - no artificial delay
    if (searchType === "counsellor") {
      navigate(`/counselor?name=${encodeURIComponent(inputField)}`);
      setIsSearching(false);
    } else {
      dispatch(setInput(inputField));
      navigate(`/searchpage?fromSearch=true&searchType=${searchType}`);
      // Reset loading state immediately after navigation
      setIsSearching(false);
    }
    setShowSuggestions(false);
  };

  const currentBanner =
    banners && banners.length > 0 ? banners[currentBannerIndex] : null;

  return (
    // <div className="h-[480px] w-full relative">
    <div className="h-fit min-h-56 max-h-96 w-full relative mb-8">
    {/* <div className="h-fit min-h-56 max-h-96 w-full relative mb-8"> */}
      {/* Background banner slider from /banners API, fallback to Promotions */}
      {banners.length > 0 && !isBannerLoading ? (
        <div className="relative w-full h-full group">
          {banners[currentBannerIndex]?.destinationLink ? (
            <a
              href={banners[currentBannerIndex].destinationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full"
              tabIndex={0}
              aria-label={banners[currentBannerIndex]?.title || 'Banner'}
            >
              <img
                src={`${imageUrl}/${banners[currentBannerIndex].images[0]}`}
                alt={banners[currentBannerIndex].title || "Banner"}
                className="w-full min-h-56 max-h-96 h-full object-cover transition-opacity duration-700 select-none cursor-pointer"
                draggable="false"
              />
            </a>
          ) : (
            <img
              src={`${imageUrl}/${banners[currentBannerIndex].images[0]}`}
              alt={banners[currentBannerIndex].title || "Banner"}
              className="w-full min-h-56 max-h-96 h-full object-cover transition-opacity duration-700 select-none"
              draggable="false"
            />
          )}
          {/* Left Chevron */}
          {banners.length > 1 && (
            <button
              className="banner-chevron absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-70 text-white rounded-full p-2 z-20 pointer-events-auto"
              onClick={e => {
                e.stopPropagation();
                setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
              }}
              aria-label="Previous banner"
              tabIndex={0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}
          {/* Right Chevron */}
          {banners.length > 1 && (
            <button
              className="banner-chevron absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-70 text-white rounded-full p-2 z-20 pointer-events-auto"
              onClick={e => {
                e.stopPropagation();
                setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
              }}
              aria-label="Next banner"
              tabIndex={0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}
        </div>
      ) : (
        <Promotions location="HOME_MAIN_PAGE" className="!h-full min-h-56 !mt-0" />
      )}

      <div className="h-full w-full bg-[#00000049] p-2 absolute top-0  z-10 flex flex-col items-center justify-center">
        <h1 className="text-4xl text-white text-center font-semibold mb-5">
          {currentBanner?.title || "Find Over 5000+ Colleges in India"}
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
                onBlur={() => {
                  // Small timeout to allow suggestion clicks to register
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleBtnClick();
                  }
                }}
              />
            </div>

            <button
              className="!h-full right-0 !rounded-sm w-1/5 max-sm:w-1/6 absolute top-0 bg-[#b82025] min-w-24 hover:bg-red-400 hover:scale-105 transition-all text-white disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
              onClick={handleBtnClick}
              disabled={isSearching}
            >
              {isSearching ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Searching...</span>
                </div>
              ) : (
                "Search"
              )}
            </button>
          </div>

          {/* Suggestions dropdown with loading hidden (silent update) */}
          {showSuggestions && (
            <div className="absolute ml-5 mr-5 mt-1 w-[calc(100%-40px)] bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto">
              {suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={(e) => e.preventDefault()} // Prevents blur from firing before click
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
                !isLoading && <div className="px-4 py-2 text-gray-500">No results found</div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Banner;
