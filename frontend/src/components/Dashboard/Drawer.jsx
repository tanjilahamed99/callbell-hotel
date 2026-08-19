import {
  Menu,
  X,
  Home,
  User,
  CreditCard,
  History,
  Settings,
  PhoneCall,
  Shield,
  LogOut,
  Bell,
} from "lucide-react";
import { useRef } from "react";
import { useCall } from "../../Provider/Provider";
import { Link, useLocation } from "react-router-dom";

const Drawer = ({ links: navLinks }) => {
  const { pathname } = useLocation();
  const drawerRef = useRef(null);
  const { logout, user } = useCall();

  const closeDrawer = () => {
    if (drawerRef.current) {
      drawerRef.current.checked = false;
    }
  };

  const handleLogout = () => {
    closeDrawer();
    logout();
  };

  return (
    <div className="navbar bg-white border-b border-gray-200 shadow-sm px-4">
      <div className="flex-1">
        <div className="drawer">
          <input
            id="my-drawer"
            type="checkbox"
            className="drawer-toggle"
            ref={drawerRef}
          />

          <div className="drawer-content">
            {/* Drawer button */}
            <label
              htmlFor="my-drawer"
              className="btn drawer-button bg-gradient-to-r from-blue-600 to-teal-500 text-white border-none hover:from-blue-700 hover:to-teal-600 shadow-md">
              <Menu className="w-5 h-5" />
            </label>
          </div>

          <div className="drawer-side z-50">
            <label
              htmlFor="my-drawer"
              className="drawer-overlay bg-black/50 backdrop-blur-sm"
              onClick={closeDrawer}></label>

            <div className="menu bg-white min-h-full w-80 max-w-full p-0">
              {/* Drawer Header */}
              <div className="bg-gradient-to-r from-blue-600 via-blue-600 to-teal-500 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center">
                      <PhoneCall className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        <span className="text-teal-100">Tarainn</span> Hotel
                      </h2>
                      <p className="text-white/80 text-sm">Dashboard</p>
                    </div>
                  </div>
                  <label
                    htmlFor="my-drawer"
                    className="btn btn-circle btn-ghost btn-sm text-white hover:bg-white/20">
                    <X className="w-5 h-5" />
                  </label>
                </div>

                {/* User Info */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-white to-white/80 flex items-center justify-center text-blue-600 font-bold">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">
                        {user?.name || "User"}
                      </p>
                      <p className="text-white/80 text-sm truncate">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto py-6 px-4">
                <nav className="space-y-1">
                  {navLinks.map((link) => {
                    const isActive =
                      pathname === link.href ||
                      pathname.startsWith(link.href + "/");
                    return (
                      <div key={link.href} className="relative">
                        <Link
                          to={link.href}
                          onClick={closeDrawer}
                          className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                            isActive
                              ? "bg-gradient-to-r from-blue-50 to-teal-50 text-blue-600 border border-blue-200 shadow-sm"
                              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          }`}>
                          <link.icon
                            className={`w-5 h-5 mr-3 ${
                              isActive
                                ? "text-teal-600"
                                : "text-gray-500 group-hover:text-teal-600"
                            }`}
                          />
                          <span className="font-medium">{link.label}</span>
                          {isActive && (
                            <div className="absolute right-4 w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-teal-500"></div>
                          )}
                        </Link>
                      </div>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom Section */}
              <div className="border-t border-gray-200 p-4">
                <div className="space-y-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center w-full px-4 py-3 bg-white border border-blue-200 text-blue-600 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200">
                    <LogOut className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logo */}
      <div className="flex-none">
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <h2 className="font-bold text-gray-900 text-lg">
              <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                Tarainn Hotel
              </span>
            </h2>
            <p className="text-xs text-gray-500">Dashboard</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
