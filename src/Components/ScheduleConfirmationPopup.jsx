import React from "react";
import { CheckCircle2, X } from "lucide-react";

const ScheduleConfirmationPopup = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] animate-backdrop-fade"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="bg-white rounded-2xl p-8 max-w-md w-full relative z-10 shadow-2xl animate-modal-pop border border-gray-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          {/* Animated Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-100 rounded-full scale-[2] opacity-20 animate-pulse" />
              <svg 
                className="w-20 h-20 text-[#B82025] relative z-10" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path className="checkmark-path" d="m9 12 2 2 4-4" />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
            Test Scheduled!
          </h2>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            Your guidance test has been successfully scheduled. 
            Check your dashboard for upcoming details.
          </p>

          <div className="space-y-3">
            <a
              href="https://admin.eduroutez.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full bg-[#B82025] text-white py-3.5 px-6 rounded-xl font-bold text-lg shadow-lg shadow-red-900/20 hover:bg-[#a01c21] transition-all transform hover:-translate-y-0.5"
            >
              Go to Admin Panel
            </a>
            
            <button
              onClick={onClose}
              className="w-full py-3 px-6 text-gray-500 font-semibold hover:text-gray-800 transition-colors"
            >
              Close Window
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleConfirmationPopup;
