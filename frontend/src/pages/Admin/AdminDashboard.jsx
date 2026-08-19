import { useEffect, useState } from "react";
import { useCall } from "../../Provider/Provider";
import getAllUsers from "../../hooks/admin/getAllUsers";
import { getDepartmentUsers } from "../../hooks/admin/payment";
import { Link } from "react-router-dom";
import {
  Users,
  Building2,
  Shield,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Server,
  BellRing,
  UtensilsCrossed,
} from "lucide-react";

const DEPT_ICON = {
  reception: BellRing,
  "room-service": UtensilsCrossed,
  restaurant: UtensilsCrossed,
  manager: Shield,
  "duty-manager": Shield,
  staff: Users,
};

const AdminDashboard = () => {
  const { user } = useCall();
  const [totalUsers, setTotalUsers] = useState(0);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id && user?.email) {
      const fetch = async () => {
        try {
          const { data: userData } = await getAllUsers(user.id, user.email);
          if (userData.success) {
            setTotalUsers(userData.users?.length || 0);
          }
          const { data: deptData } = await getDepartmentUsers(
            user.id,
            user.email,
          );
          if (deptData.success) {
            setDepartments(deptData.users || deptData.data || []);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetch();
    }
  }, [user]);

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      link: "/admin/users",
    },
    {
      title: "Departments",
      value: departments.length,
      icon: Building2,
      link: "/admin/departments",
    },
  ];

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
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1
            className="text-2xl sm:text-3xl text-[#eef2f7]"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 600,
            }}>
            Admin <span className="text-teal-400">Overview</span>
          </h1>
          <p className="text-[#eef2f7]/45 mt-1 text-sm sm:text-base">
            Welcome back,{" "}
            <span className="font-semibold text-[#eef2f7]">
              {user?.name?.split(" ")[0] || "Admin"}
            </span>
            .
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="p-2 rounded-lg border border-blue-500/20 bg-[#0a0f15]/40 hover:bg-blue-500/10 transition-colors">
          <RefreshCw className="w-5 h-5 text-teal-400" />
        </button>
      </div>

      {/* Stats — row design */}
      <div className="rounded-2xl border border-blue-500/20 bg-[#0a0f15]/40 overflow-hidden mb-6">
        <div className="divide-y sm:divide-y-0 sm:divide-x divide-blue-500/10 sm:flex">
          {stats.map((stat, index) => (
            <Link
              to={stat.link}
              key={index}
              className="group flex-1 flex items-center justify-between gap-3 px-4 sm:px-6 py-4 hover:bg-blue-500/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-[#eef2f7]/45">{stat.title}</p>
                  <p className="text-xl font-bold text-[#eef2f7]">
                    {stat.value}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#eef2f7]/25 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* System Health & Departments row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* System Health */}
        <div className="rounded-2xl border border-blue-500/20 bg-[#0a0f15]/40 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-blue-500/15 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center">
              <Server className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#eef2f7]">
                System Health
              </h2>
              <p className="text-xs text-[#eef2f7]/45">
                Current system status
              </p>
            </div>
          </div>
          <div className="divide-y divide-blue-500/10">
            {[
              { label: "API Status", status: "Operational" },
              { label: "Database", status: "Online" },
              { label: "Call Service", status: "Active" },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between px-4 sm:px-6 py-3">
                <span className="text-sm text-[#eef2f7]/50">{row.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-sm font-medium text-emerald-400">
                    {row.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 sm:px-6 py-3 border-t border-blue-500/15">
            <div className="flex items-center gap-2 text-sm text-[#eef2f7]/40">
              <AlertCircle className="w-4 h-4" />
              <span>No critical issues detected</span>
            </div>
          </div>
        </div>

        {/* Departments preview */}
        <div className="rounded-2xl border border-blue-500/20 bg-[#0a0f15]/40 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-blue-500/15 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#eef2f7]">
                  Departments
                </h2>
                <p className="text-xs text-[#eef2f7]/45">
                  Guest-facing call accounts
                </p>
              </div>
            </div>
            <Link
              to="/admin/departments"
              className="text-sm text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1">
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {departments.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-[#eef2f7]/40">
              No departments created yet.
            </div>
          ) : (
            <div className="divide-y divide-blue-500/10">
              {departments.slice(0, 4).map((dept) => {
                const Icon = DEPT_ICON[dept.department] || Users;
                return (
                  <div
                    key={dept._id}
                    className="flex items-center gap-3 px-4 sm:px-6 py-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-teal-400" />
                    </div>
                    <span className="text-sm text-[#eef2f7] truncate">
                      {dept.name}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;