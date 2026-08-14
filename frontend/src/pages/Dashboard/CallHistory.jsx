import { useEffect, useState } from "react";
import { useCall } from "../../Provider/Provider";
import {
  Phone,
  Clock,
  Search,
  PhoneIncoming,
  Calendar,
  User,
  ChevronDown,
  X,
} from "lucide-react";
import { BASE_URL } from "../../config/constant";
import { getContactList } from "../../hooks/users/updateUser";

const CallHistory = () => {
  const { user } = useCall();
  const [callHistory, setCallHistory] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await getContactList(user.id);
        if (data.success) {
          setCallHistory(data.callHistory);
          setFiltered(data.callHistory);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetch();
  }, [user]);

  useEffect(() => {
    let result = [...callHistory];

    if (search.trim()) {
      result = result.filter(
        (c) =>
          c.gestName?.toLowerCase().includes(search.toLowerCase()) ||
          c.gestPhone?.includes(search),
      );
    }

    result.sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.time) - new Date(a.time)
        : new Date(a.time) - new Date(b.time),
    );

    setFiltered(result);
  }, [search, sortOrder, callHistory]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const totalMinutes = callHistory.reduce(
    (sum, c) => sum + (parseFloat(c.duration) || 0),
    0,
  );

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
          <p className="text-gray-600 mt-4 font-medium">
            Loading call history...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Call <span className="text-red-600">History</span>
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          All incoming guest calls logged to your account
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          {
            label: "Total Calls",
            value: callHistory.length,
            icon: Phone,
            color: "from-red-600 to-red-700",
          },
          {
            label: "Total Minutes",
            value: totalMinutes.toFixed(1),
            icon: Clock,
            color: "from-orange-500 to-amber-500",
          },
          {
            label: "Unique Guests",
            value: new Set(callHistory.map((c) => c.gestId)).size,
            icon: User,
            color: "from-gray-700 to-gray-900",
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

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
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

          {/* Sort */}
          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="h-10 pl-3 pr-8 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-red-400 appearance-none cursor-pointer">
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Guest", "Phone", "Duration", "Date", "Time"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((call, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-red-50/30 transition-colors">
                    {/* Guest */}
                    <td className="px-4 py-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-red-600">
                            {call.gestName?.charAt(0)?.toUpperCase() || "G"}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {call.gestName}
                        </span>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-4 sm:px-6 text-sm text-gray-600 font-mono">
                      {call.gestPhone}
                    </td>

                    {/* Duration */}
                    <td className="px-4 py-4 sm:px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                        <Clock className="w-3 h-3" />
                        {parseFloat(call.duration).toFixed(2)} min
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 sm:px-6">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {formatDate(call.time)}
                      </div>
                    </td>

                    {/* Time */}
                    <td className="px-4 py-4 sm:px-6 text-sm text-gray-500">
                      {formatTime(call.time)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <PhoneIncoming className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {search ? "No results found" : "No calls yet"}
            </h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">
              {search
                ? "Try a different name or phone number"
                : "Call history will appear here after guests call you"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallHistory;
