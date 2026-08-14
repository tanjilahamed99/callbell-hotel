import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config/constant";
import { useCall } from "../../Provider/Provider";
import Swal from "sweetalert2";
import {
  MessageSquare,
  Mail,
  User,
  Calendar,
  Clock,
  Search,
  Filter,
  Trash2,
  Eye,
  Phone,
  MapPin,
  Archive,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Download,
  MoreVertical,
  AlertCircle,
  CheckCircle,
  XCircle,
  Bell,
  FileText,
} from "lucide-react";

const AdminContact = () => {
  const [contactList, setContactList] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [expandedCard, setExpandedCard] = useState(null);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    thisWeek: 0,
    lastMonth: 0,
  });
  const { user } = useCall();

  const calculateStats = (contacts) => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const unread = contacts.filter((c) => !c.read).length;
    const thisWeek = contacts.filter(
      (c) => new Date(c.createdAt) > oneWeekAgo
    ).length;
    const lastMonth = contacts.filter(
      (c) => new Date(c.createdAt) > oneMonthAgo
    ).length;

    return {
      total: contacts.length,
      unread,
      thisWeek,
      lastMonth,
    };
  };

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        BASE_URL + `/admin/contacts/${user.id}/${user.email}`
      );
      const contacts = data?.data || [];
      setContactList(contacts);
      setFilteredContacts(contacts);
      setStats(calculateStats(contacts));
    } catch (err) {
      console.error("Error fetching contact info:", err);
      Swal.fire({
        title: "Error!",
        text: "Failed to load contact submissions. Please try again.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchContacts();
    }
  }, [user]);

  useEffect(() => {
    let filtered = [...contactList];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (contact) =>
          contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((contact) =>
        statusFilter === "unread" ? !contact.read : contact.read
      );
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      let cutoffDate = new Date();

      switch (dateFilter) {
        case "today":
          cutoffDate.setDate(now.getDate() - 1);
          break;
        case "week":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "month":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        default:
          break;
      }

      filtered = filtered.filter(
        (contact) => new Date(contact.createdAt) > cutoffDate
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredContacts(filtered);
  }, [contactList, searchTerm, statusFilter, dateFilter]);

  const toggleCardExpand = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  const toggleSelectContact = (contactId) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleBulkAction = async (action) => {
    if (selectedContacts.length === 0) return;

    if (action === "delete") {
      const result = await Swal.fire({
        title: "Delete Selected?",
        text: `Are you sure you want to delete ${selectedContacts.length} contact submission(s)?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: `Delete ${selectedContacts.length} items`,
      });

      if (result.isConfirmed) {
        try {
          await Promise.all(
            selectedContacts.map((id) =>
              axios.delete(BASE_URL + `/admin/contacts/${id}`)
            )
          );
          setSelectedContacts([]);
          fetchContacts();
          Swal.fire({
            title: "Success!",
            text: `${selectedContacts.length} contact submission(s) deleted.`,
            icon: "success",
            confirmButtonColor: "#dc2626",
            timer: 2000,
          });
        } catch (error) {
          console.error("Error deleting contacts:", error);
        }
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-red-50">
                <MessageSquare className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Contact Submissions
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage and respond to user inquiries
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Total Contacts
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-red-50">
                  <MessageSquare className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    This Week
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.thisWeek}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Last 30 Days
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.lastMonth}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-50">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Search Input */}
              <div className="lg:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Contacts
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or message..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none transition-all">
                    <option value="all">All Status</option>
                    <option value="unread">Unread Only</option>
                    <option value="read">Read Only</option>
                  </select>
                </div>
              </div>

              {/* Date Filter */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none transition-all">
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                  </select>
                </div>
              </div>

              {/* Reset Button */}
              <div className="lg:col-span-2">
                <div className="h-full flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                      setDateFilter("all");
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-red-300 hover:text-red-700 transition-colors font-medium">
                    <RefreshCw className="w-4 h-4" />
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedContacts.length > 0 && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-900">
                  {selectedContacts.length} contact(s) selected
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction("delete")}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                  <Trash2 className="w-4 h-4" />
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelectedContacts([])}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  <XCircle className="w-4 h-4" />
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contacts Grid/List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-red-600 mb-4"></div>
              <p className="text-gray-600">Loading contact submissions...</p>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No contact submissions found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                  ? "Try adjusting your filters or search term"
                  : "No contact submissions have been received yet"}
              </p>
              {(searchTerm ||
                statusFilter !== "all" ||
                dateFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setDateFilter("all");
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors mx-auto">
                  <RefreshCw className="w-4 h-4" />
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Contact Submissions ({filteredContacts.length})
                  </h3>
                  <div className="text-sm text-gray-500">
                    Showing {filteredContacts.length} of {contactList.length}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 max-h-[calc(100vh-400px)] overflow-y-auto">
                {filteredContacts.map((item, index) => (
                  <div
                    key={index}
                    className={`bg-white border rounded-xl p-5 shadow-sm hover:shadow-lg transition-all group ${
                      !item.read
                        ? "border-red-200 bg-red-50/50"
                        : "border-gray-200"
                    } ${expandedCard === index ? "ring-2 ring-red-500" : ""}`}>
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedContacts.includes(item._id)}
                          onChange={() => toggleSelectContact(item._id)}
                          className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                        />
                        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                          <User className="w-5 h-5 text-red-600" />
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {!item.read && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                            New
                          </span>
                        )}
                        <button
                          onClick={() => toggleCardExpand(index)}
                          className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                          {expandedCard === index ? (
                            <ChevronUp className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                        <div className="relative">
                          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        {item.name}
                        {!item.read && (
                          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        )}
                      </h3>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <a
                            href={`mailto:${item.email}`}
                            className="text-sm text-gray-700 hover:text-red-600 transition-colors">
                            {item.email}
                          </a>
                        </div>

                        {item.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">
                              {item.phone}
                            </span>
                          </div>
                        )}

                        {item.address && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">
                              {item.address}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Message */}
                      <div className="mt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">
                            Message
                          </span>
                        </div>
                        <p
                          className={`text-sm text-gray-600 leading-relaxed ${
                            expandedCard === index ? "" : "line-clamp-3"
                          }`}>
                          {item.message}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {formatDate(item.createdAt)}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {formatTime(item.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminContact;
