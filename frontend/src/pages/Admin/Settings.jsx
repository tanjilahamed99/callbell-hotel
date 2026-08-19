import axios from "axios";
import { useEffect, useState } from "react";
import { useCall } from "../../Provider/Provider";
import getAllLiveKit from "../../hooks/admin/getAdminLiveKit";
import { BASE_URL } from "../../config/constant";
import Swal from "sweetalert2";
import {
  Key,
  Lock,
  Globe,
  Settings as SettingsIcon,
  Save,
  RefreshCw,
  Shield,
  Server,
  Link as LinkIcon,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";

const Settings = () => {
  const { user } = useCall();
  const [reUpdate, setReUpdate] = useState(true);

  const [liveKitUrl, setLiveKitUrl] = useState("");
  const [liveKitKey, setLiveKitKey] = useState("");
  const [liveKitSecret, setLiveKitSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const handleUpdateLiveKitCredential = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url = e.target.url.value;
    const key = e.target.key.value;
    const secret = e.target.secret.value;

    try {
      const { data } = await axios.put(
        `${BASE_URL}/admin/livekit/set/${user.id}/${user.email}`,
        { url, key, secret },
      );
      if (data.success) {
        setReUpdate(!reUpdate);
        Swal.fire({
          title: "Success!",
          text: "LiveKit credentials updated successfully.",
          icon: "success",
          background: "#101820",
          color: "#eef2f7",
          confirmButtonColor: "#2563eb",
          showConfirmButton: true,
          timer: 3000,
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update LiveKit credentials. Please try again.",
        icon: "error",
        background: "#101820",
        color: "#eef2f7",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchLiveKit = async () => {
      try {
        const { data } = await getAllLiveKit(user.id, user.email);
        if (data.success) {
          setLiveKitUrl(data.data.url || "");
          setLiveKitKey(data.data.key || "");
          setLiveKitSecret(data.data.secret || "");
        }
      } catch (error) {
        console.error("Error fetching LiveKit info:", error);
      }
    };

    if (user) fetchLiveKit();
  }, [user, reUpdate]);

  return (
    <div
      className="p-4 sm:p-6"
      style={{ fontFamily: "'Inter', ui-sans-serif, sans-serif" }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <SettingsIcon className="w-7 h-7 text-teal-400" />
            </div>
            <div>
              <h1
                className="text-2xl md:text-3xl text-[#eef2f7]"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 600,
                }}>
                System Settings
              </h1>
              <p className="text-[#eef2f7]/45 mt-1">
                Configure your video calling service
              </p>
            </div>
          </div>
        </div>

        {/* LiveKit Card */}
        <form
          onSubmit={handleUpdateLiveKitCredential}
          className="rounded-2xl border border-blue-500/20 bg-[#0a0f15]/40 overflow-hidden">
          <div className="p-6 border-b border-blue-500/15">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <Server className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#eef2f7]">
                  LiveKit Configuration
                </h2>
                <p className="text-sm text-[#eef2f7]/45 mt-1">
                  Video conferencing service setup
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              {/* URL */}
              <div>
                <label className="block text-sm font-medium text-[#eef2f7]/60 mb-2">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-teal-400/70" />
                    LiveKit Server URL
                  </div>
                </label>
                <div className="relative">
                  <input
                    defaultValue={liveKitUrl}
                    name="url"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-blue-500/20 bg-[#0a0f15]/60 text-[#eef2f7] placeholder-[#eef2f7]/30 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                    placeholder="https://your-livekit-server.com"
                  />
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400/50" />
                </div>
              </div>

              {/* API Key */}
              <div>
                <label className="block text-sm font-medium text-[#eef2f7]/60 mb-2">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-teal-400/70" />
                    API Key
                  </div>
                </label>
                <div className="relative">
                  <input
                    defaultValue={liveKitKey}
                    name="key"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-blue-500/20 bg-[#0a0f15]/60 text-[#eef2f7] placeholder-[#eef2f7]/30 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                    placeholder="Enter your API key"
                  />
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400/50" />
                </div>
              </div>

              {/* API Secret */}
              <div>
                <label className="block text-sm font-medium text-[#eef2f7]/60 mb-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-teal-400/70" />
                    API Secret
                  </div>
                </label>
                <div className="relative">
                  <input
                    defaultValue={liveKitSecret}
                    name="secret"
                    type={showSecret ? "text" : "password"}
                    required
                    className="w-full pl-10 pr-10 py-3 rounded-lg border border-blue-500/20 bg-[#0a0f15]/60 text-[#eef2f7] placeholder-[#eef2f7]/30 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                    placeholder="Enter your API secret"
                  />
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400/50" />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#eef2f7]/30 hover:text-teal-400">
                    {showSecret ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-teal-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-[0_10px_30px_-8px_rgba(37,99,235,0.5)]">
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Update LiveKit Settings
                </>
              )}
            </button>

            {/* Status */}
            <div className="mt-6 pt-6 border-t border-blue-500/15">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      liveKitUrl && liveKitKey && liveKitSecret
                        ? "bg-emerald-500"
                        : "bg-[#eef2f7]/20"
                    }`}></div>
                  <span className="text-sm text-[#eef2f7]/50">
                    {liveKitUrl && liveKitKey && liveKitSecret
                      ? "Configured"
                      : "Not Configured"}
                  </span>
                </div>
                {liveKitUrl && liveKitKey && liveKitSecret && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">
                    Ready
                  </span>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Info card */}
        <div className="mt-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-[#eef2f7] mb-1">
                Important Notes
              </h3>
              <ul className="text-sm text-[#eef2f7]/50 space-y-1.5">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-400/60 mt-1.5"></div>
                  <span>Credentials are encrypted and stored securely</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-400/60 mt-1.5"></div>
                  <span>Changes may take a few minutes to propagate</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-400/60 mt-1.5"></div>
                  <span>Test your configuration before going live</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;