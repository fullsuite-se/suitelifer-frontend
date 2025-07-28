import { useState, useEffect } from 'react';
import { suitebiteAPI } from '../../../utils/suitebiteAPI';
import { formatTimeAgo, formatDate } from '../../../utils/dateHelpers';
import { downloadReceiptPDF } from '../../../utils/pdfReceipt';
import OrderItemCard from '../OrderItemCard';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ArrowPathIcon,
  EyeIcon,
  ShoppingBagIcon,
  HeartIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  ArrowsUpDownIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  UserIcon,
  ArrowDownTrayIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * OrderManagement Component - Admin Order Management
 * 
 * Comprehensive admin order management with features:
 * - View all orders with filtering and search
 * - Approve pending orders
 * - Complete processing orders
 * - View detailed order information
 * - Real-time status updates
 * - Enhanced UI with loading states and error handling
 * - Bulk selection and delete functionality
 */
const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('ordered_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [approvingOrders, setApprovingOrders] = useState(new Set());
  const [completingOrders, setCompletingOrders] = useState(new Set());
  const [cancellingOrders, setCancellingOrders] = useState(new Set());
  const [deletingOrders, setDeletingOrders] = useState(new Set());
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportStatus, setExportStatus] = useState('pending');
  const [exportFormat, setExportFormat] = useState('csv');
  
  // Bulk selection state
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  
  // Confirmation modals state
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState({ type: '', orderId: null });

  useEffect(() => {
    loadOrders();
  }, []);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 4000);
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      
      const filters = {};
      if (statusFilter !== 'all') filters.status = statusFilter;
      if (dateRange.start) filters.dateFrom = dateRange.start;
      if (dateRange.end) filters.dateTo = dateRange.end;
      
      const response = await suitebiteAPI.getAllOrders(filters);
      if (response.success) {
        const mappedOrders = (response.orders || []).map(order => ({  // Changed back to response.orders
          order_id: order.order_id,
          user_id: order.user_id,
          first_name: order.first_name,
          last_name: order.last_name,
          user_email: order.user_email,
          status: order.status,
          ordered_at: order.ordered_at,
          processed_at: order.processed_at,
          completed_at: order.completed_at,
          total_points: order.total_points,
          notes: order.notes,
          item_count: order.item_count || order.orderItems?.length || 0,
          orderItems: order.orderItems || []  // Include order items with variations
        }));
        setOrders(mappedOrders);
        // Clear selections when orders are reloaded
        setSelectedOrders(new Set());
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      showNotification('error', 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Bulk selection handlers
  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const deletableOrders = filteredAndSortedOrders.filter(order => 
      order.status === 'cancelled' || order.status === 'completed'
    );
    
    if (selectedOrders.size === deletableOrders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(deletableOrders.map(order => order.order_id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedOrders.size === 0) {
      showNotification('error', 'No orders selected for deletion');
      return;
    }

    const selectedOrderList = Array.from(selectedOrders);
    const orderDetails = orders.filter(order => selectedOrderList.includes(order.order_id));
    
    // Check if all selected orders are deletable
    const nonDeletableOrders = orderDetails.filter(order => 
      order.status !== 'cancelled' && order.status !== 'completed'
    );

    if (nonDeletableOrders.length > 0) {
      const orderIds = nonDeletableOrders.map(order => order.order_id).join(', ');
      showNotification('error', `Orders ${orderIds} cannot be deleted (only cancelled or completed orders can be deleted)`);
      return;
    }

    setShowBulkDeleteConfirm(true);
  };

  const confirmBulkDelete = async () => {
    // Close modal immediately for better UX
    setShowBulkDeleteConfirm(false);
    
    try {
      setBulkDeleting(true);
      const selectedOrderList = Array.from(selectedOrders);
      let successCount = 0;
      let errorCount = 0;

      for (const orderId of selectedOrderList) {
        try {
          const response = await suitebiteAPI.deleteOrder(orderId, 'Bulk deleted by admin');
          if (response.success) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          console.error(`Error deleting order ${orderId}:`, error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        showNotification('success', `Successfully deleted ${successCount} order(s)`);
        if (errorCount > 0) {
          showNotification('error', `Failed to delete ${errorCount} order(s)`);
        }
        await loadOrders(); // Refresh the list
      } else {
        showNotification('error', 'Failed to delete any orders');
      }
    } catch (error) {
      console.error('Bulk delete error:', error);
      showNotification('error', 'Failed to perform bulk delete operation');
    } finally {
      setBulkDeleting(false);
      setSelectedOrders(new Set());
    }
  };

  const handleOrderDetails = async (orderId) => {
    try {
      setLoadingOrderDetails(true);
      const response = await suitebiteAPI.getOrderById(orderId);
      
      if (response.success) {
        setSelectedOrder(response.data); // API returns data not order
        setShowOrderDetails(true);
      } else {
        showNotification('error', 'Failed to load order details');
      }
    } catch (error) {
      console.error('Error loading order details:', error);
      showNotification('error', 'Failed to load order details');
    } finally {
      setLoadingOrderDetails(false);
    }
  };

  const handleApproveOrder = async (orderId) => {
    try {
      setApprovingOrders(prev => new Set(prev).add(orderId));
      
      const response = await suitebiteAPI.approveOrder(orderId);
      
      if (response.success) {
        showNotification('success', 'Order approved successfully!');
        await loadOrders(); // Refresh the list
      } else {
        showNotification('error', response.message || 'Failed to approve order');
      }
    } catch (error) {
      console.error('Error approving order:', error);
      showNotification('error', 'Failed to approve order');
    } finally {
      setApprovingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      setCompletingOrders(prev => new Set(prev).add(orderId));
      
      const response = await suitebiteAPI.completeOrder(orderId);
      
      if (response.success) {
        showNotification('success', 'Order completed successfully!');
        await loadOrders(); // Refresh the list
      } else {
        showNotification('error', response.message || 'Failed to complete order');
      }
    } catch (error) {
      console.error('Error completing order:', error);
      showNotification('error', 'Failed to complete order');
    } finally {
      setCompletingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const handleCancelOrder = (orderId) => {
    setPendingAction({ type: 'cancel', orderId });
    setShowCancelConfirm(true);
  };

  const handleDeleteOrder = (orderId) => {
    setPendingAction({ type: 'delete', orderId });
    setShowDeleteConfirm(true);
  };

  const confirmCancelOrder = async () => {
    const { orderId } = pendingAction;
    
    // Close modal immediately for better UX
    setShowCancelConfirm(false);
    setPendingAction({ type: '', orderId: null });
    
    try {
      setCancellingOrders(prev => new Set(prev).add(orderId));
      
      const response = await suitebiteAPI.cancelOrder(orderId, 'Cancelled by admin');
      
      if (response.success) {
        showNotification('success', 'Order cancelled successfully!');
        await loadOrders(); // Refresh the list
      } else {
        showNotification('error', response.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      showNotification('error', 'Failed to cancel order');
    } finally {
      setCancellingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const confirmDeleteOrder = async () => {
    const { orderId } = pendingAction;
    
    // Close modal immediately for better UX
    setShowDeleteConfirm(false);
    setPendingAction({ type: '', orderId: null });
    
    try {
      setDeletingOrders(prev => new Set(prev).add(orderId));
      
      const response = await suitebiteAPI.deleteOrder(orderId, 'Deleted by admin');
      
      if (response.success) {
        showNotification('success', 'Order deleted successfully!');
        await loadOrders(); // Refresh the list
      } else {
        showNotification('error', response.message || 'Failed to delete order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      showNotification('error', 'Failed to delete order');
    } finally {
      setDeletingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-4 w-4 text-yellow-500" />;
      case 'processing':
        return <ArrowPathIcon className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircleIcon className="h-4 w-4 text-red-500" />;
      case 'refunded':
        return <ArrowPathIcon className="h-4 w-4 text-purple-500" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'processing':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'refunded':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case 'pending':
        return 'Awaiting admin approval';
      case 'processing':
        return 'Order approved, being processed';
      case 'completed':
        return 'Order completed successfully';
      case 'cancelled':
        return 'Order was cancelled';
      case 'refunded':
        return 'Order was refunded';
      default:
        return 'Unknown status';
    }
  };

  // Filter and sort orders
  const filteredAndSortedOrders = orders
    .filter(order => {
      const matchesSearch = 
        order.order_id.toString().includes(searchTerm) ||
        `${order.first_name} ${order.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user_email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'order_id':
          aValue = a.order_id;
          bValue = b.order_id;
          break;
        case 'customer':
          aValue = `${a.first_name} ${a.last_name}`.toLowerCase();
          bValue = `${b.first_name} ${b.last_name}`.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'total_points':
          aValue = a.total_points;
          bValue = b.total_points;
          break;
        case 'ordered_at':
        default:
          aValue = new Date(a.ordered_at);
          bValue = new Date(b.ordered_at);
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSortBy('ordered_at');
    setSortOrder('desc');
    setDateRange({ start: '', end: '' });
  };

  const canApproveOrder = (order) => {
    return order.status === 'pending';
  };

  const canCancelOrder = (order) => {
    return order.status === 'pending' || order.status === 'processing';
  };

  const canCompleteOrder = (order) => {
    return order.status === 'processing';
  };

  const canDeleteOrder = (order) => {
    return order.status === 'cancelled' || order.status === 'completed';
  };

  function getOrderItemsSummary(order) {
    if (!order.orderItems || order.orderItems.length === 0) return '';
    return order.orderItems.map(item => {
      let summary = `${item.quantity}x ${item.product_name}`;
      if (item.variations && item.variations.length > 0) {
        const varText = item.variations.map(v => {
          const type = v.type_label || v.type_name || '';
          const val = v.option_label || v.option_value || '';
          return `${type}: ${val}`;
        }).join(', ');
        summary += `\n   - ${varText}`;
      }
      return summary;
    }).join('\n');
  }

  function exportOrdersToCSV(orders) {
    const headers = ['Order ID', 'Customer Name', 'Date', 'Total Points', 'Items'];
    const rows = orders.map(order => [
      order.order_id,
      `${order.first_name || ''} ${order.last_name || ''}`.trim(),
      order.ordered_at,
      order.total_points,
      getOrderItemsSummary(order)
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_export_${exportStatus}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function exportOrdersToPDF(orders) {
    const doc = new jsPDF();
    const tableColumn = ['Order ID', 'Customer Name', 'Date', 'Total Points', 'Items'];
    const tableRows = orders.map(order => [
      order.order_id,
      `${order.first_name || ''} ${order.last_name || ''}`.trim(),
      order.ordered_at,
      order.total_points,
      getOrderItemsSummary(order)
    ]);
    
    doc.text('Orders Export', 14, 16);
    autoTable(doc, { 
      head: [tableColumn], 
      body: tableRows, 
      startY: 22, 
      styles: { cellWidth: 'wrap', fontSize: 10 }, 
      bodyStyles: { valign: 'top' }, 
      columnStyles: { 4: { cellWidth: 60 } } 
    });
    doc.save(`orders_export_${exportStatus}_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  const handleExportOrders = () => {
    const ordersToExport = filteredAndSortedOrders.filter(order => {
      if (exportStatus === 'pending') return order.status === 'pending';
      if (exportStatus === 'processing') return order.status === 'processing';
      return true; // 'all' case
    });

    if (exportFormat === 'csv') {
      exportOrdersToCSV(ordersToExport);
    } else {
      exportOrdersToPDF(ordersToExport);
    }
    
    setShowExportModal(false);
    showNotification('success', `Exported ${ordersToExport.length} orders successfully!`);
  };

  // Get deletable orders count for select all functionality
  const deletableOrders = filteredAndSortedOrders.filter(order => 
    order.status === 'cancelled' || order.status === 'completed'
  );

  return (
    <div className="order-management-container p-6 bg-gray-50 min-h-screen">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}





      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <div className="p-2 bg-gray-100 rounded-lg">
              <ShoppingBagIcon className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{orders.filter(o => o.status === 'pending').length}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-blue-600">{orders.filter(o => o.status === 'processing').length}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <ArrowPathIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'completed').length}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-red-600">{orders.filter(o => o.status === 'cancelled').length}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircleIcon className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Export */}
      <div className="flex flex-wrap md:flex-nowrap items-end gap-2 mb-6 bg-white rounded-lg shadow-sm border p-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 flex-1 min-w-0">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search orders..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="min-w-[150px]">
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="min-w-[120px]">
            <label className="block text-xs font-medium text-gray-700 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
            >
              <option value="ordered_at">Date</option>
              <option value="order_id">Order ID</option>
              <option value="customer">Customer</option>
              <option value="status">Status</option>
              <option value="total_points">Points</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="min-w-[100px]">
            <label className="block text-xs font-medium text-gray-700 mb-1">Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
            >
              <option value="desc">Newest</option>
              <option value="asc">Oldest</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="px-3 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Export Button aligned with filters */}
        <div className="flex-shrink-0 self-stretch flex items-end">
          <button
            className="h-full px-4 py-2 bg-[#0097b2] text-white rounded-lg hover:bg-[#007a8e] font-semibold shadow text-sm"
            onClick={() => setShowExportModal(true)}
          >
            Print/Export Orders
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="orders-list-container max-h-[60vh] overflow-y-auto rounded-lg border bg-white">
        <div className="orders-list pb-16">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0097b2] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading orders...</p>
            </div>
          ) : filteredAndSortedOrders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
              <ShoppingBagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">No orders match your current filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Select All Header with Bulk Delete */}
              {deletableOrders.length > 0 && (
                <div className="sticky top-0 bg-gray-50 border-b border-gray-200 p-4 z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedOrders.size === deletableOrders.length && deletableOrders.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-[#0097b2] border-gray-300 rounded focus:ring-[#0097b2]"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Select all deletable orders ({deletableOrders.length} available)
                      </span>
                    </div>
                    {selectedOrders.size > 0 && (
                      <button
                        onClick={handleBulkDelete}
                        disabled={bulkDeleting}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 text-sm"
                      >
                        {bulkDeleting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <TrashIcon className="h-4 w-4" />
                            Delete Selected ({selectedOrders.size})
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {filteredAndSortedOrders.map((order, idx) => (
                <div key={order.order_id} className={`order-card bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow${idx === filteredAndSortedOrders.length - 1 ? ' mb-16' : ''}`}>
                  <div className="flex items-start justify-between">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {/* Selection Checkbox */}
                        {canDeleteOrder(order) && (
                          <input
                            type="checkbox"
                            checked={selectedOrders.has(order.order_id)}
                            onChange={() => handleSelectOrder(order.order_id)}
                            className="h-4 w-4 text-[#0097b2] border-gray-300 rounded focus:ring-[#0097b2] mt-1"
                          />
                        )}
                        
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span className={getStatusBadge(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          Order #{order.order_id}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {getStatusDescription(order.status)}
                      </p>
                      
                      {/* Customer Info */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <UserIcon className="h-4 w-4" />
                          <span>{order.first_name} {order.last_name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarDaysIcon className="h-4 w-4" />
                          <span>{formatDate(order.ordered_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <HeartIcon className="h-4 w-4 text-red-500" />
                          <span>{order.total_points} heartbits</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ShoppingBagIcon className="h-4 w-4" />
                          <span>{order.item_count} item{order.item_count !== 1 ? 's' : ''}</span>
                        </div>
                      </div>

                      {/* Order Items Preview */}
                      {order.orderItems && order.orderItems.length > 0 && (
                        <div className="mb-3">
                          <div className="text-xs text-gray-500 mb-2">Items:</div>
                          <div className="space-y-1">
                            {order.orderItems.slice(0, 2).map((item, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <div className="w-4 h-4 bg-gray-200 rounded-sm flex-shrink-0"></div>
                                <span className="text-gray-700 truncate">
                                  {item.quantity}x {item.product_name}
                                  {item.variations && item.variations.length > 0 && (
                                    <span className="text-gray-500">
                                      {' '}({item.variations.map(v => v.option_label || v.option_value).join(', ')})
                                    </span>
                                  )}
                                </span>
                              </div>
                            ))}
                            {order.orderItems.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{order.orderItems.length - 2} more items
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 ml-4">
                      <button
                        onClick={() => handleOrderDetails(order.order_id)}
                        disabled={loadingOrderDetails}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View order details"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      
                      {canApproveOrder(order) && (
                        <button
                          onClick={() => handleApproveOrder(order.order_id)}
                          disabled={approvingOrders.has(order.order_id)}
                          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                          title="Approve order"
                        >
                          {approvingOrders.has(order.order_id) ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                          ) : (
                            <CheckIcon className="h-5 w-5" />
                          )}
                        </button>
                      )}
                      
                      {canCancelOrder(order) && (
                        <button
                          onClick={() => handleCancelOrder(order.order_id)}
                          disabled={cancellingOrders.has(order.order_id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          title="Cancel order"
                        >
                          {cancellingOrders.has(order.order_id) ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                          ) : (
                            <XCircleIcon className="h-5 w-5" />
                          )}
                        </button>
                      )}

                      {canCompleteOrder(order) && (
                        <button
                          onClick={() => handleCompleteOrder(order.order_id)}
                          disabled={completingOrders.has(order.order_id)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Complete order"
                        >
                          {completingOrders.has(order.order_id) ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                          ) : (
                            <CheckCircleIcon className="h-5 w-5" />
                          )}
                        </button>
                      )}

                      {canDeleteOrder(order) && (
                        <button
                          onClick={() => handleDeleteOrder(order.order_id)}
                          disabled={deletingOrders.has(order.order_id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete order"
                        >
                          {deletingOrders.has(order.order_id) ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                          ) : (
                            <TrashIcon className="h-5 w-5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <CheckIcon className="h-3 w-3 text-green-500" />
                        <span>Ordered {formatTimeAgo(order.ordered_at)}</span>
                      </div>
                      {order.processed_at && (
                        <div className="flex items-center gap-1">
                          <CheckIcon className="h-3 w-3 text-blue-500" />
                          <span>Approved {formatTimeAgo(order.processed_at)}</span>
                        </div>
                      )}
                      {order.completed_at && (
                        <div className="flex items-center gap-1">
                          <CheckIcon className="h-3 w-3 text-green-500" />
                          <span>Completed {formatTimeAgo(order.completed_at)}</span>
                        </div>
                      )}
                      {order.status === 'cancelled' && (
                        <div className="flex items-center gap-1">
                          <XCircleIcon className="h-3 w-3 text-red-500" />
                          <span>Cancelled</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Export Orders</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
                <select
                  value={exportStatus}
                  onChange={(e) => setExportStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending Only</option>
                  <option value="processing">Processing Only</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
                >
                  <option value="csv">CSV</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleExportOrders}
                className="flex-1 bg-[#0097b2] text-white py-2 px-4 rounded-lg hover:bg-[#007a8e] font-semibold"
              >
                Export
              </button>
              <button
                onClick={() => setShowExportModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete {selectedOrders.size} selected order(s)? This action cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={confirmBulkDelete}
                disabled={bulkDeleting}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 font-semibold"
              >
                {bulkDeleting ? 'Deleting...' : 'Delete Orders'}
              </button>
              <button
                onClick={() => setShowBulkDeleteConfirm(false)}
                disabled={bulkDeleting}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 disabled:opacity-50 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Confirmation Modal */}
      <ConfirmationModal
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={confirmCancelOrder}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? This action cannot be undone."
        confirmText="Cancel Order"
        cancelText="Keep Order"
        confirmColor="blue"
      />

      {/* Delete Order Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteOrder}
        title="Delete Order"
        message="Are you sure you want to delete this order? This action cannot be undone."
        confirmText="Delete Order"
        cancelText="Keep Order"
        confirmColor="red"
      />

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => {
            setShowOrderDetails(false);
            setSelectedOrder(null);
          }} 
        />
      )}
    </div>
  );
};

// Order Details Modal Component
const OrderDetailsModal = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="bg-[#0097b2] text-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Order #{order.order_id}</h2>
              <p className="text-sm opacity-90">{order.first_name} {order.last_name} • {order.user_email}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Modal Content */}
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {/* Status Badge */}
          <div className="mb-4 flex justify-center">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-lg font-semibold ${
              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
              order.status === 'completed' ? 'bg-green-100 text-green-800' :
              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </div>
          </div>
          {/* Order Timeline */}
          <div className="mb-4">
            <div className="flex items-center justify-between gap-4 relative px-2">
              {/* Horizontal line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 z-0" style={{transform: 'translateY(-50%)'}}></div>
              {/* Timeline steps */}
              <div className="flex flex-1 items-center justify-between z-10">
                {/* Placed */}
                <div className="flex flex-col items-center min-w-[80px]">
                  <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow flex items-center justify-center">
                    <CheckIcon className="h-2 w-2 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-900 mt-1">Placed</span>
                  <span className="text-[10px] text-gray-500">{formatDate(order.ordered_at)}</span>
                </div>
                {/* Approved */}
                {order.processed_at && (
                  <div className="flex flex-col items-center min-w-[80px]">
                    <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow flex items-center justify-center">
                      <CheckIcon className="h-2 w-2 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-900 mt-1">Approved</span>
                    <span className="text-[10px] text-gray-500">{formatDate(order.processed_at)}</span>
                  </div>
                )}
                {/* Completed */}
                {order.completed_at && (
                  <div className="flex flex-col items-center min-w-[80px]">
                    <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow flex items-center justify-center">
                      <CheckIcon className="h-2 w-2 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-900 mt-1">Completed</span>
                    <span className="text-[10px] text-gray-500">{formatDate(order.completed_at)}</span>
                  </div>
                )}
                {/* Cancelled */}
                {order.status === 'cancelled' && (
                  <div className="flex flex-col items-center min-w-[80px]">
                    <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow flex items-center justify-center">
                      <XMarkIcon className="h-2 w-2 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-900 mt-1">Cancelled</span>
                    <span className="text-[10px] text-gray-500">Order was cancelled</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Items</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {order.orderItems && order.orderItems.map((item, index) => (
                <OrderItemCard 
                  key={`${item.order_item_id}-${index}`} 
                  item={item} 
                  showImages={true}
                />
              ))}
              {(!order.orderItems || order.orderItems.length === 0) && (
                <div className="text-center py-4 text-gray-500">
                  <ShoppingBagIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No items found in this order</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">Total</span>
              <div className="flex items-center gap-2">
                <HeartIcon className="h-4 w-4 text-red-500" />
                <span className="text-sm font-bold text-[#0097b2]">{order.total_points} heartbits</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-1 mb-1">
                <ExclamationTriangleIcon className="h-3 w-3 text-yellow-600" />
                <span className="text-xs font-medium text-yellow-800">Notes</span>
              </div>
              <p className="text-xs text-yellow-700">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-200 p-4 bg-white relative z-10">
          <div className="flex justify-between items-center">
            {/* Receipt Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => downloadReceiptPDF(order)}
                className="flex items-center gap-2 px-4 py-2 bg-[#0097b2] text-white rounded-lg hover:bg-[#007a8e] transition-colors text-sm font-medium cursor-pointer"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                Download Receipt
              </button>
            </div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, confirmColor = "red" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-2">{message}</p>
        </div>
        
        {/* Modal Footer */}
        <div className="p-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            {cancelText || 'Cancel'}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg transition-colors text-sm font-medium ${
              confirmColor === 'red' 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement; 