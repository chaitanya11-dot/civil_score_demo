
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PoliceBadge from '../icons/PoliceBadge';
import { LogOut, ArrowLeft, ArrowRight } from 'lucide-react';

const PoliceHeader: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/police/login');
  };

  return (
    <header className="bg-gray-800 text-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={() => navigate(1)}
              className="ml-1 p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-label="Go forward"
            >
              <ArrowRight size={20} />
            </button>
            <div className="flex items-center ml-4">
              <PoliceBadge className="h-8 w-8 text-blue-400" />
              <span className="ml-3 text-xl font-semibold">Police Dashboard</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            aria-label="Logout"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};


const PoliceLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <PoliceHeader />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default PoliceLayout;
