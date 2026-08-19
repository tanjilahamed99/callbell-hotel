import React from "react";
import { Link } from "react-router-dom";
import { DoorClosed, ArrowLeft, PhoneCall } from "lucide-react";

const NotFound = () => {
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

      <div className="relative z-10 w-full max-w-md text-center">
        {/* Brand mark */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-teal-500 shadow-md">
            <PhoneCall className="h-7 w-7 text-white" strokeWidth={1.6} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Call<span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">Bell</span>
          </h1>
          <p className="mt-1 text-xs uppercase tracking-[0.3em] text-gray-500">
            Guest Services Portal
          </p>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
            <span className="absolute inset-0 -m-3 rounded-full border border-teal-300/60" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-gradient-to-r from-blue-600 to-teal-500 shadow-md">
              <DoorClosed className="h-9 w-9 text-white" />
            </div>
          </div>

          <h2 className="mb-2 text-5xl font-bold text-gray-900">404</h2>
          <h3 className="mb-3 text-xl font-bold text-gray-900">
            This room doesn't exist
          </h3>
          <p className="mb-8 text-sm text-gray-500">
            The page you're looking for may have been moved, renamed, or
            never existed. Let's get you back to somewhere familiar.
          </p>

          <Link
            to="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-md transition-all duration-300 hover:from-blue-700 hover:to-teal-600 active:scale-[0.98]">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
          <span>Need help? Contact the front desk.</span>
        </div>
      </div>
    </div>
  );
};

export default NotFound;