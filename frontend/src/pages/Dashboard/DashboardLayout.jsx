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
    { href: "/", label: "Home", icon: Home },
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/call-history", label: "Call History", icon: Phone },
    { href: "/dashboard/contacts", label: "Contacts", icon: Users },
    {
      href: "/dashboard/subscriptions",
      label: "Subscriptions",
      icon: CreditCard,
    },
    { href: "/dashboard/transactions", label: "Transactions", icon: History },
  ];

  const supportLinks = [];

  return (
    <PrivateRoute>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:flex lg:w-64 xl:w-72 flex-col border-r border-gray-200 bg-white shadow-xl">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-100">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center">
                <PhoneCall className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">Call</span>
                <span className="text-xl font-bold text-red-600">Bell</span>
                <p className="text-xs text-gray-500">Dashboard</p>
              </div>
            </Link>
          </div>

          {/* User Profile Summary */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center text-white font-bold text-lg">
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
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-xs text-gray-500">Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                Main Menu
              </p>
              <nav className="space-y-1">
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.href}
                    className="group flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200">
                    <div className="flex items-center">
                      <link.icon className="w-5 h-5 mr-3 text-gray-500 group-hover:text-red-600" />
                      <span className="font-medium">{link.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                  </Link>
                ))}
              </nav>

              <div className="mt-8">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                  Support
                </p>
                <nav className="space-y-1">
                  {supportLinks.map((link, index) => (
                    <Link
                      key={index}
                      to={link.href}
                      className="group flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200">
                      <div className="flex items-center">
                        <link.icon className="w-5 h-5 mr-3 text-gray-500 group-hover:text-red-600" />
                        <span className="font-medium">{link.label}</span>
                      </div>
                      {index === 0 && (
                        <span className="ml-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs px-2 py-0.5 rounded-full">
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
          <div className="border-t border-gray-100 p-4">
            <div className="bg-gradient-to-r from-red-50 to-white rounded-lg p-4 mb-4">
              <div className="flex items-center mb-2">
                <Shield className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-sm font-medium text-gray-900">
                  Security Status
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-3">
                Your account is protected with 2FA
              </p>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-red-600 to-red-700 h-1.5 rounded-full"
                  style={{ width: "85%" }}></div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-3 py-2.5 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200">
              <LogOut className="w-5 h-5 mr-2" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
            <div className="lg:hidden">
              <Drawer links={[...navLinks, ...supportLinks]} user={user} />
            </div>
          </div>

          {/* Quick Actions - Mobile */}
          {/* <div className="lg:hidden bg-white border-b border-gray-100 px-4 py-3">
            <div className="flex items-center justify-between space-x-2 overflow-x-auto pb-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className={`flex flex-col items-center justify-center min-w-24 px-4 py-3 bg-gradient-to-r ${action.color} text-white rounded-xl hover:shadow-lg transition-all duration-200 active:scale-95`}>
                  <action.icon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </div> */}

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
                    <p className="text-sm sm:text-base text-gray-600 mt-1 truncate">
                      Welcome back, {user?.name || "User"}! Here's your overview
                    </p>
                  </div>
                  {/* <div className="hidden lg:flex items-center space-x-3">
                    <div className="relative">
                      <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-red-600 transition-colors" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                        3
                      </span>
                    </div>
                    <button
                      onClick={() => navigate("/dashboard/calls/new")}
                      className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95">
                      New Call
                    </button>
                  </div> */}
                </div>
              </div>

              {/* Stats Cards - Mobile/Tablet */}

              {/* Content Container */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <Outlet />
              </div>

              {/* Quick Tips - Mobile */}
              <div className="lg:hidden mt-4 bg-gradient-to-r from-red-50 to-white rounded-xl p-4 border border-red-100">
                <div className="flex items-center mb-2">
                  <Shield className="w-5 h-5 text-red-600 mr-2" />
                  <span className="font-medium text-gray-900">Quick Tip</span>
                </div>
                <p className="text-sm text-gray-600">
                  Use the search bar to quickly find contacts or previous calls.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 bg-white p-3 sm:p-4 md:p-5 lg:p-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                <div className="text-xs sm:text-sm text-gray-600 text-center md:text-left order-2 md:order-1">
                  <p>
                    © {new Date().getFullYear()} CallBell. All rights reserved.
                  </p>
                </div>
                <div className="flex items-center flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 order-1 md:order-2 mb-3 md:mb-0">
                  <a
                    href="/privacy"
                    className="text-xs sm:text-sm text-gray-600 hover:text-red-600 transition-colors">
                    Privacy
                  </a>
                  <a
                    href="/terms"
                    className="text-xs sm:text-sm text-gray-600 hover:text-red-600 transition-colors">
                    Terms
                  </a>
                  <a
                    href="/help"
                    className="text-xs sm:text-sm text-gray-600 hover:text-red-600 transition-colors">
                    Help
                  </a>
                  <a
                    href="/contact"
                    className="text-xs sm:text-sm text-gray-600 hover:text-red-600 transition-colors">
                    Contact
                  </a>
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
