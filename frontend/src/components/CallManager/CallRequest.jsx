import React, { useEffect, useRef, useState } from "react";

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

const CallRequest = ({ handleCloseCall, userName, waitingCall }) => {
  useBrandFonts();

  const [canPlaySound, setCanPlaySound] = useState(false);
  const audioRef = useRef(null);

  // Enable sound on first interaction
  useEffect(() => {
    const enableSound = () => setCanPlaySound(true);

    window.addEventListener("click", enableSound, { once: true });

    return () => window.removeEventListener("click", enableSound);
  }, []);

  // Play / stop ringtone
  useEffect(() => {
    if (!waitingCall || !canPlaySound) return;

    if (!audioRef.current) {
      audioRef.current = new Audio("/ring.mp3");
      audioRef.current.loop = true;
    }

    if (waitingCall) {
      audioRef.current
        .play()
        .catch((err) => console.log("Autoplay prevented:", err));
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [waitingCall, canPlaySound]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-gray-50 px-4"
      style={{
        fontFamily: "'Inter', ui-sans-serif, sans-serif",
      }}
    >
      {/* =========================================
          BACKGROUND
      ========================================= */}
      <div className="pointer-events-none absolute inset-0">
        {/* Light grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)",
            backgroundSize: "46px 46px",
          }}
        />

        {/* Blue glow */}
        <div className="absolute -top-16 left-[15%] h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />

        {/* Teal glow */}
        <div className="absolute bottom-0 right-[10%] h-96 w-96 rounded-full bg-teal-200/40 blur-3xl" />

        {/* Center glow */}
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/30 blur-3xl" />
      </div>

      {/* =========================================
          MAIN CARD
      ========================================= */}
      <div className="relative z-10 w-[90%] max-w-sm">
        {/* Soft card glow */}
        <div className="absolute -inset-3 rounded-[2rem] bg-blue-500/5 blur-2xl" />

        <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-xl shadow-gray-200/60">
          {/* Top gradient line */}
          <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-blue-600 to-teal-500" />

          {/* =========================================
              HOTEL BRAND
          ========================================= */}
          <div className="mb-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-blue-600">
              TARAINN
            </p>

            <p className="mt-1 text-[9px] uppercase tracking-[0.3em] text-gray-400">
              Hotel Guest Services
            </p>
          </div>

          {/* =========================================
              CALLER AVATAR
          ========================================= */}
          <div className="relative mx-auto mb-7 h-28 w-28">
            {/* Pulse ring */}
            <span className="absolute inset-0 -m-3 rounded-full border border-blue-400/30 call-ring call-ring-a" />

            <span className="absolute inset-0 -m-3 rounded-full border border-teal-400/30 call-ring call-ring-b" />

            {/* Avatar */}
            <div className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-blue-600 to-teal-500 text-3xl font-bold text-white shadow-lg shadow-blue-500/20">
              {userName?.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* =========================================
              CALL INFO
          ========================================= */}
          <div className="mb-7">
            <div className="mb-2 flex items-center justify-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-teal-500" />

              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-600">
                Incoming Call
              </span>
            </div>

            <h2
              className="text-3xl text-gray-900"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 600,
              }}
            >
              Calling{" "}
              <span className="text-blue-600">
                {userName}
              </span>
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Waiting for them to answer…
            </p>
          </div>

          {/* Divider */}
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />

            <span className="text-[9px] uppercase tracking-[0.25em] text-gray-400">
              Call Request
            </span>

            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* =========================================
              CANCEL BUTTON
          ========================================= */}
          <button
            onClick={handleCloseCall}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 py-3.5 font-semibold uppercase tracking-wide text-white shadow-md shadow-blue-500/20 transition-all duration-300 hover:from-blue-700 hover:to-teal-600 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
          >
            Cancel Call
          </button>

          {/* Security text */}
          <p className="mt-5 text-xs text-gray-400">
            Secure guest communication
          </p>
        </div>
      </div>

      {/* =========================================
          ANIMATIONS
      ========================================= */}
      <style>{`
        @keyframes callRing {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }

          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }

        .call-ring {
          animation: callRing 2.4s ease-out infinite;
        }

        .call-ring-b {
          animation-delay: 1.2s;
        }

        @media (prefers-reduced-motion: reduce) {
          .call-ring-a,
          .call-ring-b {
            animation: none;
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
};

export default CallRequest;