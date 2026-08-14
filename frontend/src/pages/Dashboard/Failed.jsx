import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  XCircle, 
  RefreshCw, 
  CreditCard, 
  Shield, 
  Home, 
  HelpCircle,
  AlertTriangle,
  ArrowLeft,
  ExternalLink
} from "lucide-react";

const Failed = () => {
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();

  const handleTryAgain = () => {
    navigate("/dashboard/subscriptions");
    setShowModal(false);
  };

  const handleGoHome = () => {
    navigate("/");
    setShowModal(false);
  };

  const handleContactSupport = () => {
    window.open("mailto:support@callbell.com", "_blank");
  };

  const handleViewFAQ = () => {
    navigate("/help/payment-faq");
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center font-sans">
          {/* Backdrop with blur effect */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" 
            onClick={handleTryAgain} 
          />

          {/* Modal Content */}
          <div className="relative z-50 w-full max-w-md mx-auto animate-[fadeInUp_0.4s_ease-out]">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-red-50 via-red-100 to-orange-50 p-6 text-center border-b border-red-100">
                <div className="relative mb-4">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center">
                    <XCircle className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-white border-4 border-orange-500 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Payment Failed
                </h2>
                <p className="text-gray-600">
                  We couldn't process your payment at this time
                </p>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="space-y-6">
                  {/* Error Message */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full text-sm font-medium">
                      <XCircle className="w-4 h-4" />
                      Transaction could not be completed
                    </div>
                  </div>

                  {/* Possible Reasons */}
                  <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-4 border border-red-100">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      Possible Reasons
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                        </div>
                        <span className="text-sm text-gray-700">Insufficient funds in your account</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                        </div>
                        <span className="text-sm text-gray-700">Incorrect card details entered</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                        </div>
                        <span className="text-sm text-gray-700">Bank server temporarily unavailable</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                        </div>
                        <span className="text-sm text-gray-700">Transaction declined by your bank</span>
                      </li>
                    </ul>
                  </div>

                  {/* What to do next */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <RefreshCw className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm">Try again with the same payment method</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm">Use a different payment method or card</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <HelpCircle className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm">Contact your bank for authorization issues</span>
                    </div>
                  </div>

                  {/* Security Assurance */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span>Your card was not charged. All transactions are secured with 256-bit encryption.</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 space-y-3">
                  <button
                    onClick={handleTryAgain}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 shadow-md hover:shadow-lg transition-all duration-200 font-bold flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Payment Again
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={handleGoHome}
                      className="py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium flex items-center justify-center gap-2"
                    >
                      <Home className="w-4 h-4" />
                      Go Home
                    </button>
                    <button
                      onClick={handleContactSupport}
                      className="py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Contact Support
                    </button>
                  </div>

                  <button
                    onClick={handleViewFAQ}
                    className="w-full py-3 px-4 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2"
                  >
                    <HelpCircle className="w-4 h-4" />
                    View Payment FAQ
                  </button>
                </div>

                {/* Help Section */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-600 text-center">
                    Need immediate assistance?
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-2">
                    <a 
                      href="mailto:callbellwala@gmail.com" 
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      callbellwala@gmail.com
                    </a>
                    <span className="hidden sm:inline text-gray-400">•</span>
                    <a 
                      href="tel:+918299065387" 
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      +91-8299065387
                    </a>
                  </div>
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
            <ArrowLeft className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Redirecting...
          </h1>
          <p className="text-gray-600">
            Taking you back to subscriptions
          </p>
        </div>
      )}
    </div>
  );
};

export default Failed;
