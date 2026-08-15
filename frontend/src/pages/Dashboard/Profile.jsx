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

const Profile = () => {
  useBrandFonts();
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
            background: "#101820",
            color: "#f1ece2",
            confirmButtonColor: "#b8892b",
          });
          setRefetch(!refetch);
        }
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to upload image",
          icon: "error",
          background: "#101820",
          color: "#f1ece2",
          confirmButtonColor: "#b8892b",
        });
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      Swal.fire({
        title: "Error",
        text: "Failed to upload image",
        icon: "error",
        background: "#101820",
        color: "#f1ece2",
        confirmButtonColor: "#b8892b",
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
        background: "#101820",
        color: "#f1ece2",
        confirmButtonColor: "#b8892b",
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
        background: "#101820",
        color: "#f1ece2",
        confirmButtonColor: "#b8892b",
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
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-[#b8892b] to-[#8a651c] animate-pulse mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-[#b8892b]/20 border-t-[#c9a24b] rounded-full animate-spin"></div>
            </div>
          </div>
          <p className="text-[#f1ece2]/60 mt-4 font-medium">
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
    <div
      className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8"
      style={{ fontFamily: "'Inter', ui-sans-serif, sans-serif" }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl text-[#f1ece2] mb-2"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 600,
            }}>
            Profile <span className="text-[#c9a24b]">Settings</span>
          </h1>
          <p className="text-[#f1ece2]/45 text-sm sm:text-base">
            Manage your personal information
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Profile Card */}
          <div className="rounded-2xl border border-[#b8892b]/20 bg-gradient-to-br from-[#16222f]/90 via-[#0e161e]/90 to-[#16222f]/90 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#b8892b] to-[#8a651c] p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                {/* Profile Image */}
                <div className="relative">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-white/10 border-4 border-[#0a0f15]/30">
                    {myInfo?.image ? (
                      <img
                        src={myInfo?.image}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#0a0f15] text-2xl sm:text-3xl font-bold">
                        {initials}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleUpdateClick}
                    disabled={uploading}
                    className={`absolute bottom-1 right-1 w-10 h-10 rounded-full bg-[#0a0f15] border border-[#b8892b]/30 flex items-center justify-center shadow-lg hover:scale-105 transition-all duration-200 ${
                      uploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}>
                    {uploading ? (
                      <RefreshCw className="w-4 h-4 text-[#c9a24b] animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4 text-[#c9a24b]" />
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
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0a0f15] mb-1 truncate">
                    {myInfo?.name || "User"}
                  </h2>
                  <p className="text-[#0a0f15]/70 text-sm sm:text-base mb-3 truncate">
                    {myInfo?.email || "user@example.com"}
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <div className="flex items-center gap-1 bg-[#0a0f15]/15 px-3 py-1 rounded-full">
                      <Shield className="w-3 h-3 text-[#0a0f15]" />
                      <span className="text-xs text-[#0a0f15] font-medium">
                        Verified Account
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Field rows */}
            <div className="divide-y divide-[#b8892b]/10">
              {fieldRows.map((field) => (
                <div
                  key={field.key}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 sm:px-6 py-4">
                  <div className="flex items-center gap-2 sm:w-48 shrink-0">
                    <field.icon className="w-4 h-4 text-[#c9a24b]/70" />
                    <label className="text-sm font-medium text-[#f1ece2]/60">
                      {field.label}
                    </label>
                  </div>
                  {isEditing && field.editable ? (
                    <input
                      type={field.type}
                      name={field.key}
                      value={myInfo?.[field.key] || ""}
                      onChange={handleChange}
                      className="flex-1 px-3 py-2 bg-[#0a0f15]/60 border border-[#b8892b]/20 rounded-lg text-[#f1ece2] placeholder-[#f1ece2]/30 focus:outline-none focus:border-[#c9a24b] focus:ring-2 focus:ring-[#c9a24b]/25 transition-all duration-200"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  ) : (
                    <p className="flex-1 text-base font-medium text-[#f1ece2]">
                      {myInfo?.[field.key] || "Not set"}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="px-4 sm:px-6 py-5 border-t border-[#b8892b]/15">
              <div className="flex flex-col sm:flex-row gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-[#b8892b] to-[#8a651c] text-[#0a0f15] font-semibold shadow-lg hover:shadow-[0_10px_30px_-8px_rgba(184,137,43,0.5)] transition-all duration-200">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-[#b8892b]/20 bg-[#0a0f15]/60 text-[#f1ece2]/70 font-semibold hover:bg-[#0a0f15] transition-all duration-200">
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-[#b8892b] to-[#8a651c] text-[#0a0f15] font-semibold shadow-lg hover:shadow-[0_10px_30px_-8px_rgba(184,137,43,0.5)] transition-all duration-200">
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Account Status — row design */}
          <div className="rounded-2xl border border-[#b8892b]/20 bg-gradient-to-br from-[#16222f]/90 via-[#0e161e]/90 to-[#16222f]/90 shadow-xl overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-[#b8892b]/15 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#f1ece2]">
                  Account Status
                </h3>
                <p className="text-sm text-[#f1ece2]/45">
                  Security & Verification
                </p>
              </div>
            </div>

            <div className="divide-y divide-[#b8892b]/10">
              <div className="flex items-center justify-between px-4 sm:px-6 py-3.5">
                <span className="text-sm text-[#f1ece2]/50">
                  Email Verified
                </span>
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex items-center justify-between px-4 sm:px-6 py-3.5">
                <span className="text-sm text-[#f1ece2]/50">
                  Phone Verified
                </span>
                {myInfo?.phone ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <span className="text-xs text-[#c9a24b]">Not set</span>
                )}
              </div>
              <div className="flex items-center justify-between px-4 sm:px-6 py-3.5">
                <span className="text-sm text-[#f1ece2]/50">Last Login</span>
                <span className="text-xs text-[#f1ece2]/40">Just now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
