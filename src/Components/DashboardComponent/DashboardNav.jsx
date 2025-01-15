import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import axios from "axios";

const DashboardNav = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error("User ID not found in localStorage");
        }
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        setUserName(response.data.data.name);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleBecomeCounselor = () => {
    window.location.href = "/become-couseller";
  };

  const handleQuestion = () => {
    window.location.href = '/question-&-answers';
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      
      <div className="flex items-center gap-4">
        <button
          onClick={handleBecomeCounselor}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Become a Counselor
          <ArrowRight className="h-4 w-4" />
        </button>
        <button
          onClick={handleQuestion}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Ask Question
          <ArrowRight className="h-4 w-4" />
        </button>

        <div className="border px-4 py-2 rounded-md flex items-center gap-2">
          <h3>{userName}</h3>
          <div className="h-7 w-7 bg-gray-500 rounded-full"></div>
        </div>
      </div>
    </header>
  );
};

export default DashboardNav;