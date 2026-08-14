import { Outlet, Link } from "react-router-dom";
import Drawer from "../../components/Dashboard/Drawer";
import AdminPrivateRoute from "../../components/PrivateRoute/AdminPrivateRoute";
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
  Building2,
} from "lucide-react";
import { useCall } from "../../Provider/Provider";
import { useEffect, useState } from "react";
import getAllUsers from "../../hooks/admin/getAllUsers";

const AdminDashboardLayout = () => {
  const { user, logout } = useCall();
  const [allUsers, setAllUsers] = useState([]);

  const handleLogout = () => {
    logout();
  };

  const navLinks = [
    { href: "/admin", label: "Dashboard", icon: BarChart3 },
    { href: "/", label: "Home", icon: Home },
    { href: "/admin/users", label: "All Users", icon: Users },
    { href: "/admin/credit", label: "Credit", icon: CreditCardIcon },
    { href: "/admin/distributor", label: "Distributor", icon: Users },
    { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
    { href: "/admin/transactions", label: "Transactions", icon: History },
    { href: "/admin/settings", label: "Settings", icon: Settings },
    { href: "/admin/departments", label: "Departments", icon: Building2 },
  ];

  const supportLinks = [
    { href: "/admin/about", label: "About", icon: FileText },
    { href: "/admin/contact", label: "Contact", icon: Mail },
  ];

  const legalLinks = [
    { href: "/admin/terms", label: "Terms", icon: FileText },
    { href: "/admin/privacy", label: "Privacy", icon: Shield },
  ];

  const systemStats = [
    {
      label: "Active Users",
      value: allUsers.length.toString() || "0",
      change: "+12%",
      color: "text-green-600",
    },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if(user?.id && user?.email) {
          const { data } = await getAllUsers(user.id, user.email);
          if (data.success) {
            setAllUsers(data.users || []);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, [user]);

  return (
    <AdminPrivateRoute>
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
                <p className="text-xs text-gray-500">Admin Panel</p>
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
                  <span className="text-xs text-gray-500">Administrator</span>
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
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="mt-8">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                  Legal
                </p>
                <nav className="space-y-1">
                  {legalLinks.map((link, index) => (
                    <Link
                      key={index}
                      to={link.href}
                      className="group flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200">
                      <div className="flex items-center">
                        <link.icon className="w-5 h-5 mr-3 text-gray-500 group-hover:text-red-600" />
                        <span className="font-medium">{link.label}</span>
                      </div>
                    </Link>
                  ))}
                </nav>
              </div>
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
              <Drawer
                links={[...navLinks, ...supportLinks, ...legalLinks]}
                user={user}
              />
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
                      Admin Dashboard
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1 truncate">
                      Welcome back, Administrator. Here's your system overview.
                    </p>
                  </div>
                </div>

                {/* System Stats - Mobile/Tablet */}
                <div className="lg:hidden grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  {systemStats.map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-3 border border-gray-100">
                      <p className="text-xs text-gray-600 truncate">
                        {stat.label}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-lg font-bold text-gray-900">
                          {stat.value}
                        </p>
                        <span className={`text-xs font-medium ${stat.color}`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Stats - Desktop */}
              <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {systemStats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {stat.value}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
                        {index === 0 && (
                          <Users className="w-6 h-6 text-red-600" />
                        )}
                        {index === 1 && (
                          <Activity className="w-6 h-6 text-blue-600" />
                        )}
                        {index === 2 && (
                          <CreditCard className="w-6 h-6 text-purple-600" />
                        )}
                        {index === 3 && (
                          <AlertCircle className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center mt-4">
                      <span className={`text-sm font-medium ${stat.color}`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        from yesterday
                      </span>
                    </div>
                  </div>
                ))}
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
                    © {new Date().getFullYear()} CallBell Admin Panel. All
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
    </AdminPrivateRoute>
  );
};

export default AdminDashboardLayout;
