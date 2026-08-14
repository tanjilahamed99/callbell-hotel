import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Sparkles,
  Crown,
  PhoneCall,
  Volume2,
  Lock,
  Target,
  Globe,
  MessageCircle,
  Video,
  Headphones,
} from "lucide-react";
import getWebsiteData from "../../hooks/admin/getWebisteData";
import { useCall } from "../../Provider/Provider";

const SubscriptionHomeSection = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useCall();
  const navigate = useNavigate();

  const handleSub = () => {
    if (!user || !user.id) {
      return navigate("/login");
    } else {
      return navigate("/dashboard/subscriptions");
    }
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await getWebsiteData();
        if (data.success) {
          setPlans(data.data.plan || []);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const features = [
    {
      icon: Shield,
      text: "End-to-End Encryption",
      desc: "Military-grade security for all calls",
    },
    {
      icon: Volume2,
      text: "HD Audio Quality",
      desc: "Crystal clear audio experience",
    },
    {
      icon: Video,
      text: "HD Video Calls",
      desc: "High definition video streaming",
    },
    {
      icon: Lock,
      text: "Privacy First",
      desc: "Your conversations are private",
    },
    {
      icon: Target,
      text: "Reliable Connection",
      desc: "99.9% uptime guarantee",
    },
    {
      icon: Headphones,
      text: "24/7 Support",
      desc: "Always available to help you",
    },
  ];

  const stats = [
    { value: "10K+", label: "Active Users", icon: Users, color: "green" },
    { value: "99.9%", label: "Uptime", icon: CheckCircle, color: "blue" },
    { value: "24/7", label: "Support", icon: Clock, color: "orange" },
    { value: "100%", label: "Secure", icon: Shield, color: "purple" },
  ];

  const getPricePerMinute = (price, minutes) => {
    const priceNum = parseFloat(price);
    const minutesNum = parseFloat(minutes);
    if (minutesNum === 0) return "Unlimited";
    return (priceNum / minutesNum).toFixed(2);
  };

  const getValuePerDay = (price, duration) => {
    const priceNum = parseFloat(price);
    const durationNum = parseFloat(duration);
    if (durationNum === 0) return priceNum;
    return (priceNum / durationNum).toFixed(2);
  };

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-6"></div>
            <p className="text-gray-600">Loading subscription plans...</p>
          </div>
        </div>
      </section>
    );
  }

  if (plans.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-red-50 to-orange-50 flex items-center justify-center mb-6">
              <HelpCircle className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Plans Available
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Subscription plans are currently being updated. Please check back
              soon.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-100 to-orange-100 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-red-600" />
            <span className="text-sm font-semibold text-red-700">
              Premium Plans
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Perfect{" "}
            <span className="text-gradient bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              Plan
            </span>
          </h2>

          <p className="text-xl text-gray-600 mb-8">
            Flexible pricing designed for individuals and teams. All plans
            include premium features.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl ${
                    stat.color === "green"
                      ? "bg-green-50"
                      : stat.color === "blue"
                      ? "bg-blue-50"
                      : stat.color === "orange"
                      ? "bg-orange-50"
                      : "bg-purple-50"
                  }`}>
                  <stat.icon
                    className={`w-6 h-6 ${
                      stat.color === "green"
                        ? "text-green-600"
                        : stat.color === "blue"
                        ? "text-blue-600"
                        : stat.color === "orange"
                        ? "text-orange-600"
                        : "text-purple-600"
                    }`}
                  />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              All Plans Include
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group flex items-start gap-4 p-4 rounded-xl hover:bg-red-50 transition-colors">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 group-hover:from-red-100 group-hover:to-orange-100 transition-all flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {feature.text}
                    </h4>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const isPopular = index === 1;
            const pricePerMinute = getPricePerMinute(plan.price, plan.minute);
            const valuePerDay = getValuePerDay(plan.price, plan.duration);

            return (
              <div
                key={plan._id}
                className={`relative ${
                  isPopular ? "transform lg:scale-105 lg:-translate-y-4" : ""
                }`}>
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-full shadow-lg">
                      <Crown className="w-4 h-4" />
                      <span className="font-bold text-sm">MOST POPULAR</span>
                    </div>
                  </div>
                )}

                {/* Plan Card */}
                <div
                  className={`h-full bg-white rounded-3xl border-2 transition-all duration-300 hover:shadow-2xl ${
                    isPopular
                      ? "border-red-500 shadow-xl"
                      : "border-gray-200 shadow-lg"
                  }`}>
                  {/* Header */}
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {plan.name}
                      </h3>
                      {isPopular && (
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900">
                          ₹
                        </span>
                        <span className="text-5xl font-bold text-gray-900">
                          {plan.price}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1">One-time payment</p>
                    </div>

                    {/* Plan Details */}
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg">
                            <Clock className="w-4 h-4 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {plan.minute === "Unlimited"
                                ? "Unlimited"
                                : `${plan.minute}`}{" "}
                              Minutes
                            </p>
                            <p className="text-xs text-gray-600">
                              Total call time
                            </p>
                          </div>
                        </div>
                        {pricePerMinute !== "Unlimited" && (
                          <div className="text-right">
                            <p className="font-bold text-gray-900">
                              ₹{pricePerMinute}/min
                            </p>
                            <p className="text-xs text-gray-600">
                              Effective rate
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg">
                            <Calendar className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {plan.duration} Days
                            </p>
                            <p className="text-xs text-gray-600">
                              Plan validity
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            ₹{valuePerDay}/day
                          </p>
                          <p className="text-xs text-gray-600">Daily value</p>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <h4 className="font-semibold text-gray-900">
                          Plan Features:
                        </h4>
                      </div>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></div>
                          <span className="text-gray-700">
                            {plan.minute === "Unlimited"
                              ? "Unlimited"
                              : `${plan.minute} minutes`}{" "}
                            video calls
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></div>
                          <span className="text-gray-700">
                            {plan.duration} days access
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></div>
                          <span className="text-gray-700">
                            HD audio and video quality
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></div>
                          <span className="text-gray-700">
                            24/7 customer support
                          </span>
                        </li>
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <div onClick={handleSub}>
                      <button
                        className={`w-full py-4 rounded-xl font-semibold transition-all group ${
                          isPopular
                            ? "bg-gradient-to-r from-red-600 to-orange-500 text-white hover:shadow-lg hover:shadow-red-500/30 hover:scale-[1.02]"
                            : "bg-gradient-to-r from-gray-900 to-black text-white hover:shadow-lg hover:shadow-gray-900/30 hover:scale-[1.02]"
                        }`}>
                        <div className="flex items-center justify-center gap-2">
                          <CreditCard className="w-5 h-5" />
                          <span>Get {plan.name} Plan</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .text-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }

        @keyframes gradient-shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </section>
  );
};

export default SubscriptionHomeSection;
