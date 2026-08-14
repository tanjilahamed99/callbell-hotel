import { useEffect, useState } from "react";
import { useCall } from "../../Provider/Provider";
import Swal from "sweetalert2";
import {
  Users,
  Search,
  ShieldOff,
  Shield,
  Phone,
  User,
  X,
  Ban,
  CheckCircle,
} from "lucide-react";
import { BASE_URL } from "../../config/constant";
import {
  blockGest,
  getUniqueContact,
  unblockGest,
} from "../../hooks/users/updateUser";

const Contacts = () => {
  const { user } = useCall();
  const [contacts, setContacts] = useState([]);
  const [blockedIds, setBlockedIds] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getUniqueContact(user.id);

      if (data.success) {
        setContacts(data.contacts);
        setFiltered(data.contacts);
        // Force everything to string to avoid ObjectId vs String mismatch
        const ids = data.contacts
          .filter((c) => c.isBlocked)
          .map((c) => String(c.gestId));
        setBlockedIds(ids);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  useEffect(() => {
    let result = [...contacts];

    if (tab === "blocked") {
      result = result.filter((c) => blockedIds.includes(String(c.gestId)));
    }

    if (search.trim()) {
      result = result.filter(
        (c) =>
          c.gestName?.toLowerCase().includes(search.toLowerCase()) ||
          c.gestPhone?.includes(search),
      );
    }

    setFiltered(result);
  }, [search, tab, contacts, blockedIds]);

  const handleBlock = async (contact) => {
    const isBlocked = blockedIds.includes(String(contact.gestId));
    const action = isBlocked ? "unblock" : "block";

    const result = await Swal.fire({
      title: `${action === "block" ? "Block" : "Unblock"} ${contact.gestName}?`,
      text:
        action === "block"
          ? "This guest won't be able to call you anymore."
          : "This guest will be able to call you again.",
      icon: action === "block" ? "warning" : "question",
      showCancelButton: true,
      confirmButtonColor: action === "block" ? "#dc2626" : "#16a34a",
      cancelButtonColor: "#6b7280",
      confirmButtonText: action === "block" ? "Yes, Block" : "Yes, Unblock",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setActionLoading(String(contact.gestId));
    try {
      let data;
      if (action === "block") {
        data = await blockGest(user.id, contact.gestId);
      } else {
        data = await unblockGest(user.id, contact.gestId);
      }

      if (data.data.success || data.data.message) {
        if (action === "block") {
          setBlockedIds((prev) => [...prev, String(contact.gestId)]);
        } else {
          setBlockedIds((prev) =>
            prev.filter((id) => id !== String(contact.gestId)),
          );
        }

        Swal.fire({
          title: action === "block" ? "Blocked!" : "Unblocked!",
          text: `${contact.gestName} has been ${action}ed successfully.`,
          icon: "success",
          confirmButtonColor: "#dc2626",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Something went wrong",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const blockedCount = contacts.filter((c) =>
    blockedIds.includes(String(c.gestId)),
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-red-600 to-red-700 animate-pulse mb-4" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
            </div>
          </div>
          <p className="text-gray-600 mt-4 font-medium">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Guest <span className="text-red-600">Contacts</span>
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Manage guests who have called you — block or unblock anytime
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          {
            label: "Total Contacts",
            value: contacts.length,
            icon: Users,
            color: "from-red-600 to-red-700",
          },
          {
            label: "Active",
            value: contacts.length - blockedCount,
            icon: CheckCircle,
            color: "from-green-600 to-green-700",
          },
          {
            label: "Blocked",
            value: blockedCount,
            icon: Ban,
            color: "from-gray-600 to-gray-800",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
            <div
              className={`w-11 h-11 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center flex-shrink-0`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-9 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-100 rounded-lg p-1 gap-1 self-start">
              {[
                { key: "all", label: "All" },
                { key: "blocked", label: `Blocked (${blockedCount})` },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    tab === t.key
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contact list */}
        {filtered.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filtered.map((contact, idx) => {
              const isBlocked = blockedIds.includes(String(contact.gestId));
              const isLoading = actionLoading === String(contact.gestId);

              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between px-4 sm:px-6 py-4 hover:bg-gray-50/60 transition-colors ${
                    isBlocked ? "opacity-60" : ""
                  }`}>
                  {/* Avatar + info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-base ${
                        isBlocked
                          ? "bg-gray-100 text-gray-400"
                          : "bg-gradient-to-br from-red-100 to-orange-100 text-red-600"
                      }`}>
                      {contact.gestName?.charAt(0)?.toUpperCase() || "G"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {contact.gestName}
                        </p>
                        {isBlocked && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-[11px] font-semibold">
                            <Ban className="w-2.5 h-2.5" />
                            Blocked
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                        <Phone className="w-3 h-3" />
                        {contact.gestPhone}
                      </div>
                    </div>
                  </div>

                  {/* Block / Unblock button */}
                  <button
                    onClick={() => handleBlock(contact)}
                    disabled={isLoading}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      isBlocked
                        ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                        : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                    }`}>
                    {isLoading ? (
                      <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : isBlocked ? (
                      <Shield className="w-3.5 h-3.5" />
                    ) : (
                      <ShieldOff className="w-3.5 h-3.5" />
                    )}
                    {isBlocked ? "Unblock" : "Block"}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {search
                ? "No contacts found"
                : tab === "blocked"
                  ? "No blocked contacts"
                  : "No contacts yet"}
            </h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">
              {search
                ? "Try a different name or phone number"
                : tab === "blocked"
                  ? "You haven't blocked anyone"
                  : "Guests who call you will appear here"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contacts;
