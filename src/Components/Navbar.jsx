import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/Images/logo.png";
import explore from "../assets/Images/explore.png";

import edit from "../assets/Images/editBtn.png";
import menu from "../assets/Images/menuBar.png";
import menubar from "../assets/Images/secondMenu.png";
import SecondMenu from "./SubNavbar";
import MobileNavbar from "./MobileNavbar";
import axiosInstance from "../ApiFunctions/axios";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useCategories from "../DataFiles/categories";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // For hover menu
  const location = useLocation();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const { categoriesData, loading, error } = useCategories();
  console.log("categoriesData", categoriesData);
  useEffect(() => {
    if (error) {
      console.log("Navbar Error:", error?.message);
    }
  }, [error]);

  const accessToken = localStorage.getItem("accessToken");
  console.log("accessToken", accessToken);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleReviewClick = (e) => {
    if (!accessToken) {
      e.preventDefault();
      setShowLoginPopup(true);
    }
  };

  const handleQuestion = () => {
    // Always navigate to question-answer page
    // The page will handle login check on form submission
    navigate("/question-&-answers");
  };

  const handleLoginPopupClose = () => {
    setShowLoginPopup(false);
  };

  const handleLogout = async () => {
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
      <nav className="fixed top-0 left-0 right-0 z-[999] bg-white ">
        <div className="h-16 w-full p-5 flex items-center justify-between">
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
                className="CustomFlex gap-1 bg-[#b82025] px-4 py-2 rounded-md text-white text-xs  hover:scale-95 group transform transition-all font-medium cursor-pointer"
              >
                <span>LOGIN</span>
              </Link>
            )}

            {/* Menu with hover functionality */}
            {accessToken && (
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

                {/* Dropdown menu */}
                {isDropdownOpen && (
                  <div className="absolute z-[1000] right-0 top-[34px] w-50 bg-white border transition-all border-gray-300 rounded-lg shadow-lg">
                    <Link
                      to="/dashboard/profile-page"
                      className="block px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:text-red-500"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/dashboard/settings"
                      className="block px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:text-red-500"
                    >
                      Settings
                    </Link>
                    <Link
                      to="/dashboard/"
                      className="block px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:text-red-500"
                    >
                      Dashboard
                    </Link>
                    {/* <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:text-red-500"
                    >
                      Logout
                    </button> */}
                  </div>
                )}
              </div>
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

        <ul className="mt-12 ml-0 space-y-4">
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

      {showLoginPopup && (
        <div className="popup-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
          <div className="popup bg-white min-w-[290px] p-12 m-20s rounded-lg shadow-2xl transform transition-all duration-300 scale-95 hover:scale-100 w-1/3">
            <h3 className="text-2xl font-semibold mb-8 text-center text-gray-800">
              Hey there! We'd love to hear your thoughts. Please log in to share
              your review with us and help others make informed decisions.
            </h3>
            <div className="flex justify-center space-x-6">
              <button
                onClick={handleLoginPopupClose}
                className="bg-gray-600 text-white px-8 py-4 rounded-lg shadow-lg transition-all duration-300 hover:bg-gray-700 focus:outline-none"
              >
                Close
              </button>
              <Link
                to="/login"
                onClick={handleLoginPopupClose}
                className="bg-[#b82025] whitespace-nowrap text-white px-8 py-4 rounded-lg shadow-lg transition-all duration-300 hover:bg-red-700 focus:outline-none"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
