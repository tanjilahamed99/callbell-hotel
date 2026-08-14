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
  PersonStanding,
  X,
} from "lucide-react";
import getAllDistributors from "../../hooks/admin/getAllDistributors";
import updateDistributorStatus from "../../hooks/admin/updateStatus";
import addNewWebsiteData from "../../hooks/admin/addNewSub";
import getWebsiteData from "../../hooks/admin/getWebisteData";

const AdminDistributor = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: admin } = useCall();
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectStatus, setSelectStatus] = useState("all");
  const [commission, setCommission] = useState(null);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterUsers(term, selectStatus);
  };

  // data comes like (approve/reject/pending)
  const filterUsers = (searchTerm, selectStatus) => {
    let filtered = users;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();

      filtered = filtered.filter(
        (user) =>
          user?.name?.toLowerCase().includes(searchLower) ||
          user?.email?.toLowerCase().includes(searchLower) ||
          user?.address?.toLowerCase().includes(searchLower) ||
          user?.phone?.toLowerCase().includes(searchLower) ||
          user?.role?.toLowerCase().includes(searchLower),
      );
    }

    // ✅ STATUS FILTER
    if (selectStatus !== "all") {
      filtered = filtered.filter(
        (user) => user?.distributorStatus === selectStatus,
      );
    }

    setFilteredUsers(filtered);
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
    const fetch = async () => {
      try {
        const { data } = await getWebsiteData();
        if (data.success) {
          setCommission(data.data.distributorCommission);
        }
      } catch (error) {
        console.error("Error fetching payment status:", error);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await getAllDistributors();
        if (data.success) {
          setUsers(data.distributors);
          setFilteredUsers(data.distributors);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [admin]);

  useEffect(() => {
    filterUsers(searchTerm, selectStatus);
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
          <p className="text-gray-600 mt-4 font-medium">
            Loading contributors...
          </p>
        </div>
      </div>
    );
  }

  const stats = {
    total: users.length,
    approved: users.filter((u) => u.distributorStatus === "approve").length,
    pending: users.filter((u) => u.distributorStatus === "pending").length,
    rejected: users.filter((u) => u.distributorStatus === "reject").length,
  };

  const handleUpdateStatus = async (status, userId) => {
    try {
      const { data } = await updateDistributorStatus({ status, userId });
      if (data.success) {
        const updatedUsers = users.map((user) =>
          user._id === userId ? { ...user, distributorStatus: status } : user,
        );
        setUsers(updatedUsers);
        filterUsers(searchTerm, selectStatus);

        Swal.fire({
          title: "Success!",
          text: `Distributor status updated to ${status}.`,
          icon: "success",
          confirmButtonColor: "#dc2626",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectStatus(value);
    filterUsers(searchTerm, value);
  };

  const handleUpdateCommission = async (e) => {
    e.preventDefault();

    if (!commission || isNaN(commission) || commission < 0) {
      Swal.fire({
        title: "Error!",
        text: `Please enter a valid commission percentage.`,
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    try {
      const { data } = await addNewWebsiteData(admin.id, admin.email, {
        distributorCommission: commission,
      });
      if (data.success) {
        Swal.fire({
          title: "Success!",
          text: `Distributor commission updated to ${commission}%.`,
          icon: "success",
          confirmButtonColor: "#dc2626",
          showConfirmButton: true,
          timer: 3000,
        });
        setCommission(commission);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommissionChange = (e) => {
    setCommission(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Distributor <span className="text-red-600">Management</span>
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Manage all registered Distributor and their subscriptions
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
                  <p className="text-sm text-gray-600">Total Distributor</p>
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
                  <p className="text-sm text-gray-600">Approve Distributor</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.approved}
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
                  <p className="text-sm text-gray-600">Pending Distributor</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.pending}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-50 to-orange-100 flex items-center justify-center">
                  <PersonStanding className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rejected Distributor</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.rejected}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-red-50 to-red-100 flex items-center justify-center">
                  <X className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Commission setup for distributors */}
        <div className="mb-6 rounded-xl border border-neutral-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-black">
            Distributor Commission
          </h2>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Input */}
            <div className="relative w-full sm:w-2/3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                required
                defaultValue={commission}
                onChange={handleCommissionChange}
                type="text"
                name="commission"
                placeholder="Set commission percentage"
                className="
          w-full rounded-lg
          border border-neutral-300
          bg-white
          py-3 pl-9 pr-4
          text-sm text-black
          transition-all duration-200

          placeholder:text-neutral-400

          hover:border-black
          focus:border-red-600
          focus:outline-none
          focus:ring-2
          focus:ring-red-600/20
        "
              />
            </div>

            {/* Button */}
            <button
              onClick={handleUpdateCommission}
              className="
        inline-flex items-center justify-center
        rounded-lg border border-red-600
        bg-red-600 px-5 py-3
        text-sm font-medium text-white
        transition-all duration-200

        hover:bg-red-700
        hover:border-red-700
        active:scale-[0.98]
      ">
              Update
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
                  placeholder="Search users by name, email, phone..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                name="status"
                onChange={handleChange}
                className="
      w-full appearance-none rounded-lg
      border border-neutral-300
      bg-white
      px-4 py-3
      text-sm font-medium text-black
      transition-all duration-200

      hover:border-black

      focus:border-red-600
      focus:outline-none
      focus:ring-2
      focus:ring-red-600/20

      disabled:cursor-not-allowed
      disabled:opacity-50
    "
                aria-label="Filter by status">
                <option value="all">All</option>
                <option value="approve">Approved</option>
                <option value="reject">Rejected</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Reset Button */}
            <div>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFromDate("");
                  setToDate("");
                  filterUsers("", "all");
                }}
                className="w-full lg:w-auto px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Reset Filters
              </button>
            </div>
          </div>

          {/* Active Filters */}
          {searchTerm && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      filterUsers("");
                    }}
                    className="ml-1 hover:text-red-900">
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
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className="font-bold text-gray-900">
                        {(user.distributorStatus === "approve" && "Approved") ||
                          (user.distributorStatus === "reject" && "Rejected") ||
                          "Pending"}
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
                        <p className="text-sm text-gray-600">User Created</p>
                        <span
                          className={`inline-flex border border-gray-300 text-black text-center mx-auto items-center px-2.5 py-0.5 rounded-full text-xs font-medium}`}>
                          0
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {user.distributorStatus === "approve" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                            <CheckCircle className="w-3 h-3" />
                            Approved
                          </span>
                        ) : user.distributorStatus === "reject" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">
                            <XCircle className="w-3 h-3" />
                            Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                            <Shield className="w-3 h-3" />
                            Pending
                          </span>
                        )}

                        {user.distributorStatus === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleUpdateStatus("approve", user._id)
                              }
                              className="p-2 text-sm text-gray-600 border border-green-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateStatus("reject", user._id)
                              }
                              className="p-2 text-sm border-red-500 border text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              Reject
                            </button>
                          </>
                        )}
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
                      Status
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      User Created
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Joined Date
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
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
                        <div className="text-sm text-black">
                          {(user.distributorStatus === "approve" &&
                            "Approved") ||
                            (user.distributorStatus === "reject" &&
                              "Rejected") ||
                            "Pending"}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium text-black`}>
                            0
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
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {user.distributorStatus === "approve" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                              <CheckCircle className="w-3 h-3" />
                              Approved
                            </span>
                          ) : user.distributorStatus === "reject" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">
                              <XCircle className="w-3 h-3" />
                              Rejected
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                              <Shield className="w-3 h-3" />
                              Pending
                            </span>
                          )}

                          {user.distributorStatus === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  handleUpdateStatus("approve", user._id)
                                }
                                className="p-2 text-sm text-gray-600 border border-green-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  handleUpdateStatus("reject", user._id)
                                }
                                className="p-2 text-sm border-red-500 border text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                Reject
                              </button>
                            </>
                          )}
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

export default AdminDistributor;
