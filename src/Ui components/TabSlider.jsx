import React, { useRef, useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce"; // Install lodash.debounce if not already installed

const TabSlider = ({ tabs, sectionRefs, className }) => {
  const sliderRef = useRef();
  const tabContainerRef = useRef();
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFixed, setIsFixed] = useState(false);
  const [containerTop, setContainerTop] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const checkOverflow = useCallback(() => {
    const slider = sliderRef.current;
    if (slider) {
      setIsOverflowing(slider.scrollWidth > slider.clientWidth);
    }
  }, []);

  useEffect(() => {
    checkOverflow();

    if (tabContainerRef.current) {
      const rect = tabContainerRef.current.getBoundingClientRect();
      setContainerTop(rect.top + window.scrollY);
      setContainerWidth(rect.width);
    }

    const handleScroll = debounce(() => {
      if (tabContainerRef.current) {
        const scrollPosition = window.scrollY;
        const shouldBeFixed = scrollPosition > containerTop - 64;
        setIsFixed(shouldBeFixed);
      }
    }, 50);

    const handleResize = debounce(() => {
      checkOverflow();
      if (tabContainerRef.current) {
        setContainerWidth(tabContainerRef.current.offsetWidth);
        const rect = tabContainerRef.current.getBoundingClientRect();
        setContainerTop(rect.top + window.scrollY);
      }
    }, 100);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [checkOverflow, containerTop]);

  const handleTabClick = (index) => {
    setActiveIndex(index);

    const section = sectionRefs[index].current;
    if (section) {
      const topOffset = 100;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const scrollToPosition = sectionTop - topOffset;

      window.scrollTo({
        top: scrollToPosition,
        behavior: "smooth",
      });
    }
  };

  const scroll = (direction) => {
    const slider = sliderRef.current;
    const scrollAmount = direction === "left" ? -200 : 200;
    slider.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isFixed && <div style={{ height: "56px" }}></div>}

      <div
        ref={tabContainerRef}
        className={`${className}`}
        style={{
          position: isFixed ? "fixed" : "relative",
          top: isFixed ? "64px" : "auto",
          width: isFixed ? containerWidth : "100%",
          zIndex: 998,
          backgroundColor: "white",
          boxShadow: isFixed ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
        }}
      >
        <div
          className="tabsScroll bg-white border-[1.5px] solid border-black border-opacity-35 rounded-md overflow-x-auto scrollbar-hide"
          ref={sliderRef}
        >
          <ul className="flex border-b justify-between py-1 list-none m-0 p-0">
            {tabs.map((tab, index) => (
              <li
                key={index}
                className={`px-4 mb-0 py-2 border-r-[1.5px] border-l-[1.5px] border-opacity-65 flex-1 whitespace-nowrap min-w-32 cursor-pointer text-center text-xs font-medium transition-all duration-300
                                ${
                                  activeIndex === index
                                    ? "bg-[#b82025] text-white rounded-md border-none mx-1"
                                    : "hover:bg-gray-200 border-gray-400"
                                }`}
                onClick={() => handleTabClick(index)}
              >
                {tab}
              </li>
            ))}
          </ul>
        </div>

        {isOverflowing && (
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#F0FDF4] transition-transform active:scale-95 p-1 pb-2 px-3 shadow-md rounded-full z-20"
            onClick={() => scroll("left")}
            style={{ marginLeft: "-10px" }}
          >
            &#8592;
          </button>
        )}

        {isOverflowing && (
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#ffaf80] transition-transform active:scale-95 p-1 pb-2 px-3 shadow-md rounded-full z-20"
            onClick={() => scroll("right")}
            style={{ marginRight: "-10px" }}
          >
            &#8594;
          </button>
        )}
      </div>
    </>
  );
};

export default TabSlider;
