import React, { useState } from 'react';
import { formatDate } from '../../utils/dateHelpers';

const DigitalReceipt = ({ order, onClose }) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const items = order.orderItems || order.items || [];

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return `inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`;
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderVariations = (variations) => {
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

    return Object.entries(groupedVariations).map(([typeName, variations]) => (
      <div key={typeName} className="flex items-start gap-2 text-sm text-gray-600">
        <span className="font-medium capitalize whitespace-nowrap">{typeName}:</span>
        <div className="flex flex-wrap gap-1 flex-1">
          {variations.map((variation, index) => (
            <div key={index} className="flex items-center gap-1">
              {variation.hex_color && (
                <div
                  className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                  style={{ backgroundColor: variation.hex_color }}
                />
              )}
              <span className="break-words">{variation.option_label || variation.option_value}</span>
              {index < variations.length - 1 && <span>,</span>}
            </div>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="digital-receipt-modal fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="modal-content bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Centered Title */}
        <div className="p-4 text-center border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">The Gift Suite</h3>
        </div>

        {/* Compact Order Info */}
        <div className="p-3 space-y-2">
          {/* Customer, Status & Date Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-gray-600">Customer</p>
                <p className="font-semibold text-gray-900 text-base">
                  {order.first_name || order.user_first_name} {order.last_name || order.user_last_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={getStatusBadge(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium text-gray-900 text-base">{formatDateTime(order.ordered_at)}</p>
              </div>
            </div>
          </div>

          {/* Horizontal Line */}
          <div className="border-t border-gray-200"></div>

          {/* Items Section */}
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-2">Items</h4>
            <div className="space-y-1">
              {items.map((item, index) => (
                <div key={index} className="relative">
                  <div className={`rounded-lg p-3 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white border border-gray-100'}`}>
                    {/* Item Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-gray-900 text-base break-words">{item.product_name}</h5>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{item.price_points} pts each</span>
                        </div>
                      </div>
                      <div className="text-right ml-3 flex-shrink-0">
                        <p className="font-semibold text-gray-900 text-base">
                          {item.quantity * item.price_points} pts
                        </p>
                      </div>
                    </div>

                    {/* Dynamic Variations - Now contained within the background */}
                    {item.variations && item.variations.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200 space-y-1">
                        {renderVariations(item.variations)}
                      </div>
                    )}
                  </div>
                  {/* Horizontal line between items */}
                  {index < items.length - 1 && (
                    <div className="border-t border-gray-200 my-1"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Horizontal Line */}
          <div className="border-t border-gray-200"></div>

          {/* Summary */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-base font-medium text-gray-700">Total Points Used</span>
              <span className="font-bold text-[#0097b2] text-xl">{order.total_points} heartbits</span>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <span className="text-yellow-600 text-base">📝</span>
                <div>
                  <p className="text-sm font-medium text-yellow-800 mb-1">Notes</p>
                  <p className="text-sm text-yellow-700">{order.notes}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modern Footer */}
        <div className="bg-gray-50 p-4 rounded-b-xl">
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className="flex-1 bg-[#0097b2] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#007a8e] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-base"
            >
              {isPrinting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Printing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Receipt
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-base"
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