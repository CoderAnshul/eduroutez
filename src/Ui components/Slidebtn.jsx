import React from 'react'
import gallery from '../assets/Images/galleryBtn.png';

const Slidebtn = ({onClick,className}) => {
  return (
    <button
        variant="outline"
        size="icon"
        className={`${className} absolute top-4 z-20 left-4 p-3 rounded-full bg-white/80 hover:bg-white/90`}
        onClick={onClick}
        aria-label="View fullscreen"
      >
        <img src={gallery} alt="gallerybtn" />
      </button>
  )
}

export default Slidebtn