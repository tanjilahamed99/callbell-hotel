import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { BASE_URL } from "../../config/constant";
import { Mail, Key, Lock, ArrowLeft, ShieldCheck, RefreshCw } from "lucide-react";

const ForgetPassword = () => {
  const [step, setStep] = useState(1); // steps: 1=email, 2=code, 3=new password
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // Step 1: Send auth code
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

  // Step 2: Verify code
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

  // Step 3: Reset password
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
          confirmButtonColor: "#dc2626",
          confirmButtonText: "Continue to Login"
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
    <div className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-black">
          <div className="absolute inset-0 opacity-5 bg-[linear-gradient(90deg,#ff1212_1px,transparent_1px),linear-gradient(180deg,#ff1212_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-red-600/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-red-700/3 blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Card Container */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="rounded-2xl bg-gradient-to-br from-gray-900/90 via-black/90 to-gray-900/90 backdrop-blur-xl border border-red-900/30 shadow-2xl shadow-red-900/10 overflow-hidden">
          {/* Header */}
          <div className="p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 rounded-full blur-lg opacity-30" />
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-600 to-red-800 p-1">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                    <ShieldCheck className="w-10 h-10 text-red-500" />
                  </div>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Reset <span className="text-red-500">Password</span>
              </h1>
              <p className="text-gray-400 text-center text-sm">
                Secure password recovery process
              </p>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {[1, 2, 3].map((stepNum) => (
                  <div key={stepNum} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      stepNum === step 
                        ? "border-red-600 bg-red-600 text-white" 
                        : stepNum < step 
                          ? "border-green-500 bg-green-500/20 text-green-500" 
                          : "border-gray-700 text-gray-500"
                    }`}>
                      {stepNum < step ? "✓" : stepNum}
                    </div>
                    <span className="text-xs mt-2 text-gray-400">
                      {stepNum === 1 ? "Email" : stepNum === 2 ? "Code" : "Password"}
                    </span>
                  </div>
                ))}
                <div className="flex-1 h-0.5 bg-gray-800 mx-4 -mt-5">
                  <div 
                    className="h-full bg-gradient-to-r from-red-600 to-red-700 transition-all duration-500"
                    style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
                  />
                </div>
              </div>
            </div>

            {/* Step 1: Email */}
            {step === 1 && (
              <form onSubmit={handleSendCode} className="space-y-6">
                <div className="text-center">
                  <p className="text-gray-400 text-sm">
                    Enter your email address to receive a verification code
                  </p>
                </div>
                
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Enter your email"
                    required
                    className="w-full rounded-lg border border-gray-700 bg-gray-900/50 py-3 pl-12 pr-4 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
                  />
                </div>

                {error && (
                  <div className="rounded-lg bg-red-900/30 border border-red-700 p-4">
                    <p className="text-sm text-red-300 text-center">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-gradient-to-r from-red-600 to-red-700 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:from-red-700 hover:to-red-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 active:scale-95"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
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
                  <p className="text-gray-400 text-sm mb-2">
                    Enter the 6-digit verification code sent to
                  </p>
                  <p className="text-red-400 font-semibold text-sm">{email}</p>
                </div>
                
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Key className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    type="text"
                    placeholder="Enter 6-digit code"
                    required
                    maxLength="6"
                    className="w-full rounded-lg border border-gray-700 bg-gray-900/50 py-3 pl-12 pr-4 text-center text-2xl tracking-widest text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
                  />
                </div>

                {error && (
                  <div className="rounded-lg bg-red-900/30 border border-red-700 p-4">
                    <p className="text-sm text-red-300 text-center">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-gradient-to-r from-red-600 to-red-700 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:from-red-700 hover:to-red-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 active:scale-95"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
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
                    className="inline-flex items-center text-sm text-gray-400 hover:text-red-500 transition-colors duration-200"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Resend Code
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="text-center">
                  <p className="text-gray-400 text-sm">
                    Enter your new password
                  </p>
                </div>
                
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="New password"
                    required
                    className="w-full rounded-lg border border-gray-700 bg-gray-900/50 py-3 pl-12 pr-4 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
                  />
                </div>

                <div className="rounded-lg bg-gray-900/50 border border-gray-700 p-4">
                  <p className="text-xs text-gray-400 mb-2">Password requirements:</p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li className="flex items-center">
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-700'}`} />
                      At least 8 characters
                    </li>
                    <li className="flex items-center">
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-700'}`} />
                      One uppercase letter
                    </li>
                    <li className="flex items-center">
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${/\d/.test(password) ? 'bg-green-500' : 'bg-gray-700'}`} />
                      One number
                    </li>
                  </ul>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-900/30 border border-red-700 p-4">
                    <p className="text-sm text-red-300 text-center">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-gradient-to-r from-red-600 to-red-700 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:from-red-700 hover:to-red-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 active:scale-95"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
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
          <div className="border-t border-gray-800/50 p-6">
            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-sm text-gray-400 hover:text-red-500 transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center justify-center space-x-2 text-gray-500 text-sm">
            <ShieldCheck className="h-4 w-4" />
            <span>Your security is our priority</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;