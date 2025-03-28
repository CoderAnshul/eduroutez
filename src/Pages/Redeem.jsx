import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trophy, Gift, History } from "lucide-react";

const Redeem = () => {
  const [userPoints, setUserPoints] = useState(0); // User's available points
  const [redeemPoints, setRedeemPoints] = useState("");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

  // Fetch user points from the backend
  useEffect(() => {
    const fetchUserPoints = async () => {
      try {
        const userId = localStorage.getItem("userId"); // Get user ID from localStorage
        if (!userId) throw new Error("User ID not found in localStorage");

        const response = await axios.get(`${VITE_BASE_URL}/user/`, {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("accessToken"),
            "x-refresh-token": localStorage.getItem("refreshToken"),
          },
        });

        setUserPoints(response.data.data.points || 0); // Set points from the response
      } catch (error) {
        console.error("Error fetching user points:", error);
        setMessage("Failed to fetch points.");
      }
    };

    fetchUserPoints();
  }, []);

  // Handle point redemption
  const handleRedeem = async (e) => {
    e.preventDefault();

    const points = parseInt(redeemPoints, 10);
    if (isNaN(points) || points <= 0) {
      setMessage("Please enter a valid number of points.");
      return;
    }

    if (points > userPoints) {
      setMessage("You don't have enough points.");
      return;
    }

    try {
      const userId = localStorage.getItem("userId"); // Get user ID from localStorage
      const response = await axios.post(
        `${VITE_BASE_URL}/redeem-points`,
        { points },
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("accessToken"),
            "x-refresh-token": localStorage.getItem("refreshToken"),
          },
        }
      );

      if (response.data.success) {
        const timestamp = new Date().toLocaleString();
        const newEntry = { points, timestamp };

        setHistory([newEntry, ...history]); // Add to history
        setUserPoints(userPoints - points); // Deduct points
        setMessage(`Successfully redeemed ${points} points!`);
      } else {
        setMessage(response.data.message || "Redemption failed.");
      }
    } catch (error) {
      console.error("Error redeeming points:", error);
      setMessage("An error occurred while redeeming points.");
    }

    setRedeemPoints(""); // Reset input
  };

  useEffect(() => {
    const fetchRedemptionHistory = async () => {
      try {
        const userId = localStorage.getItem("userId"); // Get user ID from localStorage
        if (!userId) throw new Error("User ID not found in localStorage");

        const response = await axios.get(`${VITE_BASE_URL}/redeem-history`, {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("accessToken"),
            "x-refresh-token": localStorage.getItem("refreshToken"),
          },
        });

        setHistory(response.data?.data?.result || []); // Set history from the response
      } catch (error) {
        console.error("Error fetching redemption history:", error);
        setMessage("Failed to fetch redemption history.");
      }
    };

    fetchRedemptionHistory();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Points Summary */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-xl shadow-lg p-6 text-white text-center">
        <Trophy className="w-12 h-12 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Your Points</h1>
        <p className="text-5xl font-bold">{userPoints}</p>
        <p className="text-red-100 mt-2 text-lg">
          Redeem your points for exciting rewards!
        </p>
      </div>

      {/* Redeem Form */}
      <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
          <Gift className="w-6 h-6 text-red-500" />
          Redeem Points
        </h2>
        <form onSubmit={handleRedeem} className="space-y-4">
          <div>
            <label
              htmlFor="points"
              className="block text-sm font-medium text-gray-700"
            >
              Enter the number of points to redeem:
            </label>
            <input
              type="number"
              id="points"
              value={redeemPoints}
              onChange={(e) => setRedeemPoints(e.target.value)}
              placeholder="e.g., 100"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#b82025] text-white font-semibold py-3 px-4 rounded-lg hover:bg-red-700 transition"
          >
            Redeem Points
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes("Success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      {/* Redemption History */}
      <div className="bg-gray-50 rounded-xl shadow-md p-6 space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
          <History className="w-6 h-6 text-red-500" />
          Redemption History
        </h2>
        {history.length > 0 ? (
          <ul className="space-y-2">
            {history.map((entry, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-white rounded-lg shadow-sm p-4 border"
              >
                <div>
                  <span className="font-semibold text-gray-700">
                    Redeemed:{" "}
                    <span className="text-red-600">{entry.points} pts</span>
                  </span>
                  <p className="text-sm text-gray-500">{entry.remarks}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(entry.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">
            No redemption history yet. Redeem your first reward!
          </p>
        )}
      </div>
    </div>
  );
};

export default Redeem;
