import { X, Calendar, CreditCard, Award, UserPlus, Shield } from "lucide-react";

const ViewUserDetails = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0a0f15]/70 backdrop-blur-sm transition-opacity duration-300 ease-out animate-fadeIn"
        onClick={() => onClose(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md max-h-[90vh] flex flex-col rounded-2xl border border-[#b8892b]/20 bg-gradient-to-br from-[#16222f] via-[#101820] to-[#0e161e] shadow-2xl overflow-hidden transform transition-all duration-300 ease-out animate-slideUp">
        {/* Header */}
        <div className="flex-shrink-0 p-5 sm:p-6 border-b border-[#b8892b]/15">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-gradient-to-r from-[#b8892b] to-[#8a651c] flex-shrink-0">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-[#0a0f15]" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-[#f1ece2] truncate">
                  User Details
                </h2>
                <p className="text-sm text-[#f1ece2]/45 truncate">
                  {user?.name || "User information"}
                </p>
              </div>
            </div>
            <button
              onClick={() => onClose(false)}
              className="p-2 hover:bg-[#b8892b]/10 rounded-lg transition-colors flex-shrink-0"
              aria-label="Close modal">
              <X className="w-5 h-5 text-[#f1ece2]/50" />
            </button>
          </div>
        </div>

        {/* Content — scrollable */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-[#f1ece2] flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#c9a24b]/70" />
              Basic Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-lg border border-[#b8892b]/15 bg-[#0a0f15]/50 p-4">
                <span className="text-xs font-medium text-[#f1ece2]/40 uppercase tracking-wide">
                  Name
                </span>
                <p className="text-base sm:text-lg font-semibold text-[#f1ece2] truncate mt-1">
                  {user?.name || "N/A"}
                </p>
              </div>

              <div className="rounded-lg border border-[#b8892b]/15 bg-[#0a0f15]/50 p-4">
                <span className="text-xs font-medium text-[#f1ece2]/40 uppercase tracking-wide">
                  Email
                </span>
                <p className="text-base sm:text-lg font-semibold text-[#f1ece2] truncate mt-1">
                  {user?.email || "N/A"}
                </p>
              </div>

              <div className="rounded-lg border border-[#b8892b]/15 bg-[#0a0f15]/50 p-4">
                <span className="text-xs font-medium text-[#f1ece2]/40 uppercase tracking-wide">
                  Phone
                </span>
                <p className="text-base sm:text-lg font-semibold text-[#f1ece2] mt-1">
                  {user?.phone || "N/A"}
                </p>
              </div>

              <div className="rounded-lg border border-[#b8892b]/15 bg-[#0a0f15]/50 p-4">
                <span className="text-xs font-medium text-[#f1ece2]/40 uppercase tracking-wide">
                  Role
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  {user?.role === "admin" && (
                    <Shield className="w-4 h-4 text-[#c9a24b]" />
                  )}
                  <span
                    className={`text-base sm:text-lg font-semibold ${
                      user?.role === "admin"
                        ? "text-[#c9a24b]"
                        : "text-[#f1ece2]"
                    }`}>
                    {user?.role || "user"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="space-y-4 pt-4 border-t border-[#b8892b]/15">
            <h3 className="text-base sm:text-lg font-semibold text-[#f1ece2] flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#c9a24b]/70" />
              Account Status
            </h3>

            <div className="rounded-lg border border-[#b8892b]/15 bg-[#0a0f15]/50 p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-[#f1ece2]/50">
                  Joined
                </span>
                <Calendar className="w-4 h-4 text-[#c9a24b]/60" />
              </div>
              <p className="text-base sm:text-lg font-semibold text-[#f1ece2]">
                {formatDate(user?.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-[#b8892b]/15 p-4 sm:p-5">
          <button
            onClick={() => onClose(false)}
            className="w-full border border-[#b8892b]/20 text-[#f1ece2]/70 font-semibold py-3 px-6 rounded-lg hover:bg-[#b8892b]/10 transition-colors">
            Close
          </button>
        </div>
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