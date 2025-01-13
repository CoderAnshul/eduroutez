import React, { useState, useEffect } from "react";
import axios from "axios";
import { Crown, Award, Medal, Star } from "lucide-react";

const WelcomeBanner = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:4001/api/v1/user", {
          withCredentials: true,
        });
        alert(response);
        console.log(response);
        if (response.data.success) {
          setUser(response.data.data);
        } else {
          console.error("Failed to fetch user profile");
        }
      } catch (error) {
        
        console.error("Error fetching user profileB VG", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const getLevelDetails = (points) => {
    if (points >= 5001) {
      return {
        name: "Platinum Certificate",
        icon: Crown,
        color: "bg-gradient-to-r from-slate-300 to-zinc-300",
        progress: 100,
        currentRange: "5001+",
        nextTarget: null
      };
    }
    if (points >= 1001) {
      return {
        name: "Gold Certificate",
        icon: Award,
        color: "bg-gradient-to-r from-yellow-400 to-yellow-300",
        progress: 80,
        currentRange: "1001-5000",
        nextTarget: 5001
      };
    }
    if (points >= 501) {
      return {
        name: "Silver Certificate",
        icon: Medal,
        color: "bg-gradient-to-r from-gray-300 to-gray-200",
        progress: 60,
        currentRange: "501-1000",
        nextTarget: 1001
      };
    }
    if (points >= 11) {
      return {
        name: "Bronze Certificate",
        icon: Medal,
        color: "bg-gradient-to-r from-orange-700 to-orange-600",
        progress: 40,
        currentRange: "11-500",
        nextTarget: 501
      };
    }
    return {
      name: "Well Wisher",
      icon: Star,
      color: "bg-gradient-to-r from-blue-400 to-blue-300",
      progress: 20,
      currentRange: "0-10",
      nextTarget: 11
    };
  };

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-100 p-6 rounded-lg">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-red-50 border border-red-200 p-6 rounded-lg text-red-600">
        <p className="text-lg">Error loading user data. Please try again later.</p>
      </div>
    );
  }

  const levelDetails = getLevelDetails(user.points);
  const LevelIcon = levelDetails.icon;
  const pointsToNext = levelDetails.nextTarget ? levelDetails.nextTarget - user.points : 0;

  return (
    <div className="bg-white shadow-xl rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-red-600 to-red-600 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome back, {user.name}!
            </h1>
            <p className="text-purple-100">
              You've earned {user.points || 0} points so far
            </p>
          </div>
          <div className="flex items-center justify-center">
            <LevelIcon size={48} className="text-white" />
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className={`${levelDetails.color} rounded-lg p-6 flex items-center space-x-4`}>
          <LevelIcon size={32} className="text-white" />
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white mb-2">
              {levelDetails.name}
            </h2>
            <div className="w-full bg-black bg-opacity-10 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-500"
                style={{ width: `${levelDetails.progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Current Points</p>
            <p className="text-gray-900 font-semibold">
              {user.points || 0}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Next Level</p>
            <p className="text-gray-900 font-semibold">
              {levelDetails.nextTarget ? `${levelDetails.nextTarget}+ Points` : "Max Level"}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Next Level</p>
            <p className="text-gray-900 font-semibold">
              "Bronze Certificate"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;