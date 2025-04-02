import { Link, useLocation } from "wouter";

interface SidebarProps {
  currentUser: {
    name: string;
    role: string;
    avatar: string;
  };
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar = ({ currentUser, isOpen, onToggle }: SidebarProps) => {
  const [location] = useLocation();
  
  const navItems = [
    { label: "Dashboard", icon: "ri-dashboard-line", path: "/" },
    { label: "Point of Sale", icon: "ri-shopping-cart-line", path: "/pos" },
    { label: "Inventory", icon: "ri-store-2-line", path: "/inventory" },
    { label: "Staff", icon: "ri-user-line", path: "/staff" },
    { label: "Customers", icon: "ri-group-line", path: "/customers" },
    { label: "Events", icon: "ri-calendar-event-line", path: "/events" },
    { label: "Finances", icon: "ri-money-dollar-circle-line", path: "/finances" },
    { label: "Settings", icon: "ri-settings-4-line", path: "/settings" },
    { label: "Help", icon: "ri-question-line", path: "/help" }
  ];
  
  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };
  
  // Create a NavItem component to keep code DRY
  const NavItem = ({ item }: { item: typeof navItems[0] }) => (
    <li key={item.path}>
      <Link 
        href={item.path}
        className={`w-full flex items-center px-4 py-2.5 rounded-lg transition-all ${
          isActive(item.path)
            ? 'bg-gradient-to-r from-purple-700 to-purple-900 text-white shadow-lg shadow-purple-700/20'
            : 'text-gray-300 hover:bg-zinc-800/50 hover:text-white'
        }`}
        onClick={() => window.innerWidth < 1024 && onToggle()}
      >
        <i className={`${item.icon} mr-3 text-lg ${isActive(item.path) ? 'text-purple-300' : 'text-gray-400'}`}></i>
        <span className="font-medium text-sm">{item.label}</span>
      </Link>
    </li>
  );
  
  return (
    <aside 
      className={`bg-black/95 text-white h-full w-64 fixed z-30 transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col shadow-xl shadow-purple-900/20 border-r border-zinc-800 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-gradient-to-r from-purple-900/70 to-black">
        <div className="flex items-center">
          <div className="mr-3 bg-purple-600 rounded-md p-1.5 shadow-lg shadow-purple-500/20">
            <i className="ri-nightclub-line text-lg"></i>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">NightlifePro</h1>
        </div>
        <button onClick={onToggle} className="lg:hidden text-gray-300 hover:text-white">
          <i className="ri-close-line text-xl"></i>
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-6">
        <div className="px-5 mb-6">
          <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-3 ml-1">Main</p>
          <ul className="space-y-1.5">
            {navItems.slice(0, 3).map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </ul>
        </div>

        <div className="px-5 mb-6">
          <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-3 ml-1">Management</p>
          <ul className="space-y-1.5">
            {navItems.slice(3, 7).map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </ul>
        </div>

        <div className="px-5 mb-6">
          <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-3 ml-1">System</p>
          <ul className="space-y-1.5">
            {navItems.slice(7).map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </ul>
        </div>
      </nav>
      
      <div className="p-5 border-t border-zinc-800 bg-gradient-to-r from-black to-purple-900/20">
        <div className="flex items-center">
          <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mr-3 flex items-center justify-center text-white font-semibold shadow-lg shadow-purple-700/20">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{currentUser.name}</p>
            <p className="text-xs text-gray-400">{currentUser.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
