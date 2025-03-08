import React from 'react';
import Sidebar from '../Components/DashboardComponent/Sidebar';
import { Outlet } from 'react-router-dom';
import DashboardNav from '../Components/DashboardComponent/DashboardNav';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen min-h-fit">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Section */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Navbar */}
        <DashboardNav />

        {/* Main Content */}
        <main className="p-3 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
