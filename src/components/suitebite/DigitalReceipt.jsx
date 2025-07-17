import { useState } from 'react';
import { suitebiteAPI } from '../../utils/suitebiteAPI';
import { formatDate } from '../../utils/dateHelpers';

const DigitalReceipt = ({ order, onClose, onPrint }) => {
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = async () => {
    if (isPrinting) return;

    try {
      setIsPrinting(true);
      // Simulate print functionality
      window.print();
      if (onPrint) {
        await onPrint();
      }
    } catch (error) {
      // Error handling for production - replace console.error with proper logging
    } finally {
      setIsPrinting(false);
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
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
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="digital-receipt-modal fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="modal-content bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="modal-header bg-[#0097b2] text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Digital Receipt</h3>
            <button
              onClick={onClose}
              className="close-btn p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="modal-body p-6">
          {/* Receipt Header */}
          <div className="receipt-header text-center mb-6">
            <h2 className="text-3xl font-bold text-[#1a0202] mb-2">Suitebite Store</h2>
            <p className="text-[#4a6e7e] text-sm">Digital Receipt & Order Confirmation</p>
            <div className="mt-2">
              <span className={getStatusBadge(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
          
          {/* Customer Information */}
          <div className="customer-info mb-6 bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-[#1a0202] mb-3">Customer Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-[#4a6e7e]">Customer Name:</span>
                <div className="text-[#1a0202] font-semibold">
                  {order.user_first_name} {order.user_last_name}
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-[#4a6e7e]">Email:</span>
                <div className="text-[#1a0202]">{order.user_email}</div>
              </div>
            </div>
          </div>
          
          {/* Receipt Details */}
          <div className="receipt-details space-y-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-sm font-medium text-[#4a6e7e]">Order #:</span>
                <div className="text-[#1a0202] font-semibold">#{order.order_id}</div>
              </div>
              <div>
                <span className="text-sm font-medium text-[#4a6e7e]">Order Date:</span>
                <div className="text-[#1a0202]">{formatDateTime(order.ordered_at)}</div>
              </div>
              <div>
                <span className="text-sm font-medium text-[#4a6e7e]">Payment Method:</span>
                <div className="text-[#1a0202]">❤️ Heartbits</div>
              </div>
              <div>
                <span className="text-sm font-medium text-[#4a6e7e]">Items:</span>
                <div className="text-[#1a0202]">{order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}</div>
              </div>
            </div>
          </div>
          
          {/* Order Timeline */}
          <div className="order-timeline mb-6 bg-blue-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-[#1a0202] mb-3">Order Timeline</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Order Placed</p>
                  <p className="text-xs text-gray-500">{formatDateTime(order.ordered_at)}</p>
                </div>
              </div>
              {order.processed_at && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order Approved</p>
                    <p className="text-xs text-gray-500">{formatDateTime(order.processed_at)}</p>
                  </div>
                </div>
              )}
              {order.completed_at && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order Completed</p>
                    <p className="text-xs text-gray-500">{formatDateTime(order.completed_at)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Receipt Items */}
          <div className="receipt-items mb-6">
            <h4 className="text-lg font-semibold text-[#1a0202] mb-3">Items Purchased</h4>
            <div className="items-list space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="item bg-[#eee3e3] rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <div className="item-image w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.product_name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-2xl">📦</span>
                      )}
                    </div>
                    
                    <div className="item-details flex-1">
                      <div className="item-name font-semibold text-[#1a0202] text-lg">
                        {item.product_name}
                      </div>
                      {item.product_description && (
                        <div className="item-description text-sm text-[#4a6e7e] mt-1">
                          {item.product_description}
                        </div>
                      )}
                      <div className="item-meta text-sm text-[#4a6e7e] mt-2">
                        Quantity: {item.quantity} × ❤️ {item.price_points} heartbits
                      </div>
                    </div>
                    
                    <div className="item-total text-right">
                      <div className="text-lg font-bold text-[#0097b2]">
                        ❤️ {item.price_points * item.quantity}
                      </div>
                      <div className="text-xs text-[#4a6e7e]">
                        {item.quantity} × {item.price_points}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Receipt Summary */}
          <div className="receipt-summary border-t border-gray-200 pt-4">
            <div className="summary-row flex justify-between items-center py-2">
              <span className="text-lg font-semibold text-[#1a0202]">Subtotal:</span>
              <span className="text-lg font-semibold text-[#0097b2]">❤️ {order.total_points}</span>
            </div>
            <div className="summary-row flex justify-between items-center py-2">
              <span className="text-sm text-[#4a6e7e]">Tax:</span>
              <span className="text-sm text-[#4a6e7e]">❤️ 0 (Heartbits are tax-free)</span>
            </div>
            <div className="summary-row flex justify-between items-center py-2 border-t border-gray-200 pt-2">
              <span className="text-xl font-bold text-[#1a0202]">Total:</span>
              <span className="text-xl font-bold text-[#0097b2]">❤️ {order.total_points}</span>
            </div>
          </div>
          
          {/* Notes Section */}
          {order.notes && (
            <div className="notes-section mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="text-sm font-semibold text-yellow-800 mb-2">Order Notes</h4>
              <p className="text-sm text-yellow-700">{order.notes}</p>
            </div>
          )}
          
          {/* Receipt Footer */}
          <div className="receipt-footer text-center mt-6 pt-4 border-t border-gray-200">
            <p className="text-[#4a6e7e] text-sm mb-2">
              Thank you for your purchase! This is your digital receipt.
            </p>
            <p className="text-[#4a6e7e] text-xs">
              Receipt ID: {order.order_id} | Generated: {formatDateTime(order.ordered_at)}
            </p>
            <p className="text-[#4a6e7e] text-xs mt-1">
              For support, contact your administrator or visit the help desk.
            </p>
          </div>
        </div>
        
        {/* Receipt Actions */}
        <div className="modal-footer bg-gray-50 p-4 rounded-b-lg">
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className="print-btn flex-1 bg-[#0097b2] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#007a8e] transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isPrinting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Printing...
                </>
              ) : (
                <>
                  🖨️ Print Receipt
                </>
              )}
            </button>
            
            <button
              onClick={onClose}
              className="close-btn flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalReceipt; 