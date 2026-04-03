import React, { useState } from 'react';
import Login from '../Pages/Login';
import Signup from '../Pages/Signup';

const AuthPopup = ({ isOpen, onClose }) => {
  const [popupMode, setPopupMode] = useState("login");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black bg-opacity-70 flex items-center justify-center p-4 sm:p-6 md:p-12 overflow-hidden transition-opacity">
      <div className="relative w-full max-w-5xl h-full max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scale-up">
        <button 
           onClick={onClose}
           className="absolute top-4 right-4 z-[1010] text-gray-500 hover:text-red-600 bg-white hover:bg-red-50 p-2 rounded-full shadow-md transition-all"
        >
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <line x1="18" y1="6" x2="6" y2="18"></line>
             <line x1="6" y1="6" x2="18" y2="18"></line>
           </svg>
        </button>
        <div className="w-full h-full overflow-y-auto">
          {popupMode === "login" ? (
             <Login isMode="popup" onSwitch={() => setPopupMode("signup")} onClose={onClose} />
          ) : (
             <Signup isMode="popup" onSwitch={() => setPopupMode("login")} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPopup;
