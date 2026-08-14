import { useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useCall } from "../../Provider/Provider";
import { BASE_URL } from "../../config/constant";
import {
  CheckCircle,
  XCircle,
  Loader2,
  ArrowRight,
  Home,
  CreditCard,
  Shield,
  RefreshCw,
  ExternalLink
} from "lucide-react";

const Success = () => {
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();
  const { user } = useCall();
  const [status, setStatus] = useState("loading"); // loading | success | failed
  const [errorMsg, setErrorMsg] = useState("");
  const [transactionData, setTransactionData] = useState(null);
  const [searchParams] = useSearchParams();
  let refId = searchParams.get("refId");
  let subId = searchParams.get("subId");

  const handleBack = () => {
    navigate("/dashboard/subscriptions");
    setShowModal(false);
  };

  const handleGoDashboard = () => {
    navigate("/dashboard");
    setShowModal(false);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (refId && user && subId) {
      setErrorMsg("");
      const fetchStatus = async () => {
        try {
          const { data } = await axios.post(
            `${BASE_URL}/paygic/validatePayment`,
            {
              userId: user.id,
              merchantReferenceId: refId,
              subId,
            }
          );
          
          if (data.success) {
            setStatus("success");
            setTransactionData(data.data);
            
            // Auto-close modal after 5 seconds on success
            setTimeout(() => {
              navigate("/dashboard");
            }, 5000);
          } else {
            setStatus("failed");
            setErrorMsg(data.message || "Payment validation failed");
          }
        } catch (err) {
          console.error(err);
          setStatus("failed");
          setErrorMsg(err.response?.data?.message || "An unexpected error occurred");
        }
      };

      fetchStatus();
    }
  }, [refId, user, subId, navigate]);

  if (!subId || !refId) {
    return <Navigate to="/dashboard/subscriptions" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center font-sans">
          {/* Backdrop with blur effect */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" 
            onClick={handleBack} 
          />

          {/* Modal Content */}
          <div className="relative z-50 w-full max-w-md mx-auto animate-[fadeInUp_0.4s_ease-out]">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
              {/* Modal Header */}
              <div className={`p-6 text-center ${
                status === "loading" 
                  ? "bg-gradient-to-r from-blue-50 to-blue-100" 
                  : status === "success" 
                  ? "bg-gradient-to-r from-green-50 to-green-100" 
                  : "bg-gradient-to-r from-red-50 to-red-100"
              }`}>
                {status === "loading" && (
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
                        <Loader2 className="w-10 h-10 text-white animate-spin" />
                      </div>
                      <div className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Processing Payment
                    </h2>
                    <p className="text-gray-600">
                      Please wait while we confirm your transaction
                    </p>
                  </div>
                )}

                {status === "success" && (
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-600 to-green-700 flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border-4 border-green-500 flex items-center justify-center">
                        <Shield className="w-3 h-3 text-green-600" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Payment Successful!
                    </h2>
                    <p className="text-gray-600">
                      Your subscription has been activated successfully
                    </p>
                  </div>
                )}

                {status === "failed" && (
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center">
                        <XCircle className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Payment Failed
                    </h2>
                    <p className="text-gray-600">
                      We couldn't process your payment
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {status === "loading" && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Verifying with payment gateway...
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reference ID</span>
                        <span className="font-mono text-sm font-medium text-gray-900">{refId?.slice(-8)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status</span>
                        <span className="text-blue-600 font-medium">Processing</span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-1.5 rounded-full animate-pulse"></div>
                      </div>
                      <p className="text-center text-sm text-gray-500 mt-2">
                        Please don't close this window
                      </p>
                    </div>
                  </div>
                )}

                {status === "success" && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Transaction completed successfully
                      </div>
                    </div>

                    {transactionData && (
                      <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-4 border border-green-100">
                        <h3 className="font-bold text-gray-900 mb-3">Transaction Details</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Reference ID</span>
                            <span className="font-mono text-sm font-medium text-gray-900">{refId?.slice(-8)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status</span>
                            <span className="text-green-600 font-bold">Completed</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date & Time</span>
                            <span className="text-sm text-gray-900">
                              {new Date().toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Subscription activated immediately</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Full access granted to all features</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Receipt sent to your email</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500 text-center">
                        You will be redirected to dashboard in 5 seconds...
                      </p>
                    </div>
                  </div>
                )}

                {status === "failed" && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full text-sm">
                        <XCircle className="w-4 h-4" />
                        Transaction could not be completed
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-4 border border-red-100">
                      <h3 className="font-bold text-gray-900 mb-3">Error Details</h3>
                      <p className="text-red-600 text-sm mb-3">{errorMsg}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Reference ID</span>
                          <span className="font-mono text-sm font-medium text-gray-900">{refId?.slice(-8)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status</span>
                          <span className="text-red-600 font-bold">Failed</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-sm">Payment was not processed</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-sm">No charges were made to your account</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-sm">Please try again or use a different payment method</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500 text-center mb-4">
                        If this error persists, please contact support
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col gap-3">
                  {status === "loading" && (
                    <button
                      onClick={handleBack}
                      className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-semibold"
                    >
                      Cancel Payment
                    </button>
                  )}

                  {status === "success" && (
                    <>
                      <button
                        onClick={handleGoDashboard}
                        className="w-full py-3.5 px-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg transition-all duration-200 font-bold flex items-center justify-center gap-2"
                      >
                        Go to Dashboard
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleBack}
                        className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                      >
                        View Subscriptions
                      </button>
                    </>
                  )}

                  {status === "failed" && (
                    <>
                      <button
                        onClick={handleRetry}
                        className="w-full py-3.5 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 shadow-md hover:shadow-lg transition-all duration-200 font-bold flex items-center justify-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                      </button>
                      <button
                        onClick={handleBack}
                        className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium flex items-center justify-center gap-2"
                      >
                        <CreditCard className="w-4 h-4" />
                        Choose Different Plan
                      </button>
                    </>
                  )}
                </div>

                {/* Help Section */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span>Secure payment processed by</span>
                    <span className="font-semibold text-gray-700">CallBell</span>
                  </div>
                  <p className="text-xs text-gray-400 text-center mt-2">
                    Need help? Contact callbellwala@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Background Content (visible when modal closes) */}
      {!showModal && (
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center mb-6">
            <Home className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Redirecting...
          </h1>
          <p className="text-gray-600">
            Taking you back to your dashboard
          </p>
        </div>
      )}
    </div>
  );
};

export default Success;
