"use client";

import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { useCall } from "../../Provider/Provider";
import socket from "../../utils/soket";
import { useNavigate } from "react-router-dom";
import CallRequest from "./CallRequest";

export default function CallManager({
  userId,
  userName = "CallBell-user",
  isBusy,
  setActiveCall,
}) {
  const [waitingCall, setWaitingCall] = useState(false);
  const { user } = useCall();
  const guest = JSON.parse(localStorage.getItem("guest"));
  const guestName = guest.name;
  const gestId = guest.id;
  const gestRoom = guest.room;

  console.log(userId);

  const navigate = useNavigate();

  useEffect(() => {
    socket.on("call-accepted", ({ roomName, peerSocketId }) => {
      setWaitingCall(false);
      navigate(
        `/room?roomName=${roomName}&username=${
          guestName || "Guest"
        }&peerSocketId=${peerSocketId}`,
      );
    });
    // 👇 Guest hears decline
    socket.on("call-declined", () => {
      Swal.fire({
        icon: "error",
        title: "Call Declined",
        text: "Your call could not be connected because it was declined.",
        confirmButtonText: "OK",
        confirmButtonColor: "#dc2626", // Professional red
        background: "#ffffff",
        color: "#1f2937",
      });

      setWaitingCall(false); // hide waiting modal
      navigate("/login");
    });

    return () => {
      socket.off("incoming-call");
      socket.off("call-accepted");
      socket.off("call-declined");
    };
  }, [guestName, user, navigate]);

  const callRegisteredUser = useCallback(() => {
    if (!userId.trim()) return;

    if (isBusy) {
      return Swal.fire({
        icon: "warning",
        title: "User Currently Unavailable",
        text: "The user is currently busy. Please try again in a few minutes.",
        confirmButtonText: "OK",
        confirmButtonColor: "#2563eb", // Professional blue
        background: "#ffffff",
        color: "#1f2937",
      });
    }
    const roomName = `call_guest_${userId}_${Date.now()}`;
    setWaitingCall(true);

    socket.emit("guest-call", {
      from: guestName || "Guest",
      to: userId,
      roomName,
      gestId,
      room: gestRoom,
    });
  }, [userId, guestName, gestRoom]);

  const handleCloseCall = useCallback(() => {
    socket.emit("callCanceled", { userId });
    setWaitingCall(false);
  }, [userId]);

  return (
    <div className="flex gap-5 items-center justify-center w-full">
      <button
        onClick={callRegisteredUser}
        className="w-[70%] bg-green-600 text-white rounded-lg py-2 font-semibold hover:bg-green-700 transition">
        📞 Call {userName}
      </button>
      <button
        onClick={() => setActiveCall(null)}
        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg shadow hover:bg-gray-300 w-[30%]">
        Back
      </button>

      {/* Waiting Modal */}
      {waitingCall && (
        <CallRequest
          handleCloseCall={handleCloseCall}
          userName={userName}
          waitingCall={waitingCall}
        />
      )}
    </div>
  );
}
