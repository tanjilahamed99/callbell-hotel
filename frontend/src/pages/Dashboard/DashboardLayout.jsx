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
import { useEffect } from "react";

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

const DashboardLayout = () => {
  useBrandFonts();
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
      <div
        className="relative flex min-h-screen overflow-hidden"
        style={{
          background:
            "radial-gradient(circle at 18% 12%, #16222f 0%, #101820 50%, #0a0f15 100%)",
          fontFamily: "'Inter', ui-sans-serif, sans-serif",
        }}>
        {/* Ambient brass grid, matching auth page */}
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
          {/* Logo Section */}
          <div className="p-6 border-b border-[#b8892b]/15">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#b8892b] to-[#8a651c] flex items-center justify-center">
                <PhoneCall className="w-6 h-6 text-[#0a0f15]" />
              </div>
              <div>
                <span
                  className="text-xl text-[#f1ece2]"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontWeight: 600,
                  }}>
                  The Tarainn
                </span>
                <p className="text-xs uppercase tracking-[0.2em] text-[#c9a24b]/70">
                  Staff Dashboard
                </p>
              </div>
            </Link>
          </div>

          {/* User Profile Summary */}
          <div className="p-6 border-b border-[#b8892b]/15">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#b8892b] to-[#8a651c] flex items-center justify-center text-[#0a0f15] font-bold text-lg">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#f1ece2] truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-sm text-[#f1ece2]/45 truncate">
                  {user?.email || "user@example.com"}
                </p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                  <span className="text-xs text-[#f1ece2]/45">Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-4">
              <p className="text-xs font-semibold text-[#c9a24b]/70 uppercase tracking-wider mb-3 px-2">
                Main Menu
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

              <div className="mt-8">
                <p className="text-xs font-semibold text-[#c9a24b]/70 uppercase tracking-wider mb-3 px-2">
                  Support
                </p>
                <nav className="space-y-1">
                  {supportLinks.map((link, index) => (
                    <Link
                      key={index}
                      to={link.href}
                      className="group flex items-center justify-between px-3 py-2.5 rounded-lg text-[#f1ece2]/70 hover:bg-[#b8892b]/10 hover:text-[#c9a24b] transition-all duration-200">
                      <div className="flex items-center">
                        <link.icon className="w-5 h-5 mr-3 text-[#f1ece2]/40 group-hover:text-[#c9a24b]" />
                        <span className="font-medium">{link.label}</span>
                      </div>
                      {index === 0 && (
                        <span className="ml-2 bg-gradient-to-r from-[#b8892b] to-[#8a651c] text-[#0a0f15] text-xs px-2 py-0.5 rounded-full font-semibold">
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
          <div className="border-t border-[#b8892b]/15 p-4">
            <div className="rounded-lg border border-[#b8892b]/15 bg-[#0a0f15]/60 p-4 mb-4">
              <div className="flex items-center mb-2">
                <Shield className="w-5 h-5 text-[#c9a24b] mr-2" />
                <span className="text-sm font-medium text-[#f1ece2]">
                  Security Status
                </span>
              </div>
              <p className="text-xs text-[#f1ece2]/45 mb-3">
                Your account is protected with 2FA
              </p>
              <div className="w-full bg-[#f1ece2]/10 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-[#b8892b] to-[#8a651c] h-1.5 rounded-full"
                  style={{ width: "85%" }}></div>
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

        {/* Mobile Drawer */}
        {/* Main Content Area */}
        <div className="relative z-10 flex-1 flex flex-col min-w-0">
          {/* Mobile Header */}
          <div className="lg:hidden border-b border-[#b8892b]/15 bg-[#101820]/70 backdrop-blur-xl px-4 py-3">
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
                    <h1
                      className="text-xl sm:text-2xl md:text-3xl text-[#f1ece2] truncate"
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontWeight: 600,
                      }}>
                      Dashboard
                    </h1>
                    <p className="text-sm sm:text-base text-[#f1ece2]/45 mt-1 truncate">
                      Welcome back, {user?.name || "User"}! Here's your overview
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Cards - Mobile/Tablet */}

              {/* Content Container */}
              <div className="rounded-xl sm:rounded-2xl border border-[#b8892b]/20 bg-gradient-to-br from-[#16222f]/90 via-[#0e161e]/90 to-[#16222f]/90 shadow-2xl backdrop-blur-xl overflow-hidden">
                <Outlet />
              </div>

              {/* Quick Tips - Mobile */}
              <div className="lg:hidden mt-4 rounded-xl border border-[#b8892b]/20 bg-[#0a0f15]/40 p-4">
                <div className="flex items-center mb-2">
                  <Shield className="w-5 h-5 text-[#c9a24b] mr-2" />
                  <span className="font-medium text-[#f1ece2]">Quick Tip</span>
                </div>
                <p className="text-sm text-[#f1ece2]/45">
                  Use the search bar to quickly find contacts or previous calls.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[#b8892b]/15 bg-[#0a0f15]/40 p-3 sm:p-4 md:p-5 lg:p-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                <div className="text-xs sm:text-sm text-[#f1ece2]/40 text-center md:text-left order-2 md:order-1">
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
