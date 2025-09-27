import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, ArrowLeft, ArrowRight, Menu } from 'lucide-react';
import ShieldCheck from '../icons/ShieldCheck';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm z-10 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center">
              <button
                  onClick={() => navigate(-1)}
                  className="ml-4 p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                  aria-label="Go back"
              >
                  <ArrowLeft size={20} />
              </button>
              <button
                  onClick={() => navigate(1)}
                  className="ml-1 p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                  aria-label="Go forward"
              >
                  <ArrowRight size={20} />
              </button>
            </div>
            <div className="flex items-center ml-4">
              <ShieldCheck className="h-7 w-7 text-primary-600" />
              <span className="ml-2 text-xl font-semibold text-gray-800">Civil Score</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800">
              <Search size={20} />
            </button>
            <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;