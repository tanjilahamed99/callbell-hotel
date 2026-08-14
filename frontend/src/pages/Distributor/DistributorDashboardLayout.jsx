import { Outlet, Link } from "react-router-dom";
import Drawer from "../../components/Dashboard/Drawer";
import {
  Home,
  Users,
  CreditCardIcon,
  CreditCard,
  History,
  Settings,
  Shield,
  Bell,
  BarChart3,
  FileText,
  Globe,
  Mail,
  HelpCircle,
  LogOut,
  ChevronRight,
  Search,
  Activity,
  Database,
  AlertCircle,
} from "lucide-react";
import { useCall } from "../../Provider/Provider";
import DistributorPrivateRoute from "../../components/PrivateRoute/DistributorPrivateRoute";

const DistributorDashboardLayout = () => {
  const { user, logout } = useCall();

  const handleLogout = () => {
    logout();
  };

  const navLinks = [
    { href: "/distributor", label: "Dashboard", icon: BarChart3 },
    { href: "/", label: "Home", icon: Home },
    { href: "/distributor/users", label: "All Users", icon: Users },
  ];


  return (
    <DistributorPrivateRoute>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:flex lg:w-64 xl:w-72 flex-col border-r border-gray-200 bg-white shadow-xl">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-100">
            <Link to="/" className="flex items-center space-x-2">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">Call</span>
                <span className="text-xl font-bold text-red-600">Bell</span>
                <p className="text-xs text-gray-500">Distributor Panel</p>
              </div>
            </Link>
          </div>

          {/* Admin Profile */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center text-white font-bold text-lg">
                {user?.name?.charAt(0) || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {user?.name || "Admin"}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {user?.email || "admin@callbell.com"}
                </p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-xs text-gray-500">Distributor</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                Administration
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
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-100 p-4">
            {/* System Status */}
            <div className="bg-gradient-to-r from-red-50 to-white rounded-lg p-4 mb-4">
              <div className="flex items-center mb-2">
                <Activity className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-sm font-medium text-gray-900">
                  System Status
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-600">
                    All Systems Operational
                  </span>
                </div>
                <span className="text-xs text-green-600 font-medium">
                  99.9%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div
                  className="bg-gradient-to-r from-green-600 to-green-700 h-1.5 rounded-full"
                  style={{ width: "99.9%" }}></div>
              </div>
            </div>

            {/* Logout Button */}
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
              <Drawer links={[...navLinks]} user={user} />
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
                      Distributor Dashboard
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1 truncate">
                      Welcome back, Distributor. Here's your system overview.
                    </p>
                  </div>
                </div>
              </div>

              {/* Content Container */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <Outlet />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 bg-white p-3 sm:p-4 md:p-5 lg:p-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                <div className="text-xs sm:text-sm text-gray-600 text-center md:text-left order-2 md:order-1">
                  <p>
                    © {new Date().getFullYear()} CallBell Distributor Panel. All
                    rights reserved.
                  </p>
                </div>
                <div className="flex items-center flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 order-1 md:order-2 mb-3 md:mb-0">
                  <span className="text-xs sm:text-sm text-gray-600">
                    System:{" "}
                    <span className="font-medium text-green-600">Online</span>
                  </span>
                  <span className="text-xs sm:text-sm text-gray-600">
                    Version: <span className="font-mono">2.1.4</span>
                  </span>
                  <span className="text-xs sm:text-sm text-gray-600">
                    Users: <span className="font-medium">1,247</span>
                  </span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </DistributorPrivateRoute>
  );
};

export default DistributorDashboardLayout;
