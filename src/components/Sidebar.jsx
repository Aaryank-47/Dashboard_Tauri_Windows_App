import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  HomeIcon,
  FastFoodIcon,
  ReceiptIcon,
  AnalyticsIcon,
  FeedbackIcon,
  SettingsIcon,
  UserIcon,
  LogoutIcon
} from "./Icons.jsx";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: "/", icon: <HomeIcon />, label: "Dashboard" },
    { path: "/food", icon: <FastFoodIcon />, label: "Menu" },
    { path: "/order", icon: <ReceiptIcon />, label: "Orders" },
    { path: "/analytics", icon: <AnalyticsIcon />, label: "Analytics" },
    { path: "/feedback", icon: <FeedbackIcon />, label: "Feedback" },
   // { path: "/settings", icon: <SettingsIcon />, label: "Settings" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden md:flex flex-col w-64 h-screen bg-white border-r border-gray-200"
      >
     {/* Logo Header */}
<div className="px-6 py-5 border-b border-gray-200">
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="flex items-center space-x-3 cursor-pointer"
    onClick={() => navigate("/")}
  >
    <motion.div 
      transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
      className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm"
    >
      <img 
        src="https://t3.ftcdn.net/jpg/02/41/30/72/360_F_241307210_MjjaJC3SJy2zJZ6B7bKGMRsKQbdwRSze.jpg" 
        alt="Canteen Logo"
        className="w-full h-full object-cover"
      />
    </motion.div>
    <h2 className="text-xl font-bold text-gray-900">
      CanteenPro
    </h2>
  </motion.div>
</div>

        {/* Navigation */}
        <div className="flex-1 px-3 py-4 overflow-y-auto">
          <nav className="space-y-1">
            <AnimatePresence>
              {menuItems.map((item) => (
                <motion.div
                  key={item.path}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive(item.path)
                        ? "bg-gray-100 text-black font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`p-2 rounded-md ${
                        isActive(item.path)
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="ml-3">{item.label}</span>
                    {isActive(item.path) && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto w-2 h-2 rounded-full bg-black"
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </nav>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 border border-gray-300">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.adminName || "Admin User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.adminEmail || "admin@example.com"}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-gray-100 transition-colors rounded-full"
              title="Sign Out"
            >
              <LogoutIcon className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Mobile Bottom Navigation */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 px-4 md:hidden z-50"
      >
        {menuItems.slice(0, 5).map((item) => (
          <motion.div
            key={item.path}
            whileTap={{ scale: 0.9 }}
            className="flex-1 flex justify-center"
          >
            <Link
              to={item.path}
              className={`flex flex-col items-center text-xs ${
                isActive(item.path) ? "text-black" : "text-gray-500"
              }`}
            >
              <motion.span
                animate={isActive(item.path) ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
                className={`p-2 rounded-full ${
                  isActive(item.path) ? "bg-gray-100" : ""
                }`}
              >
                {item.icon}
              </motion.span>
              <span className="mt-1">{item.label}</span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
};

export default Sidebar;