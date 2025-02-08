import React, { useState } from "react";

const Filter = ({ filterSections, handleFilterChange }) => {
  const [searchTerms, setSearchTerms] = useState({});
  const [openSections, setOpenSections] = useState(
    filterSections.map(() => true)
  );

  const toggleSection = (index) => {
    setOpenSections((prev) =>
      prev.map((isOpen, i) => (i === index ? !isOpen : isOpen))
    );
  };

  return (
    <div className="space-y-2">
      {filterSections.map((section, index) => {
        const filteredItems = section.items;

        return (
          <div key={index} className="w-full border rounded-lg">
            <button
              onClick={() => toggleSection(index)}
              className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 text-sm font-medium text-gray-700 border-none outline-none focus:outline-none"
            >
              <span>{section.title}</span>
              <svg
                className={`h-5 w-5 transform transition-transform ${
                  openSections[index] ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>

            <div
              className={`overflow-y-scroll transition-all duration-300 ${
                openSections[index] ? "max-h-80" : "max-h-0"
              }`}
            >
              <div className="p-4 space-y-3">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, idx) => (
                    <label
                      key={idx}
                      className="flex items-center text-sm text-gray-600 cursor-pointer hover:text-red-500 hover:ml-1 transition-all"
                    >
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          handleFilterChange(section.title, item);
                        }}
                        className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
                      />
                      <span className="ml-2">{item}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No items found</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Filter;
