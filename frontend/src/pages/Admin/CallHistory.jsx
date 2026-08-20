import React, { useEffect, useState } from "react";
import {
  PhoneCall,
  User,
  Phone,
  Clock,
  Calendar,
  RefreshCw,
} from "lucide-react";
import Swal from "sweetalert2";
import { getCallHistory } from "../../hooks/admin/payment";

const CallHistory = () => {
  const [callHistory, setCallHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchCallHistory = async () => {
    try {
      setLoading(true);

      const { data } = await getCallHistory();

      console.log(data);

      if (!data.success) {
        throw new Error(data.message || "Failed to load call history");
      }

      console.log(data);

      setCallHistory(data.callHistory || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCallHistory();
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const departmentName = (department) => {
    if (!department) return "Staff";

    return department
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1
              className="text-3xl font-semibold text-gray-900"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
              }}>
              Call <span className="text-teal-600">History</span>
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              View all guest calls handled by your staff
            </p>
          </div>

          <button
            onClick={fetchCallHistory}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50">
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Summary */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Calls</p>

                <h2 className="mt-2 text-3xl font-semibold text-gray-900">
                  {callHistory.length}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <PhoneCall size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Staff With Calls</p>

                <h2 className="mt-2 text-3xl font-semibold text-gray-900">
                  {new Set(callHistory.map((call) => call.userId)).size}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <User size={23} />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:block">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="font-semibold text-gray-900">All Call Records</h2>

            <p className="mt-1 text-xs text-gray-500">
              {callHistory.length} total call records
            </p>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <RefreshCw size={24} className="animate-spin text-teal-500" />
            </div>
          ) : callHistory.length === 0 ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <PhoneCall size={40} className="mx-auto text-gray-300" />

                <p className="mt-3 font-medium text-gray-700">
                  No call history
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  No calls have been recorded yet.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <th className="px-5 py-4">Staff</th>

                    <th className="px-5 py-4">Department</th>

                    <th className="px-5 py-4">Guest</th>

                    <th className="px-5 py-4">Phone</th>

                    <th className="px-5 py-4">Duration</th>

                    <th className="px-5 py-4">Date</th>

                    <th className="px-5 py-4">Time</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {callHistory.map((call, index) => (
                    <tr
                      key={call._id || index}
                      className="transition hover:bg-gray-50">
                      {/* Staff */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-teal-500 font-semibold text-white">
                            {call.userName?.charAt(0)?.toUpperCase() || "S"}
                          </div>

                          <div>
                            <p className="font-medium text-gray-900">
                              {call.userName}
                            </p>

                            <p className="text-xs text-gray-400">
                              {call.userEmail}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700">
                          {departmentName(call.department)}
                        </span>
                      </td>

                      {/* Guest */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-gray-400" />

                          <div>
                            <p className="font-medium text-gray-800">
                              {call.gestName}
                            </p>

                            <p className="text-xs text-gray-400">
                              ID: {call.gestId}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Phone size={15} className="text-teal-500" />

                          {call.gestPhone}
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                          <Clock size={13} />
                          {call.duration.slice(0,4)}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={15} className="text-gray-400" />

                          {formatDate(call.time)}
                        </div>
                      </td>

                      {/* Time */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {formatTime(call.time)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Mobile */}
        <div className="space-y-4 md:hidden">
          {loading ? (
            <div className="flex h-48 items-center justify-center rounded-2xl border border-gray-200 bg-white">
              <RefreshCw size={23} className="animate-spin text-teal-500" />
            </div>
          ) : callHistory.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
              <PhoneCall size={40} className="mx-auto text-gray-300" />

              <p className="mt-3 font-medium text-gray-700">No call history</p>
            </div>
          ) : (
            callHistory.map((call, index) => (
              <div
                key={call._id || index}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                {/* Staff */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-teal-500 font-semibold text-white">
                      {call.userName?.charAt(0)?.toUpperCase() || "S"}
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900">
                        {call.userName}
                      </p>

                      <p className="text-xs text-gray-500">
                        {departmentName(call.department)}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    {call.duration}
                  </span>
                </div>

                {/* Guest */}
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                      <User size={17} />
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Guest</p>

                      <p className="font-medium text-gray-800">
                        {call.gestName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">
                      <Phone size={17} />
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Phone</p>

                      <p className="font-medium text-gray-800">
                        {call.gestPhone}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-xs text-gray-400">Date</p>

                      <p className="mt-1 text-sm font-medium text-gray-700">
                        {formatDate(call.time)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-xs text-gray-400">Time</p>

                      <p className="mt-1 text-sm font-medium text-gray-700">
                        {formatTime(call.time)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CallHistory;
