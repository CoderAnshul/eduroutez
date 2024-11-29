import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import logo from '../assets/Images/logo.png';
import searchImg from '../assets/Images/searchLogo.png';
import edit from '../assets/Images/editBtn.png';
import explore from '../assets/Images/explore.png';
import notification from '../assets/Images/notification.png';
import menu from '../assets/Images/menuBar.png';
import menubar from '../assets/Images/secondMenu.png';
import SecondMenu from './SubNavbar';

const Navbar = () => {
  return (
    <>
      <div className='sticky top-0 z-[999] bg-white shadow-md'>
      <div className='h-16 w-full p-5 flex items-center justify-between '>
        {/* Logo - link it to home or appropriate page */}
        <Link to="/">
          <img className='h-6 md:h-8' src={logo} alt="mainLogo" />
        </Link>
        
        {/* Search bar */}
        <div className="search ml-5 bg-white border-[1.5px] border-gray-500 px-4 py-2 rounded-lg items-center gap-2 w-[40%] overflow-hidden hidden sm:flex">
          <button>
            <img className='hover:scale-105 transition-all' src={searchImg} alt="search" />
          </button>
          <input
            className='text-sm w-full'
            type="text"
            name="search"
            id="search"
            placeholder='Search for Colleges, Institutes, and more...'
          />
        </div>

        <div className='CustomFlex gap-3 opacity-80'>
          {/* Write a Review link */}
          <Link to="/writereview" className='CustomFlex gap-1 font-medium cursor-pointer text-sm hidden lg:flex'>
            <button>
              <img className='h-4' src={edit} alt="editBtn" />
            </button>
            <h4>Write a Review</h4>
          </Link>

          {/* Explore link */}
          <Link to="/searchpage" className='CustomFlex gap-1 font-medium cursor-pointer text-sm hidden lg:flex'>
            <img className='h-4' src={explore} alt="exploreBtn" />
            <span>Explore</span>
          </Link>

          {/* Menu bar icon */}
          <button className='CustomFlex gap-1 font-medium cursor-pointer text-sm md:hidden'>
            <img className='h-6' src={menubar} alt="menu" />
          </button>~

          {/* Notification icon */}
          <div className='CustomFlex relative gap-1 font-medium cursor-pointer text-sm'>
            <span className='bg-red-500 h-2 w-2 rounded-full absolute top-0 right-0'></span>
            <img className='h-5' src={notification} alt="notification" />
          </div>

          {/* Profile icon */}
          <div className='CustomFlex relative gap-1 font-medium cursor-pointer text-sm border-2 py-1 px-2 border-gray-400 rounded-2xl'>
            <img className='h-3 opacity-75' src={menu} alt="menu" />
            <span className='bg-gray-500 h-5 w-5 rounded-full'></span>
          </div>
        </div>
      </div>

      <SecondMenu />
      </div>
    </>
  );
}

export default Navbar;
