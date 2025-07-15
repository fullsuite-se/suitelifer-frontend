import { useState, useEffect } from 'react';
import { suitebiteAPI } from '../../utils/suitebiteAPI';
import { formatTimeAgo, formatDate } from '../../utils/dateHelpers';
import { downloadReceiptPDF } from '../../utils/pdfReceipt';
import { useSuitebiteStore } from '../../store/stores/suitebiteStore';
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
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  TrashIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

/**
 * OrderHistory Component - Enhanced with Advanced Features
 * 
 * Comprehensive order management with enhanced features:
 * - Advanced filtering and search
 * - Order status tracking with visual indicators
 * - Reorder functionality for completed orders
 * - Detailed order views with item breakdown
 * - Real-time status updates
 * - Enhanced UI with loading states and error handling
 * - Order cancellation for pending orders
 * - Improved order details modal
 */
const OrderHistory = ({ onCartUpdate, onHeartbitsUpdate }) => {
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
  const [reorderingItems, setReorderingItems] = useState(new Set());
  const [cancellingOrders, setCancellingOrders] = useState(new Set());
  const [deletingOrders, setDeletingOrders] = useState(new Set());
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    loadOrderHistory();
  }, []);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 4000);
  };

  const loadOrderHistory = async () => {
    try {
      setLoading(true);
      
      const response = await suitebiteAPI.getOrderHistory();
      if (response.success) {
        const mappedOrders = (response.orders || []).map(order => ({
          order_id: order.order_id,
          status: order.status,
          ordered_at: order.ordered_at,
          processed_at: order.processed_at,
          completed_at: order.completed_at,
          total_points: order.total_points,
          notes: order.notes,
          item_count: order.item_count || 0
        }));
        setOrders(mappedOrders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error loading order history:', error);
      showNotification('error', 'Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderDetails = async (orderId) => {
    try {
      setLoadingOrderDetails(true);
      const response = await suitebiteAPI.getOrderById(orderId);
      
      if (response.success) {
        setSelectedOrder(response.order);
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

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }

    try {
      setCancellingOrders(prev => new Set(prev).add(orderId));
      
      const response = await suitebiteAPI.cancelOrder(orderId, 'Cancelled by user');
      
      if (response.success) {
        // Refresh heartbits balance after successful cancellation
        try {
          const heartbitsResponse = await suitebiteAPI.getUserHeartbits();
          if (heartbitsResponse.success) {
            const heartbits = heartbitsResponse.heartbits_balance || heartbitsResponse.balance || 0;
            // Update heartbits in Zustand store
            const { setUserHeartbits } = useSuitebiteStore.getState();
            setUserHeartbits(heartbits);
            console.log('💖 Heartbits updated after order cancellation:', heartbits);
            
            // Call onHeartbitsUpdate if provided to trigger parent component refresh
            if (onHeartbitsUpdate) {
              onHeartbitsUpdate();
            }
          }
        } catch (error) {
          console.error('Error refreshing heartbits after order cancellation:', error);
        }
        
        showNotification('success', 'Order cancelled successfully');
        await loadOrderHistory(); // Refresh the list
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

  const handleReorder = async (orderId) => {
    try {
      setReorderingItems(prev => new Set(prev).add(orderId));
      
      // Get order details to add items to cart
      const orderResponse = await suitebiteAPI.getOrderById(orderId);
      if (!orderResponse.success) {
        throw new Error('Failed to get order details');
      }

      const order = orderResponse.order;
      let successCount = 0;
      let failCount = 0;

      // Add each item from the order to the cart
      for (const item of order.items) {
        try {
          const addResponse = await suitebiteAPI.addToCart({
            product_id: item.product_id,
            quantity: item.quantity
          });
          
          if (addResponse.success) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (error) {
          failCount++;
        }
      }

      if (successCount > 0) {
        // Refresh cart data from server to update frontend state
        try {
          const cartResponse = await suitebiteAPI.getCart();
          if (cartResponse.success) {
            // Update cart in Zustand store
            const { setCart } = useSuitebiteStore.getState();
            const mappedCart = (cartResponse.cartItems || []).map(item => ({
              cart_item_id: item.cart_item_id,
              product_id: item.product_id,
              product_name: item.product_name || item.name,
              points_cost: item.price_points || item.points_cost || item.price,
              quantity: item.quantity,
              image_url: item.image_url,
              variation_id: item.variation_id,
              variation_details: item.variation_details
            }));
            setCart(mappedCart);
            console.log('🛒 Cart updated after reorder:', mappedCart.length, 'items');
            
            // Call onCartUpdate if provided to trigger parent component refresh
            if (onCartUpdate) {
              onCartUpdate();
            }
            
            // Force a small delay to ensure UI updates
            setTimeout(() => {
              if (onCartUpdate) {
                onCartUpdate();
              }
            }, 100);
          }
        } catch (error) {
          console.error('Error refreshing cart after reorder:', error);
        }
        
        showNotification('success', `${successCount} items added to cart! ${failCount > 0 ? `(${failCount} items failed)` : ''}`);
      } else {
        showNotification('error', 'Failed to add items to cart');
      }
      
    } catch (error) {
      console.error('Error reordering:', error);
      showNotification('error', 'Failed to reorder items');
    } finally {
      setReorderingItems(prev => {
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
      
      const response = await suitebiteAPI.deleteOrder(orderId, 'Deleted by user');
      
      if (response.success) {
        showNotification('success', 'Order deleted successfully!');
        await loadOrderHistory(); // Refresh the list
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
        if (!orderText.includes(searchLower)) return false;
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

  const canCancelOrder = (order) => {
    return order.status === 'pending';
  };

  const canReorder = (order) => {
    return order.status === 'completed';
  };

  return (
    <div className="order-history-container">
      {/* Filters */}
      <div className="filters mb-6 bg-white rounded-lg shadow-sm border p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Orders</label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by order ID..."
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

          {/* Sort By, Sort Order, Reset */}
          <div className="flex gap-2 items-end justify-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
              >
                <option value="ordered_at">Order Date</option>
                <option value="total_points">Total Points</option>
                <option value="status">Status</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
            <button
              onClick={resetFilters}
              className="h-10 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors self-end"
              style={{ marginTop: '24px' }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="orders-list-container max-h-[60vh] overflow-y-auto rounded-lg border bg-white flex-1">
        <div className="orders-list">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0097b2] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your orders...</p>
            </div>
          ) : filteredAndSortedOrders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
              <ShoppingBagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">Start shopping to see your order history here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedOrders.map((order) => (
                <div key={order.order_id} className="order-card bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
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
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
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
                            <XMarkIcon className="h-5 w-5" />
                          )}
                        </button>
                      )}
                      
                      {canReorder(order) && (
                        <button
                          onClick={() => handleReorder(order.order_id)}
                          disabled={reorderingItems.has(order.order_id)}
                          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                          title="Reorder items"
                        >
                          {reorderingItems.has(order.order_id) ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                          ) : (
                            <ArrowPathIcon className="h-5 w-5" />
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
                          <span>Processed {formatTimeAgo(order.processed_at)}</span>
                        </div>
                      )}
                      {order.completed_at && (
                        <div className="flex items-center gap-1">
                          <CheckIcon className="h-3 w-3 text-green-500" />
                          <span>Completed {formatTimeAgo(order.completed_at)}</span>
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
        <div className="p-6">
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
              {order.status === 'pending' && 'Your order is awaiting admin approval. You can cancel it anytime.'}
              {order.status === 'processing' && 'Your order has been approved and is being processed.'}
              {order.status === 'completed' && 'Your order has been completed successfully!'}
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
              {order.items && order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <ShoppingBagIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{item.product_name}</h4>
                    <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                    {item.variation_details && (
                      <p className="text-xs text-gray-500">Variations: {Array.isArray(item.variation_details)
                        ? item.variation_details.map(opt => opt.option_label).join(' + ')
                        : item.variation_details.option_label}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#0097b2]">{item.price_points} pts</p>
                    <p className="text-xs text-gray-500">Total: {item.price_points * item.quantity} pts</p>
                  </div>
                </div>
              ))}
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

export default OrderHistory;
