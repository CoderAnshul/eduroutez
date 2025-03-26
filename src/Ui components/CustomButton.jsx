import React from 'react';
import { Link } from 'react-router-dom';

const CustomButton = ({ text, className = '', to = '', onClick }) => {
  return (
    <Link to={to}>
      <button
        className={`${className} viewmorebtn  bg-[#b82025] text-sm text-white w-32 whitespace-nowrap transition-transform transform active:scale-95 hover:scale-105`}
        onClick={onClick}  
      >
        {text}
      </button>
    </Link>
  );
}

export default CustomButton;
