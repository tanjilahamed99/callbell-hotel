import { useEffect, useState } from "react";
import { useCall } from "../../Provider/Provider";
import myData from "../../hooks/users/myData";
import {
  Mail,
  Phone as PhoneIcon,
  MapPin,
  Shield,
  CheckCircle,
  Activity,
  Zap,
  User,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useCall();
  const [myInfo, setMyInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const getInitials = (name) =>
    name
      ?.split(" ")
      ?.map((n) => n[0])
      ?.slice(0, 2)
      ?.join("")
      ?.toUpperCase() || "U";

  useEffect(() => {
    if (user) {
      const fetch = async () => {
        setLoading(true);
        const { data } = await myData({ id: user.id });
        if (data.success) {
          setMyInfo(data.data);
        }
        setLoading(false);
      };
      fetch();
    }
  }, [user]);

  const infoRows = [
    { label: "Email", value: myInfo?.email, icon: Mail },
    { label: "Phone", value: myInfo?.phone, icon: PhoneIcon },
    { label: "Address", value: myInfo?.address, icon: MapPin },
    { label: "Department", value: myInfo?.department, icon: Shield },
  ];

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 bg-white">
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-blue-600 to-teal-500 animate-pulse mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-teal-500 rounded-full animate-spin"></div>
              </div>
            </div>
            <p className="text-gray-500 mt-4 font-medium">
              Loading your dashboard...
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {/* Welcome Header */}
          <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-blue-50 via-white to-teal-50 p-4 sm:p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center shadow-sm">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                    Welcome back,{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                      {user?.name?.split(" ")[0] || "User"}
                    </span>
                  </h1>
                </div>
                <p className="text-gray-500 text-sm sm:text-base max-w-2xl">
                  Here's your account overview.
                </p>
                <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-gray-600">
                      Account active
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-gray-600">
                      Online now
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-blue-200/40 rounded-2xl blur-lg"></div>
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-gradient-to-br from-blue-600 to-teal-500 border-4 border-white shadow-md flex items-center justify-center text-white text-2xl sm:text-3xl font-bold">
                  {myInfo?.image ? (
                    <img
                      src={myInfo?.image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getInitials(user?.name)
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-4 border-white"></div>
              </div>
            </div>
          </div>

          {/* Account Info — row design */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center shadow-sm">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Account Information
                </h2>
                <p className="text-xs text-gray-500">
                  Your basic account details
                </p>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {infoRows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between px-4 sm:px-6 py-3.5">
                  <div className="flex items-center gap-2.5 text-gray-500">
                    <row.icon className="w-4 h-4 text-teal-600" />
                    <span className="text-sm">{row.label}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 truncate max-w-[60%] text-right">
                    {row.value || "Not set"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;