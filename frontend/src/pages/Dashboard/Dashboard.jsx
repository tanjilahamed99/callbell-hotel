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

const Dashboard = () => {
  useBrandFonts();
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
    <div
      className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8"
      style={{ fontFamily: "'Inter', ui-sans-serif, sans-serif" }}>
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-[#b8892b] to-[#8a651c] animate-pulse mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-[#b8892b]/20 border-t-[#c9a24b] rounded-full animate-spin"></div>
              </div>
            </div>
            <p className="text-[#f1ece2]/60 mt-4 font-medium">
              Loading your dashboard...
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {/* Welcome Header */}
          <div className="rounded-2xl border border-[#b8892b]/20 bg-gradient-to-r from-[#16222f] via-[#101820] to-[#0e161e] p-4 sm:p-6 md:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#b8892b]/15 border border-[#b8892b]/30 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-[#c9a24b]" />
                  </div>
                  <h1
                    className="text-2xl sm:text-3xl md:text-4xl text-[#f1ece2]"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontWeight: 600,
                    }}>
                    Welcome back,{" "}
                    <span className="text-[#c9a24b]">
                      {user?.name?.split(" ")[0] || "User"}
                    </span>
                  </h1>
                </div>
                <p className="text-[#f1ece2]/50 text-sm sm:text-base max-w-2xl">
                  Here's your account overview.
                </p>
                <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-[#f1ece2]/60">
                      Account active
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-[#f1ece2]/60">
                      Online now
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-[#b8892b]/20 rounded-2xl blur-lg"></div>
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-gradient-to-br from-[#b8892b] to-[#8a651c] border-4 border-[#0a0f15]/40 flex items-center justify-center text-[#0a0f15] text-2xl sm:text-3xl font-bold">
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
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-4 border-[#101820]"></div>
              </div>
            </div>
          </div>

          {/* Account Info — row design */}
          <div className="rounded-2xl border border-[#b8892b]/20 bg-gradient-to-br from-[#16222f]/90 via-[#0e161e]/90 to-[#16222f]/90 shadow-xl overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-[#b8892b]/15 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#b8892b] to-[#8a651c] flex items-center justify-center">
                <User className="w-5 h-5 text-[#0a0f15]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#f1ece2]">
                  Account Information
                </h2>
                <p className="text-xs text-[#f1ece2]/45">
                  Your basic account details
                </p>
              </div>
            </div>

            <div className="divide-y divide-[#b8892b]/10">
              {infoRows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between px-4 sm:px-6 py-3.5">
                  <div className="flex items-center gap-2.5 text-[#f1ece2]/50">
                    <row.icon className="w-4 h-4 text-[#c9a24b]/70" />
                    <span className="text-sm">{row.label}</span>
                  </div>
                  <span className="text-sm font-medium text-[#f1ece2] truncate max-w-[60%] text-right">
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
