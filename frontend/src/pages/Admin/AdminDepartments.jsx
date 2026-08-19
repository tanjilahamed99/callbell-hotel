import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Swal from "sweetalert2";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  BellRing,
  UtensilsCrossed,
  Shield,
  Users,
  Building2,
  Mail,
  Lock,
  User as UserIcon,
} from "lucide-react";
import { useCall } from "../../Provider/Provider";
import {
  createDepartmentUser,
  deleteDepartmentUser,
  getDepartmentUsers,
  updateDepartmentUser,
} from "../../hooks/admin/payment";

const DEPARTMENTS = [
  "reception",
  "room-service",
  "restaurant",
  "manager",
  "duty-manager",
  "staff",
];

const DEPT_META = {
  reception: { label: "Reception", icon: BellRing },
  "room-service": { label: "Room Service", icon: UtensilsCrossed },
  restaurant: { label: "Restaurant", icon: UtensilsCrossed },
  manager: { label: "Manager", icon: Shield },
  "duty-manager": { label: "Duty Manager", icon: Shield },
  staff: { label: "Staff", icon: Users },
};

const emptyForm = { name: "", email: "", password: "", department: "staff" };

const AdminDepartments = () => {
  const { user } = useCall();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchDepartments = async () => {
    if (!user?.id || !user?.email) return;
    try {
      setLoading(true);
      const { data } = await getDepartmentUsers(user.id, user.email);
      if (data.success) {
        setDepartments(data.users || data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [user]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (dept) => {
    setEditingId(dept._id);
    setForm({
      name: dept.name || "",
      email: dept.email || "",
      password: "",
      department: dept.department || "staff",
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Missing fields",
        text: "Name and email are required.",
        background: "#101820",
        color: "#eef2f7",
        confirmButtonColor: "#2563eb",
      });
    }

    if (!editingId && !form.password.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Password required",
        text: "Please set a password for this department account.",
        background: "#101820",
        color: "#eef2f7",
        confirmButtonColor: "#2563eb",
      });
    }

    try {
      setSaving(true);

      if (editingId) {
        const payload = {
          name: form.name,
          email: form.email,
          department: form.department,
        };
        if (form.password.trim()) payload.password = form.password;

        const { data } = await updateDepartmentUser(editingId, payload);
        if (!data.success) throw new Error(data.message || "Update failed");
      } else {
        const { data } = await createDepartmentUser({
          ...form,
          adminId: user?.id,
          adminEmail: user?.email,
        });
        if (!data.success) throw new Error(data.message || "Create failed");
      }

      await Swal.fire({
        icon: "success",
        title: editingId ? "Updated" : "Created",
        text: `Department account ${editingId ? "updated" : "created"} successfully.`,
        background: "#101820",
        color: "#eef2f7",
        confirmButtonColor: "#2563eb",
        timer: 1500,
        showConfirmButton: false,
      });

      setShowModal(false);
      fetchDepartments();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: err.response?.data?.message || err.message,
        background: "#101820",
        color: "#eef2f7",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (dept) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Remove this account?",
      text: `${dept.name} will no longer be reachable by guests.`,
      showCancelButton: true,
      background: "#101820",
      color: "#eef2f7",
      confirmButtonText: "Remove",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
    });

    if (!confirm.isConfirmed) return;

    try {
      const { data } = await deleteDepartmentUser(dept._id);
      if (!data.success) throw new Error(data.message || "Delete failed");
      setDepartments((prev) => prev.filter((d) => d._id !== dept._id));
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Couldn't remove account",
        text: err.response?.data?.message || err.message,
        background: "#101820",
        color: "#eef2f7",
        confirmButtonColor: "#2563eb",
      });
    }
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2
            className="text-xl sm:text-2xl text-[#eef2f7]"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 600,
            }}>
            Departments
          </h2>
          <p className="text-sm text-[#eef2f7]/45 mt-1">
            Manage guest-facing call accounts — reception, room service,
            restaurant, and more.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 text-white font-medium shadow-lg hover:shadow-[0_10px_30px_-8px_rgba(37,99,235,0.5)] transition-all duration-200">
          <Plus className="w-4 h-4" />
          Add Department
        </button>
      </div>

      {/* List — row design */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-teal-400 animate-spin mb-3" />
          <p className="text-sm text-[#eef2f7]/45">Loading departments...</p>
        </div>
      ) : departments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Building2 className="w-10 h-10 text-[#eef2f7]/20 mb-3" />
          <p className="text-[#eef2f7]/45">No department accounts yet.</p>
          <button
            onClick={openCreate}
            className="mt-4 text-sm font-medium text-teal-400 hover:text-teal-300">
            Create your first one
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-blue-500/20 bg-[#0a0f15]/40 overflow-hidden">
          <div className="divide-y divide-blue-500/10">
            {departments.map((dept) => {
              const meta = DEPT_META[dept.department] || DEPT_META.staff;
              const Icon = meta.icon;
              return (
                <div
                  key={dept._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 hover:bg-blue-500/5 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-[#eef2f7] truncate">
                          {dept.name}
                        </p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500/10 text-teal-400 text-[11px] font-medium">
                          {meta.label}
                        </span>
                      </div>
                      <p className="text-xs text-[#eef2f7]/40 truncate">
                        {dept.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => openEdit(dept)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[#eef2f7]/60 hover:bg-blue-500/10 hover:text-teal-400 text-sm font-medium transition-colors duration-200">
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(dept)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[#eef2f7]/60 hover:bg-red-500/10 hover:text-red-400 text-sm font-medium transition-colors duration-200">
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create / Edit Modal — portal, escapes layout clipping */}
      {showModal &&
        createPortal(
          <div className="fixed inset-0 bg-[#0a0f15]/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-3 sm:p-4">
            <div className="w-full max-w-md max-h-[90vh] flex flex-col rounded-2xl border border-blue-500/20 bg-gradient-to-br from-[#16222f] via-[#101820] to-[#0e161e] overflow-hidden shadow-2xl">
              <div className="flex-shrink-0 flex items-center justify-between px-5 sm:px-6 py-4 border-b border-blue-500/15">
                <h3 className="font-semibold text-[#eef2f7]">
                  {editingId ? "Edit Department" : "New Department"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-lg text-[#eef2f7]/40 hover:bg-blue-500/10 hover:text-[#eef2f7]/70 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-teal-400/70 uppercase tracking-wide mb-1.5">
                    Display Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400/50" />
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      type="text"
                      placeholder="Front Desk"
                      className="w-full h-11 pl-10 pr-3 rounded-lg border border-blue-500/20 bg-[#0a0f15]/60 text-sm text-[#eef2f7] placeholder:text-[#eef2f7]/30 focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-400/15 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-teal-400/70 uppercase tracking-wide mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400/50" />
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="reception@tarainn.com"
                      className="w-full h-11 pl-10 pr-3 rounded-lg border border-blue-500/20 bg-[#0a0f15]/60 text-sm text-[#eef2f7] placeholder:text-[#eef2f7]/30 focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-400/15 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-teal-400/70 uppercase tracking-wide mb-1.5">
                    {editingId ? "New Password (optional)" : "Password"}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400/50" />
                    <input
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      type="password"
                      placeholder={
                        editingId ? "Leave blank to keep current" : "••••••••"
                      }
                      className="w-full h-11 pl-10 pr-3 rounded-lg border border-blue-500/20 bg-[#0a0f15]/60 text-sm text-[#eef2f7] placeholder:text-[#eef2f7]/30 focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-400/15 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-teal-400/70 uppercase tracking-wide mb-1.5">
                    Department
                  </label>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="w-full h-11 px-3 rounded-lg border border-blue-500/20 bg-[#0a0f15]/60 text-sm text-[#eef2f7] focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-400/15 transition">
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d} className="bg-[#101820]">
                        {DEPT_META[d].label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-2 pb-1">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 h-11 rounded-lg border border-blue-500/20 text-[#eef2f7]/70 font-medium hover:bg-blue-500/10 transition-colors">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 h-11 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 text-white font-medium shadow-lg hover:shadow-[0_10px_30px_-8px_rgba(37,99,235,0.5)] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : editingId ? (
                      "Save Changes"
                    ) : (
                      "Create"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default AdminDepartments;