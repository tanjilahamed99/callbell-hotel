import { Outlet, Link } from "react-router-dom";
import Drawer from "../../components/Dashboard/Drawer";
import AdminPrivateRoute from "../../components/PrivateRoute/AdminPrivateRoute";
import {
  Home,
  Users,
  Settings,
  Shield,
  BarChart3,
  ChevronRight,
  Activity,
  Building2,
  LogOut,
  BellRing,
} from "lucide-react";
import { useCall } from "../../Provider/Provider";
import { useEffect, useState } from "react";
import getAllUsers from "../../hooks/admin/getAllUsers";

const useBrandFonts = () => {
  useEffect(() => {
    const id = "auth-brand-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
};

const AdminDashboardLayout = () => {
  useBrandFonts();
  const { user, logout } = useCall();
  const [allUsers, setAllUsers] = useState([]);

  const handleLogout = () => {
    logout();
  };

  const navLinks = [
    { href: "/admin", label: "Dashboard", icon: BarChart3 },
    { href: "/admin/users", label: "All Users", icon: Users },
    { href: "/admin/departments", label: "Departments", icon: Building2 },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  const systemStats = [
    {
      label: "Active Users",
      value: allUsers.length.toString() || "0",
    },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (user?.id && user?.email) {
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
      <div
        className="relative flex min-h-screen overflow-hidden"
        style={{
          background:
            "radial-gradient(circle at 18% 12%, #16222f 0%, #101820 50%, #0a0f15 100%)",
          fontFamily: "'Inter', ui-sans-serif, sans-serif",
        }}>
        {/* Ambient brass grid */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(#b8892b 1px, transparent 1px), linear-gradient(90deg, #b8892b 1px, transparent 1px)",
              backgroundSize: "46px 46px",
            }}
          />
          <div className="absolute -top-10 left-1/4 h-72 w-72 rounded-full bg-[#b8892b]/8 blur-3xl" />
          <div className="absolute bottom-0 right-1/5 h-96 w-96 rounded-full bg-[#2f4a5e]/25 blur-3xl" />
        </div>

        {/* Sidebar - Desktop */}
        <div className="relative z-10 hidden lg:flex lg:w-64 xl:w-72 flex-col border-r border-[#b8892b]/15 bg-[#101820]/70 shadow-2xl backdrop-blur-xl">
          {/* Logo */}
          <div className="p-6 border-b border-[#b8892b]/15">
            <Link to="/" className="flex items-center space-x-2">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#b8892b] to-[#8a651c] flex items-center justify-center">
                  <BellRing className="w-5 h-5 text-[#0a0f15]" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#101820]"></div>
              </div>
              <div>
                <span
                  className="text-xl text-[#f1ece2]"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontWeight: 600,
                  }}>
                  The Meridian
                </span>
                <p className="text-xs uppercase tracking-[0.2em] text-[#c9a24b]/70">
                  Admin Panel
                </p>
              </div>
            </Link>
          </div>

          {/* Admin Profile */}
          <div className="p-6 border-b border-[#b8892b]/15">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#b8892b] to-[#8a651c] flex items-center justify-center text-[#0a0f15] font-bold text-lg">
                {user?.name?.charAt(0) || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#f1ece2] truncate">
                  {user?.name || "Admin"}
                </p>
                <p className="text-sm text-[#f1ece2]/45 truncate">
                  {user?.email || "admin@meridian.com"}
                </p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                  <span className="text-xs text-[#f1ece2]/45">
                    Administrator
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-4">
              <p className="text-xs font-semibold text-[#c9a24b]/70 uppercase tracking-wider mb-3 px-2">
                Administration
              </p>
              <nav className="space-y-1">
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.href}
                    className="group flex items-center justify-between px-3 py-2.5 rounded-lg text-[#f1ece2]/70 hover:bg-[#b8892b]/10 hover:text-[#c9a24b] transition-all duration-200">
                    <div className="flex items-center">
                      <link.icon className="w-5 h-5 mr-3 text-[#f1ece2]/40 group-hover:text-[#c9a24b]" />
                      <span className="font-medium">{link.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#f1ece2]/25 group-hover:text-[#c9a24b]/70" />
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-[#b8892b]/15 p-4">
            <div className="rounded-lg border border-[#b8892b]/15 bg-[#0a0f15]/60 p-4 mb-4">
              <div className="flex items-center mb-2">
                <Activity className="w-5 h-5 text-[#c9a24b] mr-2" />
                <span className="text-sm font-medium text-[#f1ece2]">
                  System Status
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-xs text-[#f1ece2]/45">
                    All Systems Operational
                  </span>
                </div>
                <span className="text-xs text-emerald-400 font-medium">
                  99.9%
                </span>
              </div>
              <div className="w-full bg-[#f1ece2]/10 rounded-full h-1.5 mt-2">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-1.5 rounded-full"
                  style={{ width: "99.9%" }}></div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-3 py-2.5 rounded-lg text-[#f1ece2]/70 hover:bg-[#b8892b]/10 hover:text-[#c9a24b] transition-all duration-200">
              <LogOut className="w-5 h-5 mr-2" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="relative z-10 flex-1 flex flex-col min-w-0">
          {/* Mobile Header */}
          <div className="lg:hidden border-b border-[#b8892b]/15 bg-[#101820]/70 backdrop-blur-xl px-4 py-3">
            <div className="lg:hidden">
              <Drawer links={navLinks} user={user} />
            </div>
          </div>

          <main className="flex-1 overflow-y-auto">
            <div className="p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8">
              {/* Header */}
              <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <h1
                      className="text-xl sm:text-2xl md:text-3xl text-[#f1ece2] truncate"
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontWeight: 600,
                      }}>
                      Admin Dashboard
                    </h1>
                    <p className="text-sm sm:text-base text-[#f1ece2]/45 mt-1 truncate">
                      Welcome back, Administrator. Here's your overview.
                    </p>
                  </div>
                </div>

                {/* System Stats - Mobile */}
                <div className="lg:hidden grid grid-cols-2 gap-3 mt-4">
                  {systemStats.map((stat, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-[#b8892b]/20 bg-[#0a0f15]/40 p-3">
                      <p className="text-xs text-[#f1ece2]/45 truncate">
                        {stat.label}
                      </p>
                      <p className="text-lg font-bold text-[#f1ece2] mt-1">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Container */}
              <div className="rounded-xl sm:rounded-2xl border border-[#b8892b]/20 bg-gradient-to-br from-[#16222f]/90 via-[#0e161e]/90 to-[#16222f]/90 shadow-2xl backdrop-blur-xl overflow-hidden">
                <Outlet />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[#b8892b]/15 bg-[#0a0f15]/40 p-3 sm:p-4 md:p-5 lg:p-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                <div className="text-xs sm:text-sm text-[#f1ece2]/40 text-center md:text-left">
                  <p>
                    © {new Date().getFullYear()} The Meridian Admin Panel.
                    All rights reserved.
                  </p>
                </div>
                <div className="flex items-center flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
                  <span className="text-xs sm:text-sm text-[#f1ece2]/40">
                    System:{" "}
                    <span className="font-medium text-emerald-400">
                      Online
                    </span>
                  </span>
                  <span className="text-xs sm:text-sm text-[#f1ece2]/40">
                    Users:{" "}
                    <span className="font-medium text-[#f1ece2]/70">
                      {allUsers.length}
                    </span>
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