import axios from "axios";
import { BASE_URL } from "../../config/constant";
import { useCall } from "../../Provider/Provider";
import { useEffect, useState } from "react";
import getWebsiteData from "../../hooks/admin/getWebisteData";
import {
  CheckCircle,
  Star,
  Zap,
  Shield,
  Users,
  Clock,
  Calendar,
  TrendingUp,
  Award,
  ArrowRight,
  CreditCard,
  HelpCircle,
  RefreshCw,
  X,
} from "lucide-react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import userFreeTrail from "../../hooks/users/userFreeTrail";
import myData from "../../hooks/users/myData";
import {
  createRazorpayPaymentIntent,
  getRazorpayKey,
} from "../../hooks/payment";

const PaymentModal = ({ plan, onClose, onSelect }) => {
  const [selected, setSelected] = useState("paygic");

  const [paygic, setPaygic] = useState(null);
  const [razorpay, setRazorpay] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await getWebsiteData();
      if (data.success) {
        setPaygic(data.data.paymentMethod.paygic);
        setRazorpay(data.data.paymentMethod.razorpay);
      }
    };
    fetch();
  }, []);

  if (!plan) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <CreditCard className="w-7 h-7 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Choose Payment Method
          </h2>
          <p className="text-sm text-gray-500">
            {plan.name} &mdash; ₹{plan.price} &bull; {plan.duration} Days
          </p>
        </div>

        {/* Payment Options */}
        <div className="flex flex-col gap-3 mb-6">
          {/* Paygic */}
          <button
            hidden={paygic ? false : true}
            onClick={() => setSelected("paygic")}
            className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
              selected === "paygic"
                ? "border-red-500 bg-red-50"
                : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100"
            }`}>
            <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center border border-gray-200 flex-shrink-0 shadow-sm">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">Paygic</p>
              <p className="text-xs text-gray-500 mt-0.5">
                UPI · Cards · Net Banking
              </p>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                selected === "paygic"
                  ? "border-red-500 bg-red-500"
                  : "border-gray-300 bg-white"
              }`}>
              {selected === "paygic" && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
          </button>

          {/* Razorpay */}
          <button
            hidden={razorpay ? false : true}
            onClick={() => setSelected("razorpay")}
            className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
              selected === "razorpay"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100"
            }`}>
            <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center border border-gray-200 flex-shrink-0 shadow-sm">
              <Zap className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">Razorpay</p>
              <p className="text-xs text-gray-500 mt-0.5">
                UPI · Cards · Wallets · EMI
              </p>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                selected === "razorpay"
                  ? "border-blue-500 bg-blue-500"
                  : "border-gray-300 bg-white"
              }`}>
              {selected === "razorpay" && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
          </button>
        </div>

        {/* Amount Summary */}
        <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 mb-5 border border-gray-100">
          <span className="text-sm text-gray-600">Total amount</span>
          <span className="text-lg font-bold text-gray-900">₹{plan.price}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer">
            Cancel
          </button>
          <button
            onClick={() => onSelect(selected)}
            className="flex-[2] py-3 px-6 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md">
            Continue to Payment
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Subscriptions = () => {
  const { user } = useCall();
  const [sub, setSub] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [modalPlan, setModalPlan] = useState(null);
  const [razorpayKey, setRazorpayKey] = useState(null);

  const features = [
    { icon: CheckCircle, text: "HD Voice Quality", color: "text-green-500" },
    { icon: Shield, text: "End-to-End Encryption", color: "text-blue-500" },
    { icon: Users, text: "Unlimited Contacts", color: "text-purple-500" },
    { icon: Clock, text: "24/7 Support", color: "text-orange-500" },
    { icon: Zap, text: "Instant Connection", color: "text-yellow-500" },
    { icon: Award, text: "Priority Support", color: "text-red-500" },
  ];

  const handlePaymentSelect = async (gateway) => {
    const { _id: id, price, name: planName } = modalPlan;
    setModalPlan(null);

    if (gateway === "paygic") {
      try {
        const { data } = await axios.post(`${BASE_URL}/paygic/getPage`, {
          amount: price,
          userId: user.id,
          subId: id,
        });
        if (data.success) {
          window.location.href = data.payPageUrl;
        }
      } catch (error) {
        console.log(error);
        Swal.fire({
          title: "Error",
          text: "Failed to initiate payment. Please try again.",
          icon: "error",
          confirmButtonColor: "#dc2626",
        });
      }
    } else {
      try {
        if (!razorpayKey) {
          Swal.fire({
            title: "Error",
            text: "Credentials Error",
            icon: "error",
            confirmButtonColor: "#dc2626",
          });
        }

        const receiptId = `receipt_CallBell_${Date.now()}`;
        const intentData = {
          amount: price * 100,
          currency: "INR",
          receipt: receiptId,
          notes: {
            userId: user.id,
            subId: id,
            amount: price,
          },
        };
        const { data } = await createRazorpayPaymentIntent(intentData);

        localStorage.setItem(
          "pendingRazorpayOrder",
          JSON.stringify({ orderId: data.id, subId: id, ts: Date.now() }),
        );

        const options = {
          key: razorpayKey,
          amount: price * 100,
          name: "CallBell",
          description: planName,
          image: "https://i.ibb.co.com/Cp5QMrHM/icon.png",
          order_id: data.id,
          handler(res) {
            localStorage.removeItem("pendingRazorpayOrder");
            window.location.href = `/dashboard/razorpay?orderId=${res.razorpay_order_id}&subId=${id}`;
          },
          modal: {
            // Fires when user closes the checkout, whether or not payment happened
            ondismiss: () => {
              // Don't remove localStorage here — we still want to verify on next check
              window.location.href = `/dashboard/razorpay?orderId=${data.id}&subId=${id}`;
            },
          },
          prefill: {
            name: "CallBell User",
            email: "calbell@gmail.com",
            contact: "00000000000",
          },
          notes: { address: "CallBell Corporate Office" },
          theme: { color: "#dc2626" },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.on("payment.failed", (response) => {
          console.log("payment failed message :", response);
          Swal.fire({
            title: "Payment Failed",
            text: response.error.description || "Something went wrong.",
            icon: "error",
            confirmButtonColor: "#dc2626",
          });
        });
        rzp1.open();
      } catch (error) {
        console.log(error);
        Swal.fire({
          title: "Error",
          text: "Failed to initiate Razorpay payment. Please try again.",
          icon: "error",
          confirmButtonColor: "#dc2626",
        });
      }
    }
  };

  const freeTrail = async (planId) => {
    try {
      const { data } = await userFreeTrail({ id: user.id, planId });
      if (data.success) {
        Swal.fire({
          title: "Success",
          text: "Trial subscription started!",
          icon: "success",
          confirmButtonColor: "#dc2626",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Something went wrong.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  useEffect(() => {
    const pending = localStorage.getItem("pendingRazorpayOrder");
    if (pending) {
      const { orderId, subId, ts } = JSON.parse(pending);
      // only chase orders from the last ~30 min, ignore stale ones
      if (Date.now() - ts < 30 * 60 * 1000) {
        window.location.href = `/dashboard/razorpay?orderId=${orderId}&subId=${subId}`;
      } else {
        localStorage.removeItem("pendingRazorpayOrder");
      }
    }
  }, []);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await getWebsiteData();
        if (data.success) {
          setSub(data.data.plan || []);
        }
        if (user.id) {
          const { data } = await myData({ id: user.id });
          setUserData(data.data);
        }

        const { data: res } = await getRazorpayKey();
        if (res.success) {
          setRazorpayKey(res.key);
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-red-600 to-red-700 animate-pulse mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
            </div>
          </div>
          <p className="text-gray-600 mt-4 font-medium">
            Loading subscription plans...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Payment Modal */}
      <PaymentModal
        plan={modalPlan}
        onClose={() => setModalPlan(null)}
        onSelect={handlePaymentSelect}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-red-50 rounded-full mb-4">
              <Star className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Choose Your <span className="text-red-600">Plan</span>
            </h1>
            <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-3xl mx-auto">
              Select the perfect plan for your communication needs. All plans
              include our core features.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-50 to-green-100 flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-xl font-bold text-gray-900">10K+</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center mr-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Satisfaction Rate</p>
                  <p className="text-xl font-bold text-gray-900">98%</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-red-50 to-red-100 flex items-center justify-center mr-3">
                  <TrendingUp className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Uptime</p>
                  <p className="text-xl font-bold text-gray-900">99.9%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="mb-8 sm:mb-10">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                All Plans Include
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center p-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-50 to-white border border-gray-200 flex items-center justify-center mb-3">
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Subscription Plans */}
          {sub.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sub.map((plan, idx) => {
                const isPopular = idx === 1;
                return (
                  <div
                    key={idx}
                    className={`relative group ${
                      isPopular
                        ? "transform lg:scale-105 lg:-translate-y-2"
                        : ""
                    }`}>
                    {/* Popular Badge */}
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          MOST POPULAR
                        </div>
                      </div>
                    )}

                    {/* Plan Card */}
                    <div
                      className={`h-full bg-white rounded-2xl shadow-lg border overflow-hidden transition-all duration-300 hover:shadow-xl ${
                        isPopular ? "border-red-300" : "border-gray-100"
                      }`}>
                      {/* Plan Header */}
                      <div
                        className={`p-6 text-center ${
                          isPopular
                            ? "bg-gradient-to-r from-red-600 to-red-700"
                            : "bg-gradient-to-r from-gray-900 to-black"
                        }`}>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {plan?.name}
                        </h3>
                        <div className="flex items-center justify-center gap-2 text-white/90">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            {plan?.duration} Days Plan
                          </span>
                        </div>
                      </div>

                      {/* Price Section */}
                      <div className="p-6 border-b border-gray-100">
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <span className="text-3xl font-bold text-gray-900">
                              ₹
                            </span>
                            <span className="text-5xl font-bold text-gray-900 ml-1">
                              {plan?.price}
                            </span>
                          </div>
                          <p className="text-gray-600">One-time payment</p>
                          <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">
                              ₹{Math.round(plan?.price / plan?.duration)} per
                              day
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="p-6">
                        <h4 className="text-lg font-bold text-gray-900 mb-4">
                          What's Included
                        </h4>
                        <ul className="space-y-3">
                          <li className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="w-3 h-3 text-green-600" />
                            </div>
                            <span className="text-gray-700">
                              {plan?.minute || 500} Minutes Call Time
                            </span>
                          </li>
                          <li className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="w-3 h-3 text-green-600" />
                            </div>
                            <span className="text-gray-700">
                              HD Audio Quality
                            </span>
                          </li>
                          <li className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="w-3 h-3 text-green-600" />
                            </div>
                            <span className="text-gray-700">
                              Unlimited Contacts
                            </span>
                          </li>
                          <li className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="w-3 h-3 text-green-600" />
                            </div>
                            <span className="text-gray-700">
                              24/7 Customer Support
                            </span>
                          </li>
                          <li className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="w-3 h-3 text-green-600" />
                            </div>
                            <span className="text-gray-700">
                              Secure End-to-End Encryption
                            </span>
                          </li>
                        </ul>
                      </div>

                      {/* Action Button */}
                      <div className="p-6 pt-0">
                        {plan.price <= 0 ? (
                          <button
                            disabled={userData?.subscription?.freeTrail}
                            onClick={() => freeTrail(plan._id)}
                            className={`w-full py-3.5 cursor-pointer px-6 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${
                              isPopular
                                ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hover:shadow-lg"
                                : "bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 hover:shadow-lg"
                            }`}>
                            <CreditCard className="w-5 h-5" />
                            {userData?.subscription?.freeTrail
                              ? "Already Used"
                              : "Start Free Trial"}
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setModalPlan(plan)}
                            className={`w-full cursor-pointer py-3.5 px-6 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                              isPopular
                                ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hover:shadow-lg"
                                : "bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 hover:shadow-lg"
                            }`}>
                            <CreditCard className="w-5 h-5" />
                            Get Started
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-red-50 to-white border border-red-100 flex items-center justify-center mb-6">
                <HelpCircle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No Plans Available
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                Subscription plans are currently being updated. Please check
                back soon.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200">
                <RefreshCw className="w-4 h-4" />
                Refresh Plans
              </button>
            </div>
          )}

          {/* FAQ Section */}
          <div className="mt-12 sm:mt-16">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-4">
                    <h4 className="font-bold text-gray-900 mb-2">
                      Can I upgrade or downgrade my plan?
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Yes, you can upgrade or downgrade at any time. Changes
                      take effect immediately.
                    </p>
                  </div>
                  <div className="border-b border-gray-100 pb-4">
                    <h4 className="font-bold text-gray-900 mb-2">
                      Is there a free trial?
                    </h4>
                    <p className="text-gray-600 text-sm">
                      We offer a 7-day free trial for all premium plans. No
                      credit card required.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-4">
                    <h4 className="font-bold text-gray-900 mb-2">
                      What payment methods do you accept?
                    </h4>
                    <p className="text-gray-600 text-sm">
                      We accept all major credit cards, debit cards, UPI, and
                      net banking via Paygic and Razorpay.
                    </p>
                  </div>
                  <div className="border-b border-gray-100 pb-4">
                    <h4 className="font-bold text-gray-900 mb-2">
                      Can I cancel anytime?
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Yes, you can cancel your subscription at any time. No
                      long-term contracts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Support CTA */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Need help choosing a plan?</p>
            <Link to={"/contact"}>
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-semibold">
                <HelpCircle className="w-4 h-4" />
                Contact Support
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Subscriptions;
