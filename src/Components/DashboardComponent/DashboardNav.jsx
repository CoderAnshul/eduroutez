import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import axiosInstance from "../../ApiFunctions/axios";
import { useNavigate } from 'react-router-dom';

const DashboardNav = () => {
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const apiUrl = typeof window !== 'undefined' 
    ? window.VITE_BASE_URL 
    : import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          navigate('/');
          return;
        }

        setIsLoading(true);
        const response = await axiosInstance.get('/user/', {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('accessToken'),
            'x-refresh-token': localStorage.getItem('refreshToken')
          }
        });

        if (response.data?.data?.name) {
          setUserName(response.data.data.name);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response?.status === 401) {
          localStorage.clear();
          navigate('/');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleBecomeCounselor = () => {
    navigate("/become-couseller");
  };

  const handleQuestion = () => {
    navigate('/question-&-answers');
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
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
          {isLoading ? (
            <span className="text-gray-500">Loading...</span>
          ) : (
            <>
              <h3>{userName || 'Guest'}</h3>
              <div 
                className="h-7 w-7 bg-gray-500 rounded-full cursor-pointer hover:bg-gray-600"
                onClick={handleLogout}
                title="Click to logout"
              />
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardNav;