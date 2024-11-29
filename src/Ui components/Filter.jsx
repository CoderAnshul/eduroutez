import React, { useState } from 'react';

const Filter = ({ filterSections }) => {
  const [searchTerms, setSearchTerms] = useState({});
  const [openSections, setOpenSections] = useState(
    filterSections.map(() => true) // Initialize all sections as open
  );

  const handleSearchChange = (sectionTitle, value) => {
    setSearchTerms((prev) => ({
      ...prev,
      [sectionTitle]: value,
    }));
  };

  const toggleSection = (index) => {
    setOpenSections((prev) =>
      prev.map((isOpen, i) => (i === index ? !isOpen : isOpen))
    );
  };

  return (
    <div className="space-y-2">
      {filterSections.map((section, index) => {
        const filteredItems = section.items.filter((item) =>
          item.toLowerCase().includes(
            (searchTerms[section.title] || "").toLowerCase()
          )
        );

        return (
          <div key={index} className="w-full border rounded-lg">
            {/* Accordion Header */}
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

            {/* Accordion Content */}
            <div
              className={`overflow-y-scroll scrollbar-thumb-red transition-all duration-300 ${
                openSections[index] ? "max-h-80" : "max-h-0"
              }`}
            >
              <div className="p-4 space-y-3">
                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder={`Search ${section.title}`}
                    value={searchTerms[section.title] || ""}
                    onChange={(e) =>
                      handleSearchChange(section.title, e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Checkboxes */}
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, idx) => (
                    <label
                      key={idx}
                      className="flex items-center text-sm text-gray-600 cursor-pointer hover:text-red-500 hover:ml-1 transition-all"
                    >
                      <input
                        type="checkbox"
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

