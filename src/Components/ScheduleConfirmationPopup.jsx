import React from "react";

const ScheduleConfirmationPopup = ({ open, onClose }) => {
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Test Scheduled!</h2>
          <p className="text-gray-600 mb-4">
            Your guidance test has been scheduled. Login into your panel for more options.
          </p>
          <a
            href="https://admin.eduroutez.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-red-700 text-white py-2 px-6 rounded-lg font-semibold hover:bg-red-800"
          >
            Go to Admin Panel
          </a>
        </div>
      </div>
    </div>
  );
};

export default ScheduleConfirmationPopup;
