import React, { useState } from "react";
import downArrow from '../assets/Images/downArrow.png';

const MobileNavbar = ({ categories }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeItem, setActiveItem] = useState(null);

  const toggleCategory = (label) => {
    setActiveCategory((prev) => (prev === label ? null : label));
    setActiveItem(null); // Reset the active item when toggling categories
  };

  const toggleItem = (id) => {
    setActiveItem((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full bg-gray-100 h-[450px] overflow-y-auto scrollbar-thumb-transparent">
      <ul className="space-y-2">
        {categories.map((category, index) => (
          <li key={index}>
            <div
              className={`flex justify-between items-center p-3 transition-all rounded cursor-pointer ${
                activeCategory === category.label? "bg-red-500 text-white": "bg-gray-200"
                 
              }`}
              onClick={() => toggleCategory(category.label)}
            >
              <span>{category.label}</span>
              <span
                className={`transform transition-transform ${
                  activeCategory === category.label ? "rotate-180" : "rotate-0"
                }`}
              >
                <img
                  className="h-3 transition-all"
                  src={downArrow}
                  alt=""
                />
              </span>
            </div>
            {activeCategory === category.label && (
              <ul className="mt-2 space-y-1">
                {category.sidebarItems.map((item) => (
                  <li key={item.id}>
                    <div
                      className={`flex justify-between items-center p-2 bg-gray-50 rounded cursor-pointer ${
                        activeItem === item.id ? "bg-gray-300" : ""
                      }`}
                      onClick={() => toggleItem(item.id)}
                    >
                      <span>{item.name}</span>
                      <span
                        className={`transform transition-transform ${
                          activeItem === item.id ? "rotate-180" : "rotate-0"
                        }`}
                      >
                        <img
                          className="h-3 transition-all"
                          src={downArrow}
                          alt=""
                        />
                      </span>
                    </div>
                    {activeItem === item.id && (
                      <div className="ml-4 mt-2 max-h-40 overflow-y-auto">
                        {category.contents[item.id]?.map((subArray, i) => (
                          <div key={i} className="mb-2">
                            {subArray.map((content, j) => (
                              <a
                                key={j}
                                href={content.link}
                                className="block text-sm text-blue-500 hover:underline"
                              >
                                {content.name}
                              </a>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MobileNavbar;
