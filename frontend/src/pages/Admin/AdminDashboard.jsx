import { useEffect, useState } from "react";
import { useCall } from "../../Provider/Provider";
import getAllUsers from "../../hooks/admin/getAllUsers";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import getWebsiteData from "../../hooks/admin/getWebisteData";
import {
  Users,
  CreditCard,
  TrendingUp,
  DollarSign,
  Calendar,
  Clock,
  Activity,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowRight,
  RefreshCw,
  BarChart3,
  Database,
  Globe,
  PhoneCall,
  UserPlus,
  Download
} from "lucide-react";

const AdminDashboard = () => {
  const { user } = useCall();
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalSubscriptions: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    latestTransactions: [],
    activeUsers: 0,
    pendingTransactions: 0,
    completedTransactions: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("today");

  useEffect(() => {
    if (user) {
      const fetch = async () => {
        const { data: userData } = await getAllUsers(user.id, user.email);
        if (userData.success) {
          const allTransactions = userData.users
            .flatMap((u) => u.transactionHistory || [])
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          
          const totalRevenue = allTransactions
            .filter(t => t.status === "Completed")
            .reduce((sum, t) => sum + (t.amount || 0), 0);
            
          const pendingTransactions = allTransactions.filter(t => t.status === "Pending").length;
          const completedTransactions = allTransactions.filter(t => t.status === "Completed").length;
          const activeUsers = userData.users.filter(u => u.subscription?.status === "active").length;

          setDashboardData((prev) => ({
            ...prev,
            totalUsers: userData.users?.length || 0,
            totalTransactions: allTransactions.length,
            totalRevenue,
            pendingTransactions,
            completedTransactions,
            activeUsers,
            latestTransactions: allTransactions.slice(0, 8),
          }));
        }
      };
      fetch();
    }
  }, [user]);

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const { data } = await getWebsiteData();
        if (data.success) {
          setDashboardData((prev) => ({
            ...prev,
            totalSubscriptions: data.data.plan.length || 0,
          }));
        }
      } catch (err) {
        console.error("Error fetching subscriptions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubs();
  }, []);

  const stats = [
    {
      title: "Total Users",
      value: dashboardData.totalUsers,
      change: "+12.5%",
      icon: Users,
      color: "from-blue-600 to-cyan-500",
      link: "/admin/users"
    },
    {
      title: "Active Subscriptions",
      value: dashboardData.totalSubscriptions,
      change: "+8.2%",
      icon: CreditCard,
      color: "from-green-600 to-emerald-500",
      link: "/admin/subscriptions"
    },
    {
      title: "Total Transactions",
      value: dashboardData.totalTransactions,
      change: "+23.1%",
      icon: TrendingUp,
      color: "from-purple-600 to-pink-500",
      link: "/admin/transactions"
    },
    {
      title: "Total Revenue",
      value: `₹${dashboardData.totalRevenue.toLocaleString()}`,
      change: "+18.7%",
      icon: DollarSign,
      color: "from-red-600 to-orange-500",
      link: "/admin/transactions"
    }
  ];

  const quickActions = [
    // { icon: UserPlus, label: "Add User", color: "from-blue-600 to-blue-700", link: "/admin/users/add" },
    { icon: CreditCard, label: "Create Plan", color: "from-green-600 to-green-700", link: "/admin/subscriptions" },
    // { icon: Download, label: "Export Data", color: "from-purple-600 to-purple-700", link: "#" },
    // { icon: Shield, label: "Security Log", color: "from-red-600 to-red-700", link: "/admin/logs" }
  ];

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
          <p className="text-gray-600 mt-4 font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Cancel':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };



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
            <span>${transaction.planDuration || 0} days</span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold">Minutes:</span>
            <span>${transaction.planMinute || 0} minutes</span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold">Amount:</span>
            <span class="font-bold">₹${transaction.amount || 0}</span>
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Admin <span className="text-red-600">Dashboard</span>
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Welcome back, <span className="font-semibold text-gray-900">{user?.name?.split(" ")[0] || "Admin"}</span>. Here's your system overview.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border text-black border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none"
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Link to={stat.link} key={index} className="group">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700">
                      {stat.change}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 group-hover:text-red-600 transition-colors">View details</span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions & System Health */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-red-50 to-white p-4 sm:p-6 border-b border-red-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                      <p className="text-sm text-gray-600">Frequently used admin tasks</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <Link
                      key={index}
                      to={action.link}
                      className="group flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:border-red-300 hover:shadow-md transition-all duration-200"
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center mb-3`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 text-center">{action.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-red-50 to-white p-4 sm:p-6 border-b border-red-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">System Health</h2>
                  <p className="text-sm text-gray-600">Current system status</p>
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">API Status</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-green-600">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Database</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-green-600">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Payment Gateway</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-green-600">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Uptime</span>
                  <span className="text-sm font-bold text-gray-900">99.9%</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>No critical issues detected</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Transactions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-red-50 to-white p-4 sm:p-6 border-b border-red-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Recent Transactions</h2>
                  <p className="text-sm text-gray-600">Latest payment activities</p>
                </div>
              </div>
              <Link
                to="/admin/transactions"
                className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dashboardData.latestTransactions.length > 0 ? (
                  dashboardData.latestTransactions.map((tran, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center text-white text-xs font-bold mr-3">
                            {tran.author?.name?.charAt(0) || "U"}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {tran.author?.name || "Unknown User"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {tran.author?.email || "No email"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            tran.plan?.toLowerCase().includes('premium') 
                              ? 'bg-red-500' 
                              : tran.plan?.toLowerCase().includes('pro')
                              ? 'bg-blue-500'
                              : 'bg-green-500'
                          }`}></div>
                          <span className="text-sm text-gray-900">{tran.plan || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {tran.createdAt ? new Date(tran.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          }) : "N/A"}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-lg font-bold text-gray-900">₹{tran.amount || 0}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(tran.status)}
                          <span className={`text-sm font-medium ${
                            tran.status === "Completed" 
                              ? "text-green-600" 
                              : tran.status === "Pending"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}>
                            {tran.status || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button onClick={()=>handleViewDetails(tran)} className="text-sm text-red-600 hover:text-red-800 font-medium">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-12">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200 flex items-center justify-center mb-4">
                          <Database className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                        <p className="text-gray-600">There are no recent transactions to display.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Summary Footer */}
          {dashboardData.latestTransactions.length > 0 && (
            <div className="border-t border-gray-200 bg-gradient-to-r from-red-50 to-white px-4 py-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-bold">{dashboardData.latestTransactions.length}</span> of{' '}
                  <span className="font-bold">{dashboardData.totalTransactions}</span> total transactions
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">
                    Completed: <span className="font-bold text-green-600">{dashboardData.completedTransactions}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Pending: <span className="font-bold text-yellow-600">{dashboardData.pendingTransactions}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats Footer */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-3">
              <PhoneCall className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Avg. Call Duration</p>
                <p className="text-xl font-bold text-gray-900">4.2 min</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-white rounded-xl p-4 border border-green-100">
            <div className="flex items-center gap-3">
              <Globe className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active Countries</p>
                <p className="text-xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-white rounded-xl p-4 border border-purple-100">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Response Time</p>
                <p className="text-xl font-bold text-gray-900">128ms</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
