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
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
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

      <div className="relative z-10 flex w-[90%] max-w-sm flex-col items-center rounded-3xl border border-[#b8892b]/20 bg-gradient-to-br from-[#16222f]/95 via-[#0e161e]/95 to-[#16222f]/95 p-8 text-center shadow-2xl backdrop-blur-xl">
        {/* Pulsing avatar */}
        <div className="relative mb-6">
          <span className="absolute inset-0 -m-3 rounded-full border border-[#c9a24b]/30 call-ring call-ring-a" />
          <span className="absolute inset-0 -m-3 rounded-full border border-[#c9a24b]/30 call-ring call-ring-b" />
          <div className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full border-4 border-[#0a0f15]/30 bg-gradient-to-br from-[#b8892b] to-[#8a651c] text-3xl font-bold text-[#0a0f15] shadow-lg">
            {userName?.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Caller info */}
        <h2
          className="mb-2 text-xl md:text-2xl text-[#f1ece2]"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 600,
          }}>
          Calling <span className="text-[#c9a24b]">{userName}</span>
        </h2>
        <p className="mb-6 text-[#f1ece2]/45">Waiting for them to answer…</p>

        {/* Cancel button */}
        <button
          onClick={handleCloseCall}
          className="w-full transform rounded-xl bg-gradient-to-r from-[#b8892b] to-[#8a651c] py-3 font-semibold uppercase tracking-wide text-[#0a0f15] shadow-lg transition-all duration-300 hover:shadow-[0_10px_30px_-8px_rgba(184,137,43,0.5)] active:scale-95">
          Cancel Call
        </button>
      </div>

      <style>{`
        @keyframes callRing {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .call-ring { animation: callRing 2.4s ease-out infinite; }
        .call-ring-b { animation-delay: 1.2s; }
        @media (prefers-reduced-motion: reduce) {
          .call-ring-a, .call-ring-b { animation: none; opacity: 0.2; }
        }
      `}</style>
    </div>
  );
};

export default CallRequest;
