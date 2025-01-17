import React, { useState } from 'react';
import axios from 'axios';

const Logout = () => {
    const [showPopup, setShowPopup] = useState(true);
    const apiUrl = import.meta.env.VITE_BASE_URL;

    const handleLogout = async () => {
        try {
            window.location.reload();
            const token = localStorage.getItem('accessToken'); // Get the token from localStorage
    
            if (!token) {
                throw new Error("No token found in localStorage");
            }
    
            await axios.post(
                `${apiUrl}/logout`,
                {},
                {
                    headers: {

                        'x-access-token': localStorage.getItem('accessToken'),
                        'x-refresh-token': localStorage.getItem('refreshToken')                    },
                    withCredentials: true, // Make sure credentials (cookies) are included with the request
                }
            );
            window.location.reload();

            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('email');
            console.log('Logged out successfully!');
            window.location.href = '/login'; // Redirect to login page
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <>
            <div className="popup fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                <div className="popup-inner bg-white rounded-lg shadow-lg w-1/3 p-6 text-center">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Are you sure you want to logout?</h2>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={handleLogout}
                            className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200"
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
        </>
    );
};

export default Logout;
