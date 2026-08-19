import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { BASE_URL } from "../../config/constant";
import { Mail, Key, Lock, ArrowLeft, ShieldCheck, RefreshCw } from "lucide-react";

const ForgetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(BASE_URL + `/auth/send-code`, {
        email,
      });
      if (data.success) {
        setStep(2);
        setError("");
      }
    } catch (err) {
      setError(err.response?.data?.email || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(BASE_URL + `/auth/verify-code`, {
        email,
        code,
      });
      if (data.success) {
        setStep(3);
        setError("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(BASE_URL + `/auth/change-password`, {
        email,
        code,
        password,
      });
      if (data.success) {
        Swal.fire({
          title: "Success!",
          text: "Your password has been reset!",
          icon: "success",
          confirmButtonColor: "#2563eb",
          confirmButtonText: "Continue to Login",
        });
        setStep(1);
        setEmail("");
        setCode("");
        setPassword("");
        navigate("/login");
        setError("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gray-50">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
        <div className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 h-96 w-96 rounded-full bg-teal-200/40 blur-3xl" />
      </div>

      {/* Card Container */}
      <div className="relative z-10 mx-4 w-full max-w-md">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="p-8">
            <div className="mb-8 flex flex-col items-center">
              <div className="relative mb-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-teal-500 shadow-md">
                  <ShieldCheck className="h-10 w-10 text-white" />
                </div>
              </div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Reset{" "}
                <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                  Password
                </span>
              </h1>
              <p className="text-center text-sm text-gray-500">
                Secure password recovery process
              </p>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {[1, 2, 3].map((stepNum) => (
                  <div key={stepNum} className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                        stepNum === step
                          ? "border-blue-600 bg-gradient-to-r from-blue-600 to-teal-500 text-white"
                          : stepNum < step
                            ? "border-teal-500 bg-teal-50 text-teal-600"
                            : "border-gray-200 text-gray-400"
                      }`}>
                      {stepNum < step ? "✓" : stepNum}
                    </div>
                    <span className="mt-2 text-xs text-gray-500">
                      {stepNum === 1 ? "Email" : stepNum === 2 ? "Code" : "Password"}
                    </span>
                  </div>
                ))}
                <div className="-mt-5 mx-4 h-0.5 flex-1 bg-gray-200">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-teal-500 transition-all duration-500"
                    style={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }}
                  />
                </div>
              </div>
            </div>

            {/* Step 1: Email */}
            {step === 1 && (
              <form onSubmit={handleSendCode} className="space-y-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Enter your email address to receive a verification code
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Enter your email"
                    required
                    className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-center text-sm text-red-600">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:from-blue-700 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-70 active:scale-95">
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="-ml-1 mr-3 h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending Code...
                    </span>
                  ) : (
                    "Send Verification Code"
                  )}
                </button>
              </form>
            )}

            {/* Step 2: Code */}
            {step === 2 && (
              <form onSubmit={handleVerifyCode} className="space-y-6">
                <div className="text-center">
                  <p className="mb-2 text-sm text-gray-500">
                    Enter the 6-digit verification code sent to
                  </p>
                  <p className="text-sm font-semibold text-teal-600">{email}</p>
                </div>

                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Key className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    type="text"
                    placeholder="Enter 6-digit code"
                    required
                    maxLength="6"
                    className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-12 pr-4 text-center text-2xl tracking-widest text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-center text-sm text-red-600">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:from-blue-700 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-70 active:scale-95">
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="-ml-1 mr-3 h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Verifying...
                    </span>
                  ) : (
                    "Verify Code"
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center text-sm text-gray-500 transition-colors duration-200 hover:text-teal-600">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resend Code
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Enter your new password</p>
                </div>

                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="New password"
                    required
                    className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <p className="mb-2 text-xs text-gray-500">Password requirements:</p>
                  <ul className="space-y-1 text-xs text-gray-500">
                    <li className="flex items-center">
                      <div className={`mr-2 h-1.5 w-1.5 rounded-full ${password.length >= 8 ? "bg-teal-500" : "bg-gray-300"}`} />
                      At least 8 characters
                    </li>
                    <li className="flex items-center">
                      <div className={`mr-2 h-1.5 w-1.5 rounded-full ${/[A-Z]/.test(password) ? "bg-teal-500" : "bg-gray-300"}`} />
                      One uppercase letter
                    </li>
                    <li className="flex items-center">
                      <div className={`mr-2 h-1.5 w-1.5 rounded-full ${/\d/.test(password) ? "bg-teal-500" : "bg-gray-300"}`} />
                      One number
                    </li>
                  </ul>
                </div>

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-center text-sm text-red-600">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:from-blue-700 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-70 active:scale-95">
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="-ml-1 mr-3 h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Resetting...
                    </span>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 bg-gray-50 p-6">
            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-sm text-gray-500 transition-colors duration-200 hover:text-teal-600">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center justify-center space-x-2 text-sm text-gray-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Your security is our priority</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;