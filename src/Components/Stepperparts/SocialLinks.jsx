import React, { useState, useEffect } from 'react';

const SocialLinks = ({ setFormData, setIsSubmit }) => {
  const [links, setLinks] = useState([""]); // Initialize with one empty input field

  // Update the parent form data whenever links change
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: links,
    }));
  }, [links, setFormData]);

  // Handle input value change
  const handleInputChange = (index, value) => {
    const updatedLinks = [...links];
    updatedLinks[index] = value;
    setLinks(updatedLinks);
  };

  // Add a new input field
  const handleAddInput = () => {
    setLinks([...links, ""]); // Add a new empty input
  };

  // Remove an input field
  const handleRemoveInput = (index) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    setLinks(updatedLinks);
  };

  return (
    <div className="flex flex-col items-center h-full">
      <div className="w-full flex flex-col items-center max-w-4xl p-6 bg-white rounded-lg h-[480px] overflow-y-scroll scrollbar-thumb-red">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800 text-center">Social Links</h1>

        {/* Subtitle */}
        <p className="mt-1 text-sm text-gray-500 text-center">
          Check twice before you paste your social handle's link
        </p>

        {/* Dynamic Input Fields */}
        <div className="mt-6 space-y-4">
          {links.map((link, index) => (
            <div key={index} className="flex items-center space-x-4">
              <input
                type="text"
                placeholder={`Paste your social profile link`}
                value={link}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {links.length > 1 && (
                <button
                  onClick={() => handleRemoveInput(index)}
                  className="px-[10px] py-1 text-sm text-white bg-red-500 rounded-full hover:bg-red-600"
                >
                  X
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Button */}
        <button
          onClick={handleAddInput}
          className="mt-4 px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          + Add More
        </button>
      </div>
    </div>
  );
};

export default SocialLinks;
