"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useCall } from "../../Provider/Provider";
import {
  Phone,
  PhoneCall,
  PhoneOff,
  User,
  X,
  Info,
  Volume2,
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

export default function CallPopup() {
  useBrandFonts();

  const {
    incomingCall,
    declineCall,
    acceptCall,
    modalOpen,
  } = useCall();

  const [timerActive, setTimerActive] = useState(false);
  // Only shown if the browser actively blocked autoplay — gives the user
  // a guaranteed same-tick gesture to unlock audio instead of silent failure.
  const [needsSoundUnlock, setNeedsSoundUnlock] = useState(false);
  const audioRef = useRef(null);
  const soundArmedRef = useRef(false);

  // Create + preload the audio element ONCE, as early as possible, instead of
  // lazily when a call arrives. Reduces first-play latency/failure on slow
  // connections and means there's always an element ready to unlock.
  useEffect(() => {
    const audio = new Audio("/ring.mp3");
    audio.loop = true;
    audio.volume = 0.7;
    audio.preload = "auto";
    audio.load();
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  // Arm audio on the very first real user gesture anywhere on the page.
  // Listens to pointerdown (covers touch + mouse) and keydown. Using
  // pointerdown instead of click also means it fires before any click
  // handler (e.g. the decline-on-backdrop-click) has a chance to run.
  useEffect(() => {
    const arm = () => {
      soundArmedRef.current = true;
      // "Prime" playback with a real gesture in the call stack: play+immediately
      // pause. Many browsers (notably Safari) treat this as unlocking audio
      // for later non-gesture playback in the same session.
      const audio = audioRef.current;
      if (audio) {
        audio
          .play()
          .then(() => {
            if (!incomingCall || !modalOpen) {
              audio.pause();
              audio.currentTime = 0;
            }
          })
          .catch(() => {
            /* still locked, ignore — we retry on the real ring */
          });
      }
    };

    window.addEventListener("pointerdown", arm, { once: true });
    window.addEventListener("keydown", arm, { once: true });

    return () => {
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("keydown", arm);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stop ringtone globally (used elsewhere in the app on call end/cleanup).
  useEffect(() => {
    window.stopCallRingtone = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };

    return () => {
      window.stopCallRingtone = null;
    };
  }, []);

  const tryPlayRingtone = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => setNeedsSoundUnlock(false))
        .catch((err) => {
          // NotAllowedError = autoplay blocked, needs a fresh gesture.
          // AbortError = a pause() interrupted this play() (e.g. rapid
          // incomingCall updates) — safe to ignore, next effect run retries.
          if (err?.name === "NotAllowedError") {
            setNeedsSoundUnlock(true);
          } else if (err?.name !== "AbortError") {
            console.warn("Ringtone playback failed:", err);
          }
        });
    }
  }, []);

  // Play / stop ringtone in sync with call state.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (modalOpen && incomingCall) {
      tryPlayRingtone();
    } else {
      audio.pause();
      audio.currentTime = 0;
      setNeedsSoundUnlock(false);
    }
  }, [incomingCall, modalOpen, tryPlayRingtone]);

  // If the tab was hidden and audio got paused, resume when it becomes
  // visible again while a call is still actively ringing.
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        window.stopCallRingtone?.();
      } else if (modalOpen && incomingCall && !timerActive) {
        tryPlayRingtone();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [modalOpen, incomingCall, timerActive, tryPlayRingtone]);

  const handleAcceptCall = () => {
    window.stopCallRingtone?.();
    setTimerActive(true);
    acceptCall();
  };

  const handleDeclineCall = () => {
    window.stopCallRingtone?.();
    setTimerActive(false);
    declineCall();
  };

  const handleUnlockSound = (e) => {
    e.stopPropagation();
    tryPlayRingtone();
  };

  if (!incomingCall) return null;

  return (
    <>
      {modalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-gray-50 px-4 py-6"
          style={{
            fontFamily: "'Inter', ui-sans-serif, sans-serif",
          }}
        >
          {/* =========================================
              BACKGROUND
          ========================================= */}
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage:
                  "linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)",
                backgroundSize: "46px 46px",
              }}
            />
            <div className="absolute -top-20 left-[10%] h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />
            <div className="absolute bottom-0 right-[10%] h-96 w-96 rounded-full bg-teal-200/40 blur-3xl" />
            <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/30 blur-3xl" />
          </div>

          {/* =========================================
              BACKDROP
          ========================================= */}
          <div
            className="absolute inset-0 bg-gray-900/25 backdrop-blur-md"
            onClick={handleDeclineCall}
          />

          {/* =========================================
              POPUP
          ========================================= */}
          <div className="relative z-10 w-full max-w-md">
            <div className="absolute -inset-4 rounded-[2rem] bg-blue-500/10 blur-2xl" />

            <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl shadow-gray-300/50">
              <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-blue-600 to-teal-500" />

              {/* Sound-blocked notice — only shows if autoplay was actually blocked */}
              {needsSoundUnlock && !timerActive && (
                <button
                  onClick={handleUnlockSound}
                  className="absolute left-1/2 top-5 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] font-medium text-amber-700 shadow-sm transition-colors hover:bg-amber-100"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  Tap to enable ring sound
                </button>
              )}

              <div className="absolute right-5 top-5 z-20">
                <button
                  onClick={handleDeclineCall}
                  aria-label="Close call"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-400 transition-all duration-300 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="relative px-7 py-8 sm:px-9 sm:py-9">
                <div className="mb-7 text-center">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-blue-600">
                    TARAINN
                  </p>
                  <p className="mt-1 text-[9px] uppercase tracking-[0.3em] text-gray-400">
                    Hotel Guest Services
                  </p>
                </div>

                <div className="relative mx-auto mb-7 h-28 w-28">
                  <div className="absolute inset-0 rounded-full border border-blue-300/40 animate-ping" />
                  <div
                    className="absolute inset-[-10px] rounded-full border border-teal-300/30"
                    style={{ animation: "callRing 2.4s ease-out infinite" }}
                  />
                  <div
                    className="absolute inset-[-20px] rounded-full border border-blue-300/20"
                    style={{ animation: "callRing 2.4s ease-out 1.2s infinite" }}
                  />

                  <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-blue-600 to-teal-500 shadow-lg shadow-blue-500/20">
                    {incomingCall?.from?.avatar ? (
                      <img
                        src={incomingCall.from.avatar}
                        alt={incomingCall.from.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <User className="h-14 w-14 text-white/90" />
                        <span className="mt-1 text-[9px] font-medium uppercase tracking-wider text-white/70">
                          Guest
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-7 text-center">
                  <div className="mb-2 flex items-center justify-center gap-2">
                    <PhoneCall
                      className={`h-5 w-5 text-blue-600 ${
                        !timerActive ? "animate-pulse" : ""
                      }`}
                    />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                      {timerActive ? "Active Call" : "Incoming Call"}
                    </span>
                  </div>

                  <h2
                    className="text-3xl text-gray-900 sm:text-4xl"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontWeight: 600,
                    }}
                  >
                    {incomingCall.from.name}
                  </h2>

                  <p
                    className="mt-1 text-xl text-teal-600"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontWeight: 600,
                    }}
                  >
                    Room {incomingCall.from.room}
                  </p>

                  <p className="mt-3 text-sm text-gray-500">
                    {timerActive
                      ? "Call is currently in progress"
                      : "A guest is requesting your assistance"}
                  </p>

                  {incomingCall.from.email && (
                    <p className="mt-2 text-xs text-gray-400">
                      {incomingCall.from.email}
                    </p>
                  )}
                </div>

                <div className="mb-7 flex items-center gap-4">
                  <div className="h-px flex-1 bg-gray-200" />
                  <span className="text-[9px] font-medium uppercase tracking-[0.25em] text-gray-400">
                    Call Request
                  </span>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>

                <div className="flex items-center justify-center gap-10">
                  <button
                    onClick={handleDeclineCall}
                    className="group relative flex flex-col items-center"
                  >
                    <div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-white shadow-md shadow-red-500/20 transition-all duration-300 group-hover:scale-105 group-hover:bg-red-600 group-hover:shadow-lg active:scale-95">
                      <PhoneOff className="h-7 w-7" />
                    </div>
                    <span className="mt-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-500 transition-colors group-hover:text-red-500">
                      Decline
                    </span>
                  </button>

                  <button
                    onClick={handleAcceptCall}
                    className="group relative flex flex-col items-center"
                  >
                    {!timerActive && (
                      <div className="absolute inset-0 rounded-full bg-teal-400/20 animate-ping" />
                    )}
                    <div className="absolute inset-0 rounded-full bg-teal-500/20 blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-md shadow-blue-500/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-teal-500/20 active:scale-95">
                      <Phone className="h-7 w-7" />
                    </div>
                    <span className="mt-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-500 transition-colors group-hover:text-teal-600">
                      {timerActive ? "Connected" : "Accept"}
                    </span>
                  </button>
                </div>

                <div className="mt-8 border-t border-gray-100 pt-5">
                  <div className="flex items-center justify-center gap-2 text-center">
                    <Info className="h-4 w-4 shrink-0 text-blue-500" />
                    <span className="text-xs leading-relaxed text-gray-400">
                      {timerActive
                        ? "Call in progress. Use the controls above to manage."
                        : "This call is protected with secure communication."}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 text-center">
              <div className="inline-flex items-center gap-3 rounded-full border border-gray-200 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                <span className="text-[10px] uppercase tracking-[0.18em] text-gray-400">
                  Tarainn Hotel Guest Services
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes callRing {
          0% {
            transform: scale(0.85);
            opacity: 0.5;
          }
          70% {
            opacity: 0.15;
          }
          100% {
            transform: scale(1.35);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-ping,
          .animate-pulse {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}