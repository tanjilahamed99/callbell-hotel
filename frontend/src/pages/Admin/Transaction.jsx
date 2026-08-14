import React, { useEffect, useState } from "react";
import getAllUsers from "../../hooks/admin/getAllUsers";
import { useCall } from "../../Provider/Provider";
import { 
  Search, 
  Filter, 
  Calendar, 
  RefreshCw, 
  DollarSign, 
  User, 
  Mail, 
  CreditCard,
  CalendarDays,
  Receipt,
  CheckCircle,
  XCircle,
  BarChart3,
  Download,
  ChevronDown,
  ChevronUp
} from "lucide-react";

const AdminTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const { user } = useCall();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    cancelled: 0,
    totalAmount: 0
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchTransactions = async () => {
        setLoading(true);
        try {
          const { data: userData } = await getAllUsers(user.id, user.email);
          if (userData.success) {
            const allTransactions = userData.users
              .flatMap((u) => u.transactionHistory || [])
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            setTransactions(allTransactions);
            
            const completed = allTransactions.filter(t => t.status === "Completed").length;
            const cancelled = allTransactions.filter(t => t.status === "Cancel").length;
            const totalAmount = allTransactions
              .filter(t => t.status === "Completed")
              .reduce((sum, t) => sum + (t.amount || 0), 0);
            
            setStats({
              total: allTransactions.length,
              completed,
              cancelled,
              totalAmount
            });
          }
        } catch (error) {
          console.error("Error fetching transactions:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchTransactions();
    }
  }, [user]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (e) => {
    setFilterType(e.target.value);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterType("All");
    setFromDate("");
    setToDate("");
    setSortConfig({ key: null, direction: 'asc' });
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredTransactions = transactions?.filter((txn) => {
    const txnDate = new Date(txn?.createdAt);
    
    const matchesSearch =
      txn?._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn?.plan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn?.amount?.toString().includes(searchTerm) ||
      txn?.createdAt?.toString().includes(searchTerm) ||
      txn?.paymentMethod?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn?.author?.name?.toString()?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn?.author?.address?.toString()?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn?.author?.email?.toString()?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "All" ? true : txn.status === filterType;

    const matchesDate =
      (!fromDate || txnDate >= new Date(fromDate)) &&
      (!toDate || txnDate <= new Date(toDate + "T23:59:59Z"));

    return matchesSearch && matchesType && matchesDate;
  });

  const sortedTransactions = [...(filteredTransactions || [])].sort((a, b) => {
    if (!sortConfig.key) return 0;

    if (sortConfig.key === 'author') {
      const aName = a.author?.name || '';
      const bName = b.author?.name || '';
      return sortConfig.direction === 'asc' 
        ? aName.localeCompare(bName)
        : bName.localeCompare(aName);
    }

    if (sortConfig.key === 'amount') {
      return sortConfig.direction === 'asc' 
        ? (a.amount || 0) - (b.amount || 0)
        : (b.amount || 0) - (a.amount || 0);
    }

    if (sortConfig.key === 'createdAt') {
      return sortConfig.direction === 'asc'
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    }

    return 0;
  });


  console.log(sortedTransactions)


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "Cancel":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Receipt className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-50 text-green-700 border border-green-200";
      case "Cancel":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Transaction Dashboard
            </h1>
            <p className="text-gray-600">
              Monitor and manage all transaction activities
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 rounded-lg bg-red-50">
                <Receipt className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
              <div className="p-3 rounded-lg bg-red-50">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalAmount.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-t-xl"
        >
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filter & Search</h2>
          </div>
          {showFilters ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {showFilters && (
          <div className="px-6 pb-6 border-t border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-6">
              {/* Search Input */}
              <div className="lg:col-span-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Transactions
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by ID, name, email, amount, or payment method..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Status
                </label>
                <div className="relative">
                  <BarChart3 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={filterType}
                    onChange={handleFilter}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none transition-all"
                  >
                    <option value="All">All Transactions</option>
                    <option value="Completed">Completed Only</option>
                    <option value="Cancel">Cancelled Only</option>
                  </select>
                </div>
              </div>

              {/* Results Count */}
              <div className="lg:col-span-2">
                <div className="h-full flex items-end">
                  <div className="w-full bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-xs text-gray-600">Showing</p>
                    <p className="text-2xl font-bold text-red-600">{filteredTransactions?.length || 0}</p>
                    <p className="text-xs text-gray-600">results</p>
                  </div>
                </div>
              </div>

              {/* Reset Button */}
              <div className="lg:col-span-2">
                <div className="h-full flex items-end">
                  <button
                    onClick={handleResetFilters}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-red-300 hover:text-red-700 transition-colors font-medium"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset Filters
                  </button>
                </div>
              </div>

              {/* Date Range */}
              <div className="lg:col-span-12 mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none transition-all"
                      onChange={(e) => {
                        const days = parseInt(e.target.value);
                        if (days) {
                          const date = new Date();
                          date.setDate(date.getDate() - days);
                          setFromDate(date.toISOString().split('T')[0]);
                          setToDate(new Date().toISOString().split('T')[0]);
                        }
                      }}
                    >
                      <option value="">Quick Date Range</option>
                      <option value="7">Last 7 Days</option>
                      <option value="30">Last 30 Days</option>
                      <option value="90">Last 90 Days</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('_id')}
                    className="flex items-center gap-1 hover:text-red-600 transition-colors"
                  >
                    Transaction ID
                    {sortConfig.key === '_id' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('author')}
                    className="flex items-center gap-1 hover:text-red-600 transition-colors"
                  >
                    Customer
                    {sortConfig.key === 'author' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Plan Details
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('amount')}
                    className="flex items-center gap-1 hover:text-red-600 transition-colors"
                  >
                    Amount
                    {sortConfig.key === 'amount' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-100 rounded w-24 mt-2"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div>
                          <div className="h-4 bg-gray-200 rounded w-28 mb-2"></div>
                          <div className="h-3 bg-gray-100 rounded w-36"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-8 bg-gray-200 rounded w-24"></div>
                    </td>
                  </tr>
                ))
              ) : sortedTransactions?.length > 0 ? (
                sortedTransactions?.map((txn) => (
                  <tr key={txn._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                          <Receipt className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 font-mono">
                            {txn._id.slice(-8).toUpperCase()}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <p className="text-xs text-gray-500">
                              {formatDate(txn.createdAt)} • {formatTime(txn.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <CreditCard className="w-3 h-3 text-gray-400" />
                            <p className="text-xs text-gray-500">
                              {txn.paymentMethod}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-red-600" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {txn.author?.name || "N/A"}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <p className="text-xs text-gray-500 truncate max-w-[180px]">
                              {txn.author?.email || "N/A"}
                            </p>
                          </div>
                          {txn.author?.address && (
                            <p className="text-xs text-gray-500 mt-1 truncate max-w-[180px]">
                              {txn.author.address}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {txn.plan}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Duration: <span className="font-medium">{txn.duration}</span>
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                          <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-gray-900">
                            ₹{txn.amount?.toLocaleString() || "0"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {txn.plan === "Premium" ? "Premium Plan" : "Basic Plan"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(txn.status)}
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(txn.status)}`}>
                          {txn.status === "Cancel" ? "Cancelled" : txn.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No transactions found
                      </h3>
                      <p className="text-gray-500 max-w-md mb-4">
                        {searchTerm || filterType !== "All" || fromDate || toDate
                          ? "No transactions match your current filters. Try adjusting your search criteria."
                          : "There are no transactions in the system yet."}
                      </p>
                      {(searchTerm || filterType !== "All" || fromDate || toDate) && (
                        <button
                          onClick={handleResetFilters}
                          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!loading && sortedTransactions?.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-gray-900">{sortedTransactions.length}</span> of{" "}
                  <span className="font-medium text-gray-900">{transactions.length}</span> transactions
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">
                      Completed: <span className="font-medium">{stats.completed}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-gray-600">
                      Cancelled: <span className="font-medium">{stats.cancelled}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Total Revenue: <span className="font-bold text-gray-900">₹{stats.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTransaction;