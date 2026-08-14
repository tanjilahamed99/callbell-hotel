import { useEffect, useState } from "react";
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

const emptyForm = {
  name: "",
  email: "",
  password: "",
  department: "staff",
};

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
        confirmButtonColor: "#dc2626",
      });
    }

    if (!editingId && !form.password.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Password required",
        text: "Please set a password for this department account.",
        confirmButtonColor: "#dc2626",
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
        confirmButtonColor: "#dc2626",
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
        confirmButtonColor: "#dc2626",
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
      confirmButtonText: "Remove",
      confirmButtonColor: "#dc2626",
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
        confirmButtonColor: "#dc2626",
      });
    }
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Departments
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage guest-facing call accounts — reception, room service,
            restaurant, and more.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-medium shadow-sm hover:shadow-md transition-all duration-200">
          <Plus className="w-4 h-4" />
          Add Department
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-red-600 animate-spin mb-3" />
          <p className="text-sm text-gray-500">Loading departments...</p>
        </div>
      ) : departments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Building2 className="w-10 h-10 text-gray-300 mb-3" />
          <p className="text-gray-500">No department accounts yet.</p>
          <button
            onClick={openCreate}
            className="mt-4 text-sm font-medium text-red-600 hover:text-red-700">
            Create your first one
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => {
            const meta = DEPT_META[dept.department] || DEPT_META.staff;
            const Icon = meta.icon;
            return (
              <div
                key={dept._id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
                    <Icon className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-50 text-red-700 text-xs font-medium">
                    {meta.label}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 truncate">
                  {dept.name}
                </h3>
                <p className="text-sm text-gray-500 truncate mt-0.5">
                  {dept.email}
                </p>

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => openEdit(dept)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 text-sm font-medium transition-colors duration-200">
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(dept)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 text-sm font-medium transition-colors duration-200">
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-[9998] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">
                {editingId ? "Edit Department" : "New Department"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Display Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    type="text"
                    placeholder="Front Desk"
                    className="w-full h-11 pl-10 pr-3 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="reception@hotel.com"
                    className="w-full h-11 pl-10 pr-3 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  {editingId ? "New Password (optional)" : "Password"}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    type="password"
                    placeholder={
                      editingId ? "Leave blank to keep current" : "••••••••"
                    }
                    className="w-full h-11 pl-10 pr-3 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Department
                </label>
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="w-full h-11 px-3 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition">
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {DEPT_META[d].label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 h-11 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 h-11 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
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
        </div>
      )}
    </div>
  );
};

export default AdminDepartments;
