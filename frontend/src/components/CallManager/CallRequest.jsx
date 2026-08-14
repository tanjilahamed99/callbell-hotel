import React, { useEffect, useRef, useState } from "react";

const CallRequest = ({ handleCloseCall, userName, waitingCall }) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="relative bg-white w-[90%] max-w-sm rounded-3xl shadow-2xl flex flex-col items-center p-8 text-center">
        {/* Pulsing avatar */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-green-400 opacity-30 animate-ping"></div>
          <div className="absolute inset-0 rounded-full bg-green-400 opacity-20 animate-ping delay-200"></div>
          <div className="w-28 h-28 bg-green-500 rounded-full flex items-center justify-center z-10 text-white text-3xl font-bold">
            {userName?.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Caller info */}
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
          Calling <span className="text-green-600">{userName}</span>
        </h2>
        <p className="text-gray-500 mb-6">Waiting for them to answer…</p>

        {/* Cancel button */}
        <button
          onClick={handleCloseCall}
          className="w-full py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 active:scale-95 transition transform shadow-md">
          Cancel Call
        </button>
      </div>
    </div>
  );
};

export default CallRequest;
