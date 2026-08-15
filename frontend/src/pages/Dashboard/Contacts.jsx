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
import {
  blockGest,
  getUniqueContact,
  unblockGest,
} from "../../hooks/users/updateUser";

const useBrandFonts = () => {
  useEffect(() => {
    const id = "auth-brand-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
};

const Contacts = () => {
  useBrandFonts();
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
      background: "#101820",
      color: "#f1ece2",
      confirmButtonColor: action === "block" ? "#b8892b" : "#16a34a",
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
          background: "#101820",
          color: "#f1ece2",
          confirmButtonColor: "#b8892b",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Something went wrong",
        icon: "error",
        background: "#101820",
        color: "#f1ece2",
        confirmButtonColor: "#b8892b",
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-[#b8892b] to-[#8a651c] animate-pulse mb-4" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-[#b8892b]/20 border-t-[#c9a24b] rounded-full animate-spin" />
            </div>
          </div>
          <p className="text-[#f1ece2]/60 mt-4 font-medium">
            Loading contacts...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8"
      style={{ fontFamily: "'Inter', ui-sans-serif, sans-serif" }}>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1
          className="text-2xl sm:text-3xl lg:text-4xl text-[#f1ece2] mb-2"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 600,
          }}>
          Guest <span className="text-[#c9a24b]">Contacts</span>
        </h1>
        <p className="text-[#f1ece2]/45 text-sm sm:text-base">
          Manage guests who have called you — block or unblock anytime
        </p>
      </div>

      {/* Stats — row design */}
      <div className="rounded-2xl border border-[#b8892b]/20 bg-gradient-to-br from-[#16222f]/90 via-[#0e161e]/90 to-[#16222f]/90 shadow-xl overflow-hidden mb-6">
        <div className="divide-y sm:divide-y-0 sm:divide-x divide-[#b8892b]/10 sm:flex">
          {[
            { label: "Total Contacts", value: contacts.length, icon: Users },
            {
              label: "Active",
              value: contacts.length - blockedCount,
              icon: CheckCircle,
            },
            { label: "Blocked", value: blockedCount, icon: Ban },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex-1 flex items-center gap-3 px-4 sm:px-6 py-4">
              <div className="w-10 h-10 rounded-lg bg-[#b8892b]/10 border border-[#b8892b]/20 flex items-center justify-center flex-shrink-0">
                <stat.icon className="w-5 h-5 text-[#c9a24b]" />
              </div>
              <div>
                <p className="text-xs text-[#f1ece2]/45">{stat.label}</p>
                <p className="text-xl font-bold text-[#f1ece2]">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main card */}
      <div className="rounded-2xl border border-[#b8892b]/20 bg-gradient-to-br from-[#16222f]/90 via-[#0e161e]/90 to-[#16222f]/90 shadow-xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 sm:p-6 border-b border-[#b8892b]/15">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#f1ece2]/30" />
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-9 bg-[#0a0f15]/60 border border-[#b8892b]/20 rounded-lg text-sm text-[#f1ece2] placeholder:text-[#f1ece2]/30 focus:outline-none focus:border-[#c9a24b] focus:ring-2 focus:ring-[#c9a24b]/20 transition"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f1ece2]/30 hover:text-[#f1ece2]/60">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Tabs */}
            <div className="flex bg-[#0a0f15]/60 border border-[#b8892b]/15 rounded-lg p-1 gap-1 self-start">
              {[
                { key: "all", label: "All" },
                { key: "blocked", label: `Blocked (${blockedCount})` },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    tab === t.key
                      ? "bg-gradient-to-r from-[#b8892b] to-[#8a651c] text-[#0a0f15]"
                      : "text-[#f1ece2]/50 hover:text-[#f1ece2]/80"
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contact list */}
        {filtered.length > 0 ? (
          <div className="divide-y divide-[#b8892b]/10">
            {filtered.map((contact, idx) => {
              const isBlocked = blockedIds.includes(String(contact.gestId));
              const isLoading = actionLoading === String(contact.gestId);

              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between px-4 sm:px-6 py-4 hover:bg-[#b8892b]/5 transition-colors ${
                    isBlocked ? "opacity-60" : ""
                  }`}>
                  {/* Avatar + info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-base ${
                        isBlocked
                          ? "bg-[#f1ece2]/5 text-[#f1ece2]/30"
                          : "bg-gradient-to-br from-[#b8892b] to-[#8a651c] text-[#0a0f15]"
                      }`}>
                      {contact.gestName?.charAt(0)?.toUpperCase() || "G"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-[#f1ece2] truncate">
                          {contact.gestName}
                        </p>
                        {isBlocked && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#b8892b]/10 text-[#c9a24b] rounded-full text-[11px] font-semibold">
                            <Ban className="w-2.5 h-2.5" />
                            Blocked
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#f1ece2]/40 mt-0.5">
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
                        ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                        : "bg-[#b8892b]/10 text-[#c9a24b] hover:bg-[#b8892b]/20 border border-[#b8892b]/20"
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
            <div className="w-16 h-16 mx-auto rounded-full bg-[#f1ece2]/5 flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-[#f1ece2]/25" />
            </div>
            <h3 className="text-lg font-semibold text-[#f1ece2] mb-1">
              {search
                ? "No contacts found"
                : tab === "blocked"
                  ? "No blocked contacts"
                  : "No contacts yet"}
            </h3>
            <p className="text-sm text-[#f1ece2]/40 max-w-xs mx-auto">
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