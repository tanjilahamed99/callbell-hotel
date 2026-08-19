import { Link, Outlet } from "react-router-dom";
import Drawer from "../../components/Dashboard/Drawer";
import PrivateRoute from "../../components/PrivateRoute/PrivateRoute";
import {
  Home,
  User,
  CreditCard,
  History,
  PhoneCall,
  Shield,
  LogOut,
  ChevronRight,
  Phone,
  Users,
} from "lucide-react";
import { useCall } from "../../Provider/Provider";

const DashboardLayout = () => {
  const { user, logout } = useCall();

  const handleLogout = () => {
    logout();
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/contacts", label: "Contacts", icon: Users },
    // { href: "/", label: "Home", icon: Home },
    // { href: "/dashboard/call-history", label: "Call History", icon: Phone },
    // {
    //   href: "/dashboard/subscriptions",
    //   label: "Subscriptions",
    //   icon: CreditCard,
    // },
    // { href: "/dashboard/transactions", label: "Transactions", icon: History },
  ];

  const supportLinks = [];

  return (
    <PrivateRoute>
      <div className="relative flex min-h-screen overflow-hidden bg-gray-50">
        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)",
              backgroundSize: "46px 46px",
            }}
          />
          <div className="absolute -top-10 left-1/4 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="absolute bottom-0 right-1/5 h-96 w-96 rounded-full bg-teal-200/40 blur-3xl" />
        </div>

        {/* Sidebar - Desktop */}
        <div className="relative z-10 hidden lg:flex lg:w-64 xl:w-72 flex-col border-r border-gray-200 bg-white shadow-sm">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-200">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center shadow-md">
                <PhoneCall className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">
                  Call<span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">Bell</span>
                </span>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                  Staff Dashboard
                </p>
              </div>
            </Link>
          </div>

          {/* User Profile Summary */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {user?.email || "user@example.com"}
                </p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                  <span className="text-xs text-gray-500">Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                Main Menu
              </p>
              <nav className="space-y-1">
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.href}
                    className="group flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">
                    <div className="flex items-center">
                      <link.icon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-teal-600" />
                      <span className="font-medium">{link.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-teal-500" />
                  </Link>
                ))}
              </nav>

              <div className="mt-8">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                  Support
                </p>
                <nav className="space-y-1">
                  {supportLinks.map((link, index) => (
                    <Link
                      key={index}
                      to={link.href}
                      className="group flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">
                      <div className="flex items-center">
                        <link.icon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-teal-600" />
                        <span className="font-medium">{link.label}</span>
                      </div>
                      {index === 0 && (
                        <span className="ml-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                          3
                        </span>
                      )}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-200 p-4">
            <div className="rounded-lg border border-gray-200 bg-blue-50/50 p-4 mb-4">
              <div className="flex items-center mb-2">
                <Shield className="w-5 h-5 text-teal-600 mr-2" />
                <span className="text-sm font-medium text-gray-900">
                  Security Status
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                Your account is protected with 2FA
              </p>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-blue-600 to-teal-500 h-1.5 rounded-full"
                  style={{ width: "85%" }}></div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-3 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">
              <LogOut className="w-5 h-5 mr-2" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="relative z-10 flex-1 flex flex-col min-w-0">
          {/* Mobile Header */}
          <div className="lg:hidden border-b border-gray-200 bg-white px-4 py-3">
            <div className="lg:hidden">
              <Drawer links={[...navLinks, ...supportLinks]} user={user} />
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8">
              {/* Content Header */}
              <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">
                      Dashboard
                    </h1>
                    <p className="text-sm sm:text-base text-gray-500 mt-1 truncate">
                      Welcome back, {user?.name || "User"}! Here's your overview
                    </p>
                  </div>
                </div>
              </div>

              {/* Content Container */}
              <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <Outlet />
              </div>

              {/* Quick Tips - Mobile */}
              <div className="lg:hidden mt-4 rounded-xl border border-gray-200 bg-blue-50/50 p-4">
                <div className="flex items-center mb-2">
                  <Shield className="w-5 h-5 text-teal-600 mr-2" />
                  <span className="font-medium text-gray-900">Quick Tip</span>
                </div>
                <p className="text-sm text-gray-500">
                  Use the search bar to quickly find contacts or previous calls.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 bg-white p-3 sm:p-4 md:p-5 lg:p-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                <div className="text-xs sm:text-sm text-gray-400 text-center md:text-left order-2 md:order-1">
                  <p>
                    © {new Date().getFullYear()} The Tarainn. All rights
                    reserved.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default DashboardLayout;