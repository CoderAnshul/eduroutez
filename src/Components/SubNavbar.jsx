import React, { useState } from 'react';
import downArrow from '../assets/Images/downArrow.png'



const SubNavbar = ({categories}) => {
  const [activeContent, setActiveContent] = useState({});
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [dropdownAlignment, setDropdownAlignment] = useState('left-0'); // Alignment state

  const handleMouseEnter = (category, event) => {
    const boundingBox = event.target.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const categoryWidth = boundingBox.width;

    // Calculate alignment based on the element's position
    if (category.label === 'MEDIA') {
      setDropdownAlignment('transform translate-x-[-50%]');
    } else if (boundingBox.left <= categoryWidth) {
      setDropdownAlignment('left-0');
    } else if (viewportWidth - boundingBox.right <= categoryWidth) {
      setDropdownAlignment('right-0');
    } else {
      setDropdownAlignment('left-0');
    }

    setHoveredCategory(category.label);

    // Set the first sidebar item as active by default
    const firstItemId = category.sidebarItems[0]?.id || null;
    setActiveContent((prev) => ({
      ...prev,
      [category.label]: firstItemId,
    }));
  };

  const handleMouseLeave = () => {
    setHoveredCategory(null);
    setDropdownAlignment('');
  };

  return (
    <div>
      <div className=" w-full h-auto bg-white">
        <div className="w-full px-5 py-2 h-full mx-auto flex justify-between">
          <div className="w-3/5 h-full flex flex-col justify-between">
            <div className="h-1/2 w-fit px-1 flex relative items-center justify-start gap-7">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="group"
                  onMouseEnter={(e) => handleMouseEnter(category, e)}
                  onMouseLeave={handleMouseLeave}
                >
                  <h5 className="text-xs gap-2 font-[500] group-hover:text-red-500 group-hover:scale-95 transform transition-all text-[#00000096] flex items-center cursor-pointer">
                    {category.label}
                    <img
                      className="h-3 group-hover:rotate-180 transition-all"
                      src={downArrow}
                      alt="downArrow"
                    />
                  </h5>
                  {hoveredCategory === category.label && (
                    <div
                      className={`absolute top-full z-50 w-full bg-red-100 flex ${dropdownAlignment}`}
                    >
                      <div className="w-64 bg-white overflow-y-auto">
                        <ul>
                          {category.sidebarItems.map((item) => (
                            <li
                              key={item.id}
                              className={`px-2 py-2 group text-sm flex justify-between items-center cursor-pointer transition-all hover:bg-red-200 ${
                                activeContent[category.label] === item.id
                                  ? 'bg-red-200 border-l-2 border-red-500'
                                  : ''
                              }`}
                              onMouseEnter={() =>
                                setActiveContent((prev) => ({
                                  ...prev,
                                  [category.label]: item.id,
                                }))
                              }
                            >
                              {item.name}
                              <span className="text-xs">
                                <img
                                  className={`h-3 transform transition-transform duration-300 ${
                                    activeContent[category.label] === item.id
                                      ? '-rotate-0'
                                      : '-rotate-90'
                                  }`}
                                  src={downArrow}
                                  alt=""
                                />
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {activeContent[category.label] && (
                        <div className="w-fit p-3 flex flex-wrap gap-4" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(200px, 1fr))` }}>
                        {category.contents[activeContent[category.label]]?.map(
                          (subArray, columnIndex) => (
                            <div key={columnIndex} className="flex flex-col gap-1">
                              {subArray.map((item, itemIndex) => (
                                <a
                                  key={itemIndex}
                                  href={item.link}
                                  className="block text-xs text-black hover:underline"
                                >
                                  {item.name}
                                </a>
                              ))}
                            </div>
                          )
                        )}
                      </div>
                      
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

      
      export default SubNavbar;
      