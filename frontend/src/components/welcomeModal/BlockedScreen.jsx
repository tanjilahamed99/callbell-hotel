import { useNavigate } from "react-router-dom";
import { ShieldX, Home, Phone } from "lucide-react";

const BlockedScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="relative inline-flex mb-8">
          <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center">
            <ShieldX className="w-12 h-12 text-red-500" />
          </div>
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">!</span>
          </span>
        </div>

        {/* Text */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Access Denied</h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-2">
          You have been restricted from accessing this platform.
        </p>
        <p className="text-gray-400 text-xs leading-relaxed mb-8 max-w-xs mx-auto">
          If you believe this is a mistake, please contact the user directly
          through another channel.
        </p>

        {/* Divider */}
        <div className="w-12 h-0.5 bg-red-200 mx-auto mb-8 rounded-full" />

        {/* Button */}
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-xl transition">
          <Home className="w-4 h-4" />
          Back to Home
        </button>

        {/* Footer brand */}
        <div className="mt-12 flex items-center justify-center gap-2 text-gray-300">
          <div className="w-6 h-6 bg-gray-200 rounded-md flex items-center justify-center">
            <Phone className="w-3 h-3 text-gray-400" />
          </div>
          <span className="text-xs text-gray-400">CallBell</span>
        </div>
      </div>
    </div>
  );
};

export default BlockedScreen;
