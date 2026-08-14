import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, XCircle, Loader, ArrowRight } from "lucide-react";
import { verifyRazorpayPayment } from "../../hooks/payment";
import { useCall } from "../../Provider/Provider";

const RazorpayCheck = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { user } = useCall();
  const subId = searchParams.get("subId");

  const [status, setStatus] = useState("checking"); // checking | success | failed
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!orderId) {
      setStatus("failed");
      setMessage("No order ID found in URL.");
      return;
    }

    let cancelled = false;

    const check = async (attempt = 1) => {
      try {
        const { data } = await verifyRazorpayPayment({
          orderId,
          userId: user.id,
          subId,
        });

        if (cancelled) return;

        if (data.success) {
          setStatus("success");
          setMessage(data.message || "Your subscription is now active.");
          localStorage.removeItem("pendingRazorpayOrder");
          return;
        }

        // Payment not captured yet — retry a few times (e.g. UPI can take a moment)
        if (attempt < 6) {
          setTimeout(() => check(attempt + 1), 2000);
        } else {
          setStatus("failed");
          setMessage(data.message || "Payment could not be verified.");
        }
      } catch (err) {
        if (cancelled) return;
        console.log(err);
        if (attempt < 6) {
          setTimeout(() => check(attempt + 1), 2000);
        } else {
          setStatus("failed");
          setMessage("Something went wrong while verifying your payment.");
        }
      }
    };

    check();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-md w-full text-center">
        {status === "checking" && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <Loader className="w-8 h-8 text-red-600 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Checking your payment...
            </h2>
            <p className="text-gray-600 text-sm">
              Please wait a moment while we confirm your payment with Razorpay.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 text-sm mb-6">{message}</p>
            <Link to="/dashboard/subscriptions">
              <button className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold flex items-center justify-center gap-2 cursor-pointer">
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Payment Not Verified
            </h2>
            <p className="text-gray-600 text-sm mb-6">{message}</p>
            <Link to="/dashboard/subscriptions">
              <button className="w-full py-3 px-6 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 cursor-pointer">
                Back to Plans
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default RazorpayCheck;
