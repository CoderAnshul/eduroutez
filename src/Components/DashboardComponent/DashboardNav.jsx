import React from "react";

const DashboardNav = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <div className="flex items-center gap-4">
        <div className="border px-4 py-2 rounded-md flex items-center gap-2">
          <h3>Anshul Sharma</h3>
          <div className="h-7 w-7 bg-gray-500 rounded-full"></div>
        </div>
      </div>
    </header>
  );
};

export default DashboardNav;
