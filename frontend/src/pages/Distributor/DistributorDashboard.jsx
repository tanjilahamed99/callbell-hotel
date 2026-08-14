import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Search,
  Calendar,
  Trash2,
  Eye,
  RefreshCw,
  Users,
  CheckCircle,
  UserPlus,
  CreditCard,
  X,
  Clock,
  ChevronDown,
  ChevronUp,
  User,
  Mail,
  Lock,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Star,
  ArrowDown,
  Sparkles,
  Percent,
} from "lucide-react";
import {
  createUser,
  disAllUsers,
  disDeleteUser,
  getPaymentUrl,
} from "../../hooks/distributor/distributor";
import { useCall } from "../../Provider/Provider";
import getWebsiteData from "../../hooks/admin/getWebisteData";
import userFreeTrail from "../../hooks/users/userFreeTrail";
import QrCode from "../../components/Dashboard/QrCode";

const DistributorDashboard = () => {
  const { user: distributor } = useCall();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [subscriptionUser, setSubscriptionUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [subscriptionDuration, setSubscriptionDuration] = useState(30);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [createUserModal, setCreateUserModal] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    referenceBy: distributor.id,
  });
  const [sub, setSub] = useState([]);
  const [commissionRate, setCommissionRate] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      const { data } = await createUser(userData);
      if (data.success) {
        setCreateUserModal(false);
        Swal.fire({
          title: "Success",
          text: "You have successfully logged in!",
          icon: "success",
        });
        setUserData({
          name: "",
          email: "",
          password: "",
        });
        setError(null);
        setUsers([data.data, ...users]);
        setFilteredUsers([data.data, ...filteredUsers]);
      }
    } catch (err) {
      if (err.message !== "NEXT_REDIRECT") {
        setError(err?.response?.data?.message || err.message);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Sort function
  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredUsers].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];

      // Handle nested objects
      if (key === "subscription") {
        aValue = a.subscription?.planName || "";
        bValue = b.subscription?.planName || "";
      }

      if (key === "subscriptionStatus") {
        aValue = getRemainingDays(a.subscription?.endDate);
        bValue = getRemainingDays(b.subscription?.endDate);
      }

      if (aValue < bValue) {
        return direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setFilteredUsers(sorted);
  };

  // Initialize with mock data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await disAllUsers(distributor.id);
        if (data.success) {
          setUsers(data.data);
          setFilteredUsers(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [distributor]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await getWebsiteData();
      if (data.success) {
        setSub(data.data.plan);
        setCommissionRate(data.data.distributorCommission || 0);
      }
    };

    fetch();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterUsers(term, fromDate, toDate);
  };

  const filterUsers = (searchTerm, fromDate, toDate) => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter((user) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          user?.name?.toLowerCase().includes(searchLower) ||
          user?.email?.toLowerCase().includes(searchLower) ||
          user?.address?.toLowerCase().includes(searchLower) ||
          user?.phone?.toLowerCase().includes(searchLower) ||
          user?.role?.toLowerCase().includes(searchLower) ||
          user?.subscription?.planName?.toLowerCase().includes(searchLower)
        );
      });
    }

    if (fromDate || toDate) {
      filtered = filtered.filter((user) => {
        const userDate = new Date(user?.createdAt);
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate + "T23:59:59Z") : null;

        const afterFrom = !from || userDate >= from;
        const beforeTo = !to || userDate <= to;

        return afterFrom && beforeTo;
      });
    }

    setFilteredUsers(filtered);
  };

  const getRemainingDays = (endDate) => {
    if (!endDate) return 0;
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getStatusColor = (remainingDays) => {
    if (remainingDays === 0) return "bg-red-100 text-red-800";
    if (remainingDays <= 7) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "U"
    );
  };

  const handleDelete = async (userId, userName) => {
    const result = await Swal.fire({
      title: "Delete User?",
      html: `<div class="text-left">
        <p class="mb-2">You are about to delete user:</p>
        <p class="font-bold text-gray-900">${userName}</p>
        <p class="text-sm text-gray-600 mt-2">This action cannot be undone.</p>
      </div>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete User",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const { data } = await disDeleteUser(userId);
        if (data.success) {
          setUsers(users.filter((u) => u._id !== userId));
          filterUsers(searchTerm, fromDate, toDate);
          Swal.fire({
            title: "Deleted!",
            text: "User has been deleted successfully.",
            icon: "success",
            confirmButtonColor: "#dc2626",
          });
        }
      } catch (err) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete user. Please try again.",
          icon: "error",
          confirmButtonColor: "#dc2626",
        });
        console.error(err);
      }
    }
  };

  // Open subscription modal
  const handleOpenSubscription = (user) => {
    setSubscriptionUser(user);
    setIsSubscriptionModalOpen(true);
  };

  // Process subscription
  const handleProcessSubscription = async () => {
    if (!selectedPlan || !subscriptionUser) {
      Swal.fire({
        title: "Error!",
        text: "Please select a subscription plan",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    const totalAmount = (selectedPlan.price / 30) * subscriptionDuration;
    const commissionAmount = totalAmount * 0.2; // 20% commission

    const result = await Swal.fire({
      title: "Confirm Subscription",
      html: `
        <div class="text-left">
          <p class="mb-2">You are about to subscribe <strong>${subscriptionUser.name}</strong> to:</p>
          <div class="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg mb-4">
            <h3 class="font-bold text-lg text-red-800">${selectedPlan.name} Plan</h3>
            <div class="space-y-1 mt-2">
              <p class="text-gray-700 flex justify-between">
                <span>Duration:</span>
                <span class="font-medium">${subscriptionDuration} days</span>
              </p>
              <p class="text-gray-700 flex justify-between">
                <span>Total Amount:</span>
                <span class="font-medium">$${totalAmount.toFixed(2)}</span>
              </p>
              <p class="text-gray-700 flex justify-between">
                <span>Your Commission (20%):</span>
                <span class="font-medium text-green-600">$${commissionAmount.toFixed(2)}</span>
              </p>
            </div>
          </div>
          <p class="text-sm text-gray-600">This will bill the user and add the subscription to their account.</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Confirm & Subscribe",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setIsProcessing(true);
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + subscriptionDuration);

        const subscriptionData = {
          plan: selectedPlan.id,
          planName: selectedPlan.name,
          price: selectedPlan.price,
          duration: subscriptionDuration,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          status: "active",
          totalAmount: totalAmount,
          commissionAmount: commissionAmount,
        };

        // Update the user in local state
        setUsers(
          users.map((user) => {
            if (user._id === subscriptionUser._id) {
              return {
                ...user,
                subscription: subscriptionData,
                transactionHistory: [
                  ...(user.transactionHistory || []),
                  {
                    id: `t${Date.now()}`,
                    amount: totalAmount,
                    date: startDate.toISOString(),
                    type: "subscription",
                    commission: commissionAmount,
                  },
                ],
              };
            }
            return user;
          }),
        );

        // Update filtered users
        setFilteredUsers(
          filteredUsers.map((user) => {
            if (user._id === subscriptionUser._id) {
              return {
                ...user,
                subscription: subscriptionData,
                transactionHistory: [
                  ...(user.transactionHistory || []),
                  {
                    id: `t${Date.now()}`,
                    amount: totalAmount,
                    date: startDate.toISOString(),
                    type: "subscription",
                    commission: commissionAmount,
                  },
                ],
              };
            }
            return user;
          }),
        );

        Swal.fire({
          title: "Success!",
          html: `
            <div class="text-center">
              <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-100 to-green-200 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p class="mb-2 font-medium">Subscription activated successfully!</p>
              <p class="text-sm text-gray-600 mb-1">User: ${subscriptionUser.name}</p>
              <p class="text-sm text-gray-600 mb-1">Plan: ${selectedPlan.name} (${subscriptionDuration} days)</p>
              <p class="text-sm font-medium text-green-600 mt-2">Commission earned: $${commissionAmount.toFixed(2)}</p>
            </div>
          `,
          icon: "success",
          confirmButtonColor: "#dc2626",
        });

        setIsSubscriptionModalOpen(false);
        setSelectedPlan(null);
        setSubscriptionDuration(30);
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to process subscription. Please try again.",
          icon: "error",
          confirmButtonColor: "#dc2626",
        });
        console.error(error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handlePurchase = async (userId, subId, amount) => {
    try {
      const getUrlData = {
        amount,
        userId,
        subId,
        distributorId: distributor.id,
      };

      const { data } = await getPaymentUrl(getUrlData);
      if (data.success) {
        window.location.href = data.payPageUrl;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const freeTrail = async (planId, userId) => {
    try {
      //free trail set up for every user in one time
      const { data } = await userFreeTrail({ id: userId, planId });
      if (data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u._id === userId ? { ...u, ...data.user } : u)),
        );
        // Refresh filtered list
        filterUsers(searchTerm, fromDate, toDate);
        Swal.fire({
          title: "Success",
          text: "Trail subscription Started",
          icon: "success",
          confirmButtonColor: "#dc2626",
        });
        setIsSubscriptionModalOpen(false);
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response.data.message || "Same thinks error white Purchase",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  // Calculate distributor statistics
  const stats = {
    total: users.length,
    active: users.filter((u) => getRemainingDays(u.subscription?.endDate) > 0)
      .length,
  };

  useEffect(() => {
    filterUsers(searchTerm, fromDate, toDate);
  }, [fromDate, toDate, users]);

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
          <p className="text-gray-600 mt-4 font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Distributor <span className="text-red-600">Dashboard</span>
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Manage users and subscriptions | Earn commission on every
                subscription
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium">
                {viewMode === "grid" ? "List View" : "Grid View"}
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Subscriptions</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.active}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-50 to-green-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="w-full sm:w-auto">
            <button
              onClick={() => setCreateUserModal(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium px-6 py-3 rounded-lg flex items-center justify-center transition-all duration-200 shadow-md">
              <UserPlus className="h-5 w-5 mr-2" />
              Add New User
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name, email, phone, or plan..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Date Range */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Reset Button */}
            <div>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFromDate("");
                  setToDate("");
                  filterUsers("", "", "");
                }}
                className="w-full lg:w-auto px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Reset Filters
              </button>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || fromDate || toDate) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      filterUsers("", fromDate, toDate);
                    }}
                    className="ml-1 hover:text-red-900">
                    ×
                  </button>
                </span>
              )}
              {fromDate && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  From: {fromDate}
                  <button
                    onClick={() => {
                      setFromDate("");
                      filterUsers(searchTerm, "", toDate);
                    }}
                    className="ml-1 hover:text-blue-900">
                    ×
                  </button>
                </span>
              )}
              {toDate && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  To: {toDate}
                  <button
                    onClick={() => {
                      setToDate("");
                      filterUsers(searchTerm, fromDate, "");
                    }}
                    className="ml-1 hover:text-blue-900">
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Users Table/Grid */}
        {viewMode === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center text-white font-bold">
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 truncate">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">
                          {user.email}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              user.role === "distributor"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}>
                            {user.role}
                          </span>
                          {user.subscription?.plan && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800">
                              {user.subscription.plan}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Phone</span>
                      <span className="font-medium text-gray-900">
                        {user.phone || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Transactions
                      </span>
                      <span className="font-bold text-gray-900">
                        {user.transactionHistory?.length || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Joined</span>
                      <span className="text-sm text-gray-900">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              },
                            )
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Subscription Status */}
                  <div className="mb-4">
                    {user.subscription?.minute > 0 &&
                    getRemainingDays(user.subscription.endDate) > 0 ? (
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {user.subscription.plan}
                          </p>
                          <p className="text-xs text-gray-600">
                            Expires:{" "}
                            {new Date(
                              user.subscription.endDate,
                            ).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            getRemainingDays(user.subscription.endDate),
                          )}`}>
                          <Clock className="w-3 h-3 mr-1" />
                          {getRemainingDays(user.subscription.endDate)} days
                        </span>
                      </div>
                    ) : (
                      <div className="p-3 bg-gradient-to-r from-red-50 to-white rounded-lg border border-red-100 text-center">
                        <p className="text-sm font-medium text-red-800">
                          No Active Subscription
                        </p>
                        <p className="text-xs text-red-600">
                          {commissionRate}% Off on next subscription
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleOpenSubscription(user)}
                      className={`w-full py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                        user.subscription?.minute > 0 &&
                        getRemainingDays(user.subscription.endDate) > 0
                          ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                          : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                      }`}>
                      <CreditCard className="w-4 h-4" />
                      {user.subscription?.minute > 0 &&
                      getRemainingDays(user.subscription.endDate) > 0
                        ? "Manage Subscription"
                        : "Add Subscription"}
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(user._id, user.name)}
                        className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-red-50 to-white border-b border-red-100">
                    <th
                      className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-red-100"
                      onClick={() => sortData("name")}>
                      <div className="flex items-center gap-1">
                        User
                        {sortConfig.key === "name" &&
                          (sortConfig.direction === "asc" ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          ))}
                      </div>
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Contact
                    </th>
                    <th
                      className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-red-100"
                      onClick={() => sortData("subscriptionStatus")}>
                      <div className="flex items-center gap-1">
                        Subscription
                        {sortConfig.key === "subscriptionStatus" &&
                          (sortConfig.direction === "asc" ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          ))}
                      </div>
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Transactions
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => {
                    return (
                      <tr
                        key={user._id}
                        className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center text-white font-bold text-sm mr-3">
                              {getInitials(user.name)}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {user.role === "admin"
                                  ? "Administrator"
                                  : "User"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">
                            {user.email}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.phone || "No phone"}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {user.subscription ? (
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  getRemainingDays(
                                    user.subscription.endDate,
                                  ) === 0
                                    ? "bg-red-500"
                                    : getRemainingDays(
                                          user.subscription.endDate,
                                        ) <= 7
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                }`}></div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {user.subscription.plan}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {getRemainingDays(user.subscription.endDate)}{" "}
                                  days left
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-red-600 font-medium">
                              No Subscription
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-green-600">
                            {user.transactionHistory?.length || 0} transactions
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )
                              : "N/A"}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenSubscription(user)}
                              className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                                user.subscription?.minute > 0 &&
                                getRemainingDays(user.subscription.endDate) > 0
                                  ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 hover:from-green-200 hover:to-green-300"
                                  : "bg-gradient-to-r from-red-100 to-red-200 text-red-800 hover:from-red-200 hover:to-red-300"
                              }`}>
                              <CreditCard className="w-3 h-3" />
                              {user.subscription?.minute > 0 &&
                              getRemainingDays(user.subscription.endDate) > 0
                                ? "Manage"
                                : "Subscribe"}
                            </button>
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                              <Eye className="w-3 h-3" />
                              View
                            </button>
                            <button
                              onClick={() => handleDelete(user._id, user.name)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200 flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No users found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {searchTerm || fromDate || toDate
                    ? "Try adjusting your search or filter criteria."
                    : "No users have been registered yet."}
                </p>
              </div>
            )}

            {/* Summary Footer */}
            {filteredUsers.length > 0 && (
              <div className="border-t border-gray-200 bg-gradient-to-r from-red-50 to-white px-4 py-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-sm text-gray-600">
                    Showing{" "}
                    <span className="font-bold">{filteredUsers.length}</span> of{" "}
                    <span className="font-bold">{users.length}</span> users
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600">
                      Active:{" "}
                      <span className="font-bold text-green-600">
                        {stats.active}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Expired:{" "}
                      <span className="font-bold text-red-600">
                        {stats.expired}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      No Sub:{" "}
                      <span className="font-bold text-yellow-600">
                        {stats.noSubscription}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Subscription Modal */}
      {isSubscriptionModalOpen && subscriptionUser && (
        <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {subscriptionUser.subscription?.status === "active"
                      ? "Manage Subscription"
                      : "Add Subscription"}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    For user:{" "}
                    <span className="font-semibold">
                      {subscriptionUser.name}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsSubscriptionModalOpen(false);
                    setSelectedPlan(null);
                    setSubscriptionDuration(30);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Current Subscription Status */}
              {subscriptionUser.subscription?.status === "active" && (
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-green-800">
                        Current Active Subscription
                      </h3>
                      <p className="text-sm text-green-700 mt-1">
                        Plan: {subscriptionUser.subscription.planName} •
                        Started:{" "}
                        {new Date(
                          subscriptionUser.subscription.startDate,
                        ).toLocaleDateString()}{" "}
                        • Expires:{" "}
                        {new Date(
                          subscriptionUser.subscription.endDate,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-full">
                      Active
                    </span>
                  </div>
                </div>
              )}

              {/* Subscription Plans */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Select Subscription Plan
                </h3>
                {/* Subscription Plans */}
                {sub.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sub.map((plan, idx) => {
                      const isPopular = idx === 1; // Middle plan is popular
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
                            className={`h-full bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group relative ${
                              isPopular
                                ? "border-red-200 shadow-red-900/5"
                                : "border-gray-100"
                            }`}>
                            {/* Popular Badge */}
                            {isPopular && (
                              <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
                                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-red-900/30">
                                  MOST POPULAR
                                </div>
                              </div>
                            )}

                            {/* Discount Ribbon - Show when commissionRate > 0 */}
                            {commissionRate > 0 && (
                              <div className="absolute -right-10 top-6 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-10 py-1.5 transform rotate-45 shadow-lg shadow-red-900/30">
                                {commissionRate}% OFF
                              </div>
                            )}

                            {/* Plan Header */}
                            <div
                              className={`p-6 text-center relative overflow-hidden ${
                                isPopular
                                  ? "bg-gradient-to-r from-red-600 via-red-600 to-red-700"
                                  : "bg-gradient-to-r from-gray-900 via-black to-gray-900"
                              }`}>
                              <div className="absolute inset-0 bg-grid-white/5"></div>
                              <h3 className="text-2xl font-bold text-white mb-2 relative">
                                {plan?.name}
                              </h3>
                              <div className="flex items-center justify-center gap-2 text-white/90 relative">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">
                                  {plan?.duration} Days Plan
                                </span>
                              </div>
                            </div>

                            {/* Price Section with Dynamic Discount */}
                            <div className="p-6 border-b border-gray-100 bg-gradient-to-b from-white to-gray-50">
                              <div className="text-center">
                                {/* Original Price & Savings - Show only if commissionRate > 0 */}
                                {commissionRate > 0 && (
                                  <div className="mb-3">
                                    <span className="text-sm text-gray-500 line-through">
                                      ₹{plan?.price}
                                    </span>
                                    <div className="inline-flex items-center ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                                      <ArrowDown className="w-3 h-3 mr-1" />
                                      {commissionRate}% OFF
                                    </div>
                                  </div>
                                )}

                                {/* Discounted Price (plan.price minus commissionRate%) */}
                                <div className="flex items-center justify-center mb-2">
                                  <span className="text-3xl font-bold text-gray-900">
                                    ₹
                                  </span>
                                  <span className="text-5xl font-bold text-gray-900 ml-1">
                                    {commissionRate > 0
                                      ? Math.round(
                                          plan?.price *
                                            (1 - commissionRate / 100),
                                        )
                                      : plan?.price}
                                  </span>
                                </div>

                                <p className="text-gray-600 mb-4">
                                  {commissionRate > 0
                                    ? "Discounted price"
                                    : "One-time payment"}
                                </p>

                                {/* Savings Calculation */}
                                {commissionRate > 0 && (
                                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 mb-3 border border-green-200">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-gray-700 font-medium">
                                        You Save:
                                      </span>
                                      <span className="text-lg font-bold text-green-700">
                                        ₹
                                        {Math.round(
                                          plan?.price * (commissionRate / 100),
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                )}

                                {/* Daily Rate */}
                                <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                                  <Clock className="w-4 h-4 text-gray-500" />
                                  <span className="text-gray-600">
                                    ₹
                                    {commissionRate > 0
                                      ? Math.round(
                                          (plan?.price *
                                            (1 - commissionRate / 100)) /
                                            plan?.duration,
                                        )
                                      : Math.round(
                                          plan?.price / plan?.duration,
                                        )}{" "}
                                    per day
                                  </span>
                                  {commissionRate > 0 && (
                                    <span className="text-xs text-gray-400 line-through">
                                      (Was ₹
                                      {Math.round(plan?.price / plan?.duration)}
                                      )
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Features */}
                            <div className="p-6">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                  <Sparkles className="w-5 h-5 text-red-600" />
                                  What's Included
                                </h4>
                                {/* Discount Badge inside features section */}
                                {commissionRate > 0 && (
                                  <div
                                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                                      commissionRate >= 30
                                        ? "bg-gradient-to-r from-red-100 to-orange-100 text-red-700 border border-red-200"
                                        : commissionRate >= 20
                                          ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200"
                                          : "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200"
                                    }`}>
                                    Save {commissionRate}%
                                  </div>
                                )}
                              </div>

                              <ul className="space-y-3">
                                <li className="flex items-center gap-3 group/item hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center flex-shrink-0 border border-green-200">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  </div>
                                  <span className="text-gray-700">
                                    {plan?.minute || 500} Minutes Call Time
                                  </span>
                                </li>
                                <li className="flex items-center gap-3 group/item hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center flex-shrink-0 border border-green-200">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  </div>
                                  <span className="text-gray-700">
                                    HD Audio Quality
                                  </span>
                                </li>
                                <li className="flex items-center gap-3 group/item hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center flex-shrink-0 border border-green-200">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  </div>
                                  <span className="text-gray-700">
                                    Unlimited Contacts
                                  </span>
                                </li>
                                <li className="flex items-center gap-3 group/item hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center flex-shrink-0 border border-green-200">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  </div>
                                  <span className="text-gray-700">
                                    24/7 Customer Support
                                  </span>
                                </li>
                                <li className="flex items-center gap-3 group/item hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center flex-shrink-0 border border-green-200">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  </div>
                                  <span className="text-gray-700">
                                    Secure End-to-End Encryption
                                  </span>
                                </li>

                                {/* Discount Feature - Only show if commissionRate > 0 */}
                                {commissionRate > 0 && (
                                  <li className="flex items-center gap-3 group/item hover:bg-gray-50 p-2 rounded-lg transition-colors bg-gradient-to-r from-green-50 to-emerald-50/50 border border-green-100">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-100 to-green-50 flex items-center justify-center flex-shrink-0 border border-emerald-200">
                                      <Percent className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <div>
                                      <span className="text-gray-700 font-medium">
                                        {commissionRate}% Special Discount
                                      </span>
                                      <p className="text-xs text-gray-500 mt-0.5">
                                        Save ₹
                                        {Math.round(
                                          plan?.price * (commissionRate / 100),
                                        )}{" "}
                                        instantly
                                      </p>
                                    </div>
                                  </li>
                                )}
                              </ul>
                            </div>

                            {/* Action Button */}
                            <div className="p-6 pt-0">
                              {plan.price <= 0 ? (
                                <button
                                  onClick={() =>
                                    freeTrail(plan._id, subscriptionUser._id)
                                  }
                                  className={`w-full py-3.5 px-6 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 group/btn relative overflow-hidden ${
                                    isPopular
                                      ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                                      : "bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900"
                                  }`}>
                                  {/* Shine effect */}
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>

                                  <CreditCard className="w-5 h-5 relative z-10" />
                                  <span className="relative z-10">
                                    {subscriptionUser.subscription.freeTrail
                                      ? "Already Used"
                                      : "Free Trail"}
                                  </span>
                                  <ArrowRight className="w-4 h-4 ml-2 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    handlePurchase(
                                      subscriptionUser._id,
                                      plan._id,
                                      // Pass the discounted price
                                      commissionRate > 0
                                        ? Math.round(
                                            plan?.price *
                                              (1 - commissionRate / 100),
                                          )
                                        : plan?.price,
                                    )
                                  }
                                  className={`w-full py-3.5 px-6 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 group/btn relative overflow-hidden ${
                                    isPopular
                                      ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                                      : "bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900"
                                  }`}>
                                  {/* Shine effect */}
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>

                                  <CreditCard className="w-5 h-5 relative z-10" />
                                  <span className="relative z-10">
                                    {commissionRate > 0
                                      ? `Pay ₹${Math.round(plan?.price * (1 - commissionRate / 100))}`
                                      : "Get Started"}
                                  </span>
                                  <ArrowRight className="w-4 h-4 ml-2 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                              )}

                              {/* Discount Info Footer */}
                              {commissionRate > 0 && (
                                <div className="mt-3 text-center">
                                  <p className="text-xs text-gray-500">
                                    <span className="font-medium text-green-700">
                                      Limited time offer
                                    </span>
                                    <span className="mx-1">•</span>
                                    <span>
                                      Save ₹
                                      {Math.round(
                                        plan?.price * (commissionRate / 100),
                                      )}
                                    </span>
                                    <span className="mx-1">•</span>
                                    <span className="text-gray-400 line-through">
                                      ₹{plan?.price}
                                    </span>
                                  </p>
                                </div>
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
                      Subscription plans are currently being updated. Please
                      check back soon.
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200">
                      <RefreshCw className="w-4 h-4" />
                      Refresh Plans
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setIsSubscriptionModalOpen(false);
                    setSelectedPlan(null);
                    setSubscriptionDuration(30);
                  }}
                  className="flex-1 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                  disabled={isProcessing}>
                  Cancel
                </button>
                <button
                  onClick={handleProcessSubscription}
                  disabled={!selectedPlan || isProcessing}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    !selectedPlan || isProcessing
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                  }`}>
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      {subscriptionUser.subscription?.status === "active"
                        ? "Update Subscription"
                        : "Activate Subscription"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    User Details
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Complete user information
                  </p>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center text-white font-bold text-xl">
                  {getInitials(selectedUser.name)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedUser.name}
                  </h3>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        selectedUser.role === "admin"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                      {selectedUser.role}
                    </span>
                    {selectedUser.subscription?.plan && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800">
                        {selectedUser.subscription.plan}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Contact Information
                    </h4>
                    <div className="space-y-2">
                      <p className="text-gray-900">
                        <strong>Phone:</strong> {selectedUser.phone || "N/A"}
                      </p>
                      <p className="text-gray-900">
                        <strong>Address:</strong>{" "}
                        {selectedUser.address || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Account Information
                    </h4>
                    <div className="space-y-2">
                      <p className="text-gray-900">
                        <strong>Joined:</strong>{" "}
                        {new Date(selectedUser.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-gray-900">
                        <strong>Total Transactions:</strong>{" "}
                        {selectedUser.transactionHistory?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedUser.subscription ? (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Subscription Details
                      </h4>
                      <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Plan:</span>
                          <span className="font-medium text-green-600">
                            {selectedUser.subscription.plan}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span
                            className={`font-medium ${
                              selectedUser.subscription.status === "active"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}>
                            {selectedUser.subscription.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Started:</span>
                          <span className="font-medium text-green-600">
                            {new Date(
                              selectedUser.subscription.startDate,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Expires:</span>
                          <span className="font-medium text-red-600">
                            {new Date(
                              selectedUser.subscription.endDate,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Remaining:</span>
                          <span
                            className={`font-medium ${getStatusColor(
                              getRemainingDays(
                                selectedUser.subscription.endDate,
                              ),
                            )} px-2 py-0.5 rounded text-xs`}>
                            {getRemainingDays(
                              selectedUser.subscription.endDate,
                            )}{" "}
                            days
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Subscription Status
                      </h4>
                      <div className="bg-gradient-to-r from-red-50 to-white p-4 rounded-lg border border-red-100 text-center">
                        <p className="text-red-800 font-medium">
                          No Active Subscription
                        </p>
                        <button
                          onClick={() => {
                            setSelectedUser(null);
                            handleOpenSubscription(selectedUser);
                          }}
                          className="mt-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 text-sm">
                          Add Subscription
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <QrCode user={selectedUser} />
            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium">
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    handleOpenSubscription(selectedUser);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium">
                  {selectedUser.subscription
                    ? "Manage Subscription"
                    : "Add Subscription"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {createUserModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl shadow-2xl shadow-red-900/20 w-full max-w-md border border-gray-800 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-black border-b border-gray-800 p-6 rounded-t-2xl z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-600/10 rounded-lg border border-red-600/30">
                    <User className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Create User
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                      Add new user to system
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 hover:bg-gray-800/50 rounded-lg transition-all duration-300 border border-gray-800 hover:border-gray-700 group">
                  <X className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-red-500">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                    type="text"
                    placeholder="John Doe"
                    required
                    className="w-full rounded-xl border-2 border-gray-800 bg-gray-900/50 py-3.5 pl-12 pr-4 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-red-600 focus:bg-black/60 focus:ring-1 focus:ring-red-600/30"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-red-500">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="john@example.com"
                    required
                    className="w-full rounded-xl border-2 border-gray-800 bg-gray-900/50 py-3.5 pl-12 pr-4 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-red-600 focus:bg-black/60 focus:ring-1 focus:ring-red-600/30"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors duration-200 flex items-center gap-1">
                    {showPassword ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5" />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5" />
                        Show
                      </>
                    )}
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-red-500">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    name="password"
                    value={userData.password}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required={!selectedUser}
                    className="w-full rounded-xl border-2 border-gray-800 bg-gray-900/50 py-3.5 pl-12 pr-12 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-red-600 focus:bg-black/60 focus:ring-1 focus:ring-red-600/30"
                  />
                </div>
                {!selectedUser && (
                  <p className="text-xs text-gray-500 mt-2">
                    Must be at least 8 characters with uppercase, lowercase, and
                    numbers
                  </p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-xl bg-gradient-to-r from-red-900/20 to-red-800/10 border border-red-800/30 p-4 animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-600/20 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <p className="text-sm text-red-300 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setCreateUserModal(false)}
                  className="flex-1 rounded-xl border-2 border-gray-800 bg-transparent py-3.5 px-5 font-semibold text-gray-300 transition-all duration-300 hover:border-gray-700 hover:bg-gray-900/30 hover:text-white active:scale-95">
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-red-700 py-3.5 px-5 font-semibold text-white shadow-lg shadow-red-900/30 transition-all duration-300 hover:from-red-600 hover:to-red-700 hover:shadow-xl hover:shadow-red-900/40 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95 group">
                  <span className="flex items-center justify-center gap-2">
                    Create User
                    <svg
                      className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistributorDashboard;
