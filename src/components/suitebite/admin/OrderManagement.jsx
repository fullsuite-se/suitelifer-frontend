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

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }

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

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

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
      // Status filter
      if (statusFilter !== 'all' && order.status !== statusFilter) return false;
      
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const orderText = `order ${order.order_id}`.toLowerCase();
        const userText = `${order.first_name} ${order.last_name} ${order.user_email}`.toLowerCase();
        if (!orderText.includes(searchLower) && !userText.includes(searchLower)) return false;
      }
      
      // Date range filter
      if (dateRange.start) {
        const orderDate = new Date(order.ordered_at);
        const startDate = new Date(dateRange.start);
        if (orderDate < startDate) return false;
      }
      
      if (dateRange.end) {
        const orderDate = new Date(order.ordered_at);
        const endDate = new Date(dateRange.end);
        if (orderDate > endDate) return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'ordered_at':
          aValue = new Date(a.ordered_at);
          bValue = new Date(b.ordered_at);
          break;
        case 'total_points':
          aValue = a.total_points;
          bValue = b.total_points;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'customer':
          aValue = `${a.first_name} ${a.last_name}`;
          bValue = `${b.first_name} ${b.last_name}`;
          break;
        default:
          aValue = new Date(a.ordered_at);
          bValue = new Date(b.ordered_at);
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

  return (
    <div className="order-management-container">
      {/* Analytics Section */}
      <div className="analytics mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingBagIcon className="h-6 w-6 text-blue-600" />
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
      </div>

      {/* Filters */}
      <div className="filters mb-6 bg-white rounded-lg shadow-sm border p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Orders</label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by order ID, customer..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
            >
              <option value="ordered_at">Order Date</option>
              <option value="total_points">Total Points</option>
              <option value="status">Status</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
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
              {filteredAndSortedOrders.map((order, idx) => (
                <div key={order.order_id} className={`order-card bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow${idx === filteredAndSortedOrders.length - 1 ? ' mb-16' : ''}`}>
                  <div className="flex items-start justify-between">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
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
                                    <span className="text-gray-500 text-xs ml-1">
                                      ({item.variations.map(v => v.option_label).join(', ')})
                                    </span>
                                  )}
                                </span>
                              </div>
                            ))}
                            {order.orderItems.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{order.orderItems.length - 2} more item{order.orderItems.length - 2 !== 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
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

      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

// Order Details Modal Component
const OrderDetailsModal = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="bg-[#0097b2] text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Order Details</h2>
              <p className="text-sm opacity-90">Order #{order.order_id}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Customer Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Name</p>
                  <p className="text-sm text-gray-900">{order.user_first_name} {order.user_last_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-sm text-gray-900">{order.user_email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {order.status === 'pending' && 'This order is awaiting your approval.'}
              {order.status === 'processing' && 'This order has been approved and is being processed.'}
              {order.status === 'completed' && 'This order has been completed successfully!'}
              {order.status === 'cancelled' && 'This order was cancelled.'}
            </p>
          </div>

          {/* Order Timeline */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Order Placed</p>
                  <p className="text-xs text-gray-500">{formatDate(order.ordered_at)}</p>
                </div>
              </div>
              {order.processed_at && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order Approved</p>
                    <p className="text-xs text-gray-500">{formatDate(order.processed_at)}</p>
                  </div>
                </div>
              )}
              {order.completed_at && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order Completed</p>
                    <p className="text-xs text-gray-500">{formatDate(order.completed_at)}</p>
                  </div>
                </div>
              )}
              {order.status === 'cancelled' && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order Cancelled</p>
                    <p className="text-xs text-gray-500">Order was cancelled</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.orderItems && order.orderItems.map((item, index) => (
                <OrderItemCard 
                  key={`${item.order_item_id}-${index}`} 
                  item={item} 
                  showImages={true}
                />
              ))}
              {(!order.orderItems || order.orderItems.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingBagIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No items found in this order</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <div className="flex items-center gap-2">
                <HeartIcon className="h-5 w-5 text-red-500" />
                <span className="text-lg font-bold text-[#0097b2]">{order.total_points} heartbits</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Notes</span>
              </div>
              <p className="text-sm text-yellow-700">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-between items-center">
            {/* Receipt Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => downloadReceiptPDF(order)}
                className="flex items-center gap-2 px-4 py-2 bg-[#0097b2] text-white rounded-lg hover:bg-[#007a8e] transition-colors"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                Download Receipt
              </button>
            </div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement; 