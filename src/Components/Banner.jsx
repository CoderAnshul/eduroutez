import { useState, useEffect } from 'react';
import mainBanner from '../assets/Images/mainBanner.jpg';
import banner3 from '../assets/Images/pageBanner.png';
import banner2 from '../assets/Images/img3.png';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { setInput } from '../config/inputSlice';

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputField, setInputField] = useState("");
  const [searchType, setSearchType] = useState("course");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const banners = [
    { id: 1, imageUrl: mainBanner },
    { id: 2, imageUrl: banner3 },
    { id: 3, imageUrl: banner2 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => setInputField(e.target.value);

  const handleBtnClick = () => {
    if (inputField === "") {
      alert("Please enter something");
      return;
    }

    // Handle different search types
    if (searchType === 'counsellor') {
      navigate(`/counselor?name=${encodeURIComponent(inputField)}`);
    } else {
      dispatch(setInput(inputField));
      navigate("/searchpage");
    }
  }

  const getPlaceholderText = () => {
    switch (searchType) {
      case 'institute':
        return 'Search for institutes...';
      case 'course':
        return 'Search for courses, institutes...';
      case 'counsellor':
        return 'Search for counsellor names...';
      default:
        return 'Search for colleges, institutes and more...';
    }
  };

  return (
    <div className="h-[480px] w-full relative">
      <div className="h-full w-full absolute top-0 left-0 z-0">
        {banners.map((banner, index) => (
          <div 
            key={banner.id} 
            className={`h-full w-full absolute top-0 left-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`} 
            style={{ 
              backgroundImage: `url(${banner.imageUrl})`, 
              backgroundSize: "cover", 
              backgroundPosition: "center" 
            }}
          ></div>
        ))}
      </div>

      <div className="h-full w-full bg-[#00000049] p-2 absolute top-0 overflow-hidden z-10 flex flex-col items-center justify-center">
        <h1 className="text-4xl text-white text-center font-semibold mb-5">
          {searchType === 'counsellor' 
            ? 'Find Expert Education Counsellors' 
            : 'Find Over 5000+ Colleges in India'}
        </h1>
        <div className="search ml-5 mr-5 h-12 bg-white border-[1.5px] relative border-gray-500 rounded-lg items-center gap-2 max-w-[800px] w-full overflow-hidden flex">
          <select 
            className="h-full bg-gray-100 border-r border-gray-300 px-2 text-sm outline-none cursor-pointer" 
            value={searchType} 
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="institute">Institute</option>
            <option value="course">Course</option>
            <option value="counsellor">Counsellor</option>
          </select>
          <div className="flex items-center w-4/5 pl-4 py-2 gap-3">
            <button className="hover:scale-105 transition-all">
              <svg 
                className="w-5 h-5 text-gray-500" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <input 
              className="text-sm w-1/2 outline-none" 
              type="text" 
              name="search" 
              value={inputField} 
              onChange={handleInputChange} 
              id="search" 
              placeholder={getPlaceholderText()} 
            />
          </div>
          <button 
            className="!h-full right-0 !rounded-sm w-1/5 absolute top-0 bg-red-500 min-w-24 hover:bg-red-400 hover:scale-105 transition-all text-white" 
            onClick={handleBtnClick}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;