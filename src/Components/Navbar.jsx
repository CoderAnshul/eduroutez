import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import logo from '../assets/Images/logo.png';
import searchImg from '../assets/Images/searchLogo.png';
import edit from '../assets/Images/editBtn.png';
import explore from '../assets/Images/explore.png';
import notification from '../assets/Images/notification.png';
import menu from '../assets/Images/menuBar.png';
import menubar from '../assets/Images/secondMenu.png';
import SecondMenu from './SubNavbar';
import MobileNavbar from './MobileNavbar';
import categories from '../DataFiles/categories';


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Prevent scrolling on background when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isMenuOpen]);

  return (
    <>
      <div className='sticky top-0 z-[999] bg-white'>
        <div className='h-16 w-full p-5 flex items-center justify-between '>
          <Link to="/">
            <img className='h-6 md:h-8' src={logo} alt="mainLogo" />
          </Link>

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
            <Link to="/writereview" className='CustomFlex gap-1 font-medium cursor-pointer text-sm hidden lg:flex'>
              <button>
                <img className='h-4' src={edit} alt="editBtn" />
              </button>
              <h4>Write a Review</h4>
            </Link>

            <Link to="/searchpage" className='CustomFlex gap-1 font-medium cursor-pointer text-sm hidden lg:flex'>
              <img className='h-4' src={explore} alt="exploreBtn" />
              <span>Explore</span>
            </Link>

            <button
              onClick={toggleMenu}
              className='CustomFlex gap-1 font-medium cursor-pointer text-sm md:hidden'
            >
              <img className='h-6' src={menubar} alt="menu" />
            </button>

            <div className='CustomFlex relative gap-1 font-medium cursor-pointer text-sm'>
              <span className='bg-red-500 h-2 w-2 rounded-full absolute top-0 right-0'></span>
              <img className='h-5' src={notification} alt="notification" />
            </div>

            <div className='CustomFlex relative gap-1 font-medium  text-sm border-2 py-1 px-2 border-gray-400 rounded-2xl'>
              <img className='h-3 opacity-75 cursor-pointer' src={menu} alt="menu" />
              <Link to='/login' className='bg-gray-500 cursor-pointer hover:scale-105 transition-all h-5 w-5 rounded-full'></Link>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[999] transition-opacity"
            onClick={toggleMenu} // Close menu when overlay is clicked
          ></div>
        )}

        <div
          className={`fixed top-0 left-0 h-dvh p-4 w-4/5 max-w-[300px] bg-gray-100 shadow-md z-[1000] transform ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300`}
        >

          <div className='flex items-center justify-between'>
              <Link to="/">
                <img className='h-6 md:h-8' src={logo} alt="mainLogo" />
              </Link>

              <button
                onClick={toggleMenu}
                className="  text-white font-semibold hover:font-semibold text-md px-2  rounded-full hover:bg-red-200 transition-all bg-red-500 hover:text-red-800"
              >
                X
              </button>
          </div>
          
          
          
          <ul className="mt-12  space-y-4">
            
            <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
            <li><Link to="/searchpage" onClick={toggleMenu}>Explore</Link></li>
            <li><Link to="/writereview" onClick={toggleMenu}>Write a Review</Link></li>
            <div className='md:hidden overflow-y-scroll scrollbar-thumb-transparent'>
              <MobileNavbar categories={categories}/>
            </div>
          </ul>
        </div>
      </div>

      <div className='hidden md:flex'>
      <SecondMenu categories={categories}/>
      </div>
    </>
  );
};

export default Navbar;
