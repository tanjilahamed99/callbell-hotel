import { useEffect, useState } from "react";
import updateGestData from "../../hooks/gest/updateGestData";
import Swal from "sweetalert2";
import BlockedScreen from "./BlockedScreen";
import { DoorClosed, User } from "lucide-react";

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

const GuestModal = ({ setShowUser }) => {
  useBrandFonts();

  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedGuest = localStorage.getItem("guest");

    if (!storedGuest) setShowModal(true);
  }, []);

  const handleSubmit = async () => {
    if (!name.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Name required",
        text: "Please enter your full name.",
        background: "#101820",
        color: "#f1ece2",
        confirmButtonColor: "#b8892b",
      });
    }

    if (!room.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Room number required",
        text: "Please enter your room number.",
        background: "#101820",
        color: "#f1ece2",
        confirmButtonColor: "#b8892b",
      });
    }

    try {
      setLoading(true);

      const { data } = await updateGestData({ name, room });

      // success case
      localStorage.setItem(
        "guest",
        JSON.stringify({ name, room, id: data?._id }),
      );
      setShowModal(false);
      setShowUser(true);
    } catch (error) {
      // 403 = blocked
      if (error.response?.status === 403 && error.response?.data?.blocked) {
        setShowModal(false);
        // setIsBlocked(true);
        return;
      }

      // any other error
      setShowModal(false);
      await Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: error.response?.data?.message || error.message,
        background: "#101820",
        color: "#f1ece2",
        confirmButtonColor: "#b8892b",
      });
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  // Show blocked screen instead of modal
  // if (isBlocked) return <BlockedScreen />;

  if (!showModal) return null;

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      style={{ background: "rgba(10, 15, 21, 0.75)" }}>
      <div
        className="relative w-full max-w-[420px] overflow-hidden rounded-2xl border border-[#b8892b]/20 shadow-2xl backdrop-blur-xl z-[9999]"
        style={{
          background:
            "linear-gradient(135deg, rgba(22,34,47,0.95) 0%, rgba(14,22,30,0.95) 50%, rgba(22,34,47,0.95) 100%)",
          fontFamily: "'Inter', ui-sans-serif, sans-serif",
        }}>
        {/* Top accent bar */}
        <div className="h-1 bg-gradient-to-r from-[#b8892b] to-[#c9a24b]" />

        <div className="p-8">
          {/* Brand */}
          <div className="mb-6 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#b8892b] to-[#8a651c]">
              <DoorClosed className="h-4 w-4 text-[#0a0f15]" />
            </div>
            <span className="text-[17px] font-medium text-[#f1ece2]">
              The Meridian
            </span>
          </div>

          {/* Heading */}
          <h2
            className="mb-1 text-[22px] leading-snug text-[#f1ece2]"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 600,
            }}>
            Welcome aboard
          </h2>
          <p className="mb-7 text-sm text-[#f1ece2]/45">
            Confirm your details to start your call.
          </p>

          {/* Name */}
          <div className="mb-4">
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[#c9a24b]/70">
              Full name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#c9a24b]/50" />
              <input
                type="text"
                placeholder="Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-[46px] w-full rounded-xl border border-[#b8892b]/20 bg-[#0a0f15]/60 pl-10 pr-3.5 text-[15px] text-[#f1ece2] placeholder:text-[#f1ece2]/30 outline-none transition focus:border-[#c9a24b] focus:ring-4 focus:ring-[#c9a24b]/15"
              />
            </div>
          </div>

          {/* Room Number */}
          <div className="mb-0">
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[#c9a24b]/70">
              Room number
            </label>
            <div className="relative">
              <DoorClosed className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#c9a24b]/50" />
              <input
                type="text"
                placeholder="e.g. 214"
                maxLength={6}
                value={room}
                onChange={(e) =>
                  setRoom(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))
                }
                className="h-[46px] w-full rounded-xl border border-[#b8892b]/20 bg-[#0a0f15]/60 pl-10 pr-3.5 text-[15px] text-[#f1ece2] placeholder:text-[#f1ece2]/30 outline-none transition focus:border-[#c9a24b] focus:ring-4 focus:ring-[#c9a24b]/15"
              />
            </div>
          </div>

          <hr className="my-5 border-[#b8892b]/10" />

          {/* Perks */}
          <ul className="mb-6 space-y-2">
            {[
              "Instant video calling — no downloads",
              "End-to-end encrypted calls",
              "Reach any department in one tap",
            ].map((perk) => (
              <li
                key={perk}
                className="flex items-center gap-2 text-[13px] text-[#f1ece2]/45">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#c9a24b]" />
                {perk}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#b8892b] to-[#8a651c] text-[15px] font-semibold uppercase tracking-wide text-[#0a0f15] shadow-lg transition-all duration-300 hover:shadow-[0_10px_30px_-8px_rgba(184,137,43,0.5)] disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]">
            {loading ? "Saving..." : "Get started"}
            {!loading && (
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2">
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>

          <p className="mt-4 flex items-center justify-center gap-1 text-center text-[12px] text-[#f1ece2]/35">
            <svg
              className="h-3 w-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Your information is private and secure
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuestModal;