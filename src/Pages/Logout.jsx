import React, { useState } from "react";
import axiosInstance from "../ApiFunctions/axios";

const Logout = () => {
  const [showPopup, setShowPopup] = useState(true);
  const apiUrl = import.meta.env.VITE_BASE_URL;

  const handleLogout = async () => {
    try {
      await axiosInstance.post(`${apiUrl}/logout`, {}, {
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

  return (
    <>
      {showPopup && (
        <div className="popup fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="popup-inner bg-white rounded-lg shadow-lg w-1/3 max-sm:w-2/3 p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Are you sure you want to logout?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-[#b82025] text-white font-semibold rounded-lg hover:bg-[#b82025] transition duration-200"
              >
                Yes
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition duration-200"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Logout;
