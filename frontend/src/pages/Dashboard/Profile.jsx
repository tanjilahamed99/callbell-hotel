import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { useCall } from "../../Provider/Provider";
import updateUser from "../../hooks/users/updateUser";
import myData from "../../hooks/users/myData";
import QrCode from "../../components/Dashboard/QrCode";
import { Link } from "react-router-dom";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Edit2, 
  Save, 
  X,
  Shield,
  Calendar,
  Clock,
  CreditCard,
  QrCode as QrIcon,
  RefreshCw,
  Download,
  Share2,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [myInfo, setMyInfo] = useState(null);
  const { user } = useCall();
  const [refetch, setRefetch] = useState(false);

  // initials
  const initials = myInfo?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "U";

  // open file picker
  const handleUpdateClick = () => {
    fileInputRef.current.click();
  };

  // set new profile image
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMAGEBB_API_KEY
        }`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.success) {
        const imageUrl = data.data.url;
        const { data: res } = await updateUser({
          id: user.id,
          data: { image: imageUrl },
        });
        if (res.success) {
          Swal.fire({
            title: "Success!",
            text: "Profile picture updated successfully",
            icon: "success",
            confirmButtonColor: "#dc2626",
          });
          setRefetch(!refetch);
        }
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to upload image",
          icon: "error",
          confirmButtonColor: "#dc2626",
        });
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      Swal.fire({
        title: "Error",
        text: "Failed to upload image",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setUploading(false);
    }
  };

  // handle field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMyInfo((prev) => ({ ...prev, [name]: value }));
  };

  // save profile
  const handleSave = async () => {
    if (!myInfo?.name?.trim()) {
      Swal.fire({
        title: "Error",
        text: "Name cannot be empty",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    const { data } = await updateUser({ id: user.id, data: myInfo });
    if (data.success) {
      setIsEditing(false);
      Swal.fire({
        title: "Success!",
        text: "Profile updated successfully",
        icon: "success",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  const getRemainingDays = (endDate) => {
    if (!endDate) return 0;
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

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
  }, [user, refetch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-red-600 to-red-700 animate-pulse mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
            </div>
          </div>
          <p className="text-gray-600 mt-4 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  const remainingDays = getRemainingDays(myInfo?.subscription?.endDate);
  const hasActiveSubscription = remainingDays > 0 && myInfo?.subscription?.minute > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Profile <span className="text-red-600">Settings</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage your personal information and account settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  {/* Profile Image */}
                  <div className="relative">
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-gradient-to-br from-white/20 to-white/10 border-4 border-white/30">
                      {myInfo?.image ? (
                        <img
                          src={myInfo?.image}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-2xl sm:text-3xl md:text-4xl font-bold">
                          {initials}
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={handleUpdateClick}
                      disabled={uploading}
                      className={`absolute bottom-1 right-1 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-105 transition-all duration-200 ${
                        uploading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'
                      }`}
                    >
                      {uploading ? (
                        <RefreshCw className="w-4 h-4 text-red-600 animate-spin" />
                      ) : (
                        <Camera className="w-4 h-4 text-red-600" />
                      )}
                    </button>
                    
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>

                  {/* Profile Info */}
                  <div className="text-white flex-1 text-center sm:text-left">
                    <h2 className="text-xl sm:text-2xl font-bold mb-1 truncate">
                      {myInfo?.name || "User"}
                    </h2>
                    <p className="text-red-100 text-sm sm:text-base mb-3 truncate">
                      {myInfo?.email || "user@example.com"}
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        <Shield className="w-3 h-3" />
                        <span className="text-xs">Verified Account</span>
                      </div>
                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        <span className="text-xs">Active User</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-4 sm:p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={myInfo?.name || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 bg-gray-50 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-gray-900">{myInfo?.name || "Not set"}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <label className="text-sm font-medium text-gray-700">Email Address</label>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{myInfo?.email || "Not set"}</p>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <label className="text-sm font-medium text-gray-700">Phone Number</label>
                    </div>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={myInfo?.phone || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 text-black bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-gray-900">{myInfo?.phone || "Not set"}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="space-y-2 md:col-span-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <label className="text-sm font-medium text-gray-700">Address</label>
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={myInfo?.address || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 bg-gray-50 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your address"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-gray-900">{myInfo?.address || "Not set"}</p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-3">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSave}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          <Save className="w-4 h-4" />
                          <span className="font-semibold">Save Changes</span>
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                        >
                          <X className="w-4 h-4" />
                          <span className="font-semibold">Cancel</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span className="font-semibold">Edit Profile</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center">
                    <QrIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Quick Connect QR</h3>
                    <p className="text-sm text-gray-600">Share this code for instant calls</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {hasActiveSubscription ? (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <QrCode user={user} />
                  </div>
                  <p className="text-center text-sm text-gray-600">
                    Scan this QR code to start an instant call with you
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-red-50 to-white flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Subscription Required</h4>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    You need an active subscription with available minutes to generate a QR code for instant calls.
                  </p>
                  <Link
                    to="/dashboard/subscriptions"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 shadow-md hover:shadow-lg transition-all duration-200 font-semibold"
                  >
                    <CreditCard className="w-4 h-4" />
                    Renew Subscription
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Subscription Info */}
          <div className="space-y-4 sm:space-y-6">
            {/* Subscription Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Subscription</h3>
                  <p className="text-sm text-gray-600">Your current plan</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Plan</span>
                  <span className="font-bold text-gray-900">{myInfo?.subscription?.plan || "Free"}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Available Minutes</span>
                  <span className="font-bold text-gray-900">{myInfo?.subscription?.minute.toFixed(2) || 0} min</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Remaining Days</span>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className={`font-bold ${remainingDays <= 7 ? 'text-red-600' : 'text-gray-900'}`}>
                      {remainingDays} days
                    </span>
                    {remainingDays <= 7 && remainingDays > 0 && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                        Expiring soon
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Renews on</span>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="font-bold text-gray-900">
                      {myInfo?.subscription?.endDate 
                        ? new Date(myInfo.subscription.endDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  to="/dashboard/subscriptions"
                  className="block w-full text-center px-4 py-3 bg-gradient-to-r from-red-50 to-white border border-red-200 text-red-600 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200 font-semibold"
                >
                  Manage Subscription
                </Link>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-600 to-green-700 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Account Status</h3>
                  <p className="text-sm text-gray-600">Security & Verification</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email Verified</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Phone Verified</span>
                  {myInfo?.phone ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <span className="text-xs text-red-600">Not set</span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">2FA Enabled</span>
                  <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Login</span>
                  <span className="text-xs text-gray-500">Just now</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                {/* <button className="w-full text-center px-4 py-3 bg-gradient-to-r from-gray-50 to-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200 font-semibold">
                  Security Settings
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;