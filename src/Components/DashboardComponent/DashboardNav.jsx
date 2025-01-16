import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react"; // Import ArrowRight icon from lucide-react
import axiosInstance from "../../ApiFunctions/axios";
import { useNavigate } from 'react-router-dom';

const DashboardNav = () => {
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const apiUrl =  import.meta.env.VITE_BASE_URL || 'http://localhost:4001/api/v1';


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          navigate('/');
          return;
        }

        setIsLoading(true);
        const response = await axiosInstance.get(`${apiUrl}/user/`, {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('accessToken'),
            'x-refresh-token': localStorage.getItem('refreshToken')
          }
        });
console.log('responsrftgyhuje',response.data)
        if (response.data?.data.name) {
          setUserName(response.data.data.name);
        }
      } catch (error) {
        console.log("Error fetching user data:", error.message);
        if (error.response?.status === 401) {
         console.log("User not logged in");
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
                className="h-7 w-7 rounded-full cursor-pointer hover:bg-gray-100 flex items-center justify-center"
                onClick={handleLogout}
                title="Click to logout"
              >
                <i className="fa fa-sign-out-alt text-red-500"></i>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardNav;