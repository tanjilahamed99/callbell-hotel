import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useCall } from "../../Provider/Provider";
import {
  Search,
  Calendar,
  Trash2,
  Eye,
  RefreshCw,
  Users,
  Shield,
  CheckCircle,
  XCircle,
  UserPlus,
} from "lucide-react";
import { disAllUsers } from "../../hooks/distributor/distributor";

const DistributorAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: distributor } = useCall();
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list

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
          user?.role?.toLowerCase().includes(searchLower)
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await disAllUsers(distributor.id);
        if (data.success) {
          setUsers(data.data || []);
          setFilteredUsers(data.data || []);
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

  const stats = {
    total: users.length,
    active: users.filter((u) => getRemainingDays(u.subscription?.endDate) > 0)
      .length,
    expired: users.filter(
      (u) => getRemainingDays(u.subscription?.endDate) === 0,
    ).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                User <span className="text-red-600">Management</span>
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Manage all registered users and their subscriptions
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

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Expired Subscriptions</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.expired}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-red-50 to-red-100 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
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
                  placeholder="Search users by name, email, phone..."
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
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
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
                      </div>
                    </div>
                    {user.role === "admin" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Admin
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Transactions
                      </span>
                      <span className="font-bold text-gray-900">
                        {user.transactionHistory?.length || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Phone</span>
                      <span className="font-medium text-gray-900">
                        {user.phone || "N/A"}
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

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">
                          Subscription Status
                        </p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            getRemainingDays(user.subscription?.endDate),
                          )}`}>
                          {getRemainingDays(user.subscription?.endDate)} days
                          left
                        </span>
                      </div>
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
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Email & Phone
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Transactions
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Subscription Status
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Joined Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
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
                              {user.role === "admin" ? "Administrator" : "User"}
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
                        <div className="text-lg font-bold text-gray-900">
                          {user.transactionHistory?.length || 0}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              getRemainingDays(user.subscription?.endDate) === 0
                                ? "bg-red-500"
                                : getRemainingDays(
                                      user.subscription?.endDate,
                                    ) <= 7
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`}></div>
                          <span
                            className={`text-sm font-medium ${
                              getRemainingDays(user.subscription?.endDate) === 0
                                ? "text-red-600"
                                : getRemainingDays(
                                      user.subscription?.endDate,
                                    ) <= 7
                                  ? "text-yellow-600"
                                  : "text-green-600"
                            }`}>
                            {getRemainingDays(user.subscription?.endDate)} days
                          </span>
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
                    </tr>
                  ))}
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
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DistributorAllUsers;
