import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Filter = ({ filterSections, handleFilterChange }) => {
  const [openSections, setOpenSections] = useState(
    filterSections.map(() => true)
  );

  const navigate = useNavigate();
  const location = useLocation();

  // Get current streams from URL
  const getStreamsFromURL = () => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get("stream")?.split(",") || [];
  };

  const [selectedStreams, setSelectedStreams] = useState(getStreamsFromURL);

  // Update URL when selectedStreams changes
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (selectedStreams.length > 0) {
      queryParams.set("stream", selectedStreams.join(","));
    } else {
      queryParams.delete("stream");
    }
    navigate(`?${queryParams.toString()}`, { replace: true });
  }, [selectedStreams, navigate, location.search]);

  const toggleSection = (index) => {
    setOpenSections((prev) =>
      prev.map((isOpen, i) => (i === index ? !isOpen : isOpen))
    );
  };

  const handleCheckboxChange = (sectionTitle, item) => {
    const isSelected = selectedStreams.includes(item);
    let updatedStreams;

    if (isSelected) {
      updatedStreams = selectedStreams.filter((stream) => stream !== item);
    } else {
      updatedStreams = [...selectedStreams, item];
    }

    setSelectedStreams(updatedStreams);
    handleFilterChange(sectionTitle, item);
  };

  return (
    <div className="space-y-2">
      {filterSections.map((section, index) => (
        <div key={index} className="w-full border rounded-lg">
          <button
            onClick={() => toggleSection(index)}
            className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 text-sm font-medium text-gray-700"
          >
            <span>{section.title}</span>
            <svg
              className={`h-5 w-5 transform transition-transform ${
                openSections[index] ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
              {section.items.length > 0 ? (
                section.items.map((item, idx) => (
                  <label
                    key={idx}
                    className="flex items-center text-sm text-gray-600 cursor-pointer hover:text-red-500 hover:ml-1 transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStreams.includes(item)}
                      onChange={() => handleCheckboxChange(section.title, item)}
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
      ))}
    </div>
  );
};

export default Filter;