import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/Images/logo.png";
import explore from "../assets/Images/explore.png";

import edit from "../assets/Images/editBtn.png";
import menu from "../assets/Images/menuBar.png";
import menubar from "../assets/Images/secondMenu.png";
import SecondMenu from "./SubNavbar";
import MobileNavbar from "./MobileNavbar";
import axiosInstance from "../ApiFunctions/axios";
import { ArrowRight, LogOut, User, Settings, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useCategories from "../DataFiles/categories";
import { toast } from "react-toastify";

const Navbar = () => {
  console.log('Navbar component rendered');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // For hover menu
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
              <img className="h-6" src={menubar} alt="open menu" />
            </button>
            <Link to="/">
              <img className="h-8 md:h-10" src={logo} alt="mainLogo" />
            </Link>
          </div>

          <div className="CustomFlex gap-3 opacity-80">
            <div className="">
              <button
                onClick={handleQuestion}
                className="md:flex hidden items-center text-xs font-medium gap-2 px-4 hover:scale-95 py-2 bg-[#b82025] uppercase text-white  hover:bg-[#b82025] transition-colors"
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
              to="/searchpage"
              className="CustomFlex gap-1 hover:text-red-500 hover:scale-95 group transform transition-all font-medium cursor-pointer text-sm hidden lg:flex"
            >
              <img
                className="h-4 group-hover:rotate-180 transition-all"
                src={explore}
                alt="exploreBtn"
              />
              <span className="text-black">Explore</span>
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
                <div
                  className="relative"
                  onClick={() => {
                    if (isDropdownOpen) {
                      setIsDropdownOpen(false);
                    } else {
                      setIsDropdownOpen(true);
                    }
                  }}
                >
                  <div className="CustomFlex gap-1 font-medium text-sm border-2 py-1 px-2 border-gray-400 rounded-2xl cursor-pointer">
                    <img className="h-3 opacity-75" src={menu} alt="menu" />

                    <Link
                      to="/"
                      className="secondMenu bg-gray-500 hover:scale-105 transition-all h-5 w-5 rounded-full"
                    ></Link>
                  </div>

                  {/* Enhanced Dropdown menu */}
                  {isDropdownOpen && (
                    <div className="absolute z-[1000] right-0 top-[45px] min-w-[200px] bg-white border border-gray-100 p-2 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] animate-in fade-in slide-in-from-top-2 duration-200">
                      <Link
                        to="/dashboard/profile-page"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-[#b82025] rounded-lg transition-colors group"
                      >
                        <User className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                        Profile
                      </Link>
                      <Link
                        to="/dashboard/settings"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-[#b82025] rounded-lg transition-colors group"
                      >
                        <Settings className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                        Settings
                      </Link>
                      <Link
                        to="/dashboard/"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-[#b82025] rounded-lg transition-colors group"
                      >
                        <LayoutDashboard className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                        Dashboard
                      </Link>
                      
                      <div className="h-px bg-gray-100 my-1 mx-2"></div>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-[#b82025] rounded-lg transition-colors group"
                      >
                        <LogOut className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                        Logout
                      </button>
                    </div>
                  )}
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
