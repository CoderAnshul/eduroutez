import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/Images/logo.png";

import edit from "../assets/Images/editBtn.png";
import menu from "../assets/Images/menuBar.png";
import menubar from "../assets/Images/secondMenu.png";
import SecondMenu from "./SubNavbar";
import MobileNavbar from "./MobileNavbar";
import axiosInstance from "../ApiFunctions/axios";
import { ArrowRight, LogOut, User, Settings, LayoutDashboard, Sparkles, Search, ChevronDown, Scale, TrendingUp, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setInput } from "../config/inputSlice";
import useCategories from "../DataFiles/categories";
import { toast } from "react-toastify";
import useModal from "./Modal/useModal";

const Navbar = () => {
  console.log('Navbar component rendered');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // For hover menu
  const dropdownRef = useRef(null);
  const location = useLocation();
  const { categoriesData, loading, error } = useCategories();
  console.log("categoriesData", categoriesData);
  useEffect(() => {
    console.log('Eligibility useEffect running. accessToken:', accessToken);
    if (error) {
      console.log("Navbar Error:", error?.message);
    }
  }, [error]);

  const accessToken = localStorage.getItem("accessToken");
  const [canGiveTest, setCanGiveTest] = useState(false);
  const [checkingTest, setCheckingTest] = useState(false);
  const [needToPay, setNeedToPay] = useState(false);
  const navigate = useNavigate();
  // Check can-give-test on mount if logged in
  useEffect(() => {
    const checkCanGiveTest = async () => {
      if (!accessToken) return;
      setCheckingTest(true);
      try {
        // Use axiosInstance and hardcode port 5173 as in the request
        console.log('Calling eligibility API...');
        const response = await axiosInstance.get(
          `/api/v1/counselor-test/can-give`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log('Eligibility API response:', response.data); // Debug log
        // Use the new API response structure: response.data.data.eligible
        if (response.data && response.data.data) {
          if (response.data.data.eligible === true) {
            setCanGiveTest(true);
            setNeedToPay(false);
          } else if (response.data.data.eligible === false && response.data.data.reason === 'need to pay') {
            setCanGiveTest(false);
            setNeedToPay(true);
          } else {
            setCanGiveTest(false);
            setNeedToPay(false);
          }
        } else {
          setCanGiveTest(false);
          setNeedToPay(false);
        }
      } catch (err) {
        console.error('Eligibility API error:', err);
        setCanGiveTest(false);
      } finally {
        setCheckingTest(false);
      }
    };
    checkCanGiveTest();
  }, [accessToken]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleReviewClick = (e) => {
    if (!accessToken) {
      e.preventDefault();
      navigate("/login", { state: { backgroundLocation: location } });
    }
  };

  const handleQuestion = () => {
    // Always navigate to question-answer page
    // The page will handle login check on form submission
    navigate("/question-&-answers");
  };

  const dispatch = useDispatch();
  const { showAlert } = useModal();
  const [inputField, setInputField] = useState("");
  const [searchType, setSearchType] = useState("institute");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchContainerRef = useRef(null);

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
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/courses?search=${encodeURIComponent(inputField)}&limit=10&page=0`);
          if (!isMounted) return;
          const courseResult = response.data?.data?.result || response.data?.result || [];
          filteredResults = courseResult.map((course) => {
            const inst = course.institute || {};
            const cityData = course.city || inst.city || "";
            const cityName = typeof cityData === "object" ? cityData.name : cityData;
            return { courseTitle: course.courseTitle || course.name || "Untitled Course", instituteName: inst.instituteName || course.instituteName || "", cityName: cityName || "", courseId: course._id, slug: course.slug };
          });
        } else if (searchType === "counsellor") {
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/counselors?search=${encodeURIComponent(inputField)}&limit=10&page=1`);
          if (!isMounted) return;
          const counsellorResult = response.data?.data?.result || response.data?.result || [];
          filteredResults = counsellorResult.map((c) => ({ firstname: c.firstname, lastname: c.lastname, specialization: c.specialization, _id: c._id }));
        } else {
          const searchFields = JSON.stringify({ instituteName: inputField });
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/institutes`, { params: { searchFields, limit: 10, page: 1 } });
          if (!isMounted) return;
          const instituteResult = response.data?.data?.result || response.data?.result || [];
          filteredResults = instituteResult.map((inst) => {
            const cityData = inst.city || "";
            const cityName = typeof cityData === "object" ? cityData.name : cityData;
            return { instituteName: inst.instituteName, cityName: cityName || "", slug: inst.slug, _id: inst._id };
          });
        }
        if (!isMounted) return;
        setSuggestions(filteredResults);
        setShowSuggestions(filteredResults.length > 0);
      } catch (error) {
        if (isMounted) { setSuggestions([]); setShowSuggestions(false); }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    const debounceTimer = setTimeout(fetchSuggestions, 500);
    return () => { isMounted = false; clearTimeout(debounceTimer); };
  }, [inputField, searchType]);

  const handleInputChange = (e) => setInputField(e.target.value);

  const handleSuggestionClick = (suggestion) => {
    if (searchType === "course") {
      setInputField(suggestion.courseTitle);
      dispatch(setInput(suggestion.courseTitle));
      navigate("/searchpage?fromSearch=true&searchType=course");
    } else if (searchType === "counsellor") {
      setInputField(suggestion.firstname + " " + suggestion.lastname);
      navigate(`/counselor?name=${encodeURIComponent(suggestion.firstname + " " + suggestion.lastname)}`);
    } else {
      setInputField(suggestion.instituteName);
      dispatch(setInput(suggestion.instituteName));
      navigate("/searchpage?fromSearch=true&searchType=institute");
    }
    setShowSuggestions(false);
  };

  const handleBtnClick = async () => {
    if (inputField === "") { showAlert("Please enter something"); return; }
    setIsSearching(true);
    if (searchType === "counsellor") {
      navigate(`/counselor?name=${encodeURIComponent(inputField)}`);
      setIsSearching(false);
    } else {
      dispatch(setInput(inputField));
      navigate(`/searchpage?fromSearch=true&searchType=${searchType}`);
      setIsSearching(false);
    }
    setShowSuggestions(false);
  };

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const handleLogout = async () => {
    setIsDropdownOpen(false);
    setShowLogoutPopup(true);
  };
  const confirmLogout = async () => {
    try {
      await axiosInstance.post(`${import.meta.env.VITE_BASE_URL}/logout`, {}, {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("accessToken"),
          "x-refresh-token": localStorage.getItem("refreshToken"),
        }
      });
    } catch (error) {
      console.error("Error during logout API call:", error);
    } finally {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  // Prevent scrolling on background when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMenuOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  if (location.pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <>
      {/* Main Navbar - Fixed */}
      <nav className="fixed top-0 left-0 right-0 z-[999] bg-white border-b border-gray-200">
        <div className="universal-max-width h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={toggleMenu} className="lg:hidden">
              <img className="h-6" src={menubar} alt="Open navigation menu" />
            </button>
            <Link to="/">
              <img className="h-8 md:h-10" src={logo} alt="Eduroutez Logo" />
            </Link>
          </div>

          {/* Search Bar */}
          <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-md mx-2 lg:mx-4 relative">
            <div className="flex items-center w-full h-10 bg-gray-100 border border-gray-200 rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-red-300 focus-within:bg-white focus-within:border-red-300 transition-all">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="h-full bg-gray-100 border-r border-gray-300 px-2 text-xs outline-none cursor-pointer"
              >
                <option value="institute">Institute</option>
                <option value="course">Course</option>
                <option value="counsellor">Counsellor</option>
              </select>
              <div className="flex items-center flex-1 px-2 gap-1.5">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={inputField}
                  onChange={handleInputChange}
                  placeholder={searchType === "counsellor" ? "Search counsellors..." : searchType === "course" ? "Search courses..." : "Search institutes..."}
                  className="text-xs w-full outline-none bg-transparent"
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleBtnClick(); }}
                />
              </div>
              <button
                onClick={handleBtnClick}
                disabled={isSearching}
                className="h-full px-3 bg-[#b82025] text-white text-xs font-medium hover:bg-red-700 transition-colors disabled:opacity-60"
              >
                {isSearching ? "..." : "Search"}
              </button>
            </div>

            {/* Suggestions dropdown */}
            {showSuggestions && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                {suggestions.length > 0 ? suggestions.map((suggestion, index) => (
                  <div key={index} className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="font-medium text-xs">
                      {searchType === "course" ? suggestion.courseTitle : searchType === "counsellor" ? suggestion.firstname + " " + suggestion.lastname : suggestion.instituteName}
                    </div>
                    {searchType === "course" && <div className="text-[10px] text-gray-500">{suggestion.instituteName} - {suggestion.cityName}</div>}
                    {searchType === "counsellor" && suggestion.specialization && <div className="text-[10px] text-gray-500">{suggestion.specialization}</div>}
                    {searchType === "institute" && suggestion.cityName && <div className="text-[10px] text-gray-500">{suggestion.cityName}</div>}
                  </div>
                )) : !isLoading && <div className="px-3 py-2 text-xs text-gray-500">No results found</div>}
              </div>
            )}
          </div>

          <div className="CustomFlex gap-3">
            <div className="">
              <button
                onClick={handleQuestion}
                className="md:flex hidden items-center text-xs font-medium gap-2 px-4 hover:scale-95 py-2 bg-[#b82025] uppercase text-white hover:bg-[#b82025] transition-colors"
              >
                Ask
                <ArrowRight className="h-4 w-4 hidden md:flex" />
              </button>
            </div>
            <Link
              to="/writereview"
              className="CustomFlex gap-1 group hover:text-red-500 hover:scale-95 transform transition-all font-medium cursor-pointer text-sm hidden lg:flex"
              onClick={handleReviewClick}
            >
              <button>
                <img
                  className="h-4 group-hover:rotate-[360deg] transition-all"
                  src={edit}
                  alt="editBtn"
                />
              </button>
              <span className="text-black">Write a Review</span>
            </Link>

            <Link
              to="/recommendations"
              className="CustomFlex gap-1 hover:text-red-500 hover:scale-95 group transform transition-all font-medium cursor-pointer text-sm hidden lg:flex"
            >
              <Sparkles className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="text-black">Recommend</span>
            </Link>
            <Link
              to="/career-outcome"
              className="CustomFlex gap-1 hover:text-red-500 hover:scale-95 group transform transition-all font-medium cursor-pointer text-sm hidden lg:flex"
            >
              <TrendingUp className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="text-black">Career AI</span>
            </Link>
            <Link
              to="/geo-demand"
              className="CustomFlex gap-1 hover:text-red-500 hover:scale-95 group transform transition-all font-medium cursor-pointer text-sm hidden lg:flex"
            >
              <MapPin className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="text-black">Demand Map</span>
            </Link>
            <Link
              to="/compare"
              className="CustomFlex gap-1 hover:text-red-500 hover:scale-95 group transform transition-all font-medium cursor-pointer text-sm hidden lg:flex"
            >
              <Scale className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="text-black">Compare</span>
            </Link>
            {!accessToken && (
              <Link
                to="/login"
                state={{ backgroundLocation: location }}
                className="CustomFlex gap-1 bg-[#b82025] px-4 py-2 rounded-md text-white text-xs  hover:scale-95 group transform transition-all font-medium cursor-pointer"
              >
                <span>LOGIN</span>
              </Link>
            )}

            {/* Menu with hover functionality */}
            {accessToken && (
              <>
                {/* Start Test button if eligible */}
                {canGiveTest && !checkingTest && (
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-xs font-bold mr-2 transition-all"
                    onClick={() => navigate("/counselor-test/exam")}
                  >
                    Start Test
                  </button>
                )}
                {/* Pay Now button if not eligible and need to pay */}
                {needToPay && !checkingTest && (
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-xs font-bold mr-2 transition-all"
                    onClick={() => navigate("/counselor-test/payment")}
                  >
                    Become a Counselor
                  </button>
                )}
                <div className="relative" ref={dropdownRef}>
                  <div
                    className="CustomFlex gap-1 font-medium text-sm border-2 py-1 px-2 border-gray-400 rounded-2xl cursor-pointer"
                    onClick={() => setIsDropdownOpen((s) => !s)}
                  >
                    <img className="h-3 opacity-75" src={menu} alt="menu" />

                    <div
                      className="secondMenu bg-gray-500 hover:scale-105 transition-all h-5 w-5 rounded-full"
                    ></div>
                  </div>

                  {/* Enhanced Dropdown menu - Animated */}
                  <div className={`absolute z-[1000] right-0 top-[calc(100%+12px)] min-w-[220px] bg-white border border-gray-100 p-2 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-300 origin-top-right ${
                    isDropdownOpen 
                      ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" 
                      : "opacity-0 -translate-y-4 scale-95 pointer-events-none"
                  }`}>
                    <Link
                      to="/dashboard/profile-page"
                      className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-[#b82025] rounded-xl transition-colors group"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                        <User className="w-4 h-4 text-[#b82025] opacity-70 group-hover:opacity-100" />
                      </div>
                      Profile
                    </Link>
                    <Link
                      to="/dashboard/settings"
                      className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-[#b82025] rounded-xl transition-colors group"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <Settings className="w-4 h-4 text-blue-600 opacity-70 group-hover:opacity-100" />
                      </div>
                      Settings
                    </Link>
                    <Link
                      to="/dashboard/"
                      className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-[#b82025] rounded-xl transition-colors group"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                        <LayoutDashboard className="w-4 h-4 text-orange-600 opacity-70 group-hover:opacity-100" />
                      </div>
                      Dashboard
                    </Link>
                    
                    <div className="h-px bg-gray-100 my-2 mx-2"></div>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-[#b82025] rounded-xl transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                        <LogOut className="w-4 h-4 text-gray-600 group-hover:text-[#b82025] opacity-70 group-hover:opacity-100" />
                      </div>
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer for main navbar only */}
      <div className="h-16"></div>

      {/* SecondMenu - Not fixed */}
      <div className="hidden lg:block ">
        <SecondMenu categories={categoriesData} />
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[999] transition-opacity"
          onClick={toggleMenu} // Close menu when overlay is clicked
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 h-dvh p-4 w-4/5 max-w-[300px] bg-gray-100 shadow-md z-[1000] overflow-y-scroll transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300`}
      >
        <div className="flex items-center justify-between">
          <Link to="/">
            <img className="h-12 md:h-8" src={logo} alt="mainLogo" />
          </Link>

          <button
            onClick={toggleMenu}
            className="text-white font-semibold hover:font-semibold text-md px-2 rounded-full hover:bg-red-200 transition-all bg-[#b82025] hover:text-red-800"
          >
            X
          </button>
        </div>

        <ul className="mt-12 ml-0 space-y-4 list-none">
          <li>
            <Link className="text-black" to="/" onClick={toggleMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link className="text-black" to="/searchpage" onClick={toggleMenu}>
              Explore
            </Link>
          </li>
          <li>
            <Link className="text-black" to="/recommendations" onClick={toggleMenu}>
              Recommendations
            </Link>
          </li>
          <li>
            <Link className="text-black" to="/career-outcome" onClick={toggleMenu}>
              Career AI
            </Link>
          </li>
          <li>
            <Link className="text-black" to="/geo-demand" onClick={toggleMenu}>
              Demand Map
            </Link>
          </li>
          <li>
            <Link className="text-black" to="/compare" onClick={toggleMenu}>
              Compare
            </Link>
          </li>
          <li>
            <Link
              className="text-black"
              to="/writereview"
              onClick={handleReviewClick}
            >
              Write a Review
            </Link>
          </li>
          <div className="lg:hidden overflow-y-scroll scrollbar-thumb-transparent">
            <MobileNavbar categories={categoriesData} />
          </div>
        </ul>
      </div>

      {/* Logout confirmation popup - Global Level to fix state glitch */}
      {showLogoutPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-[3000]">
          {/* Animated Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setShowLogoutPopup(false)}
          ></div>

          {/* Modal Content */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl w-[90%] max-w-sm text-center relative z-[3001] transform transition-all duration-300 scale-100 opacity-100 animate-in zoom-in-95 fade-in">
            {/* Logout Icon Header */}
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogOut className="w-8 h-8 text-[#b82025]" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Leave?</h2>
            <p className="text-gray-500 mb-8">Are you sure you want to logout? You'll need to sign back in to access your profile.</p>

            <div className="flex flex-col gap-3">
              <button
                onClick={confirmLogout}
                className="w-full py-3 rounded-xl bg-[#b82025] text-white font-bold text-lg hover:bg-red-700 transition-all active:scale-[0.98] shadow-lg shadow-red-200"
              >
                Logout Now
              </button>
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="w-full py-3 rounded-xl bg-gray-100 text-gray-600 font-bold text-lg hover:bg-gray-200 transition-all active:scale-[0.98]"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
