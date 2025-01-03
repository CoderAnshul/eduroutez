import React, { useState, useEffect } from "react";
import axios from "axios";

const WelcomeBanner = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:4001/api/v1/user/", {
          withCredentials: true, // Ensures cookies are sent
        });

        console.log("User API Response:", response.data);

        if (response.data.success) {
          setUser(response.data.data); // Update state with user data
        } else {
          console.error("Failed to fetch user profile");
        }
      } catch (error) {
        console.error("Error fetching user profile", error);
      } finally {
        setLoading(false); // End loading state
      }
    };

    fetchUserProfile();
  }, []); // Runs once when the component mounts

  if (loading) {
    return <p>Loading...</p>; // Display loading state
  }

  if (!user) {
    return <p>Error loading user data.</p>; // Display error state
  }

  return (
    <div className="bg-gradient-to-r from-purple-500 to-red-500 p-6 rounded-lg text-white">
      <h1 className="text-4xl font-bold">
        Hey <span className="font-semibold">{user.name}</span>, Welcome again!
      </h1>
   
    
    </div>
  );
};

export default WelcomeBanner;
