import React, { useRef, useState, useEffect } from "react";

const TabSlider = ({ tabs, sectionRefs, className }) => {
    const sliderRef = useRef();
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0); // Track the active tab

    // Function to check if the content is overflowing
    const checkOverflow = () => {
        const slider = sliderRef.current;
        if (slider) {
            setIsOverflowing(slider.scrollWidth > slider.clientWidth); // Set overflow state based on scrollWidth
        }
    };

    useEffect(() => {
        checkOverflow(); // Check if content overflows on mount
        window.addEventListener("resize", checkOverflow); // Recheck on window resize

        return () => {
            window.removeEventListener("resize", checkOverflow); // Cleanup event listener
        };
    }, []);

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
    

    // Function to handle scrolling (left or right)
    const scroll = (direction) => {
        const slider = sliderRef.current;
        const scrollAmount = direction === "left" ? -200 : 200; // Adjust scroll amount as needed
        slider.scrollBy({
            left: scrollAmount,
            behavior: "smooth",
        });
    };

    return (
        <div className={`sticky top-16 bg-white z-[998] shadow-md w-full ${className}`}>
            <div
                className="sticky tabsScroll top-0 bg-white z-10 border-[1.5px] solid border-black border-opacity-35 rounded-md overflow-x-auto scrollbar-hide"
                ref={sliderRef}
            >
                <ul className="flex border-b justify-between py-1">
                    {tabs.map((tab, index) => (
                        <li
                            key={index}
                            className={`px-4 py-2 border-r-[1.5px] border-l-[1.5px] border-opacity-65 flex-1 whitespace-nowrap min-w-32 cursor-pointer text-center text-xs font-medium transition-all duration-300
                            ${activeIndex === index ? "bg-red-500 text-white rounded-md border-none mx-1" : "hover:bg-gray-200 border-gray-400"}`}
                            onClick={() => handleTabClick(index)}
                        >
                            {tab}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Left Arrow - Visible only when content is overflowing */}
            {isOverflowing && (
                <button
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#F0FDF4] transition-transform active:scale-95 p-1 pb-2 px-3 shadow-md rounded-full z-20"
                    onClick={() => scroll("left")}
                    style={{ marginLeft: "-10px" }}
                >
                    &#8592; {/* Left arrow symbol */}
                </button>
            )}

            {/* Right Arrow - Visible only when content is overflowing */}
            {isOverflowing && (
                <button
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#ffaf80] transition-transform active:scale-95 p-1 pb-2 px-3 shadow-md rounded-full z-20"
                    onClick={() => scroll("right")}
                    style={{ marginRight: "-10px" }}
                >
                    &#8594; {/* Right arrow symbol */}
                </button>
            )}
        </div>
    );
};

export default TabSlider;
