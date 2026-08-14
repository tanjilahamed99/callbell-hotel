"use client";

import { useEffect, useState, useRef } from "react";
import { useCall } from "../../Provider/Provider";
import { Phone, PhoneCall, PhoneOff, User, X, Clock, Info } from "lucide-react";

export default function CallPopup() {
  const { incomingCall, declineCall, acceptCall, modalOpen } = useCall();
  const [canPlaySound, setCanPlaySound] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const audioRef = useRef(null);

  // Enable sound on first user interaction
  useEffect(() => {
    const enableSound = () => setCanPlaySound(true);
    window.addEventListener("click", enableSound, { once: true });
    window.addEventListener("keydown", enableSound, { once: true });
    return () => {
      window.removeEventListener("click", enableSound);
      window.removeEventListener("keydown", enableSound);
    };
  }, []);

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

  // Handle call acceptance
  const handleAcceptCall = () => {
    window.stopCallRingtone?.();
    setTimerActive(true);
    acceptCall();
  };

  // Handle call decline
  const handleDeclineCall = () => {
    window.stopCallRingtone?.();
    setTimerActive(false);
    declineCall();
  };

  // Play / stop ringtone
  useEffect(() => {
    if (!incomingCall || !canPlaySound) return;

    // Create audio only once
    if (!audioRef.current) {
      audioRef.current = new Audio("/ring.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.7;
    }

    // Play audio if modal is open
    if (modalOpen && incomingCall) {
      audioRef.current
        .play()
        .catch((err) => console.log("Autoplay prevented:", err));
    } else {
      // Stop audio when modal closes
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }

    // Cleanup when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [incomingCall, canPlaySound, modalOpen]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        window.stopCallRingtone?.();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  if (!incomingCall) return null;

  return (
    <>
      {modalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-red-900/30 to-red-600/20 backdrop-blur-lg"
            onClick={handleDeclineCall}
          />

          {/* Call popup container */}
          <div className="relative w-full max-w-md mx-auto">
            {/* Animated ring effect */}
            <div className="absolute inset-0 -z-10">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute inset-0 rounded-3xl bg-red-500/10"
                  style={{
                    animation: `pulse 2s ease-in-out ${i * 0.5}s infinite`,
                    transform: `scale(${1 + i * 0.15})`,
                  }}
                />
              ))}
            </div>

            {/* Main popup card */}
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-700">
              {/* Header with close button */}
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={handleDeclineCall}
                  className="p-2 rounded-full bg-gray-800/80 hover:bg-red-600/80 text-gray-300 hover:text-white transition-all backdrop-blur-sm">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Caller avatar with pulse effect */}
                <div className="relative mx-auto mb-6 w-32 h-32">
                  {/* Outer pulse rings */}
                  <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping"></div>
                  <div className="absolute inset-0 rounded-full bg-red-500/15 animate-ping delay-300"></div>
                  <div className="absolute inset-0 rounded-full bg-red-500/10 animate-ping delay-600"></div>

                  {/* Avatar */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-600 to-red-700 shadow-lg flex items-center justify-center z-10">
                    {incomingCall?.from?.avatar ? (
                      <img
                        src={incomingCall.from.avatar}
                        alt={incomingCall.from.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <User className="w-16 h-16 text-white/90" />
                        <span className="text-white/80 text-sm mt-1">
                          Calling...
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Caller info */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <PhoneCall className="w-5 h-5 text-red-400 animate-bounce" />
                    <h2 className="text-xl font-bold text-white">
                      {timerActive ? "Active Call" : "Incoming Call"}
                    </h2>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">
                    {incomingCall.from.name}
                  </h3>

                  <p className="text-gray-300">Video Call Request</p>

                  {incomingCall.from.email && (
                    <p className="text-sm text-gray-400 mt-1">
                      {incomingCall.from.email}
                    </p>
                  )}
                </div>

                {/* Call controls */}
                <div className="space-y-6">
                  {/* Main action buttons */}
                  <div className="flex items-center justify-center gap-6">
                    <button
                      onClick={handleDeclineCall}
                      className="relative group">
                      <div className="absolute inset-0 rounded-full bg-red-600/30 group-hover:bg-red-600/50 animate-ping"></div>
                      <div className="relative flex flex-col items-center gap-2 p-4 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-red-500/30 transition-all">
                        <PhoneOff className="w-8 h-8" />
                        <span className="text-xs font-medium">Decline</span>
                      </div>
                    </button>

                    <button
                      onClick={handleAcceptCall}
                      className="relative group">
                      <div className="absolute inset-0 rounded-full bg-green-600/30 group-hover:bg-green-600/50 animate-ping delay-150"></div>
                      <div className="relative flex flex-col items-center gap-2 p-4 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-500/30 transition-all">
                        <Phone className="w-8 h-8" />
                        <span className="text-xs font-medium">Accept</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Additional info */}
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                    <Info className="w-4 h-4" />
                    <span>
                      {timerActive
                        ? "Call in progress. Use controls above to manage."
                        : "This call will be encrypted end-to-end."}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Keyboard shortcuts hint */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-4 text-sm text-white/60 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
                <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">Esc</kbd>
                <span>Decline call</span>

                <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">
                  Enter
                </kbd>
                <span>Accept call</span>

                <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">M</kbd>
                <span>Toggle sound</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.2;
            transform: scale(1.05);
          }
        }
      `}</style>
    </>
  );
}
