/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import setAuthToken from "../config/setAuthToken";
import { BASE_URL } from "../config/constant";
import socket from "../utils/soket";
import Swal from "sweetalert2";
import myData from "../hooks/users/myData";
import updateUser, { updateContactList } from "../hooks/users/updateUser";

const CallContext = createContext();

export const Provider = ({ children }) => {
  const navigate = useNavigate();
  // Global state
  const [incomingCall, setIncomingCall] = useState(null);
  const [user, setUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myInfo, setMyInfo] = useState(null);
  const [isRoomClosed, setIsRoomClosed] = useState(false);
  const guest = JSON.parse(localStorage.getItem("guest"));


  const logout = async () => {
    await updateUser({ id: myInfo.id, data: { busy: false } });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    navigate("/login");
    Swal.fire({
      title: "Successful",
      text: "You have logged out!",
      icon: "success",
    });
  };

  // ✅ INIT LOGIC (moved from your init.js)
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      document.addEventListener("gesturestart", (e) => {
        e.preventDefault();
      });

      // Version check
      if (localStorage.getItem("app") !== "CallBell-hotel 2.x.x") {
        localStorage.clear();
        localStorage.setItem("app", "CallBell-hotel 2.x.x");
      }

      let token = localStorage.getItem("token");
      let userString = localStorage.getItem("user");
      let user = userString ? JSON.parse(userString) : null;

      if (token) {
        const decoded = jwtDecode(token, { complete: true });
        const dateNow = new Date();
        const isExpired = decoded.exp * 1000 < dateNow.getTime();

        let result;
        if (!isExpired) {
          try {
            const res = await axios.post(`${BASE_URL}/auth/check-user`, {
              id: decoded.id,
            });
            result = res.data;
          } catch (err) {
            console.log(err);
            result = null;
          }
        }

        if (!result || result.error) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          token = null;
          user = null;
        }
      }

      if (token) {
        setAuthToken(token);
        await updateUser({ id: user.id, data: { busy: false } });
      }

      // Push values into global state
      setToken(token);
      setUser(user);
      setLoading(false);
    };

    init();
  }, []);

  // ✅ SOCKET HANDLING
  useEffect(() => {
    socket.on("connection", () => {
      console.log("✅ Socket connected");
    });

    if (user) {
      socket.emit("register", user.id);
    }
    if (!user) {
      socket.emit("register", guest.id);
    }
    socket.on("registered", ({ userId, socketId }) => {
      // Send socket ID to Android native
      if (window.Android && window.Android.onSocketIdAvailable) {
        window.Android.onSocketIdAvailable(socketId);
      }
    });
    socket.on("incoming-call", ({ from, roomName, room }) => {
      console.log("call coming");
      setIncomingCall({ from, roomName, room });
      setModalOpen(true);
    });

    if (user) {
      socket.on("call-accepted", async ({ roomName, peerSocketId }) => {
        await updateUser({ id: user.id, data: { busy: true } });
        navigate(
          `/room?roomName=${roomName}&username=${user.name}&peerSocketId=${peerSocketId}`,
        );
      });
    }

    socket.on("end-call", async () => {
      if (user) {
        await updateUser({ id: user.id, data: { busy: false } });
        const callStart = Number(localStorage.getItem("callStart"));

        if (!callStart) {
          return navigate("/dashboard");
        }

        const totalSeconds = Math.floor((Date.now() - callStart) / 1000);
        const totalMinutes = totalSeconds / 60;

        const newData = {
          gestId: incomingCall.from.gestId,
          gestName: incomingCall.from.name,
          gestPhone: incomingCall.from.gestPhone,
          duration: totalMinutes,
        };

        await updateContactList({
          id: user.id,
          data: newData,
        });

        fetch();
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    });

    socket.on("callCanceled", (data) => {
      if (data.success) {
        setModalOpen(false);
        setIncomingCall(null);
      }
    });

    return () => {
      socket.off("incoming-call");
      socket.off("call-accepted");
      socket.off("call-declined");
      socket.off("end-call");
      socket.off("callCanceled");
    };
  }, [user, navigate, myInfo]);

  useEffect(() => {
    if (user?.id) {
      const fetch = async () => {
        const { data } = await myData({ id: user?.id });
        if (data.success) {
          setMyInfo(data.data);
        }
      };
      fetch();
    }
  }, [token, user]);

  // ✅ Helper functions
  const declineCall = useCallback(() => {
    if (!incomingCall) return;
    socket.emit("call-declined", { guestSocketId: incomingCall.from.socketId });
    setModalOpen(false);
    setIncomingCall(null);
  }, [incomingCall]);

  const acceptCall = useCallback(async () => {
    if (!incomingCall) return;

    socket.emit("call-accepted", {
      roomName: incomingCall.roomName,
      guestSocketId: incomingCall.from.socketId,
    });
    setModalOpen(false);
    // when call starts
    const startTime = Date.now(); // milliseconds
    localStorage.setItem("callStart", startTime);

    // set user busy
    await updateUser({ id: user.id, data: { busy: true } });
    navigate(
      `/room?roomName=${incomingCall.roomName}&username=${user.name}&peerSocketId=${incomingCall.from.socketId}`,
    );
  }, [incomingCall, navigate, user, myInfo]);

  // ✅ Helper functions
  const handleEndCall = useCallback(
    async (peerSocketId) => {
      if (user) {
        // set user busy
        await updateUser({ id: user.id, data: { busy: false } });
        const callStart = Number(localStorage.getItem("callStart"));

        if (!callStart) {
          return navigate("/dashboard");
        }

        const totalSeconds = Math.floor((Date.now() - callStart) / 1000);
        const totalMinutes = totalSeconds / 60;

        if (totalMinutes <= 0) {
          return navigate("/dashboard"); // redirect back to home (or show a modal)
        }
        const newData = {
          gestId: incomingCall.from.gestId,
          gestName: incomingCall.from.name,
          gestPhone: incomingCall.from.gestPhone,
          duration: totalMinutes,
        };

        const fetch = async () => {
          await updateContactList({
            id: user.id,
            data: newData,
          });
        };
        fetch();

        socket.emit("end-call", {
          targetSocketId: incomingCall.from.gestSocketId,
        });
        navigate("/dashboard");
      } else {
        socket.emit("end-call", { targetSocketId: peerSocketId });
        navigate("/login");
      }
      localStorage.removeItem("callStart");
    },
    [navigate],
  );

  // ✅ Data available everywhere
  const data = {
    handleEndCall,
    incomingCall,
    declineCall,
    acceptCall,
    modalOpen,
    user,
    setUser,
    token,
    setToken,
    logout,
    loading,
    isRoomClosed,
    setIsRoomClosed,
  };

  return <CallContext.Provider value={data}>{children}</CallContext.Provider>;
};

export const useCall = () => useContext(CallContext);
