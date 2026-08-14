import { Link } from "react-router-dom";
import { useCall } from "../../Provider/Provider";

const Navbar = () => {
  const { user, logout } = useCall();

  const handleLogout = async () => {
    logout();
  };

  const navLinks = [
    { title: "Home", to: "/" },
    { title: "About Us", to: "/about" },
    { title: "Privacy Policy", to: "/privacy" },
    { title: "Terms of Use", to: "/terms" },
    { title: "Contact Us", to: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-gray-900 to-black shadow-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 transition-transform duration-300 hover:scale-105">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">
                Call<span className="text-red-500">Bell</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              {navLinks.map((item, i) => (
                <Link
                  key={i}
                  to={item.to}
                  className="group relative px-4 py-2 transition-all duration-300">
                  <span className="relative z-10 text-gray-300 group-hover:text-white font-medium text-sm tracking-wide transition-colors duration-200">
                    {item.title}
                  </span>
                  <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/10 rounded-lg transition-all duration-300" />
                  <div className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-gradient-to-r from-red-500 to-red-600 group-hover:w-3/4 transition-all duration-300" />
                </Link>
              ))}

              {/* Dashboard / Admin Link */}
              {user?.id && (
                <Link
                  to={user.role === "admin" ? "/admin" : user.role === "distributor" ? "/distributor" : "/dashboard"}
                  className="group relative px-4 py-2 transition-all duration-300">
                  <span className="relative z-10 text-gray-300 group-hover:text-white font-medium text-sm tracking-wide transition-colors duration-200">
                    {user.role === "admin" ? "Admin Panel" : user.role === "distributor" ? "Distributor Panel" : "Dashboard"}
                    <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  </span>
                  <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/10 rounded-lg transition-all duration-300" />
                </Link>
              )}
            </div>
          </div>

          {/* Login/Logout & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Desktop Login/Logout Button */}
            <div className="hidden md:block">
              {user?.id ? (
                <button
                  onClick={handleLogout}
                  className="relative overflow-hidden rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-6 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:from-red-700 hover:to-red-800 hover:shadow-xl active:scale-95">
                  <span className="relative z-10 flex items-center">
                    Logout
                    <svg
                      className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-red-800 to-red-900 opacity-0 transition-opacity duration-300 hover:opacity-100" />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="relative overflow-hidden rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-6 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:from-red-700 hover:to-red-800 hover:shadow-xl active:scale-95 inline-flex items-center">
                  <span className="relative z-10 flex items-center">
                    Login
                    <svg
                      className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-red-800 to-red-900 opacity-0 transition-opacity duration-300 hover:opacity-100" />
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <details className="dropdown dropdown-end">
                <summary className="btn btn-ghost m-1 rounded-lg p-2 hover:bg-red-600/10">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </summary>
                <ul className="menu dropdown-content rounded-box z-[1] mt-3 w-52 bg-gradient-to-b from-gray-900 to-black p-2 shadow-2xl shadow-red-900/20 ring-1 ring-red-900/50">
                  {/* User Info */}
                  {user?.id && (
                    <li className="px-4 py-3 border-b border-red-900/30">
                      <p className="text-sm text-gray-300">Welcome back,</p>
                      <p className="font-medium text-white truncate">
                        {user.email}
                      </p>
                      <p className="text-xs text-red-400 mt-1">
                        {user.role === "admin" ? "Administrator" : "User"}
                      </p>
                    </li>
                  )}

                  {/* Mobile Links */}
                  {navLinks.map((item, i) => (
                    <li key={i}>
                      <Link
                        to={item.to}
                        className="group flex items-center rounded-lg px-4 py-3 text-gray-300 hover:bg-red-600/10 hover:text-white transition-all duration-200">
                        <span className="flex-1">{item.title}</span>
                        <svg
                          className="h-4 w-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </li>
                  ))}

                  {/* Dashboard / Admin Mobile */}
                  {user?.id && (
                    <li>
                      <Link
                        to={
                          user.role === "admin"
                            ? "/admin"
                            : user.role === "distributor"
                              ? "/distributor"
                              : "/dashboard"
                        }
                        className="group flex items-center rounded-lg px-4 py-3 text-gray-300 hover:bg-red-600/10 hover:text-white transition-all duration-200">
                        <span className="flex-1">
                          {user.role === "admin"
                            ? "Admin Panel"
                            : user.role === "distributor"
                              ? "Distributor Panel"
                              : "Dashboard"}
                        </span>
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                      </Link>
                    </li>
                  )}

                  {/* Mobile Login/Logout */}
                  <li className="mt-2">
                    {user?.id ? (
                      <button
                        onClick={handleLogout}
                        className="w-full rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:from-red-700 hover:to-red-800 active:scale-95">
                        Logout
                      </button>
                    ) : (
                      <Link
                        to="/login"
                        className="w-full rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:from-red-700 hover:to-red-800 active:scale-95 block text-center">
                        Login / Sign Up
                      </Link>
                    )}
                  </li>
                </ul>
              </details>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
