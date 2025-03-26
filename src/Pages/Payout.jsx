"use client";

import React, { useState, useEffect } from "react";
import { Wallet, AlertCircle, CheckCircle2, DollarSign } from "lucide-react";
import axiosInstance from "../ApiFunctions/axios";
import { toast } from "sonner";

const PayoutForm = () => {
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [requestedAmount, setRequestedAmount] = useState(1000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userPoints, setUserPoints] = useState(0);
  const apiUrl = import.meta.env.VITE_BASE_URL;

  const paymentMethods = [{ id: "bank", name: "Bank Transfer", icon: Wallet }];

  useEffect(() => {
    const fetchUserPoints = async () => {
      try {
        const userId = localStorage.getItem("userId"); // Get user ID from localStorage
        if (!userId) throw new Error("User ID not found in localStorage");

        const response = await axiosInstance.get(`${apiUrl}/user/`, {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("accessToken"),
            "x-refresh-token": localStorage.getItem("refreshToken"),
          },
        });

        setUserPoints(response.data.data?.balance || 0); // Set points from the response
      } catch (error) {
        console.error("Error fetching user points:", error);
        setError("Failed to fetch points.");
      }
    };

    fetchUserPoints();
  }, [apiUrl]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axiosInstance(`${apiUrl}/payout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: { paymentMethod, requestedAmount },
      });

      if (!response) {
        throw new Error("Network response was not ok");
      }
      toast.success("Payout request submitted successfully!");
      setSuccess("Payout request submitted successfully!");
    } catch (error) {
      console.error("There was an error!", error);
      toast.error(
        error.response.data.error ||
          "Failed to process payout request. Please try again."
      );
      setError(
        error.response.data.error ||
          "Failed to process payout request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center pb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Payout Request Form
            </h2>
          </div>
          <div className="text-center pb-4">
            <h3 className="text-xl font-medium text-gray-700">
              Current Balance: {userPoints} points
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Payment Method
              </label>
              <div className="flex space-x-4 mb-8">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.name)}
                    className={`flex items-center space-x-2 p-2 border mb-8 rounded-lg ${
                      paymentMethod === method.name
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                  >
                    <method.icon className="w-6 h-6" />
                    <span className="text-sm">{method.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  value={requestedAmount}
                  onChange={(e) => setRequestedAmount(Number(e.target.value))}
                  className="block w-full pl-10 mb-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Error and Success Messages */}
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                <CheckCircle2 className="w-5 h-5" />
                <p className="text-sm">{success}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#b82025] hover:bg-red-700"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                "Submit Payout Request"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PayoutForm;
