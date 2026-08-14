import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import getWebsiteData from "../../hooks/admin/getWebisteData";
import { useCall } from "../../Provider/Provider";
import addNewWebsiteData from "../../hooks/admin/addNewSub";
import {
  Plus,
  Search,
  Calendar,
  RefreshCw,
  Trash2,
  Edit2,
  Package,
  Clock,
  DollarSign,
  X,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  BarChart3,
  AlertCircle
} from "lucide-react";

const AdminSubscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const { user } = useCall();

  const [newSub, setNewSub] = useState({
    name: "",
    duration: "",
    price: "",
    minute: "",
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredSubscriptions = [...(subscriptions || [])]
    .filter((txn) => {
      const txnDate = new Date(txn?.createdAt);
      
      const matchesSearch =
        txn?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn?.duration?.toString().includes(searchTerm) ||
        txn?.minute?.toString().includes(searchTerm) ||
        txn?.price?.toString().includes(searchTerm);

      const matchesDate =
        (!fromDate || txnDate >= new Date(fromDate)) &&
        (!toDate || txnDate <= new Date(toDate + "T23:59:59Z"));

      return matchesSearch && matchesDate;
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (sortConfig.key === 'price' || sortConfig.key === 'duration' || sortConfig.key === 'minute') {
        return sortConfig.direction === 'asc'
          ? parseFloat(aValue) - parseFloat(bValue)
          : parseFloat(bValue) - parseFloat(aValue);
      }
      
      if (sortConfig.key === 'name') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const { data } = await getWebsiteData();
        if (data.success) {
          setSubscriptions(data.data.plan || []);
        }
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load subscriptions',
          confirmButtonColor: '#dc2626'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSubs();
  }, [refetch]);

  const calculateStats = () => {
    const total = subscriptions.length;
    const totalPrice = subscriptions.reduce((sum, sub) => sum + (parseFloat(sub.price) || 0), 0);
    const avgPrice = total > 0 ? totalPrice / total : 0;
    
    return { total, totalPrice, avgPrice };
  };

  const stats = calculateStats();

  const handleAdd = async () => {
    if (!newSub.name || !newSub.duration || !newSub.price || !newSub.minute) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill in all fields',
        confirmButtonColor: '#dc2626'
      });
      return;
    }

    const planData = {
      duration: parseFloat(newSub.duration),
      price: parseFloat(newSub.price),
      name: newSub.name,
      minute: parseFloat(newSub.minute),
      createdAt: new Date().toISOString()
    };

    const update = {
      plan: [planData, ...subscriptions]
    };

    try {
      const { data } = await addNewWebsiteData(user.id, user.email, update);
      if (data.success) {
        setRefetch(!refetch);
        setModalOpen(false);
        setNewSub({ name: "", duration: "", price: "", minute: "" });
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Subscription added successfully!',
          confirmButtonColor: '#dc2626'
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add subscription',
        confirmButtonColor: '#dc2626'
      });
    }
  };

  const handleEdit = (subscription) => {
    setEditingId(subscription._id);
    setEditData({ ...subscription });
  };

  const handleSaveEdit = async () => {
    if (!editData.name || !editData.duration || !editData.price || !editData.minute) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill in all fields',
        confirmButtonColor: '#dc2626'
      });
      return;
    }

    const updatedSubscriptions = subscriptions.map(sub =>
      sub._id === editingId ? { ...editData } : sub
    );

    const update = { plan: updatedSubscriptions };

    try {
      const { data } = await addNewWebsiteData(user.id, user.email, update);
      if (data.success) {
        setRefetch(!refetch);
        setEditingId(null);
        setEditData({});
        Swal.fire({
          icon: 'success',
          title: 'Updated',
          text: 'Subscription updated successfully!',
          confirmButtonColor: '#dc2626'
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update subscription',
        confirmButtonColor: '#dc2626'
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Subscription",
      text: "Are you sure you want to delete this subscription? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    });

    if (result.isConfirmed) {
      try {
        const update = {
          plan: subscriptions.filter((s) => s._id !== id),
        };
        const { data } = await addNewWebsiteData(user.id, user.email, update);
        if (data.success) {
          setRefetch(!refetch);
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Subscription has been deleted.",
            confirmButtonColor: "#dc2626",
          });
        }
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete subscription",
          confirmButtonColor: "#dc2626",
        });
      }
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFromDate("");
    setToDate("");
    setSortConfig({ key: null, direction: 'asc' });
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Subscription Plans
            </h1>
            <p className="text-gray-600">
              Manage subscription plans and pricing
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Plan
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Plans</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 rounded-lg bg-red-50">
                <Package className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalPrice.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Average Price</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.avgPrice.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-t-xl"
        >
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filter & Search</h2>
          </div>
          {showFilters ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {showFilters && (
          <div className="px-6 pb-6 border-t border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-6">
              {/* Search Input */}
              <div className="lg:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Plans
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name, duration, price, or minutes..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  />
                </div>
              </div>

              {/* Date Range */}
              <div className="lg:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Results Count */}
              <div className="lg:col-span-2">
                <div className="h-full flex items-end">
                  <div className="w-full bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-xs text-gray-600">Showing</p>
                    <p className="text-2xl font-bold text-red-600">{filteredSubscriptions.length}</p>
                    <p className="text-xs text-gray-600">plans</p>
                  </div>
                </div>
              </div>

              {/* Reset Button */}
              <div className="lg:col-span-2">
                <div className="h-full flex items-end">
                  <button
                    onClick={handleResetFilters}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-red-300 hover:text-red-700 transition-colors font-medium"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Subscription Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1 hover:text-red-600 transition-colors"
                  >
                    Plan Name
                    {sortConfig.key === 'name' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('minute')}
                    className="flex items-center gap-1 hover:text-red-600 transition-colors"
                  >
                    Minutes
                    {sortConfig.key === 'minute' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('duration')}
                    className="flex items-center gap-1 hover:text-red-600 transition-colors"
                  >
                    Duration (Days)
                    {sortConfig.key === 'duration' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('price')}
                    className="flex items-center gap-1 hover:text-red-600 transition-colors"
                  >
                    Price (₹)
                    {sortConfig.key === 'price' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSubscriptions.length > 0 ? (
                filteredSubscriptions.map((plan, idx) => (
                  <tr key={plan._id || idx} className="hover:bg-gray-50 transition-colors group">
                    {editingId === plan._id ? (
                      <>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData({...editData, name: e.target.value})}
                            className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            value={editData.minute}
                            onChange={(e) => setEditData({...editData, minute: e.target.value})}
                            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            value={editData.duration}
                            onChange={(e) => setEditData({...editData, duration: e.target.value})}
                            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            value={editData.price}
                            onChange={(e) => setEditData({...editData, price: e.target.value})}
                            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={handleSaveEdit}
                              className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium flex items-center gap-1"
                            >
                              <X className="w-3 h-3" />
                              Cancel
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                              <Package className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{plan.name}</p>
                              <p className="text-xs text-gray-500">ID: {plan._id?.slice(-6) || idx + 1}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-900">{plan.minute}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                            {plan.duration} days
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                              <DollarSign className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="text-lg font-bold text-gray-900">₹{plan.price}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(plan)}
                              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-1"
                            >
                              <Edit2 className="w-3 h-3" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(plan._id)}
                              className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Package className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No subscription plans found
                      </h3>
                      <p className="text-gray-500 max-w-md mb-4">
                        {searchTerm || fromDate || toDate
                          ? "No plans match your current filters. Try adjusting your search criteria."
                          : "There are no subscription plans yet. Add your first plan to get started."}
                      </p>
                      {(searchTerm || fromDate || toDate) ? (
                        <button
                          onClick={handleResetFilters}
                          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Clear all filters
                        </button>
                      ) : (
                        <button
                          onClick={() => setModalOpen(true)}
                          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                          <Plus className="w-4 h-4" />
                          Add First Plan
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Plan Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 transform transition-all animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Add New Plan</h2>
                <p className="text-sm text-gray-500 mt-1">Create a new subscription plan</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="e.g., Basic, Premium, Enterprise"
                      value={newSub.name}
                      onChange={(e) => setNewSub({ ...newSub, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minutes <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        min="1"
                        placeholder="e.g., 60"
                        value={newSub.minute}
                        onChange={(e) => setNewSub({ ...newSub, minute: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (Days) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        min="1"
                        placeholder="e.g., 30"
                        value={newSub.duration}
                        onChange={(e) => setNewSub({ ...newSub, duration: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="e.g., 999.00"
                      value={newSub.price}
                      onChange={(e) => setNewSub({ ...newSub, price: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubscription;
