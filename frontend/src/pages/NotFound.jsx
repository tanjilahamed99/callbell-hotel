import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { DoorClosed, ArrowLeft, BellRing } from "lucide-react";

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

const NotFound = () => {
  useBrandFonts();

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

      <div className="relative z-10 w-full max-w-md text-center">
        {/* Brand mark */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full border border-[#b8892b]/50 bg-gradient-to-br from-[#182633] to-[#0a0f15] shadow-[0_0_30px_rgba(184,137,43,0.12)]">
            <BellRing className="h-7 w-7 text-[#c9a24b]" strokeWidth={1.6} />
          </div>
          <h1
            className="text-2xl tracking-tight text-[#f1ece2]"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 600,
            }}>
            The Meridian
          </h1>
          <p className="mt-1 text-xs uppercase tracking-[0.3em] text-[#c9a24b]/70">
            Guest Services Portal
          </p>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-2xl border border-[#b8892b]/20 bg-gradient-to-br from-[#16222f]/90 via-[#0e161e]/90 to-[#16222f]/90 p-8 shadow-2xl backdrop-blur-xl">
          <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
            <span className="absolute inset-0 -m-3 rounded-full border border-[#c9a24b]/20" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#0a0f15]/30 bg-gradient-to-br from-[#b8892b] to-[#8a651c] shadow-lg">
              <DoorClosed className="h-9 w-9 text-[#0a0f15]" />
            </div>
          </div>

          <h2
            className="mb-2 text-5xl text-[#f1ece2]"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 700,
            }}>
            404
          </h2>
          <h3
            className="mb-3 text-xl text-[#f1ece2]"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 600,
            }}>
            This room doesn't exist
          </h3>
          <p className="mb-8 text-sm text-[#f1ece2]/45">
            The page you're looking for may have been moved, renamed, or
            never existed. Let's get you back to somewhere familiar.
          </p>

          <Link
            to="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#b8892b] to-[#8a651c] px-5 py-3 text-sm font-semibold uppercase tracking-wide text-[#0a0f15] shadow-lg transition-all duration-300 hover:shadow-[0_10px_30px_-8px_rgba(184,137,43,0.5)] active:scale-[0.98]">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#f1ece2]/35">
          <span>Need help? Contact the front desk.</span>
        </div>
      </div>
    </div>
  );
};

export default NotFound;