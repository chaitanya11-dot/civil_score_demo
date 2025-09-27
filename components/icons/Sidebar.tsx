
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { User, Award, Shield, Flag, Activity, Scale, Settings, HelpCircle, LogOut, Briefcase, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ConfirmationModal from '../ConfirmationModal';
import PoliceBadge from '../icons/PoliceBadge';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navItems = [
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'My Civil Score', href: '/', icon: Shield },
  { name: 'Red Flags', href: '/flags', icon: Flag },
  { name: 'Records', href: '/activities', icon: Activity },
  { name: 'Social Activities', href: '/activities', icon: Award },
  { name: 'Law & Governance', href: '/law-governance', icon: Scale },
  { name: 'Admin Dashboard', href: '/admin', icon: Briefcase },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
    const { user, logout } = useAuth();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    
    const handleConfirmLogout = () => {
        logout();
    }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-20 transition-opacity duration-300 ease-in-out lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      <div
        className={`fixed top-0 left-0 h-full bg-white w-64 border-r border-gray-200 z-30 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col w-full h-full">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <img className="h-10 w-10 rounded-full object-cover" src={user?.imageUrl || "https://picsum.photos/100"} alt="User Avatar" />
              <div className="ml-3">
                <p className="text-sm font-semibold text-gray-800">{user?.name || 'Citizen User'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'citizen@example.com'}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === '/'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors group ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
                    {item.name}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Police Portal Link - Conditionally Rendered */}
          {user?.type === 'police' && (
            <div className="px-2 py-2 border-t border-gray-200">
               <NavLink
                to="/police"
                end
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors group ${
                    isActive
                      ? 'bg-blue-100 text-blue-800 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <PoliceBadge className={`h-5 w-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-600'}`} />
                    Police Dashboard
                  </>
                )}
              </NavLink>
            </div>
          )}

          <div className="px-2 py-4 border-t border-gray-200">
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 group">
                <Settings className="h-5 w-5 mr-3 text-gray-400 group-hover:text-gray-500" /> Settings
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 group">
                <HelpCircle className="h-5 w-5 mr-3 text-gray-400 group-hover:text-gray-500" /> Help
            </a>
            <button onClick={() => setIsLogoutModalOpen(true)} className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 group">
                <LogOut className="h-5 w-5 mr-3 text-gray-400 group-hover:text-gray-500" /> Logout
            </button>
          </div>
        </div>
      </div>
       <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
      >
        Are you sure you want to log out? This action will end your current session.
      </ConfirmationModal>
    </>
  );
};

export default Sidebar;