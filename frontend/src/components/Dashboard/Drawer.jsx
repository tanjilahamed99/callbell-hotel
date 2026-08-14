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

  // const navLinks = [
  //   { href: "/dashboard", label: "Dashboard", icon: Home },
  //   { href: "/", label: "Home", icon: Home },
  //   { href: "/dashboard/profile", label: "Profile", icon: User },
  //   {
  //     href: "/dashboard/subscriptions",
  //     label: "Subscriptions",
  //     icon: CreditCard,
  //   },
  //   { href: "/dashboard/transactions", label: "Transactions", icon: History },
  //   { href: "/dashboard/settings", label: "Settings", icon: Settings },
  //   // { href: "/dashboard/calls", label: "Call History", icon: PhoneCall },
  //   // { href: "/dashboard/security", label: "Security", icon: Shield },
  // ];

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
              className="btn drawer-button bg-gradient-to-r from-red-600 to-red-700 text-white border-none hover:from-red-700 hover:to-red-800 shadow-md">
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
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center">
                      <PhoneCall className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Call<span className="text-white">Bell</span>
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
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-white to-white/80 flex items-center justify-center text-red-600 font-bold">
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
                              ? "bg-gradient-to-r from-red-50 to-white text-red-600 border border-red-200 shadow-sm"
                              : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                          }`}>
                          <link.icon
                            className={`w-5 h-5 mr-3 ${
                              isActive
                                ? "text-red-600"
                                : "text-gray-500 group-hover:text-red-600"
                            }`}
                          />
                          <span className="font-medium">{link.label}</span>
                          {isActive && (
                            <div className="absolute right-4 w-2 h-2 rounded-full bg-red-600"></div>
                          )}
                        </Link>
                      </div>
                    );
                  })}
                </nav>

                {/* Quick Stats */}
                {/* <div className="mt-8 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Calls Today</p>
                      <p className="text-xl font-bold text-gray-900">12</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Plan</p>
                      <p className="text-lg font-bold text-green-600">Premium</p>
                    </div>
                  </div>
                </div> */}
              </div>

              {/* Bottom Section */}
              <div className="border-t border-gray-200 p-4">
                <div className="space-y-2">
                  {/* <button className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 shadow-md transition-all duration-200">
                    <Bell className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Notifications</span>
                    <span className="ml-auto bg-white text-red-600 text-xs px-2 py-0.5 rounded-full">3</span>
                  </button> */}

                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center w-full px-4 py-3 bg-white border border-red-200 text-red-600 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-200">
                    <LogOut className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logo and Notifications */}
      <div className="flex-none">
        <div className="flex items-center space-x-4">
          {/* <div className="relative">
            <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-red-600 transition-colors" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </div> */}
          <div className="text-right">
            <h2 className="font-bold text-gray-900 text-lg">
              Call<span className="text-red-600">Bell</span>
            </h2>
            <p className="text-xs text-gray-500">Dashboard</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
