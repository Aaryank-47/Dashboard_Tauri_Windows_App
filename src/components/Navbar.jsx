// src/components/Navbar.jsx
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  BellIcon,
  ChevronDownIcon,
  UserIcon,
  PowerIcon,
  Cog6ToothIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const RealTimeClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center space-x-2">
      <div className="text-center">
        <div className="text-sm font-medium text-gray-900">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="text-xs text-gray-500">
          {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 bg- backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center"> {/* Increased height to h-20 */}
          
          {/* Logo/Brand - Enhanced Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-md group-hover:shadow-lg transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                  <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.176 7.547 7.547 0 01-1.705-1.715.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.546 3.75 3.75 0 013.255 3.718z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex flex-col">
                
                <span className="text-xl font-bold text-black hidden sm:inline">Dashboard</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <RealTimeClock />

            {user ? (
              <div className="flex items-center space-x-4">
                {/* Notifications with badge */}
                <Link
                  to="/notifications"
                  className="relative p-1 rounded-full hover:bg-gray-100/50 transition-colors"
                >
                  <span className="sr-only">Notifications</span>
                  <div className="relative">
                    <BellIcon className="h-6 w-6 text-gray-600" />
                    <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
                  </div>
                </Link>

                {/* Dashboard quick link */}
                <Link
                  to="/dashboard"
                  className="p-1 rounded-full hover:bg-gray-100/50 transition-colors"
                  title="Dashboard"
                >
                  <ChartBarIcon className="h-6 w-6 text-gray-600" />
                </Link>

                {/* Profile dropdown - Enhanced Section */}
                <div className="relative " ref={profileRef}>
                  <Link
                     to="/profile"
                          onClick={() => setIsProfileOpen(false)}
                    className="flex items-center space-x-2 focus:outline-none group bg-white "
                  >
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-black to-blue-500 flex items-center justify-center text-white font-medium shadow-sm group-hover:ring-2 group-hover:ring-blue-200 transition-all duration-200">
                      {user.name?.charAt(0)?.toUpperCase() || "A"}
                    </div>
                    <ChevronDownIcon className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </Link>

                
                </div>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100/50 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2.5 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <RealTimeClock />

            {user ? (
              <div className="flex items-center" ref={profileRef}>
                <button
                  onClick={toggleProfileMenu}
                  className="p-1 rounded-full hover:bg-gray-100/50 transition-colors flex items-center"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white font-medium shadow-sm">
                    {user.name?.charAt(0)?.toUpperCase() || "A"}
                  </div>
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-4 top-20 w-56 rounded-xl shadow-lg bg-white/95 backdrop-blur-sm ring-1 ring-black/5 overflow-hidden z-50">
                    <div className="py-1">
                      <div className="px-4 py-3 border-b border-gray-100/50">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/50 transition-colors"
                      >
                        <UserIcon className="h-5 w-5 mr-2 text-gray-400" />
                        Your Profile
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/50 transition-colors"
                      >
                        <Cog6ToothIcon className="h-5 w-5 mr-2 text-gray-400" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/50 transition-colors border-t border-gray-100/50"
                      >
                        <PowerIcon className="h-5 w-5 mr-2 text-gray-400" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-2 text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;