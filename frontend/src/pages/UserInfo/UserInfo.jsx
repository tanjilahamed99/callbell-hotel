import React, { Suspense, useEffect, useState } from "react";
// import getDepartments from "../../hooks/departments/getDepartments"; // TODO: point at your real admin-fetch hook
import GuestModal from "../../components/welcomeModal/WelcomeModal";
import CallManager from "../../components/CallManager/CallManager";
import { useSearchParams } from "react-router-dom";
import {
  User,
  Phone,
  Mail,
  Shield,
  Sparkles,
  Ban,
  DoorClosed,
  UtensilsCrossed,
  BellRing,
  Users,
  Building2,
} from "lucide-react";
import { useCall } from "../../Provider/Provider";
import { Navigate } from "react-router-dom";
import { getDepartments } from "../../hooks/payment";

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

// Maps a department "type" to an icon + accent — extend as you add types
const DEPT_ICON = {
  reception: BellRing,
  "room-service": UtensilsCrossed,
  restaurant: UtensilsCrossed,
  manager: Shield,
  "duty-manager": Shield,
  staff: Users,
  default: Building2,
};

const getDeptIcon = (type) =>
  DEPT_ICON[type?.toLowerCase()] || DEPT_ICON.default;

const UserInfo = () => {
  useBrandFonts();

  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [activeCall, setActiveCall] = useState(null); // department currently being called
  const [searchParams] = useSearchParams();

  // Back-compat: some old QR links may still carry userId/name; new links should carry propertyId
  const propertyId =
    searchParams.get("propertyId") || searchParams.get("userId");

  const { user: u, logout } = useCall();
  const [showUser, setShowUser] = useState(false);
  const gest = JSON.parse(localStorage.getItem("guest"));

  useEffect(() => {
    if (gest) {
      setShowUser(true);
    }
  }, [gest]);

  useEffect(() => {
    setLoading(true);
    if (propertyId) {
      const fetch = async () => {
        const { data } = await getDepartments({ propertyId });
        if (data.success) {
          setDepartments(data.data || []);
        }
        setLoading(false);
      };
      fetch();
    } else {
      setLoading(false);
    }
  }, [propertyId]);

  if (u) {
    logout();
    return <Navigate to="/" replace />;
  }

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4"
      style={{
        background:
          "radial-gradient(circle at 18% 12%, #16222f 0%, #101820 50%, #0a0f15 100%)",
        fontFamily: "'Inter', ui-sans-serif, sans-serif",
      }}>
      {/* Ambient brass grid, matching auth page */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#b8892b 1px, transparent 1px), linear-gradient(90deg, #b8892b 1px, transparent 1px)",
            backgroundSize: "46px 46px",
          }}
        />
        <div className="absolute -top-10 left-1/4 h-72 w-72 rounded-full bg-[#b8892b]/8 blur-3xl" />
        <div className="absolute bottom-0 right-1/5 h-96 w-96 rounded-full bg-[#2f4a5e]/25 blur-3xl" />
      </div>

      {!showUser && !gest ? (
        <GuestModal setShowUser={setShowUser} />
      ) : loading ? (
        <div className="relative z-10 text-center">
          <div className="relative">
            <div className="mx-auto mb-4 h-20 w-20 animate-pulse rounded-full bg-gradient-to-r from-[#b8892b] to-[#8a651c]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#b8892b]/20 border-t-[#c9a24b]"></div>
            </div>
          </div>
          <p className="mt-4 font-medium text-[#f1ece2]/60">
            Loading guest services...
          </p>
        </div>
      ) : isBlocked ? (
        /* ── PROPERTY-WIDE BLOCKED STATE ── */
        <div className="relative z-10 w-full max-w-md text-center">
          <div className="rounded-2xl border border-[#b8892b]/20 bg-gradient-to-br from-[#16222f]/90 via-[#0e161e]/90 to-[#16222f]/90 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#b8892b]/30 bg-[#b8892b]/10">
              <Ban className="h-8 w-8 text-[#c9a24b]" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-[#f1ece2]">
              Call Access Unavailable
            </h3>
            <p className="mx-auto max-w-xs text-sm text-[#f1ece2]/45">
              You're currently unable to reach guest services from this room.
            </p>
            <div className="mt-6 border-t border-[#b8892b]/15 pt-6">
              <div className="flex items-center justify-center gap-2 text-sm text-[#f1ece2]/45">
                <Shield className="h-4 w-4 text-[#c9a24b]/70" />
                <span>Please contact the front desk directly</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10 w-full max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center justify-center rounded-full border border-[#b8892b]/30 bg-[#16222f]/60 p-3">
              <User className="h-8 w-8 text-[#c9a24b]" />
            </div>
            <h1
              className="text-3xl md:text-4xl text-[#f1ece2]"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 600,
              }}>
              Guest <span className="text-[#c9a24b]">Services</span>
            </h1>
            <p className="mt-2 text-sm uppercase tracking-[0.25em] text-[#c9a24b]/70">
              The Meridian — Room {gest?.room || "—"}
            </p>
          </div>

          {activeCall ? (
            /* ── ACTIVE CALL VIEW for the selected department ── */
            <div className="overflow-hidden rounded-2xl border border-[#b8892b]/20 bg-gradient-to-br from-[#16222f]/90 via-[#0e161e]/90 to-[#16222f]/90 shadow-2xl backdrop-blur-xl">
              <div className="bg-gradient-to-r from-[#b8892b] to-[#8a651c] p-6 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#0a0f15]/40 bg-white/10">
                  {(() => {
                    const Icon = getDeptIcon(activeCall.type);
                    return <Icon className="h-9 w-9 text-[#0a0f15]" />;
                  })()}
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="mb-8 text-center">
                  <h2
                    className="mb-1 text-2xl text-[#f1ece2]"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontWeight: 600,
                    }}>
                    {activeCall.name}
                  </h2>
                  <p className="text-sm text-[#f1ece2]/50">
                    Connecting you to {activeCall.name}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#b8892b]/20 bg-[#0a0f15]/40 p-6">
                  <Suspense
                    fallback={
                      <div className="flex justify-center py-8">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#c9a24b]"></div>
                      </div>
                    }>
                    <div className="flex justify-center">
                      <CallManager
                        userId={activeCall.userId}
                        userName={activeCall.userName}
                        isBusy={activeCall.isBusy}
                      />
                    </div>
                  </Suspense>

                  <div className="mt-6 border-t border-[#b8892b]/15 pt-6">
                    <div className="flex items-center justify-center gap-2 text-sm text-[#f1ece2]/45">
                      <Shield className="h-4 w-4 text-[#c9a24b]/70" />
                      <span>All calls are end-to-end encrypted</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveCall(null)}
                  className="mt-6 inline-flex items-center font-medium text-[#f1ece2]/50 transition-colors duration-200 hover:text-[#c9a24b]">
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to directory
                </button>
              </div>
            </div>
          ) : (
            /* ── DEPARTMENT DIRECTORY ── */
            <>
              {departments.length === 0 ? (
                <div className="rounded-2xl border border-[#b8892b]/20 bg-[#16222f]/60 p-10 text-center">
                  <Sparkles className="mx-auto mb-3 h-8 w-8 text-[#c9a24b]/60" />
                  <p className="text-[#f1ece2]/50">
                    No departments are available to call right now.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {departments.map((dept) => {
                    const Icon = getDeptIcon(dept.type);
                    return (
                      <button
                        key={dept._id || dept.userId}
                        onClick={() => setActiveCall(dept)}
                        disabled={dept.isBusy}
                        className="group flex items-center gap-4 rounded-2xl border border-[#b8892b]/20 bg-gradient-to-br from-[#16222f]/90 to-[#0e161e]/90 p-5 text-left shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-[#c9a24b]/50 hover:shadow-[0_10px_30px_-8px_rgba(184,137,43,0.3)] disabled:cursor-not-allowed disabled:opacity-50">
                        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#b8892b] to-[#8a651c]">
                          <Icon className="h-6 w-6 text-[#0a0f15]" />
                          <span
                            className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#101820] ${
                              dept.isBusy ? "bg-amber-500" : "bg-emerald-500"
                            }`}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-base font-semibold text-[#f1ece2]">
                            {dept.name}
                          </h3>
                          <p className="text-xs text-[#f1ece2]/45">
                            {dept.isBusy ? "Currently busy" : "Available now"}
                          </p>
                        </div>
                        <Phone className="h-5 w-5 shrink-0 text-[#c9a24b]/60 transition-transform duration-300 group-hover:scale-110 group-hover:text-[#c9a24b]" />
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* Footer */}
          {!activeCall && (
            <div className="mt-8 overflow-hidden rounded-2xl border border-[#b8892b]/20 bg-[#0a0f15]/40 p-5">
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="flex items-center">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#b8892b] to-[#8a651c]">
                    <Phone className="h-4 w-4 text-[#0a0f15]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#f1ece2]">
                      The Meridian
                    </p>
                    <p className="text-xs text-[#f1ece2]/40">
                      Guest Services Portal
                    </p>
                  </div>
                </div>
                {gest?.room && (
                  <span className="flex items-center gap-1.5 text-sm text-[#f1ece2]/45">
                    <DoorClosed className="h-3.5 w-3.5 text-[#c9a24b]/70" />
                    Room{" "}
                    <span className="font-mono text-[#f1ece2]/70">
                      {gest.room}
                    </span>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserInfo;
