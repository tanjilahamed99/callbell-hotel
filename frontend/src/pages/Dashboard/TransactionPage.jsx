import { useEffect, useState } from "react";
import { useCall } from "../../Provider/Provider";
import myData from "../../hooks/users/myData";
import {
  Search,
  Filter,
  Download,
  Calendar,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  RefreshCw,
  Eye,
  HelpCircle,
  ExternalLink,
  DollarSign,
} from "lucide-react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [loading, setLoading] = useState(true);
  const { user } = useCall();

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterTransactions(term, filterType);
  };

  const handleFilter = (e) => {
    const type = e.target.value;
    setFilterType(type);
    filterTransactions(searchTerm, type);
  };

  const filterTransactions = (searchTerm, filterType) => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter((txn) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          txn?._id?.toLowerCase().includes(searchLower) ||
          txn?.plan?.toLowerCase().includes(searchLower) ||
          txn?.amount?.toString().includes(searchTerm) ||
          txn?.createdAt?.toLowerCase().includes(searchLower) ||
          txn?.paymentMethod?.toLowerCase().includes(searchLower) ||
          txn?.status?.toLowerCase().includes(searchLower)
        );
      });
    }

    if (filterType !== "All") {
      filtered = filtered.filter((txn) => txn.status === filterType);
    }

    setFilteredTransactions(filtered);
  };

  // Fixed: Helper function for status color
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "Pending":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "Cancel":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPlanColor = (plan) => {
    if (!plan) return "from-gray-600 to-gray-700";
    if (plan.toLowerCase().includes("premium"))
      return "from-red-600 to-red-700";
    if (plan.toLowerCase().includes("pro")) return "from-blue-600 to-blue-700";
    if (plan.toLowerCase().includes("basic"))
      return "from-green-600 to-green-700";
    return "from-gray-600 to-gray-700";
  };

  useEffect(() => {
    if (user) {
      const fetch = async () => {
        setLoading(true);
        const { data } = await myData({ id: user.id });
        if (data.success) {
          const txns = [...(data?.data?.transactionHistory || [])].reverse();
          setTransactions(txns);
          setFilteredTransactions(txns);
        }
        setLoading(false);
      };
      fetch();
    }
  }, [user]);

  const stats = {
    total: transactions.length,
    completed: transactions.filter((t) => t.status === "Completed").length,
    pending: transactions.filter((t) => t.status === "Pending").length,
    totalAmount: transactions.reduce((sum, t) => sum + (t.amount || 0), 0),
  };

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
            Loading transactions...
          </p>
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
                Transaction <span className="text-red-600">History</span>
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                View and manage all your subscription payments
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium">
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-red-50 to-red-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.completed}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-50 to-green-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.pending}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-yellow-50 to-yellow-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{stats.totalAmount}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
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
                  placeholder="Search transactions by ID, plan, amount..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-3 text-black bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Filter Dropdown */}
            <div className="w-full lg:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filterType}
                  onChange={handleFilter}
                  className="w-full pl-10 pr-4 py-3 text-black bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 appearance-none">
                  <option value="All">All Transactions</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancel">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || filterType !== "All") && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      filterTransactions("", filterType);
                    }}
                    className="ml-1 hover:text-red-900">
                    ×
                  </button>
                </span>
              )}
              {filterType !== "All" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  Status: {filterType}
                  <button
                    onClick={() => {
                      setFilterType("All");
                      filterTransactions(searchTerm, "All");
                    }}
                    className="ml-1 hover:text-blue-900">
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-red-50 to-white border-b border-red-100">
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Plan & Date
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((txn, index) => (
                    <tr
                      key={txn._id || index}
                      className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`w-10 h-10 rounded-lg bg-gradient-to-r ${getPlanColor(
                              txn.plan,
                            )} flex items-center justify-center mr-3`}>
                            <CreditCard className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              ID: {txn._id?.slice(-8) || "N/A"}
                            </div>
                            <div className="text-xs text-gray-500">
                              #{index + 1}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {txn.plan.slice(0, 20) +
                            (txn.plan.length > 20 ? "..." : "") || "N/A"}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(txn.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {txn.planDuration || 0} days
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-lg font-bold text-gray-900">
                          ₹{txn.amount || 0}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {txn.paymentMethod || "Credit Card"}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(txn.status)}
                          <span
                            className={`text-sm font-medium ${getStatusColorClass(
                              txn.status,
                            )}`}>
                            {txn.status || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewDetails(txn)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                          <Eye className="w-3 h-3" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-4 py-12">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200 flex items-center justify-center mb-4">
                          <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No transactions found
                        </h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                          {searchTerm || filterType !== "All"
                            ? "Try adjusting your search or filter criteria."
                            : "You haven't made any transactions yet. Start by purchasing a subscription plan."}
                        </p>
                        {(searchTerm || filterType !== "All") && (
                          <button
                            onClick={() => {
                              setSearchTerm("");
                              setFilterType("All");
                              filterTransactions("", "All");
                            }}
                            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200">
                            <RefreshCw className="w-4 h-4" />
                            Clear Filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Summary */}
          {filteredTransactions.length > 0 && (
            <div className="border-t border-gray-200 bg-gradient-to-r from-red-50 to-white px-4 py-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-bold">
                    {filteredTransactions.length}
                  </span>{" "}
                  of <span className="font-bold">{transactions.length}</span>{" "}
                  transactions
                </div>
                <div className="text-sm text-gray-600">
                  Total Amount:{" "}
                  <span className="font-bold text-gray-900">
                    ₹
                    {filteredTransactions.reduce(
                      (sum, t) => sum + (t.amount || 0),
                      0,
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-r from-red-50 to-white rounded-2xl p-6 border border-red-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Need help with a transaction?
              </h3>
              <p className="text-gray-600 mb-4">
                If you have questions about any transaction or need assistance,
                our support team is here to help.
              </p>
              <Link to={"/contact"}>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium">
                  <ExternalLink className="w-4 h-4" />
                  Contact Support
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;
