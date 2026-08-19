import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import getAllUsers from "../../hooks/admin/getAllUsers";
import { useCall } from "../../Provider/Provider";
import deleteUser from "../../hooks/admin/deleteUser";
import {
  Search,
  Calendar,
  Trash2,
  Eye,
  RefreshCw,
  Users,
  Shield,
} from "lucide-react";
import ViewUserDetails from "../../components/Admin/ViewUserDetails";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: admin } = useCall();
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  const handleDelete = async (userId, userName) => {
    const result = await Swal.fire({
      title: "Delete User?",
      html: `<div class="text-left">
        <p class="mb-2">You are about to delete user:</p>
        <p class="font-bold">${userName}</p>
        <p class="text-sm mt-2">This action cannot be undone.</p>
      </div>`,
      icon: "warning",
      showCancelButton: true,
      background: "#101820",
      color: "#eef2f7",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete User",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const { data } = await deleteUser(admin.id, admin.email, userId);
        if (data.success) {
          setUsers(users.filter((u) => u._id !== userId));
          filterUsers(searchTerm, fromDate, toDate);
          Swal.fire({
            title: "Deleted!",
            text: "User has been deleted successfully.",
            icon: "success",
            background: "#101820",
            color: "#eef2f7",
            confirmButtonColor: "#2563eb",
          });
        }
      } catch (err) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete user. Please try again.",
          icon: "error",
          background: "#101820",
          color: "#eef2f7",
          confirmButtonColor: "#2563eb",
        });
        console.error(err);
      }
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await getAllUsers(admin.id, admin.email);
        if (data.success) {
          setUsers(data.users || []);
          setFilteredUsers(data.users || []);
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
    filterUsers(searchTerm, fromDate, toDate);
  }, [fromDate, toDate, users]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-blue-600 to-teal-500 animate-pulse mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-blue-500/20 border-t-teal-400 rounded-full animate-spin"></div>
            </div>
          </div>
          <p className="text-[#eef2f7]/60 mt-4 font-medium">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
  };

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1
              className="text-2xl sm:text-3xl text-[#eef2f7]"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 600,
              }}>
              User <span className="text-teal-400">Management</span>
            </h1>
            <p className="text-[#eef2f7]/45 mt-1 text-sm sm:text-base">
              Manage all registered staff accounts
            </p>
          </div>
        </div>

        {/* Stats — row design */}
        <div className="rounded-2xl border border-blue-500/20 bg-[#0a0f15]/40 overflow-hidden mb-6">
          <div className="divide-y sm:divide-y-0 sm:divide-x divide-blue-500/10 sm:flex">
            {[
              { label: "Total Users", value: stats.total, icon: Users },
              { label: "Administrators", value: stats.admins, icon: Shield },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex-1 flex items-center gap-3 px-4 sm:px-6 py-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <p className="text-xs text-[#eef2f7]/45">{stat.label}</p>
                  <p className="text-xl font-bold text-[#eef2f7]">
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="rounded-2xl border border-blue-500/20 bg-[#0a0f15]/40 p-4 sm:p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#eef2f7]/30" />
              <input
                type="text"
                placeholder="Search users by name, email, phone..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-3 bg-[#0a0f15]/60 border border-blue-500/20 rounded-lg text-[#eef2f7] placeholder-[#eef2f7]/30 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#eef2f7]/30" />
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#0a0f15]/60 border border-blue-500/20 rounded-lg text-[#eef2f7] focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
              />
            </div>
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#eef2f7]/30" />
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#0a0f15]/60 border border-blue-500/20 rounded-lg text-[#eef2f7] focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
              />
            </div>
          </div>

          <button
            onClick={() => {
              setSearchTerm("");
              setFromDate("");
              setToDate("");
              filterUsers("", "", "");
            }}
            className="w-full lg:w-auto px-4 py-3 border border-blue-500/20 text-[#eef2f7]/70 rounded-lg hover:bg-blue-500/10 transition-all duration-200 font-medium flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Reset Filters
          </button>
        </div>
      </div>

      {/* Users — row list */}
      <div className="rounded-2xl border border-blue-500/20 bg-[#0a0f15]/40 overflow-hidden">
        {filteredUsers.length > 0 ? (
          <div className="divide-y divide-blue-500/10">
            {filteredUsers.map((u) => (
              <div
                key={u._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 hover:bg-blue-500/5 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {getInitials(u.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-[#eef2f7] truncate">
                        {u.name}
                      </p>
                      {u.role === "admin" && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/10 text-teal-400">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#eef2f7]/40 truncate">
                      {u.email} {u.phone ? `· ${u.phone}` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="text-xs text-[#eef2f7]/40">
                    Joined{" "}
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "N/A"}
                  </span>
                  <button
                    onClick={() => handleOpenModal(u)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-500/10 text-teal-400 rounded-lg hover:bg-blue-500/20 transition-colors">
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(u._id, u.name)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#eef2f7]/5 flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-[#eef2f7]/25" />
            </div>
            <h3 className="text-lg font-medium text-[#eef2f7] mb-2">
              No users found
            </h3>
            <p className="text-[#eef2f7]/40 max-w-md mx-auto">
              {searchTerm || fromDate || toDate
                ? "Try adjusting your search or filter criteria."
                : "No users have been registered yet."}
            </p>
          </div>
        )}

        {filteredUsers.length > 0 && (
          <div className="border-t border-blue-500/15 bg-[#0a0f15]/40 px-4 py-3">
            <div className="text-sm text-[#eef2f7]/45">
              Showing{" "}
              <span className="font-bold text-[#eef2f7]/70">
                {filteredUsers.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-[#eef2f7]/70">
                {users.length}
              </span>{" "}
              users
            </div>
          </div>
        )}
      </div>

      <ViewUserDetails
        isOpen={isModalOpen}
        onClose={setIsModalOpen}
        user={selectedUser}
      />
    </div>
  );
};

export default AllUsers;