import { useState } from "react";
import { useLocation } from "wouter";

interface HeaderProps {
  currentUser: {
    name: string;
    role: string;
    avatar: string;
  };
  onToggleSidebar: () => void;
}

const Header = ({ currentUser, onToggleSidebar }: HeaderProps) => {
  const [location] = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const getPageTitle = () => {
    switch (true) {
      case location === "/":
        return "Dashboard";
      case location === "/pos":
        return "Point of Sale";
      case location === "/inventory":
        return "Inventory Management";
      case location === "/staff":
        return "Staff Management";
      case location === "/customers":
        return "Customer Management";
      case location === "/events":
        return "Event Management";
      case location === "/finances":
        return "Financial Reports";
      case location === "/settings":
        return "System Settings";
      default:
        return "Dashboard";
    }
  };
  
  return (
    <header className="bg-black/40 backdrop-blur-sm border-b border-zinc-800 z-10">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={onToggleSidebar} className="text-gray-300 hover:text-white lg:hidden">
            <i className="ri-menu-line text-xl"></i>
          </button>
          <div className="ml-4 lg:ml-0">
            <h1 className="text-xl font-semibold text-white">{getPageTitle()}</h1>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-900/10 rounded-full transition-colors">
            <i className="ri-notification-3-line text-lg"></i>
          </button>
          <button className="p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-900/10 rounded-full transition-colors">
            <i className="ri-question-line text-lg"></i>
          </button>
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-1.5 px-2 py-1.5 rounded-full hover:bg-zinc-800/50 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                {currentUser.name.charAt(0)}
              </div>
              <i className="ri-arrow-down-s-line text-gray-400"></i>
            </button>
            {userMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-10 overflow-hidden"
                onClick={() => setUserMenuOpen(false)}
              >
                <div className="py-2">
                  <div className="px-4 py-3 border-b border-zinc-800">
                    <p className="text-sm font-medium text-white">{currentUser.name}</p>
                    <p className="text-xs text-gray-400">{currentUser.role}</p>
                  </div>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-purple-900/20 hover:text-white transition-colors"
                  >
                    <i className="ri-user-line mr-2"></i> Your Profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-purple-900/20 hover:text-white transition-colors"
                  >
                    <i className="ri-settings-line mr-2"></i> Settings
                  </a>
                  <div className="border-t border-zinc-800 my-1"></div>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-red-900/20 hover:text-red-400 transition-colors"
                  >
                    <i className="ri-logout-box-line mr-2"></i> Sign out
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
