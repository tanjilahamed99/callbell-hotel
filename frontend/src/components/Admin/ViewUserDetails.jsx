import {
  X,
  Clock,
  CreditCard,
  Award,
  Calendar,
  Zap,
  UserPlus,
} from "lucide-react";
import QrCode from "../Dashboard/QrCode";
import { Link } from "react-router-dom";

const ViewUserDetails = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  // Helper function to calculate remaining days
  const getRemainingDays = (endDate) => {
    if (!endDate) return 0;
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Helper function to get status color
  const getStatusColor = (days) => {
    if (days === 0) return "text-gray-600";
    if (days <= 3) return "text-red-600";
    if (days <= 7) return "text-orange-500";
    return "text-green-600";
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with fade-in animation */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-out animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal with slide-up animation */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ease-out animate-slideUp max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-gray-900 truncate">
                  User Details
                </h2>
                <p className="text-sm text-gray-600 truncate">
                  {user?.name || "User information"}
                </p>
              </div>
            </div>
            <button
              onClick={() => onClose(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              aria-label="Close modal">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* User Info Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-gray-400" />
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-500">
                    Name
                  </span>
                </div>
                <p className="text-lg font-semibold text-gray-900 truncate">
                  {user?.name || "N/A"}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-500">
                    Email
                  </span>
                </div>
                <p className="text-lg font-semibold text-gray-900 truncate">
                  {user?.email || "N/A"}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-500">
                    Phone
                  </span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {user?.phone || "N/A"}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-500">
                    Role
                  </span>
                </div>
                <span
                  className={`text-lg font-semibold ${
                    user?.role === "admin" ? "text-red-600" : "text-blue-600"
                  }`}>
                  {user?.role || "user"}
                </span>
              </div>
            </div>
          </div>

          {/* Account Status Section */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-gray-400" />
              Account Status
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-700">
                    Joined
                  </span>
                  <Calendar className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-lg font-semibold text-blue-900">
                  {formatDate(user?.createdAt)}
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-700">
                    Transactions
                  </span>
                  <CreditCard className="w-4 h-4 text-purple-500" />
                </div>
                <p className="text-lg font-semibold text-purple-900">
                  {user?.transactionHistory?.length || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Subscription Section */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-gray-400" />
              Subscription Details
            </h3>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-700">
                    Subscription Ends
                  </span>
                  <Calendar className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-lg font-semibold text-green-900">
                  {user?.subscription?.endDate
                    ? formatDate(user.subscription.endDate)
                    : "No active subscription"}
                </p>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-orange-700">
                    Remaining Days
                  </span>
                  <Clock className="w-4 h-4 text-orange-500" />
                </div>
                <div className="flex items-center justify-between">
                  <p
                    className={`text-xl font-bold ${getStatusColor(getRemainingDays(user?.subscription?.endDate))}`}>
                    {user?.subscription?.endDate
                      ? `${getRemainingDays(user.subscription.endDate)} days`
                      : "N/A"}
                  </p>
                  {getRemainingDays(user?.subscription?.endDate) <= 7 && (
                    <span className="text-xs font-semibold px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
                      Expiring Soon
                    </span>
                  )}
                </div>
                {user?.subscription?.endDate && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          getRemainingDays(user.subscription.endDate) <= 7
                            ? "bg-red-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            (getRemainingDays(user.subscription.endDate) / 30) *
                              100,
                          )}%`,
                        }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={"/admin/credit"}
              className="flex-1 bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <Award className="w-5 h-5" />
              Give Credits
            </Link>
            <button
              onClick={() => onClose(false)}
              className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors">
              Close
            </button>
          </div>
        </div>

        <QrCode user={user} />
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ViewUserDetails;
