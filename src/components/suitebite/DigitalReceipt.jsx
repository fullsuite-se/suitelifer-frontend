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

  // Helper function to format variation labels
  const formatLabel = (label) => {
    if (typeof label !== 'string') return String(label ?? '');
    return label
      .replace(/_/g, ' ')
      .replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  };

  // Helper function to get variation summary for an item
  const getVariationSummary = (variations) => {
    if (!variations || variations.length === 0) return null;
    
    // Group variations by type
    const groupedVariations = variations.reduce((acc, variation) => {
      const typeName = variation.type_label || variation.type_name || 'Unknown';
      if (!acc[typeName]) {
        acc[typeName] = [];
      }
      acc[typeName].push(variation);
      return acc;
    }, {});

    return groupedVariations;
  };

  // Use orderItems if available, otherwise fall back to items
  const items = order.orderItems || order.items || [];

  return (
    <div className="digital-receipt-modal fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="modal-content bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="modal-header bg-[#0097b2] text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="text-lg font-semibold">Order #{order.order_id}</h3>
                <p className="text-sm opacity-90">{order.first_name || order.user_first_name} {order.last_name || order.user_last_name} • {order.user_email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="close-btn p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="modal-body p-4">
          {/* Receipt Details */}
          <div className="receipt-details mb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <span className="text-xs font-medium text-gray-600">Order Date:</span>
                <div className="text-gray-900">{formatDateTime(order.ordered_at)}</div>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600">Payment:</span>
                <div className="text-gray-900">❤️ Heartbits</div>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600">Items:</span>
                <div className="text-gray-900">{items.length} item{items.length !== 1 ? 's' : ''}</div>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600">Total:</span>
                <div className="text-gray-900 font-semibold">❤️ {order.total_points}</div>
              </div>
            </div>
          </div>
          
          {/* Order Timeline */}
          <div className="order-timeline mb-4 bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between gap-4 relative px-2">
              {/* Horizontal line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 z-0" style={{transform: 'translateY(-50%)'}}></div>
              {/* Timeline steps */}
              <div className="flex flex-1 items-center justify-between z-10">
                {/* Placed */}
                <div className="flex flex-col items-center min-w-[80px]">
                  <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-xs font-medium text-gray-900 mt-1">Placed</span>
                  <span className="text-[10px] text-gray-500">{formatDate(order.ordered_at)}</span>
                </div>
                {/* Approved */}
                {order.processed_at && (
                  <div className="flex flex-col items-center min-w-[80px]">
                    <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
                    <span className="text-xs font-medium text-gray-900 mt-1">Approved</span>
                    <span className="text-[10px] text-gray-500">{formatDate(order.processed_at)}</span>
                </div>
              )}
                {/* Completed */}
              {order.completed_at && (
                  <div className="flex flex-col items-center min-w-[80px]">
                    <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-xs font-medium text-gray-900 mt-1">Completed</span>
                    <span className="text-[10px] text-gray-500">{formatDate(order.completed_at)}</span>
                  </div>
                )}
                </div>
            </div>
          </div>
          
          {/* Receipt Items */}
          <div className="receipt-items mb-4">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-sm font-semibold text-gray-900">Items Purchased</h4>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <div className="items-list space-y-2">
              {items.map((item, index) => {
                const variationSummary = getVariationSummary(item.variations);
                
                return (
                  <div key={index} className="item bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="item-image w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.product_name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                          <span className="text-lg">📦</span>
                      )}
                    </div>
                    
                    <div className="item-details flex-1">
                        <div className="item-name font-semibold text-gray-900 text-sm">
                        {item.product_name}
                      </div>
                        <div className="item-meta text-xs text-gray-600 mt-1">
                          {item.quantity} × ❤️ {item.price_points} heartbits
                        </div>
                        
                        {/* Variations Display */}
                        {variationSummary && (
                          <div className="item-variations mt-1">
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(variationSummary).map(([typeName, variations]) => (
                                <div key={typeName} className="flex items-center gap-1">
                                  <span className="text-xs text-gray-600 capitalize">
                                    {formatLabel(typeName)}:
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {variations.map((variation, varIndex) => (
                                      <div
                                        key={`${variation.option_id}-${varIndex}`}
                                        className="inline-flex items-center gap-1 px-1 py-0.5 bg-white rounded text-xs border border-gray-200"
                                      >
                                        {variation.hex_color && (
                                          <div
                                            className="w-2 h-2 rounded-full border border-gray-300 flex-shrink-0"
                                            style={{ backgroundColor: variation.hex_color }}
                                            title={`Color: ${variation.option_label}`}
                                          />
                                        )}
                                        <span className="text-gray-900">
                                          {variation.option_label || variation.option_value}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="item-total text-right">
                        <div className="text-sm font-bold text-[#0097b2]">
                        ❤️ {item.price_points * item.quantity}
                      </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Notes Section */}
          {order.notes && (
            <div className="notes-section mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-xs font-medium text-yellow-800">Notes:</span>
              </div>
              <p className="text-xs text-yellow-700">{order.notes}</p>
            </div>
          )}
        </div>
        
        {/* Receipt Actions */}
        <div className="modal-footer bg-gray-50 p-3 rounded-b-lg">
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className="print-btn flex-1 bg-[#0097b2] text-white py-2 px-3 rounded-lg font-semibold hover:bg-[#007a8e] transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
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
              className="close-btn flex-1 bg-gray-200 text-gray-700 py-2 px-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200 text-sm"
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