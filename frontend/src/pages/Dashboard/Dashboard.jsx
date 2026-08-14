import { useEffect, useState } from "react";
import { useCall } from "../../Provider/Provider";
import Swal from "sweetalert2";
import myData from "../../hooks/users/myData";
import {
  Calendar,
  Clock,
  CreditCard,
  TrendingUp,
  Users,
  PhoneCall,
  Shield,
  BarChart3,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Download,
  ArrowUpRight,
  Zap,
  Target,
  Activity,
  CalendarCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useCall();
  const [myInfo, setMyInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const getRemainingDays = (endDate) => {
    if (!endDate) return 0;
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getInitials = (name) =>
    name
      ?.split(" ")
      ?.map((n) => n[0])
      ?.slice(0, 2)
      ?.join("")
      ?.toUpperCase() || "U";

  useEffect(() => {
    if (user) {
      const fetch = async () => {
        setLoading(true);
        const { data } = await myData({ id: user.id });
        if (data.success) {
          setMyInfo(data.data);
        }
        setLoading(false);
      };
      fetch();
    }
  }, [user]);

  const stats = [
    {
      title: "Available Minutes",
      value: myInfo?.subscription?.minute.toFixed(2) || "0",
      change: "+12%",
      icon: Clock,
      color: "from-blue-600 to-cyan-500",
      label: "Total available",
    },
    {
      title: "Available Days",
      value: `${getRemainingDays(myInfo?.subscription?.endDate)}` || "0",
      change: "+12%",
      icon: CalendarCheck,
      color: "from-blue-600 to-cyan-500",
      label: "Total available",
    },
    {
      title: "Active Plan",
      value: myInfo?.subscription?.plan || "Free",
      change: "Premium",
      icon: Shield,
      color: "from-red-600 to-orange-500",
      label: "Current plan",
    },
  ];

  const getStatusColorClass = (status) => {
    switch (status) {
      case "Completed":
        return "text-green-600 font-bold";
      case "Pending":
        return "text-yellow-600 font-bold";
      case "Cancel":
        return "text-red-600 font-bold";
      default:
        return "text-gray-600";
    }
  };

  const handleViewDetails = (transaction) => {
    // Fixed: Use getStatusColorClass function
    const statusColorClass = getStatusColorClass(transaction.status);

    Swal.fire({
      title: "Transaction Details",
      html: `
        <div class="text-left space-y-3">
          <div class="flex justify-between">
            <span class="font-semibold">Transaction ID:</span>
            <span class="font-mono">${
              transaction._id?.slice(-8) || "N/A"
            }</span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold">Plan:</span>
            <span>${transaction.plan || "N/A"}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold">Duration:</span>
            <span>${transaction.duration || 0} days</span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold">Minutes:</span>
            <span>${transaction.planMinute || 0} minutes</span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold">Amount:</span>
            <span class="font-bold">${transaction.plan == "Credit" ? "Credit" : "₹" + transaction.amount || 0}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold">Date:</span>
            <span>${
              transaction.createdAt
                ? new Date(transaction.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"
            }</span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold">Payment Method:</span>
            <span>${transaction.paymentMethod || "Credit Card"}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold">Status:</span>
            <span class="${statusColorClass}">${
              transaction.status || "N/A"
            }</span>
          </div>
        </div>
      `,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Close",
      width: "500px",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-3 sm:p-4 md:p-6 lg:p-8">
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-red-600 to-red-700 animate-pulse mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
              </div>
            </div>
            <p className="text-gray-600 mt-4 font-medium">
              Loading your dashboard...
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
          {/* Welcome Header */}
          <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-white flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                    Welcome back,{" "}
                    <span className="text-white">
                      {user?.name?.split(" ")[0] || "User"}!
                    </span>
                  </h1>
                </div>
                <p className="text-red-100 text-sm sm:text-base md:text-lg max-w-2xl">
                  Here's your dashboard overview. Everything you need to manage
                  your calls and subscriptions.
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-300" />
                    <span className="text-sm">Account active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-green-300" />
                    <span className="text-sm">Online now</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl blur-lg"></div>
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gradient-to-br from-white/20 to-white/10 border-4 border-white/30 backdrop-blur-sm flex items-center justify-center text-white text-2xl sm:text-3xl md:text-4xl font-bold">
                  {myInfo?.image ? (
                    <img
                      src={myInfo?.image}
                      alt="Profile Picture"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getInitials(user?.name)
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 border-4 border-red-700"></div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      stat.change.includes("+")
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                    {stat.change}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-gray-500">
                    {stat.title}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Subscription Overview & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {/* Subscription Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-red-50 to-white p-4 sm:p-6 border-b border-red-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                          Subscription Overview
                        </h2>
                        <p className="text-sm text-gray-600">
                          Manage your current plan and usage
                        </p>
                      </div>
                    </div>
                    <Link to={"/dashboard/subscriptions"}>
                      <button className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 text-sm font-semibold">
                        Upgrade Plan
                      </button>
                    </Link>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Current Plan
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        {myInfo?.subscription?.plan || "Free Plan"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Remaining Days
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-bold text-gray-900">
                          {getRemainingDays(myInfo?.subscription?.endDate)} days
                        </div>
                        {getRemainingDays(myInfo?.subscription?.endDate) <=
                          7 && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                            Expiring soon
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Next Renewal
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        {myInfo?.subscription?.endDate
                          ? new Date(
                              myInfo.subscription.endDate,
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "No active subscription"}
                      </p>
                    </div>
                  </div>

                  {/* Usage Progress */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Minute Usage
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {myInfo?.subscription?.minute.toFixed(2) || 0} minutes
                        available
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-red-600 to-red-700 h-2.5 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            100,
                            ((1000 - (myInfo?.subscription?.minute || 0)) /
                              1000) *
                              100,
                          )}%`,
                        }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0 min</span>
                      <span>500 min</span>
                      <span>1000 min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-red-50 to-white p-4 sm:p-6 border-b border-red-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                      Transaction History
                    </h2>
                    <p className="text-sm text-gray-600">
                      Recent subscription purchases and renewals
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-2 text-sm border text-red-500 border-gray-300 font-bold rounded-lg hover:bg-gray-50 transition-colors">
                    Filter
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {myInfo?.transactionHistory
                    ?.slice() // Create a copy to avoid mutating original array
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                    ) // Sort by date descending (newest first)
                    .map((tran, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{tran._id?.slice(-8) || idx + 1000}
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-700">
                          {new Date(tran.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                tran.plan?.toLowerCase().includes("premium")
                                  ? "bg-red-500"
                                  : "bg-blue-500"
                              }`}></div>
                            <span className="text-sm font-medium text-gray-900">
                              {tran.plan}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          {tran.plan === "Trail" || tran.plan === "Credit" ? (
                            "Free"
                          ) : (
                            <>₹{tran.amount}</>
                          )}
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              tran.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : tran.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}>
                            {tran.status === "Completed" && (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            )}
                            {tran.status === "Pending" && (
                              <AlertCircle className="w-3 h-3 mr-1" />
                            )}
                            {tran.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-700">
                          <button
                            onClick={() => handleViewDetails(tran)}
                            className="text-red-600 cursor-pointer hover:text-red-800 font-medium text-sm">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {(!myInfo?.transactionHistory ||
                myInfo.transactionHistory.length === 0) && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <CreditCard className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No transactions yet
                  </h3>
                  <p className="text-gray-600 max-w-sm mx-auto">
                    Your transaction history will appear here once you make your
                    first purchase.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
