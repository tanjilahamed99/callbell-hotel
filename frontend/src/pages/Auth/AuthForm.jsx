import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { useCall } from "../../Provider/Provider";
import register from "../../hooks/auth/regsiter";
import setAuthToken from "../../config/setAuthToken";
import { Link, Navigate, useNavigate } from "react-router-dom";
import login from "../../hooks/auth/login";
import QrScanner from "../../components/Dashboard/QrScaner";
import { Eye, EyeOff, User, Mail, Lock, QrCode, BellRing } from "lucide-react";

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

const AuthForm = () => {
  useBrandFonts();

  const [signUp, setSignUp] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const { setToken, setUser, user, loading: callLoading } = useCall();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (signUp) {
        const { data } = await register(userData);
        if (!data.success)
          throw new Error(data.message || "Registration failed");
      }

      const { data: user } = await login({
        email: userData.email,
        password: userData.password,
      });

      const decodedUser = jwtDecode(user.token);
      localStorage.setItem("token", user.token);
      localStorage.setItem("user", JSON.stringify(decodedUser));
      localStorage.setItem("fcmToken", user.fcmToken);

      if (window.Android && window.Android.onLoginSuccess) {
        window.Android.onLoginSuccess(
          user.token,
          JSON.stringify(decodedUser),
          user.fcmToken,
        );
      }

      setAuthToken(user.token);
      setUser(jwtDecode(user.token));
      setToken(user.token);

      Swal.fire({
        title: "Success",
        text: "You have successfully logged in!",
        icon: "success",
        background: "#101820",
        color: "#f1ece2",
        confirmButtonColor: "#b8892b",
      });

      const userRole = jwtDecode(user.token);

      if (userRole.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      if (err.message !== "NEXT_REDIRECT") {
        setError(err?.response?.data?.message || err.message);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (user && !callLoading) {
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-10"
      style={{
        background:
          "radial-gradient(circle at 18% 12%, #16222f 0%, #101820 50%, #0a0f15 100%)",
        fontFamily: "'Inter', ui-sans-serif, sans-serif",
      }}>
      {/* Ambient background — fine brass grid, like a lobby directory board */}
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

      <div className="relative z-10 w-full max-w-md">
        {/* Brand mark */}
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full border border-[#b8892b]/50 bg-gradient-to-br from-[#182633] to-[#0a0f15] shadow-[0_0_30px_rgba(184,137,43,0.12)]">
            <BellRing className="h-7 w-7 text-[#c9a24b]" strokeWidth={1.6} />
          </div>
          <h1
            className="text-3xl tracking-tight text-[#f1ece2]"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 600,
            }}>
            The Tarainn
          </h1>
          <p className="mt-1 text-xs uppercase tracking-[0.3em] text-[#c9a24b]/70">
            Guest Services Portal
          </p>
        </div>

        {/* Hero: room QR → call a department. This is the guest-facing purpose of the app. */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-[#b8892b]/20 bg-gradient-to-br from-[#16222f]/90 to-[#0c1218]/90 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col items-center px-6 py-7">
            <div className="relative mb-4">
              {/* Radiating call rings behind the QR icon */}
              <span className="absolute inset-0 -m-3 rounded-full border border-[#c9a24b]/30 call-ring call-ring-a" />
              <span className="absolute inset-0 -m-3 rounded-full border border-[#c9a24b]/30 call-ring call-ring-b" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#b8892b] to-[#8a651c]">
                <QrCode className="h-8 w-8 text-[#0a0f15]" />
              </div>
            </div>
            <p
              className="mb-1 text-center text-xl text-[#f1ece2]"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 600,
              }}>
              Scan the code in your room
            </p>
            <p className="mb-5 text-center text-sm text-[#f1ece2]/50">
              Reach Reception, Room Service, or the Duty Manager in one tap — no
              account needed.
            </p>

            <div className="grid w-full grid-cols-3 gap-2">
              {["Reception", "Room Service", "Duty Manager"].map((dept) => (
                <div
                  key={dept}
                  className="rounded-lg border border-[#b8892b]/20 bg-[#0a0f15]/60 px-2 py-3 text-center transition-colors duration-300 hover:border-[#c9a24b]/40">
                  <span className="text-[11px] font-medium leading-tight text-[#f1ece2]/70">
                    {dept}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#b8892b]/20 bg-[#0a0f15]/60 p-3">
              <div className="rounded-lg bg-gradient-to-br from-[#b8892b] to-[#8a651c] p-2">
                <QrScanner />
              </div>
              <span className="text-sm font-medium text-[#f1ece2]/80">
                Or scan here to test the call flow
              </span>
            </div>
          </div>
        </div>

        {/* Staff sign in / register — plain, standard fields */}
        <div className="overflow-hidden rounded-2xl border border-[#b8892b]/20 bg-gradient-to-br from-[#16222f]/90 via-[#0e161e]/90 to-[#16222f]/90 shadow-2xl backdrop-blur-xl">
          <div className="p-8">
            <h2
              className="mb-1 text-center text-2xl text-[#f1ece2]"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 600,
              }}>
              Staff Access
            </h2>
            <p className="mb-6 text-center text-sm text-[#f1ece2]/45">
              Sign in to manage guest calls and department requests.
            </p>

            {/* Sliding tab toggle */}
            <div className="relative mb-8 flex rounded-lg border border-[#b8892b]/15 bg-[#0a0f15]/60 p-1">
              <div
                className="absolute inset-y-1 w-[calc(50%-4px)] rounded-md bg-gradient-to-r from-[#b8892b] to-[#8a651c] shadow-lg transition-transform duration-300 ease-out"
                style={{
                  transform: signUp
                    ? "translateX(calc(100% + 8px))"
                    : "translateX(0)",
                }}
              />
              <button
                type="button"
                onClick={() => setSignUp(false)}
                className={`relative z-10 flex-1 rounded-md py-3 text-center text-sm font-semibold uppercase tracking-wide transition-colors duration-300 ${
                  !signUp
                    ? "text-[#0a0f15]"
                    : "text-[#f1ece2]/50 hover:text-[#f1ece2]/80"
                }`}>
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setSignUp(true)}
                className={`relative z-10 flex-1 rounded-md py-3 text-center text-sm font-semibold uppercase tracking-wide transition-colors duration-300 ${
                  signUp
                    ? "text-[#0a0f15]"
                    : "text-[#f1ece2]/50 hover:text-[#f1ece2]/80"
                }`}>
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Signup-only fields, animated in — standard name + role, nothing guest-specific */}
              <div
                className="grid overflow-hidden transition-all duration-300 ease-out"
                style={{
                  gridTemplateRows: signUp ? "1fr" : "0fr",
                  opacity: signUp ? 1 : 0,
                }}>
                <div className="min-h-0 space-y-5">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#c9a24b]/60" />
                    <input
                      name="name"
                      value={userData.name}
                      onChange={handleChange}
                      type="text"
                      placeholder="Full name"
                      required={signUp}
                      className="w-full rounded-lg border border-[#b8892b]/20 bg-[#0a0f15]/60 py-3 pl-12 pr-4 text-[#f1ece2] placeholder-[#f1ece2]/30 outline-none transition-all duration-300 focus:border-[#c9a24b] focus:ring-2 focus:ring-[#c9a24b]/25"
                    />
                  </div>
                </div>
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#c9a24b]/60" />
                <input
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="Email"
                  required
                  className="w-full rounded-lg border border-[#b8892b]/20 bg-[#0a0f15]/60 py-3 pl-12 pr-4 text-[#f1ece2] placeholder-[#f1ece2]/30 outline-none transition-all duration-300 focus:border-[#c9a24b] focus:ring-2 focus:ring-[#c9a24b]/25"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#c9a24b]/60" />
                <input
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  className="w-full rounded-lg border border-[#b8892b]/20 bg-[#0a0f15]/60 py-3 pl-12 pr-12 text-[#f1ece2] placeholder-[#f1ece2]/30 outline-none transition-all duration-300 focus:border-[#c9a24b] focus:ring-2 focus:ring-[#c9a24b]/25"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f1ece2]/40 transition-colors duration-200 hover:text-[#c9a24b]">
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div
                className="grid overflow-hidden transition-all duration-300 ease-out"
                style={{
                  gridTemplateRows: error ? "1fr" : "0fr",
                  opacity: error ? 1 : 0,
                }}>
                <div className="min-h-0">
                  <div className="rounded-lg border border-[#b8892b]/40 bg-[#b8892b]/10 p-3">
                    <p className="text-center text-sm font-medium text-[#e8c07a]">
                      {error}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-[#b8892b] to-[#8a651c] px-5 py-3 text-sm font-semibold uppercase tracking-wide text-[#0a0f15] shadow-lg transition-all duration-300 hover:shadow-[0_10px_30px_-8px_rgba(184,137,43,0.5)] disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]">
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg
                      className="h-5 w-5 animate-spin text-[#0a0f15]"
                      fill="none"
                      viewBox="0 0 24 24">
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
                    Processing...
                  </span>
                ) : (
                  "Submit"
                )}
              </button>

              {!signUp && (
                <div className="text-center">
                  <Link
                    to="/forget-password"
                    className="text-sm text-[#f1ece2]/50 transition-colors duration-200 hover:text-[#c9a24b] hover:underline">
                    Forgot password?
                  </Link>
                </div>
              )}
            </form>
          </div>

          <div className="border-t border-[#b8892b]/10 bg-[#0a0f15]/40 p-5">
            <p className="text-center text-sm text-[#f1ece2]/40">
              {signUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => setSignUp(!signUp)}
                className="font-semibold text-[#c9a24b] transition-colors duration-200 hover:text-[#e8c07a]">
                {signUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#f1ece2]/35">
          <Lock className="h-3.5 w-3.5" />
          <span>Protected by end-to-end encryption</span>
        </div>
      </div>

      <style>{`
        @keyframes callRing {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .call-ring { animation: callRing 2.4s ease-out infinite; }
        .call-ring-b { animation-delay: 1.2s; }
        @media (prefers-reduced-motion: reduce) {
          .call-ring-a, .call-ring-b { animation: none; opacity: 0.2; }
        }
      `}</style>
    </div>
  );
};

export default AuthForm;
