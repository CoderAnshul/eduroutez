import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const GuidanceTestPopup = ({ open, onClose, onPay, onScheduleLater }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Become a Verified Counsellor</h2>
          <p className="text-gray-600">
            To complete your registration and become a verified counsellor, you must pay and give the guidance test. You can do it now or schedule for later. Only verified counsellors can do counselling.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={onPay}
            className="w-full bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-red-800"
          >
            Pay & Give Test
          </button>
          <button
            onClick={onScheduleLater}
            className="w-full border border-red-700 text-red-700 py-3 rounded-lg font-semibold hover:bg-red-50"
          >
            Schedule Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuidanceTestPopup;
