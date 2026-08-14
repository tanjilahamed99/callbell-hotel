import React, { useState } from "react";
import {
  X,
  Clock,
  CreditCard,
  Award,
  Calendar,
  Zap,
  UserPlus,
} from "lucide-react";

const GiveCreditModal = ({ isOpen, onClose, onSubmit, user }) => {
  const [formData, setFormData] = useState({
    duration: "",
    minute: "",
    subscriptionType: "Credit",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.duration || !formData.minute || !formData.subscriptionType) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
      });
      setFormData({ duration: "", minute: "", subscriptionType: "Credit" });
      onClose();
    } catch (error) {
      console.error("Error submitting credits:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Give Credits
                </h2>
                <p className="text-sm text-gray-600">
                  Assign credits to {user?.name || "user"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Duration Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Duration (Days)</span>
              </div>
            </label>
            <div className="relative">
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="1"
                max="365"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                placeholder="Enter number of days"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <div className="w-6 h-6 rounded bg-red-50 flex items-center justify-center">
                  <Calendar className="w-3 h-3 text-red-600" />
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              {[7, 30, 90].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      duration: days.toString(),
                    }))
                  }
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    formData.duration === days.toString()
                      ? "bg-red-100 text-red-700 border border-red-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}>
                  {days} days
                </button>
              ))}
            </div>
          </div>

          {/* Minutes Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Minutes</span>
              </div>
            </label>
            <div className="relative">
              <input
                type="number"
                name="minute"
                value={formData.minute}
                onChange={handleChange}
                min="1"
                max="10000"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                placeholder="Enter minutes allocation"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center">
                  <Clock className="w-3 h-3 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              {[20, 50, 100].map((minutes) => (
                <button
                  key={minutes}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      minute: minutes.toString(),
                    }))
                  }
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    formData.minute === minutes.toString()
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}>
                  {minutes} min
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.duration || !formData.minute}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                loading || !formData.duration || !formData.minute
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-600 to-orange-500 text-white hover:shadow-lg hover:shadow-red-500/30"
              }`}>
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Give Credits
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GiveCreditModal;
