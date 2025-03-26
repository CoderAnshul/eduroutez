import React, { useState, useEffect } from "react";
import axios from "axios";
import { useMutation } from "react-query";

const BankDetails = () => {
  const [bankData, setBankData] = useState({
    bankName: "",
    accountNumber: "",
    accountHolderName: "",
    ifscCode: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

  // Fetch bank details
  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error("User ID not found in localStorage");

        const response = await axios.get(`${VITE_BASE_URL}/student/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("accessToken"),
            "x-refresh-token": localStorage.getItem("refreshToken"),
          },
        });

        if (response.data.data) {
          setBankData({
            bankName: response.data.data.bankName || "",
            accountNumber: response.data.data.accountNumber || "",
            accountHolderName: response.data.data.accountHolderName || "",
            ifscCode: response.data.data.ifscCode || "",
          });
        }
      } catch (error) {
        console.error("Error fetching bank details:", error);
        setMessage("Failed to fetch bank details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBankDetails();
  }, []);

  // Update bank details mutation
  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post(`${VITE_BASE_URL}/student/`, formData, {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("accessToken"),
          "x-refresh-token": localStorage.getItem("refreshToken"),
        },
      });
      return response.data;
    },
    onSuccess: () => {
      setMessage("Bank details updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    },
    onError: (error) => {
      setMessage(
        error.response?.data?.message || "Failed to update bank details"
      );
      setTimeout(() => setMessage(""), 3000);
    },
  });

  const validateForm = () => {
    if (!bankData.bankName.trim()) return "Bank name is required";
    if (!bankData.accountNumber.trim()) return "Account number is required";
    if (!bankData.accountHolderName.trim())
      return "Account holder name is required";
    if (!bankData.ifscCode.trim()) return "IFSC code is required";
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankData.ifscCode)) {
      return "Invalid IFSC code format";
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setMessage(error);
      return;
    }

    const payload = {
      bankName: bankData.bankName,
      accountNumber: bankData.accountNumber,
      accountHolderName: bankData.accountHolderName,
      ifscCode: bankData.ifscCode,
    };

    mutate(payload);
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 border border-gray-300 rounded-lg shadow-md">
        Loading bank details...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Bank Details</h2>

      {message && (
        <div
          className={`p-4 mb-4 rounded-md ${
            message.includes("success")
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bank Name */}
          <div>
            <label
              htmlFor="bankName"
              className="block text-sm font-medium text-gray-700"
            >
              Bank Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="bankName"
              value={bankData.bankName}
              onChange={(e) =>
                setBankData({ ...bankData, bankName: e.target.value })
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-red-300 focus:border-red-600"
              placeholder="Enter bank name"
              required
            />
          </div>

          {/* Account Number */}
          <div>
            <label
              htmlFor="accountNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="accountNumber"
              value={bankData.accountNumber}
              onChange={(e) =>
                setBankData({ ...bankData, accountNumber: e.target.value })
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-red-300 focus:border-red-600"
              placeholder="Enter account number"
              required
            />
          </div>

          {/* Account Holder Name */}
          <div>
            <label
              htmlFor="accountHolderName"
              className="block text-sm font-medium text-gray-700"
            >
              Account Holder Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="accountHolderName"
              value={bankData.accountHolderName}
              onChange={(e) =>
                setBankData({ ...bankData, accountHolderName: e.target.value })
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-red-300 focus:border-red-600"
              placeholder="Enter account holder name"
              required
            />
          </div>

          {/* IFSC Code */}
          <div>
            <label
              htmlFor="ifscCode"
              className="block text-sm font-medium text-gray-700"
            >
              IFSC Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="ifscCode"
              value={bankData.ifscCode}
              onChange={(e) =>
                setBankData({
                  ...bankData,
                  ifscCode: e.target.value.toUpperCase(),
                })
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-red-300 focus:border-red-600"
              placeholder="Enter IFSC code"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#b82025] text-white py-2 px-6 rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Updating..." : "Update Details"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BankDetails;
