import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { BookOpen, Home, Search } from 'lucide-react';

const PageNotFound = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-4">
      <div className="space-y-8 max-w-2xl">
        <h1 className="text-8xl font-bold text-[#B82025]">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800">Oops! Looks like you're skipping class</h2>
        <p className="text-xl text-gray-600">
          The page you're looking for seems to have dropped out. Don't worry, even the best students get lost sometimes!
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-lg">
          <Link
            to="/"
            className="flex items-center gap-2 bg-[#B82025] text-white px-6 py-3 rounded-md hover:bg-[#9A1B1F] transition-colors"
          >
            <Home className="w-5 h-5" />
            Back to Campus (Home)
          </Link>
          <Link
            to="/search"
            className="flex items-center gap-2 border-2 border-[#B82025] text-[#B82025] px-6 py-3 rounded-md hover:bg-[#B82025] hover:text-white transition-colors"
          >
            <Search className="w-5 h-5" />
            Search Courses
          </Link>
        </div>
        <div className="pt-12">
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <BookOpen className="w-5 h-5 text-[#B82025]" />
            Keep studying, you'll find your way!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
