'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Eye,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  User,
  ArrowRight,
  X
} from 'lucide-react';
import { useAdmin } from '../layout';
import ConfirmModal from '@/components/ConfirmModal';
import { getAdminOrders, updateOrderStatus, deleteOrder } from '@/app/api/orderapi';

const STATUS_OPTIONS = ['All', 'Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrdersPage() {
  const { showToast } = useAdmin() || {};

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Order Details / Inspection Modal
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Delete Order Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Status updating state
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getAdminOrders();
      let list = res?.data || res?.orders || (Array.isArray(res) ? res : []);
      if (!list || list.length === 0) {
        // Fallback demo data if no orders placed yet
        list = [
          {
            _id: 'ord-1001',
            orderNumber: 'IC-9421',
            customer: { name: 'Aarav Sharma', email: 'aarav@example.com', phone: '+91 98765 43210' },
            shippingAddress: {
              fullName: 'Aarav Sharma',
              address: 'Flat 402, Skyline Residency, Bandra West',
              city: 'Mumbai',
              state: 'Maharashtra',
              postalCode: '400050',
            },
            orderItems: [
              {
                name: 'Midnight Echo Graphic Oversized Tee',
                price: 1299,
                quantity: 1,
                size: 'L',
                color: 'Black',
                image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&q=80',
              },
              {
                name: 'Heavyweight Raw Edge Tee',
                price: 1200,
                quantity: 1,
                size: 'XL',
                color: 'White',
                image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=300&q=80',
              },
            ],
            totalPrice: 2499,
            isPaid: true,
            paidAt: new Date(Date.now() - 3600000 * 3).toISOString(),
            orderStatus: 'Processing',
            createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
          },
          {
            _id: 'ord-1002',
            orderNumber: 'IC-9420',
            customer: { name: 'Rohan Mehra', email: 'rohan.m@example.com', phone: '+91 98111 22334' },
            shippingAddress: {
              fullName: 'Rohan Mehra',
              address: 'Plot 12, Cybercity, DLF Phase 2',
              city: 'Gurugram',
              state: 'Haryana',
              postalCode: '122002',
            },
            orderItems: [
              {
                name: 'Chaos & Anarchy Heavy Tee',
                price: 1499,
                quantity: 1,
                size: 'L',
                color: 'Vintage Charcoal',
                image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&q=80',
              },
            ],
            totalPrice: 1499,
            isPaid: true,
            paidAt: new Date(Date.now() - 3600000 * 24).toISOString(),
            orderStatus: 'Confirmed',
            createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          },
          {
            _id: 'ord-1003',
            orderNumber: 'IC-9419',
            customer: { name: 'Priya Patel', email: 'priya.p@example.com', phone: '+91 99000 11223' },
            shippingAddress: {
              fullName: 'Priya Patel',
              address: '88, Residency Road, Richmond Town',
              city: 'Bengaluru',
              state: 'Karnataka',
              postalCode: '560025',
            },
            orderItems: [
              {
                name: 'Fallen Angel Gothic Tee',
                price: 999,
                quantity: 1,
                size: 'M',
                color: 'Black',
                image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=300&q=80',
              },
            ],
            totalPrice: 999,
            isPaid: true,
            paidAt: new Date(Date.now() - 3600000 * 48).toISOString(),
            orderStatus: 'Shipped',
            createdAt: new Date(Date.now() - 3600000 * 52).toISOString(),
          },
        ];
      }
      setOrders(list);
    } catch (err) {
      console.error('Failed to load orders:', err);
      if (showToast) showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update Status handler
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await updateOrderStatus(orderId, { orderStatus: newStatus });
      if (res && res.success !== false) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder((prev) => ({ ...prev, orderStatus: newStatus }));
        }
        if (showToast) showToast(`Order updated to "${newStatus}"`, 'success');
      } else {
        if (showToast) showToast(res?.message || 'Failed to update order status', 'error');
      }
    } catch (err) {
      if (showToast) showToast('Server error updating status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete Order confirmation
  const requestDelete = (order) => {
    setOrderToDelete(order);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!orderToDelete) return;
    setIsDeleting(true);
    const id = orderToDelete._id;

    try {
      const res = await deleteOrder(id);
      if (res && res.success !== false) {
        setOrders((prev) => prev.filter((o) => o._id !== id));
        if (showToast) showToast(`Order ${orderToDelete.orderNumber || id} deleted`, 'success');
        setDeleteModalOpen(false);
        setOrderToDelete(null);
        if (selectedOrder && selectedOrder._id === id) {
          setSelectedOrder(null);
        }
      } else {
        if (showToast) showToast(res?.message || 'Failed to delete order', 'error');
      }
    } catch (err) {
      if (showToast) showToast('Error deleting order', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Status counts for quick pill badges
  const statusCounts = useMemo(() => {
    const counts = { All: orders.length };
    STATUS_OPTIONS.forEach((s) => {
      if (s !== 'All') {
        counts[s] = orders.filter(
          (o) => (o.orderStatus || 'Processing').toLowerCase() === s.toLowerCase()
        ).length;
      }
    });
    return counts;
  }, [orders]);

  // Filtered orders based on search query and status filter
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = searchQuery.toLowerCase().trim();
      const customerName = (o.customer?.name || o.shippingAddress?.fullName || '').toLowerCase();
      const customerEmail = (o.customer?.email || '').toLowerCase();
      const orderNum = (o.orderNumber || o._id || '').toLowerCase();

      const matchesSearch =
        !q || customerName.includes(q) || customerEmail.includes(q) || orderNum.includes(q);
      const matchesStatus =
        statusFilter === 'All' ||
        (o.orderStatus || 'Processing').toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // Pagination calculations
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const displayedOrders = filteredOrders.slice(startIndex, startIndex + pageSize);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 relative">
      
      {/* ======================================================== */}
      {/* 1. STICKY TOP HEADER (ORDERS + SEARCH + PAGINATION CONTROLS) */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 shadow-sm flex items-center justify-between gap-3 flex-shrink-0">
        
        {/* Left Side: "Orders" Title + Count Badge + Quick Refresh */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
              Orders
            </h1>
            <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
              {orders.length}
            </span>
          </div>

          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
            title="Refresh Orders Feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* Right Side: Search Input + Pagination Controls with Limit Selector */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          
          {/* Search Input Box */}
          <div className="relative w-36 sm:w-56 md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search orders, customers..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                title="Clear Search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Pagination Controls with Limit Selector (Right Aligned Header Widget) */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase hidden md:inline">
              Limit:
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer text-xs"
              title="Orders Per Page"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>

            <div className="h-3 w-px bg-slate-200 mx-1 hidden sm:block" />

            <span className="text-[11px] font-bold text-slate-600 hidden lg:inline">
              {totalItems > 0
                ? `${startIndex + 1}–${Math.min(startIndex + pageSize, totalItems)} of ${totalItems}`
                : '0 orders'}
            </span>

            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-lg hover:bg-white text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <span className="text-[11px] font-mono font-bold text-slate-700 px-1">
              {currentPage}/{totalPages}
            </span>

            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1 rounded-lg hover:bg-white text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. SUBHEADER STATUS FILTER TABS STRIP                    */}
      {/* ======================================================== */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 flex-shrink-0 overflow-x-auto">
        <div className="flex items-center space-x-1.5 flex-nowrap min-w-max">
          {STATUS_OPTIONS.map((status) => {
            const isSelected = statusFilter.toLowerCase() === status.toLowerCase();
            const count = statusCounts[status] || 0;

            return (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setCurrentPage(1);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                }`}
              >
                <span>{status}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] text-slate-400 font-medium hidden md:block">
          Showing {displayedOrders.length} of {totalItems} matching orders
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. SCROLLABLE ORDERS TABLE AREA                          */}
      {/* ======================================================== */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-24 text-center space-y-3">
              <div className="w-9 h-9 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Loading Customer Orders...
              </p>
            </div>
          ) : displayedOrders.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800">No matching orders</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No checkout orders match your current search query or status filter.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider sticky top-0 z-10">
                  <tr>
                    <th className="py-3.5 px-4">Order ID</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Items</th>
                    <th className="py-3.5 px-4">Total Amount</th>
                    <th className="py-3.5 px-4">Payment</th>
                    <th className="py-3.5 px-4 text-center">Fulfillment Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedOrders.map((order) => {
                    const id = order._id;
                    const orderNum = order.orderNumber || `#${id.slice(-6)}`;
                    const itemsCount = order.orderItems?.length || 1;
                    const isUpdating = updatingId === id;

                    return (
                      <tr key={id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Order Number & Date */}
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-slate-900">{orderNum}</div>
                          <div className="text-[11px] text-slate-400">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}
                          </div>
                        </td>

                        {/* Customer Details */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">
                            {order.customer?.name || order.shippingAddress?.fullName || 'Customer'}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {order.customer?.email || 'N/A'}
                          </div>
                          {order.shippingAddress?.city && (
                            <div className="text-[10px] text-slate-400">
                              {order.shippingAddress.city}, {order.shippingAddress.state}
                            </div>
                          )}
                        </td>

                        {/* Items */}
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-bold text-[11px]">
                            {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="py-3.5 px-4 font-mono">
                          <div className="font-bold text-slate-900 text-sm">
                            ₹{(order.totalPrice || 0).toLocaleString('en-IN')}
                          </div>
                        </td>

                        {/* Payment */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              order.isPaid
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {order.isPaid ? 'Paid' : 'Unpaid'}
                          </span>
                        </td>

                        {/* Status Dropdown */}
                        <td className="py-3.5 px-4 text-center">
                          <select
                            value={order.orderStatus || 'Processing'}
                            onChange={(e) => handleStatusChange(id, e.target.value)}
                            disabled={isUpdating}
                            className={`font-bold text-xs uppercase px-2.5 py-1 rounded-xl border outline-none cursor-pointer transition-all ${
                              order.orderStatus === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : order.orderStatus === 'Shipped'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : order.orderStatus === 'Cancelled'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            } ${isUpdating ? 'opacity-50 cursor-wait' : ''}`}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(order)}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="Inspect Order Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => requestDelete(order)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Bottom Pagination Footer */}
          {filteredOrders.length > 0 && (
            <div className="px-6 py-4 bg-slate-50/60 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
              <div>
                Showing <span className="font-bold text-slate-900">{startIndex + 1}</span> to{' '}
                <span className="font-bold text-slate-900">
                  {Math.min(startIndex + pageSize, filteredOrders.length)}
                </span>{' '}
                of <span className="font-bold text-slate-900">{filteredOrders.length}</span> orders
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="font-bold px-2">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. ORDER INSPECTION & DETAILS MODAL                      */}
      {/* ======================================================== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedOrder(null)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 p-6 space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  Order Inspection
                </span>
                <h3 className="text-lg font-black text-slate-900 font-mono">
                  {selectedOrder.orderNumber || selectedOrder._id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 px-3 py-1.5 rounded-lg bg-slate-100"
              >
                Close
              </button>
            </div>

            {/* Shipping Info */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block">
                Shipping Destination
              </span>
              <div className="font-bold text-slate-900">
                {selectedOrder.shippingAddress?.fullName || selectedOrder.customer?.name}
              </div>
              <div className="text-slate-600">
                {selectedOrder.shippingAddress?.address || 'Standard Address'}
              </div>
              <div className="text-slate-500">
                {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.postalCode}
              </div>
            </div>

            {/* Ordered Items List */}
            <div className="space-y-3">
              <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                Items Included ({selectedOrder.orderItems?.length || 0})
              </span>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {selectedOrder.orderItems?.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between bg-white text-xs">
                    <div className="flex items-center space-x-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt=""
                          className="w-10 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200"
                        />
                      )}
                      <div>
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-[10px] text-slate-400">
                          Size: <span className="font-bold text-slate-700">{item.size || 'M'}</span> | Color:{' '}
                          <span className="font-bold text-slate-700">{item.color || 'Standard'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="font-bold text-slate-900">
                        {item.quantity} × ₹{item.price}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        ₹{(item.quantity || 1) * (item.price || 0)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-sm">
              <span className="font-bold text-slate-600">Total Settled</span>
              <span className="text-xl font-black text-slate-900 font-mono">
                ₹{(selectedOrder.totalPrice || 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. DELETE CONFIRMATION MODAL                             */}
      {/* ======================================================== */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false);
            setOrderToDelete(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Order Record"
        message="Are you sure you want to permanently delete this customer order? This record cannot be recovered."
        itemName={orderToDelete?.orderNumber || orderToDelete?._id || ''}
        confirmText={isDeleting ? 'Deleting...' : 'Delete Permanently'}
        isLoading={isDeleting}
        isDanger={true}
      />
    </div>
  );
}
