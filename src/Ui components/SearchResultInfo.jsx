import React, { useState } from 'react'

const SearchResultInfo = () => {
    const [activeTab, setActiveTab] = useState('Overview');

    const tabs = ['Overview', 'Admissions', 'Courses', 'Placements'];
  
    return (
      <div className="border-2 border-opacity-65 shadow-lg rounded-lg pt-3 border-gray-300 pb-1 w-full ">
        {/* Title */}
        <h1 className="text-xl font-semibold mb-2 px-5 p-3 border-b-2 ">Engineering Colleges In India</h1>
        
        {/* Tabs */}
        <div className="flex space-x-6 text-sm font-medium px-5 pt-3">
          {tabs.map((tab) => (
            <div
              key={tab}
              className={`cursor-pointer ${
                activeTab === tab ? 'text-black' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              <span>{tab}</span>
              {activeTab === tab && (
                <div className="h-[2px] bg-black mt-1"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
}

export default SearchResultInfo