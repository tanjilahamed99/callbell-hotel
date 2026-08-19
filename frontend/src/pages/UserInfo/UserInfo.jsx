import React, { Suspense, useEffect, useState } from "react";
import GuestModal from "../../components/welcomeModal/WelcomeModal";
import CallManager from "../../components/CallManager/CallManager";
import {
  User,
  Phone,
  Shield,
  Sparkles,
  DoorClosed,
  UtensilsCrossed,
  BellRing,
  Users,
  Building2,
} from "lucide-react";
import { useCall } from "../../Provider/Provider";
import { Navigate } from "react-router-dom";
import { getDepartmentUsers } from "../../hooks/admin/payment";

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
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [activeCall, setActiveCall] = useState(null);

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

    const fetch = async () => {
      const { data } = await getDepartmentUsers();
      if (data.success) {
        setDepartments(data.users || []);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  if (u) {
    logout();
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gray-50 p-4">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)",
            backgroundSize: "46px 46px",
          }}
        />
        <div className="absolute -top-10 left-1/4 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute bottom-0 right-1/5 h-96 w-96 rounded-full bg-teal-200/40 blur-3xl" />
      </div>

      {!showUser && !gest ? (
        <GuestModal setShowUser={setShowUser} />
      ) : loading ? (
        <div className="relative z-10 text-center">
          <div className="relative">
            <div className="mx-auto mb-4 h-20 w-20 animate-pulse rounded-full bg-gradient-to-r from-blue-600 to-teal-500"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-teal-500"></div>
            </div>
          </div>
          <p className="mt-4 font-medium text-gray-500">
            Loading guest services...
          </p>
        </div>
      ) : (
        <div className="relative z-10 mx-auto w-full max-w-3xl">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center justify-center rounded-full border border-gray-200 bg-white p-3 shadow-sm">
              <User className="h-8 w-8 text-teal-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Guest{" "}
              <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                Services
              </span>
            </h1>
            <p className="mt-2 text-sm uppercase tracking-[0.25em] text-gray-500">
              The Tarainn — Room {gest?.room || "—"}
            </p>
          </div>

          {activeCall ? (
            /* ── ACTIVE CALL VIEW ── */
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-6 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/30 bg-white/10">
                  {(() => {
                    const Icon = getDeptIcon(activeCall.type);
                    return <Icon className="h-9 w-9 text-white" />;
                  })()}
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="mb-8 text-center">
                  <h2 className="mb-1 text-2xl font-bold text-gray-900">
                    {activeCall.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Connecting you to {activeCall.name}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                  <Suspense
                    fallback={
                      <div className="flex justify-center py-8">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-teal-500"></div>
                      </div>
                    }>
                    <div className="flex justify-center">
                      <CallManager
                        userId={activeCall._id}
                        userName={activeCall.name}
                        isBusy={activeCall.isBusy}
                        setActiveCall={setActiveCall}
                      />
                    </div>
                  </Suspense>

                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <Shield className="h-4 w-4 text-teal-600" />
                      <span>All calls are end-to-end encrypted</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveCall(null)}
                  className="mt-6 inline-flex items-center font-medium text-gray-500 transition-colors duration-200 hover:text-teal-600">
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
                <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                  <Sparkles className="mx-auto mb-3 h-8 w-8 text-teal-500" />
                  <p className="text-gray-500">
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
                        className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-all duration-300 hover:border-teal-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50">
                        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 shadow-sm">
                          <Icon className="h-6 w-6 text-white" />
                          <span
                            className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
                              dept.isBusy ? "bg-amber-500" : "bg-emerald-500"
                            }`}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-base font-semibold text-gray-900">
                            {dept.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {dept.isBusy ? "Currently busy" : "Available now"}
                          </p>
                        </div>
                        <Phone className="h-5 w-5 shrink-0 text-teal-500 transition-transform duration-300 group-hover:scale-110 group-hover:text-teal-600" />
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* Footer */}
          {!activeCall && (
            <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="flex items-center">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-teal-500">
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      The Tarainn
                    </p>
                    <p className="text-xs text-gray-500">
                      Guest Services Portal
                    </p>
                  </div>
                </div>
                {gest?.room && (
                  <span className="flex items-center gap-1.5 text-sm text-gray-500">
                    <DoorClosed className="h-3.5 w-3.5 text-teal-600" />
                    Room{" "}
                    <span className="font-mono text-gray-700">{gest.room}</span>
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
