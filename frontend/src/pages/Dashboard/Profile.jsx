import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { useCall } from "../../Provider/Provider";
import updateUser from "../../hooks/users/updateUser";
import myData from "../../hooks/users/myData";
import QrCode from "../../components/Dashboard/QrCode";
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
  QrCode as QrIcon,
  RefreshCw,
  Download,
  Share2,
  CheckCircle,
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
  const initials =
    myInfo?.name
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
        },
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
            confirmButtonColor: "#2563eb",
          });
          setRefetch(!refetch);
        }
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to upload image",
          icon: "error",
          confirmButtonColor: "#2563eb",
        });
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      Swal.fire({
        title: "Error",
        text: "Failed to upload image",
        icon: "error",
        confirmButtonColor: "#2563eb",
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
        confirmButtonColor: "#2563eb",
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
        confirmButtonColor: "#2563eb",
      });
    }
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
      <div className="min-h-screen flex items-center justify-center p-4 bg-white">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-blue-600 to-teal-500 animate-pulse mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-teal-500 rounded-full animate-spin"></div>
            </div>
          </div>
          <p className="text-gray-500 mt-4 font-medium">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  const fieldRows = [
    {
      key: "name",
      label: "Full Name",
      icon: User,
      editable: true,
      type: "text",
    },
    { key: "email", label: "Email Address", icon: Mail, editable: false },
    {
      key: "phone",
      label: "Phone Number",
      icon: Phone,
      editable: true,
      type: "tel",
    },
    {
      key: "address",
      label: "Address",
      icon: MapPin,
      editable: true,
      type: "text",
    },
  ];

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Profile <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">Settings</span>
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Manage your personal information
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Profile Card */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                {/* Profile Image */}
                <div className="relative">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-white/20 border-4 border-white/40">
                    {myInfo?.image ? (
                      <img
                        src={myInfo?.image}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold">
                        {initials}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleUpdateClick}
                    disabled={uploading}
                    className={`absolute bottom-1 right-1 w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-md hover:scale-105 transition-all duration-200 ${
                      uploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}>
                    {uploading ? (
                      <RefreshCw className="w-4 h-4 text-teal-600 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4 text-teal-600" />
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
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 truncate">
                    {myInfo?.name || "User"}
                  </h2>
                  <p className="text-white/80 text-sm sm:text-base mb-3 truncate">
                    {myInfo?.email || "user@example.com"}
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                      <Shield className="w-3 h-3 text-white" />
                      <span className="text-xs text-white font-medium">
                        Verified Account
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Field rows */}
            <div className="divide-y divide-gray-100">
              {fieldRows.map((field) => (
                <div
                  key={field.key}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 sm:px-6 py-4">
                  <div className="flex items-center gap-2 sm:w-48 shrink-0">
                    <field.icon className="w-4 h-4 text-teal-600" />
                    <label className="text-sm font-medium text-gray-500">
                      {field.label}
                    </label>
                  </div>
                  {isEditing && field.editable ? (
                    <input
                      type={field.type}
                      name={field.key}
                      value={myInfo?.[field.key] || ""}
                      onChange={handleChange}
                      className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  ) : (
                    <p className="flex-1 text-base font-medium text-gray-900">
                      {myInfo?.[field.key] || "Not set"}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="px-4 sm:px-6 py-5 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold shadow-md hover:from-blue-700 hover:to-teal-600 transition-all duration-200">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-600 font-semibold hover:bg-gray-50 transition-all duration-200">
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold shadow-md hover:from-blue-700 hover:to-teal-600 transition-all duration-200">
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Account Status — row design */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Account Status
                </h3>
                <p className="text-sm text-gray-500">
                  Security & Verification
                </p>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              <div className="flex items-center justify-between px-4 sm:px-6 py-3.5">
                <span className="text-sm text-gray-500">
                  Email Verified
                </span>
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between px-4 sm:px-6 py-3.5">
                <span className="text-sm text-gray-500">
                  Phone Verified
                </span>
                {myInfo?.phone ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                ) : (
                  <span className="text-xs text-teal-600">Not set</span>
                )}
              </div>
              <div className="flex items-center justify-between px-4 sm:px-6 py-3.5">
                <span className="text-sm text-gray-500">Last Login</span>
                <span className="text-xs text-gray-400">Just now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;