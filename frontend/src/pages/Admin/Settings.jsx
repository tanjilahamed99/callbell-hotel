import axios from "axios";
import { useEffect, useState } from "react";
import { useCall } from "../../Provider/Provider";
import getPaygicInfo from "../../hooks/admin/getPaygicInfo";
import getWebsiteData from "../../hooks/admin/getWebisteData";
import { BASE_URL } from "../../config/constant";
import Swal from "sweetalert2";
import addNewWebsiteData from "../../hooks/admin/addNewSub";
import getAllLiveKit from "../../hooks/admin/getAdminLiveKit";
import {
  CreditCard,
  Key,
  Lock,
  Globe,
  Settings as SettingsIcon,
  ToggleLeft,
  ToggleRight,
  Save,
  RefreshCw,
  Shield,
  Server,
  Link,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import { updatePaymentCredentials } from "../../hooks/admin/payment";

const Settings = () => {
  const [refetch, setRefetch] = useState(false);
  const { user } = useCall();
  const [reUpdate, setReUpdate] = useState(true);
  const [paygicMid, setPaygicMid] = useState("");
  const [paygicpassword, setPaygicPassword] = useState("");
  const [paygicStatus, setPaygicStatus] = useState(false);

  const [razorpayStatus, setRazorpayStatus] = useState(false);
  const [razorpayKey, setRazorpayKey] = useState("");
  const [razorpaySecret, setRazorpaySecret] = useState("");

  const [liveKitUrl, setLiveKitUrl] = useState("");
  const [liveKitKey, setLiveKitKey] = useState("");
  const [liveKitSecret, setLiveKitSecret] = useState("");
  const [loading, setLoading] = useState({
    payment: false,
    paygic: false,
    livekit: false,
    razorpay: false,
  });

  const [showPasswords, setShowPasswords] = useState({
    paygic: false,
    livekit: false,
    razorpay: false,
  });

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleUpdatePayGicCredential = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, paygic: true }));

    const mid = e.target.mid.value;
    const password = e.target.password.value;

    try {
      const updateData = {
        type: "paygic",
        mid,
        password,
      };

      const { data } = await updatePaymentCredentials({
        email: user.email,
        userId: user.id,
        data: updateData,
      });

      if (data.success) {
        setReUpdate(!reUpdate);
        Swal.fire({
          title: "Success!",
          text: "PayGic credentials updated successfully.",
          icon: "success",
          confirmButtonColor: "#dc2626",
          background: "#ffffff",
          color: "#1f2937",
          showConfirmButton: true,
          timer: 3000,
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update PayGic credentials. Please try again.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading((prev) => ({ ...prev, paygic: false }));
    }
  };

  const handleUpdateRazorpayCredential = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, razorpay: true }));

    const key = e.target.key.value;
    const secret = e.target.secret.value;

    try {
      const updateData = {
        type: "razorpay",
        key,
        secret,
      };

      const { data } = await updatePaymentCredentials({
        email: user.email,
        userId: user.id,
        data: updateData,
      });

      if (data.success) {
        setReUpdate(!reUpdate);
        Swal.fire({
          title: "Success!",
          text: "Razorpay credentials updated successfully.",
          icon: "success",
          confirmButtonColor: "#dc2626",
          background: "#ffffff",
          color: "#1f2937",
          showConfirmButton: true,
          timer: 3000,
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update razorpay credentials. Please try again.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading((prev) => ({ ...prev, razorpay: false }));
    }
  };

  const handleUpdatePaymentSystem = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, payment: true }));

    const paygic = e.target.paygicEnabled.checked;
    const razorpay = e.target.razorpayEnabled.checked;

    try {
      const { data } = await addNewWebsiteData(user.id, user.email, {
        paymentMethod: {
          paygic,
          razorpay,
        },
      });

      if (data.success) {
        setRefetch(!refetch);
        Swal.fire({
          title: "Success!",
          text: `Payment method updated.`,
          icon: "success",
          confirmButtonColor: "#dc2626",
          showConfirmButton: true,
          timer: 3000,
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update payment system. Please try again.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading((prev) => ({ ...prev, payment: false }));
    }
  };

  const handleUpdateLiveKitCredential = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, livekit: true }));

    const url = e.target.url.value;
    const key = e.target.key.value;
    const secret = e.target.secret.value;

    try {
      const { data } = await axios.put(
        `${BASE_URL}/admin/livekit/set/${user.id}/${user.email}`,
        {
          url,
          key,
          secret,
        },
      );
      if (data.success) {
        setReUpdate(!reUpdate);
        Swal.fire({
          title: "Success!",
          text: "LiveKit credentials updated successfully.",
          icon: "success",
          confirmButtonColor: "#dc2626",
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
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading((prev) => ({ ...prev, livekit: false }));
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getWebsiteData();
        if (data.success) {
          setPaygicStatus(data.data.paymentMethod?.paygic || false);
          setRazorpayStatus(data.data.paymentMethod?.razorpay || false);
        }
      } catch (error) {
        console.error("Error fetching payment status:", error);
      }
    };
    fetch();
  }, [refetch]);

  useEffect(() => {
    const fetchPaygic = async () => {
      try {
        const { data: res } = await getPaygicInfo(user.id, user.email);

        if (res?.success) {
          setPaygicMid(res?.data.paygic.mid || "");
          setPaygicPassword(res?.data.paygic.password || "");
          setRazorpayKey(res.data.razorpay.key || "");
          setRazorpaySecret(res.data.razorpay.secret || "");
        }
      } catch (error) {
        console.error("Error fetching PayGic info:", error);
      }
    };

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

    if (user) {
      fetchPaygic();
      fetchLiveKit();
    }
  }, [user, reUpdate]);

  const StatusIndicator = ({ status }) => (
    <div className="flex items-center gap-2">
      <div
        className={`w-2 h-2 rounded-full ${
          status ? "bg-green-500 animate-pulse" : "bg-gray-400"
        }`}></div>
      <span
        className={`text-sm font-medium ${
          status ? "text-green-600" : "text-gray-500"
        }`}>
        {status ? "Active" : "Inactive"}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-red-50">
              <SettingsIcon className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                System Settings
              </h1>
              <p className="text-gray-600 mt-1">
                Configure payment gateways and service integrations
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Payment Types */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Types Card */}
            <form
              onSubmit={handleUpdatePaymentSystem}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-red-50">
                      <CreditCard className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Payment Gateway Settings
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Enable or disable payment methods
                      </p>
                    </div>
                  </div>
                  {/* <StatusIndicator status={paygicStatus} /> */}
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {/* PayGic Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50/50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                        <CreditCard className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">PayGic</h3>
                        <p className="text-sm text-gray-500">
                          Payment gateway integration
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="paygicEnabled"
                        checked={paygicStatus}
                        onChange={(e) => setPaygicStatus(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-600"></div>
                      <div className="absolute left-1 top-1 flex items-center justify-center w-6 h-6 rounded-full transition-transform peer-checked:translate-x-7">
                        {paygicStatus ? (
                          <Check className="w-3 h-3 text-white" />
                        ) : (
                          <X className="w-3 h-3 text-gray-400" />
                        )}
                      </div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50/50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                        <CreditCard className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Razorpay</h3>
                        <p className="text-sm text-gray-500">
                          Payment gateway integration
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="razorpayEnabled"
                        checked={razorpayStatus}
                        onChange={(e) => setRazorpayStatus(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-600"></div>
                      <div className="absolute left-1 top-1 flex items-center justify-center w-6 h-6 rounded-full transition-transform peer-checked:translate-x-7">
                        {paygicStatus ? (
                          <Check className="w-3 h-3 text-white" />
                        ) : (
                          <X className="w-3 h-3 text-gray-400" />
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading.payment}
                  className="mt-6 w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all shadow-sm hover:shadow">
                  {loading.payment ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Update Payment Settings
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* PayGic Credentials Card */}
            <form
              onSubmit={handleUpdatePayGicCredential}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-purple-50">
                    <Key className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      PayGic API Credentials
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Configure PayGic merchant account
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* MID Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                          <Key className="w-4 h-4 text-gray-500" />
                          Merchant ID (MID)
                        </div>
                      </label>
                      <div className="relative">
                        <input
                          defaultValue={paygicMid}
                          name="mid"
                          required
                          className="w-full pl-10 pr-4 py-3  rounded-lg border border-gray-300  text-gray-900  focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                          placeholder="Enter your Merchant ID"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-6 h-6 rounded bg-purple-50 flex items-center justify-center">
                            <Key className="w-3 h-3 text-purple-600" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Password Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-gray-500" />
                          API Password
                        </div>
                      </label>
                      <div className="relative">
                        <input
                          defaultValue={paygicpassword}
                          name="password"
                          type={showPasswords.paygic ? "text" : "password"}
                          required
                          className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                          placeholder="Enter your API password"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-6 h-6 rounded bg-purple-50 flex items-center justify-center">
                            <Lock className="w-3 h-3 text-purple-600" />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("paygic")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPasswords.paygic ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading.paygic}
                  className="mt-6 w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all shadow-sm hover:shadow">
                  {loading.paygic ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Update PayGic Credentials
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* razorpay credentials card */}
            <form
              onSubmit={handleUpdateRazorpayCredential}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-purple-50">
                    <Key className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Razorpay API Credentials
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Configure Razorpay merchant account
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* MID Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                          <Key className="w-4 h-4 text-gray-500" />
                          Key
                        </div>
                      </label>
                      <div className="relative">
                        <input
                          defaultValue={razorpayKey}
                          name="key"
                          required
                          className="w-full pl-10 pr-4 py-3  rounded-lg border border-gray-300  text-gray-900  focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                          placeholder="Enter your Merchant ID"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-6 h-6 rounded bg-purple-50 flex items-center justify-center">
                            <Key className="w-3 h-3 text-purple-600" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Password Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-gray-500" />
                          Secret
                        </div>
                      </label>
                      <div className="relative">
                        <input
                          defaultValue={razorpaySecret}
                          name="secret"
                          type={showPasswords.razorpay ? "text" : "password"}
                          required
                          className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                          placeholder="Enter your API password"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-6 h-6 rounded bg-purple-50 flex items-center justify-center">
                            <Lock className="w-3 h-3 text-purple-600" />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("razorpay")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPasswords.razorpay ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading.razorpay}
                  className="mt-6 w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all shadow-sm hover:shadow">
                  {loading.razorpay ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Update Razorpay Credentials
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column - LiveKit */}
          <div className="lg:col-span-1">
            <form
              onSubmit={handleUpdateLiveKitCredential}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-blue-50">
                    <Server className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      LiveKit Configuration
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Video conferencing service setup
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  {/* URL Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-500" />
                        LiveKit Server URL
                      </div>
                    </label>
                    <div className="relative">
                      <input
                        defaultValue={liveKitUrl}
                        name="url"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="https://your-livekit-server.com"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center">
                          <Link className="w-3 h-3 text-blue-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* API Key Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-gray-500" />
                        API Key
                      </div>
                    </label>
                    <div className="relative">
                      <input
                        defaultValue={liveKitKey}
                        name="key"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Enter your API key"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center">
                          <Key className="w-3 h-3 text-blue-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* API Secret Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-gray-500" />
                        API Secret
                      </div>
                    </label>
                    <div className="relative">
                      <input
                        defaultValue={liveKitSecret}
                        name="secret"
                        type={showPasswords.livekit ? "text" : "password"}
                        required
                        className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Enter your API secret"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center">
                          <Shield className="w-3 h-3 text-blue-600" />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("livekit")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPasswords.livekit ? (
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
                  disabled={loading.livekit}
                  className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all shadow-sm hover:shadow">
                  {loading.livekit ? (
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

                {/* Status Section */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          liveKitUrl && liveKitKey && liveKitSecret
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}></div>
                      <span className="text-sm text-gray-600">
                        {liveKitUrl && liveKitKey && liveKitSecret
                          ? "Configured"
                          : "Not Configured"}
                      </span>
                    </div>
                    {liveKitUrl && liveKitKey && liveKitSecret && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-700 font-medium">
                        Ready
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </form>

            {/* Information Card */}
            <div className="mt-6 bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-red-900 mb-1">
                    Important Notes
                  </h3>
                  <ul className="text-sm text-red-700 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5"></div>
                      <span>Credentials are encrypted and stored securely</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5"></div>
                      <span>Changes may take a few minutes to propagate</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5"></div>
                      <span>Test configurations before production use</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
