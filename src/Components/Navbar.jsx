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



const categories = [
  {
    label: 'MAP',
    sidebarItems: [
      { id: 1, name: 'Top Ranked Colleges' },
      { id: 2, name: 'Popular Courses' },
      { id: 3, name: 'Exams' },
      { id: 4, name: 'Colleges By Location' },
      { id: 5, name: 'Compare Colleges' },
      { id: 6, name: 'College Reviews' },
      { id: 7, name: 'CAT Percentile Predictor' },
      { id: 8, name: 'College Predictors' },
      { id: 9, name: 'Ask Current MBA Students' },
      { id: 10, name: 'Resources' },
      { id: 11, name: 'Popular Specialization' },
    ],
    contents: {
      1: [
        [
          { name: 'Top MBA Colleges in India', link: '#' },
          { name: 'Top MBA Colleges in Bangalore', link: '#' },
          { name: 'Top MBA Colleges in Pune', link: '#' },
          { name: 'Top MBA Colleges in Ranchi', link: '#' },
          { name: 'Top MBA Colleges in Delhi', link: '#' },
        ],
        [
          { name: 'Top MBA Colleges in Chennai', link: '#' },
          { name: 'Top MBA Colleges in Hyderabad', link: '#' },
          { name: 'Top MBA Colleges in Hyderabad', link: '#' },
          { name: 'Top MBA Colleges in Hyderabad', link: '#' },
          { name: 'Top MBA Colleges in Hyderabad', link: '#' },
          { name: 'Top MBA Colleges in Hyderabad', link: '#' },
          { name: 'Top MBA Colleges in Hyderabad', link: '#' },
        ],
      ],
      2: [
        [
          { name: 'BTech in Computer Science', link: '#' },
          { name: 'BTech in Mechanical Engineering', link: '#' },
        ],
        [
          { name: 'MBA in Marketing', link: '#' },
          { name: 'MBA in Finance', link: '#' },
        ],
      ],
      3: [
        [
          { name: 'CAT Exam', link: '#' },
          { name: 'GATE Exam', link: '#' },
          { name: 'GMAT Exam', link: '#' },
        ],
        [
          { name: 'XAT Exam', link: '#' },
          { name: 'MAT Exam', link: '#' },
        ],
      ],
      4: [
        [
          { name: 'Colleges in Bangalore', link: '#' },
          { name: 'Colleges in Pune', link: '#' },
          { name: 'Colleges in Delhi', link: '#' },
        ],
        [
          { name: 'Colleges in Chennai', link: '#' },
          { name: 'Colleges in Hyderabad', link: '#' },
        ],
      ],
      5: [
        [
          { name: 'IIM Bangalore vs IIM Ahmedabad', link: '#' },
          { name: 'IIT Delhi vs IIT Bombay', link: '#' },
        ],
        [
          { name: 'BITS Pilani vs VIT', link: '#' },
        ],
      ],
      6: [
        [
          { name: 'IIM Ahmedabad Reviews', link: '#' },
          { name: 'IIT Bombay Reviews', link: '#' },
        ],
        [
          { name: 'IIM Lucknow Reviews', link: '#' },
          { name: 'IIT Madras Reviews', link: '#' },
        ],
      ],
      7: [
        [
          { name: 'CAT Percentile 90+', link: '#' },
          { name: 'CAT Percentile 99+', link: '#' },
        ],
      ],
      8: [
        [
          { name: 'MBA College Predictor', link: '#' },
          { name: 'Engineering College Predictor', link: '#' },
        ],
      ],
      9: [
        [
          { name: 'Talk to MBA Students at IIM', link: '#' },
          { name: 'Talk to MBA Students at XLRI', link: '#' },
        ],
      ],
      10: [
        [
          { name: 'Free Study Materials', link: '#' },
          { name: 'Mock Test Resources', link: '#' },
        ],
        [
          { name: 'Interview Preparation Guides', link: '#' },
        ],
      ],
      11: [
        [
          { name: 'MBA in Operations', link: '#' },
          { name: 'MBA in HR', link: '#' },
        ],
        [
          { name: 'MBA in Business Analytics', link: '#' },
        ],
      ],
    },
  },
  
  {
    label: 'ENGINEERING',
    sidebarItems: [
      { id: 1, name: 'Top Ranked Colleges' },
      { id: 2, name: 'Popular Courses' },
      { id: 3, name: 'Exams' },
      { id: 4, name: 'Colleges By Location' },
      { id: 5, name: 'Compare Colleges' },
    ],
    contents: {
      1: [
        [
          { name: 'Top Engineering Colleges in India', link: '#' },
          { name: 'Top Engineering Colleges in Delhi', link: '#' },
        ],
        [
          { name: 'Top Engineering Colleges in Mumbai', link: '#' },
          { name: 'Top Engineering Colleges in Bangalore', link: '#' },
        ],
      ],
      2: [
        [
          { name: 'BTech in Computer Science', link: '#' },
          { name: 'BTech in Mechanical Engineering', link: '#' },
        ],
        [
          { name: 'BTech in Civil Engineering', link: '#' },
          { name: 'BTech in Electrical Engineering', link: '#' },
        ],
      ],
      3: [
        [
          { name: 'GATE Exam', link: '#' },
          { name: 'JEE Main', link: '#' },
        ],
        [
          { name: 'JEE Advanced', link: '#' },
          { name: 'BITSAT', link: '#' },
        ],
      ],
      4: [
        [
          { name: 'Colleges in Delhi', link: '#' },
          { name: 'Colleges in Mumbai', link: '#' },
        ],
        [
          { name: 'Colleges in Bangalore', link: '#' },
          { name: 'Colleges in Pune', link: '#' },
        ],
      ],
      5: [
        [
          { name: 'College A vs College B', link: '#' },
          { name: 'College C vs College D', link: '#' },
        ],
        [
          { name: 'College E vs College F', link: '#' },
          { name: 'College G vs College H', link: '#' },
        ],
      ],
    },
  },
  {
    label: 'MEDICAL',
    sidebarItems: [
      { id: 1, name: 'Top Ranked Colleges' },
      { id: 2, name: 'Popular Courses' },
      { id: 3, name: 'Exams' },
      { id: 4, name: 'Colleges By Location' },
      { id: 5, name: 'Compare Colleges' },
    ],
    contents: {
      1: [
        [
          { name: 'Top Medical Colleges in India', link: '#' },
          { name: 'Top Medical Colleges in Delhi', link: '#' },
        ],
        [
          { name: 'Top Medical Colleges in Mumbai', link: '#' },
          { name: 'Top Medical Colleges in Bangalore', link: '#' },
        ],
      ],
      2: [
        [
          { name: 'MBBS', link: '#' },
          { name: 'BDS', link: '#' },
        ],
        [
          { name: 'BAMS', link: '#' },
          { name: 'BHMS', link: '#' },
        ],
      ],
      3: [
        [
          { name: 'NEET Exam', link: '#' },
          { name: 'AIIMS Exam', link: '#' },
        ],
        [
          { name: 'JIPMER Exam', link: '#' },
          { name: 'PGIMER Exam', link: '#' },
        ],
      ],
      4: [
        [
          { name: 'Colleges in Delhi', link: '#' },
          { name: 'Colleges in Mumbai', link: '#' },
        ],
        [
          { name: 'Colleges in Bangalore', link: '#' },
          { name: 'Colleges in Chennai', link: '#' },
        ],
      ],
      5: [
        [
          { name: 'College A vs College B', link: '#' },
          { name: 'College C vs College D', link: '#' },
        ],
        [
          { name: 'College E vs College F', link: '#' },
          { name: 'College G vs College H', link: '#' },
        ],
      ],
    },
  },
  {
    label: 'DESIGN',
    sidebarItems: [
      { id: 1, name: 'Top Ranked Colleges' },
      { id: 2, name: 'Popular Courses' },
      { id: 3, name: 'Exams' },
      { id: 4, name: 'Colleges By Location' },
      { id: 5, name: 'Compare Colleges' },
    ],
    contents: {
      1: [
        [
          { name: 'Top Design Colleges in India', link: '#' },
          { name: 'Top Design Colleges in Delhi', link: '#' },
        ],
        [
          { name: 'Top Design Colleges in Mumbai', link: '#' },
          { name: 'Top Design Colleges in Bangalore', link: '#' },
        ],
      ],
      2: [
        [
          { name: 'B.Des', link: '#' },
          { name: 'M.Des', link: '#' },
        ],
        [
          { name: 'Fashion Design', link: '#' },
          { name: 'Interior Design', link: '#' },
        ],
      ],
      3: [
        [
          { name: 'NID Entrance Exam', link: '#' },
          { name: 'CEED Exam', link: '#' },
        ],
        [
          { name: 'NIFT Exam', link: '#' },
          { name: 'UPES DAT', link: '#' },
        ],
      ],
      4: [
        [
          { name: 'Colleges in Delhi', link: '#' },
          { name: 'Colleges in Mumbai', link: '#' },
        ],
        [
          { name: 'Colleges in Bangalore', link: '#' },
          { name: 'Colleges in Pune', link: '#' },
        ],
      ],
      5: [
        [
          { name: 'College A vs College B', link: '#' },
          { name: 'College C vs College D', link: '#' },
        ],
        [
          { name: 'College E vs College F', link: '#' },
          { name: 'College G vs College H', link: '#' },
        ],
      ],
    },
  },
  {
    label: 'MEDIA',
    sidebarItems: [
      { id: 1, name: 'Top Ranked Colleges' },
      { id: 2, name: 'Popular Courses' },
      { id: 3, name: 'Exams' },
      { id: 4, name: 'Colleges By Location' },
      { id: 5, name: 'Compare Colleges' },
    ],
    contents: {
      1: [
        [
          { name: 'Top Media Colleges in India', link: '#' },
          { name: 'Top Media Colleges in Delhi', link: '#' },
 { name: 'Top Media Colleges in Mumbai', link: '#' },
          { name: 'Top Media Colleges in Bangalore', link: '#' },
        ],
        [
          { name: 'Top Media Colleges in Chennai', link: '#' },
          { name: 'Top Media Colleges in Pune', link: '#' },
        ],
      ],
      2: [
        [
          { name: 'BA in Journalism', link: '#' },
          { name: 'BSc in Film Production', link: '#' },
        ],
        [
          { name: 'MA in Mass Communication', link: '#' },
          { name: 'Diploma in Photography', link: '#' },
        ],
      ],
      3: [
        [
          { name: 'JMC Entrance Exam', link: '#' },
          { name: 'FTII Entrance Exam', link: '#' },
        ],
        [
          { name: 'XIC Entrance Exam', link: '#' },
          { name: 'Symbiosis Entrance Exam', link: '#' },
        ],
      ],
      4: [
        [
          { name: 'Colleges in Delhi', link: '#' },
          { name: 'Colleges in Mumbai', link: '#' },
        ],
        [
          { name: 'Colleges in Bangalore', link: '#' },
          { name: 'Colleges in Kolkata', link: '#' },
        ],
      ],
      5: [
        [
          { name: 'College A vs College B', link: '#' },
          { name: 'College C vs College D', link: '#' },
        ],
        [
          { name: 'College E vs College F', link: '#' },
          { name: 'College G vs College H', link: '#' },
        ],
      ],
    },
  },
  {
    label: 'TOURISM',
    sidebarItems: [
      { id: 1, name: 'Top Ranked Colleges' },
      { id: 2, name: 'Popular Courses' },
      { id: 3, name: 'Exams' },
      { id: 4, name: 'Colleges By Location' },
      { id: 5, name: 'Compare Colleges' },
    ],
    contents: {
      1: [
        [
          { name: 'Top Tourism Colleges in India', link: '#' },
          { name: 'Top Tourism Colleges in Delhi', link: '#' },
        ],
        [
          { name: 'Top Tourism Colleges in Mumbai', link: '#' },
          { name: 'Top Tourism Colleges in Bangalore', link: '#' },
        ],
      ],
      2: [
        [
          { name: 'BTTM', link: '#' },
          { name: 'BHM', link: '#' },
        ],
        [
          { name: 'MBA in Tourism', link: '#' },
          { name: 'Diploma in Travel and Tourism', link: '#' },
        ],
      ],
      3: [
        [
          { name: 'NCHMCT JEE', link: '#' },
          { name: 'IHM Entrance Exam', link: '#' },
        ],
        [
          { name: 'Travel and Tourism Entrance Exam', link: '#' },
          { name: 'BHMCT Entrance Exam', link: '#' },
        ],
      ],
      4: [
        [
          { name: 'Colleges in Delhi', link: '#' },
          { name: 'Colleges in Mumbai', link: '#' },
        ],
        [
          { name: 'Colleges in Bangalore', link: '#' },
          { name: 'Colleges in Goa', link: '#' },
        ],
      ],
      5: [
        [
          { name: 'College A vs College B', link: '#' },
          { name: 'College C vs College D', link: '#' },
        ],
        [
          { name: 'College E vs College F', link: '#' },
          { name: 'College G vs College H', link: '#' },
        ],
      ],
    },
  },
  {
    label: 'HOSPITALITY',
    sidebarItems: [
      { id: 1, name: 'Top Ranked Colleges' },
      { id: 2, name: 'Popular Courses' },
      { id: 3, name: 'Exams' },
      { id: 4, name: 'Colleges By Location' },
      { id: 5, name: 'Compare Colleges' },
    ],
    contents: {
      1: [
        [
          { name: 'Top Hospitality Colleges in India', link: '#' },
          { name: 'Top Hospitality Colleges in Delhi', link: '#' },
        ],
        [
          { name: 'Top Hospitality Colleges in Mumbai', link: '#' },
          { name: 'Top Hospitality Colleges in Bangalore', link: '#' },
        ],
      ],
      2: [
        [
          { name: 'BHM', link: '#' },
          { name: 'B.Sc in Hospitality and Hotel Administration', link: '#' },
        ],
        [
          { name: 'MBA in Hospitality', link: '#' },
          { name: 'Diploma in Hotel Management', link: '#' },
        ],
      ],
      3: [
        [
          { name: 'NCHMCT JEE', link: '#' },
          { name: 'IHM Entrance Exam', link: '#' },
        ],
        [
          { name: 'Hotel Management Entrance Exam', link: '#' },
          { name: 'BHMCT Entrance Exam', link: '#' },
        ],
      ],
      4: [
        [
          { name: 'Colleges in Delhi', link: '#' },
          { name: 'Colleges in Mumbai', link: '#' },
        ],
        [
          { name: 'Colleges in Bangalore', link: '#' },
          { name: 'Colleges in Pune', link: '#' },
        ],
      ],
      5: [
        [
          { name: 'College A vs College B', link: '#' },
          { name: 'College C vs College D', link: '#' },
        ],
        [
          { name: 'College E vs College F', link: '#' },
          { name: 'College G vs College H', link: '#' },
        ],
      ],
    },
  },
  {
    label: 'COUNSELING',
    sidebarItems: [
      { id: 1, name: 'Top Ranked Colleges' },
      { id: 2, name: 'Popular Courses' },
      { id: 3, name: 'Exams' },
      { id: 4, name: 'Colleges By Location' },
      { id: 5, name: 'Compare Colleges' },
    ],
    contents: {
      1: [
        [
          { name: 'Top Counseling Colleges in India', link: '#' },
          { name: 'Top Counseling Colleges in Delhi', link: '#' },
        ],
        [
          { name: 'Top Counseling Colleges in Mumbai', link: '#' },
          { name: 'Top Counseling Colleges in Bangalore', link: '#' },
        ],
      ],
      2: [
        [
          { name: 'B.A. in Psychology', link: '#' },
          { name: 'M.A. in Counseling Psychology', link: '#' },
        ],
        [
          { name: 'Diploma in Counseling', link: '#' },
          { name: 'Certificate in Counseling Skills', link: '#' },
        ],
      ],
      3: [
        [
          { name: 'Entrance Exam for Psychology', link: '#' },
          { name: 'NET Exam for Psychology', link: '#' },
        ],
        [
          { name: 'State Level Counseling Exams', link: '#' },
          { name: 'University Level Counseling Exams', link: '#' },
        ],
      ],
      4: [
        [
          { name: 'Colleges in Delhi', link: '#' },
          { name: 'Colleges in Mumbai', link: '#' },
        ],
        [
          { name: 'Colleges in Bangalore', link: '#' },
          { name: 'Colleges in Chennai', link: '#' },
        ],
      ],
      5: [
        [
          { name: 'College A vs College B', link: '#' },
          { name: 'College C vs College D', link: '#' },
        ],
        [
          { name: 'College E vs College F', link: '#' },
          { name: 'College G vs College H', link: '#' },
        ],
      ],
    },
  },
];


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
          className={`fixed top-0 left-0 h-full p-4 w-4/5 max-w-[300px] bg-gray-100 shadow-md z-[1000] transform ${
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
