import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/Images/logo.png";

import edit from "../assets/Images/editBtn.png";
import menubar from "../assets/Images/secondMenu.png";
import SecondMenu from "./SubNavbar";
import MobileNavbar from "./MobileNavbar";
import axiosInstance from "../ApiFunctions/axios";
import { ArrowRight, LogOut, User, Settings, LayoutDashboard, Sparkles, Search, ChevronDown, Scale, TrendingUp, MapPin, MessageCircleQuestion, X, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setInput } from "../config/inputSlice";
import useCategories from "../DataFiles/categories";
import { toast } from "react-toastify";
import useModal from "./Modal/useModal";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // For hover menu
  const dropdownRef = useRef(null);
  const location = useLocation();
  const { categoriesData, loading, error } = useCategories();
  useEffect(() => {
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
        const response = await axiosInstance.get(
          `/api/v1/counselor-test/can-give`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
    setIsSearchOpen(false);
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
    setIsSearchOpen(false);
  };

  // Close suggestions (and the dropdown search panel) on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
        setIsSearchOpen(false);
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

  // Desktop-only nav cluster shown between the search bar and the action
  // buttons. Kept as data so the row stays visually even no matter how many
  // items it holds.
  const primaryLinks = [
    { to: "/recommendations", label: "Recommend" },
    { to: "/career-outcome", label: "Career AI" },
    { to: "/geo-demand", label: "Demand Map" },
    { to: "/compare", label: "Compare" },
  ];

  return (
    <>
      {/* Main Navbar - Fixed */}
      <nav className="fixed top-0 left-0 right-0 z-[999] bg-white border-b border-gray-200">
        <div className="universal-max-width h-16 lg:h-[76px] flex items-center gap-4 lg:gap-8">
          {/* Logo — pinned left, same spot on every breakpoint */}
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={toggleMenu} className="lg:hidden">
              <img className="h-6" src={menubar} alt="Open navigation menu" />
            </button>
            <Link to="/" className="shrink-0">
              <img className="h-8 md:h-10" src={logo} alt="Eduroutez Logo" />
            </Link>
          </div>

          {/* ===== Mobile / tablet layout — untouched from the original ===== */}
          <div className="flex md:hidden items-center gap-3 ml-auto">
            <button
              onClick={handleQuestion}
              className="flex items-center text-xs font-medium gap-2 px-4 py-2 bg-[#b82025] uppercase text-white"
            >
              Ask
              <ArrowRight className="h-4 w-4" />
            </button>
            {!accessToken && (
              <Link
                to="/login"
                state={{ backgroundLocation: location }}
                className="flex items-center gap-1 bg-[#b82025] px-4 py-2 rounded-md text-white text-xs font-medium"
              >
                <span>LOGIN</span>
              </Link>
            )}
          </div>

          {/* ===== Desktop layout ===== */}

          {/* Search — a plain icon in the bar; the real search bar drops down from the top of the page */}
          <div ref={searchContainerRef} className="hidden md:block relative shrink-0">
            <button
              onClick={() => setIsSearchOpen((o) => !o)}
              className={`h-10 w-10 flex items-center justify-center rounded-full border transition-colors ${isSearchOpen ? "bg-red-50 border-red-200 text-[#b82025]" : "bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200"
                }`}
              aria-label="Toggle search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Backdrop — click anywhere on it to close */}
            <div
              onClick={() => setIsSearchOpen(false)}
              aria-hidden={!isSearchOpen}
              className={`fixed inset-0 top-16 lg:top-[76px] bg-black/30 z-[998] transition-opacity duration-300 ${isSearchOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
                }`}
            />

            {/* Panel — slides down from the top of the page, under the fixed navbar, full page width */}
            <div
              aria-hidden={!isSearchOpen}
              className={`fixed left-0 right-0 top-16 lg:top-[76px] z-[999] bg-white border-b border-gray-200 shadow-xl transition-all duration-300 ease-out ${isSearchOpen ? "translate-y-0 opacity-100 visible" : "-translate-y-full opacity-0 invisible pointer-events-none"
                }`}
            >
              <div className="universal-max-width py-5 flex items-center gap-3">
                <div className="flex items-center h-11 flex-1 bg-gray-100 border border-gray-200 rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-red-300 focus-within:bg-white focus-within:border-red-300 transition-all">
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="h-full bg-gray-100 border-r border-gray-300 px-3 text-xs outline-none cursor-pointer shrink-0"
                  >
                    <option value="institute">Institute</option>
                    <option value="course">Course</option>
                    <option value="counsellor">Counsellor</option>
                  </select>
                  <div className="flex items-center flex-1 min-w-0 px-3 gap-1.5">
                    <Search className="w-4 h-4 text-gray-400 shrink-0" />
                    <input
                      autoFocus={isSearchOpen}
                      type="text"
                      value={inputField}
                      onChange={handleInputChange}
                      placeholder={searchType === "counsellor" ? "Search counsellors..." : searchType === "course" ? "Search courses..." : "Search institutes..."}
                      className="text-sm w-full min-w-0 outline-none bg-transparent"
                      onKeyDown={(e) => { if (e.key === "Enter") handleBtnClick(); if (e.key === "Escape") setIsSearchOpen(false); }}
                    />
                  </div>
                  <button
                    onClick={handleBtnClick}
                    disabled={isSearching}
                    className="h-full px-4 bg-[#b82025] text-white text-xs font-medium hover:bg-red-700 transition-colors disabled:opacity-60 shrink-0"
                  >
                    {isSearching ? "..." : "Search"}
                  </button>
                </div>

                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-[#b82025] transition-colors shrink-0"
                  aria-label="Close search"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Suggestions dropdown */}
              {showSuggestions && (
                <div className="universal-max-width pb-4 -mt-2">
                  <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
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
                </div>
              )}
            </div>
          </div>

          {/* Center nav — takes the leftover space, so it breathes no matter the viewport width */}
          <ul className="hidden lg:flex flex-1 items-center justify-center gap-8 list-none">
            {primaryLinks.map(({ to, label }) => (
              <li key={to} className="relative group">
                <Link to={to} className="text-[13.5px] font-medium text-gray-700 group-hover:text-[#b82025] transition-colors">
                  {label}
                </Link>
                <span className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-[#b82025] scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-200" />
              </li>
            ))}
            <li className="relative group">
              <Link
                to="/writereview"
                onClick={handleReviewClick}
                className="flex items-center gap-1.5 text-[13.5px] font-medium text-gray-700 group-hover:text-[#b82025] transition-colors"
              >
                <img className="h-3.5" src={edit} alt="" />
                Write a Review
              </Link>
              <span className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-[#b82025] scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-200" />
            </li>
          </ul>

          {/* Right actions — CTAs + auth, grouped tightly since they're all "do something now" controls */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {accessToken && canGiveTest && !checkingTest && (
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-3.5 py-2 rounded-md text-xs font-bold transition-colors"
                onClick={() => navigate("/counselor-test/exam")}
              >
                Start Test
              </button>
            )}
            {accessToken && needToPay && !checkingTest && (
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3.5 py-2 rounded-md text-xs font-bold transition-colors"
                onClick={() => navigate("/counselor-test/payment")}
              >
                Become a Counselor
              </button>
            )}

            <Link
              to="/personality-assessment"
              className="flex items-center justify-center text-gray-500 hover:text-[#b82025] p-2 transition-colors shrink-0"
              title="Personality Assessment"
            >
              <Brain className="h-5 w-5" />
            </Link>

            <Link
              to="/market-trends"
              className="flex items-center justify-center text-gray-500 hover:text-[#b82025] p-2 transition-colors shrink-0"
              title="Market Trends"
            >
              <TrendingUp className="h-5 w-5" />
            </Link>

            <button
              onClick={handleQuestion}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-[#b82025] px-2 transition-colors"
              title="Ask a question"
            >
              <MessageCircleQuestion className="h-4 w-4" />
              Ask
            </button>

            <Link
              to="/searchpage"
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md text-xs font-bold transition-colors"
            >
              Explore College
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            {!accessToken ? (
              <Link
                to="/login"
                state={{ backgroundLocation: location }}
                className="flex items-center bg-[#b82025] px-4 py-2 rounded-md text-white text-xs font-semibold hover:bg-red-700 transition-colors"
              >
                LOGIN
              </Link>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 border border-gray-200 rounded-full hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsDropdownOpen((s) => !s)}
                >
                  <div className="h-7 w-7 rounded-full bg-gray-500" />
                  <ChevronDown className={`h-3.5 w-3.5 text-gray-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown menu - Animated */}
                <div className={`absolute z-[1000] right-0 top-[calc(100%+12px)] min-w-[220px] bg-white border border-gray-100 p-2 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-300 origin-top-right ${isDropdownOpen
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
            )}
          </div>
        </div>
      </nav>

      {/* Spacer for main navbar only */}
      <div className="h-16 lg:h-[76px]"></div>

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