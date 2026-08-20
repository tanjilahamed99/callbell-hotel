import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { useCall } from "../../Provider/Provider";
import setAuthToken from "../../config/setAuthToken";
import { Link, Navigate, useNavigate } from "react-router-dom";
import login from "../../hooks/auth/login";
import QrScanner from "../../components/Dashboard/QrScaner";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  QrCode,
  PhoneCall,
} from "lucide-react";

const AuthForm = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    setToken,
    setUser,
    user,
    loading: callLoading,
  } = useCall();

  const navigate = useNavigate();

  // =========================================================
  // Handle input changes
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // Login
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      const { data: user } = await login({
        email: userData.email,
        password: userData.password,
      });

      const decodedUser = jwtDecode(user.token);

      // Store authentication data
      localStorage.setItem("token", user.token);
      localStorage.setItem(
        "user",
        JSON.stringify(decodedUser),
      );
      localStorage.setItem("fcmToken", user.fcmToken);

      // Android app callback
      if (
        window.Android &&
        window.Android.onLoginSuccess
      ) {
        window.Android.onLoginSuccess(
          user.token,
          JSON.stringify(decodedUser),
          user.fcmToken,
        );
      }

      // Set authentication
      setAuthToken(user.token);
      setUser(decodedUser);
      setToken(user.token);

      // Success message
      Swal.fire({
        title: "Welcome Back",
        text: "You have successfully logged in!",
        icon: "success",
        confirmButtonColor: "#2563eb",
      });

      // Redirect according to role
      if (decodedUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      if (err.message !== "NEXT_REDIRECT") {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Login failed. Please check your credentials.",
        );
      }

      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // Already logged in
  // =========================================================

  if (user && !callLoading) {
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gray-50 px-4 py-10">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

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

      <div className="relative z-10 w-full max-w-md">

        {/* ===================================================
            BRAND
        ==================================================== */}

        <div className="mb-6 flex flex-col items-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-teal-500 shadow-md">
            <PhoneCall
              className="h-7 w-7 text-white"
              strokeWidth={1.6}
            />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              Tarainn
            </span>{" "}
            Hotel
          </h1>

          <p className="mt-1 text-xs uppercase tracking-[0.3em] text-gray-500">
            Guest Services Portal
          </p>
        </div>

        {/* ===================================================
            QR INFORMATION
        ==================================================== */}

        <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col items-center px-6 py-7">

            <div className="relative mb-4">
              <span className="absolute inset-0 -m-3 rounded-full border border-teal-400/40 call-ring call-ring-a" />

              <span className="absolute inset-0 -m-3 rounded-full border border-teal-400/40 call-ring call-ring-b" />

              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-teal-500 shadow-md">
                <QrCode className="h-8 w-8 text-white" />
              </div>
            </div>

            <p className="mb-1 text-center text-xl font-bold text-gray-900">
              Scan the code in your room
            </p>

            <p className="mb-5 text-center text-sm text-gray-500">
              Reach Reception, Room Service, or the Duty Manager
              in one tap — no account needed.
            </p>

            <div className="grid w-full grid-cols-3 gap-2">
              {[
                "Reception",
                "Room Service",
                "Duty Manager",
              ].map((dept) => (
                <div
                  key={dept}
                  className="rounded-lg border border-gray-200 bg-blue-50/50 px-2 py-3 text-center transition-colors duration-300 hover:border-teal-300"
                >
                  <span className="text-[11px] font-medium leading-tight text-gray-700">
                    {dept}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-xl border border-gray-200 bg-blue-50/50 p-3">
              <div className="rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 p-2 shadow-sm">
                <QrScanner />
              </div>

              <span className="text-sm font-medium text-gray-600">
                Or scan here to test the call flow
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================
            LOGIN CARD
        ==================================================== */}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="p-8">

            <h2 className="mb-1 text-center text-2xl font-bold text-gray-900">
              Staff Login
            </h2>

            <p className="mb-7 text-center text-sm text-gray-500">
              Sign in to manage guest calls and department requests.
            </p>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* =================================================
                  EMAIL
              ================================================== */}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="Email address"
                  autoComplete="email"
                  required
                  className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* =================================================
                  PASSWORD
              ================================================== */}

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-12 pr-12 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200 hover:text-teal-600"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* =================================================
                  ERROR
              ================================================== */}

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="text-center text-sm font-medium text-red-600">
                    {error}
                  </p>
                </div>
              )}

              {/* =================================================
                  LOGIN BUTTON
              ================================================== */}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-md transition-all duration-300 hover:from-blue-700 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">

                    <svg
                      className="h-5 w-5 animate-spin text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />

                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>

                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* =================================================
                  FORGOT PASSWORD
              ================================================== */}

              <div className="text-center">
                <Link
                  to="/forget-password"
                  className="text-sm text-gray-500 transition-colors duration-200 hover:text-teal-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

            </form>
          </div>

          {/* =================================================
              LOGIN ONLY FOOTER
          ================================================== */}

          <div className="border-t border-gray-200 bg-gray-50 p-5">
            <p className="text-center text-sm text-gray-500">
              Authorized staff members only
            </p>
          </div>
        </div>

        {/* ===================================================
            SECURITY
        ==================================================== */}

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
          <Lock className="h-3.5 w-3.5" />

          <span>
            Protected by secure authentication
          </span>
        </div>
      </div>

      {/* =====================================================
          ANIMATION
      ====================================================== */}

      <style>{`
        @keyframes callRing {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }

          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }

        .call-ring {
          animation: callRing 2.4s ease-out infinite;
        }

        .call-ring-b {
          animation-delay: 1.2s;
        }

        @media (prefers-reduced-motion: reduce) {
          .call-ring-a,
          .call-ring-b {
            animation: none;
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
};

export default AuthForm;