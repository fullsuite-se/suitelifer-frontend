import React from 'react';
import { SwatchIcon, PhotoIcon } from '@heroicons/react/24/outline';

/**
 * OrderItemCard Component
 * 
 * Displays detailed order item information including:
 * - Product details with images
 * - Selected variations (size, color, design, etc.)
 * - Quantity and pricing
 * - Visual variation indicators
 */
const OrderItemCard = ({ item, showImages = true }) => {
  // Group variations by type for better display
  const groupedVariations = item.variations?.reduce((acc, variation) => {
    if (!acc[variation.type_name]) {
      acc[variation.type_name] = [];
    }
    acc[variation.type_name].push(variation);
    return acc;
  }, {}) || {};

  const primaryImage = item.product_images?.find(img => img.is_primary) || item.product_images?.[0];

  return (
    <div className="order-item-card bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Product Image */}
        {showImages && (
          <div className="flex-shrink-0">
            {primaryImage ? (
              <img
                src={primaryImage.image_url}
                alt={primaryImage.alt_text || item.product_name}
                className="w-16 h-16 object-cover rounded-lg border border-gray-200"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <PhotoIcon className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>
        )}

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="text-base font-medium text-gray-900 truncate">
                {item.product_name}
              </h4>
              {item.product_category && (
                <p className="text-sm text-gray-500 mt-1">
                  Category: {item.product_category}
                </p>
              )}
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <p className="text-base font-medium text-gray-900">
                {item.quantity}x {item.price_points} pts
              </p>
              <p className="text-sm text-gray-500">
                Total: {item.quantity * item.price_points} pts
              </p>
            </div>
          </div>

          {/* Variations Display */}
          {Object.keys(groupedVariations).length > 0 && (
            <div className="mt-3">
              <div className="flex items-center gap-1 mb-2">
                <SwatchIcon className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">Variations:</span>
              </div>
              <div className="space-y-2">
                {Object.entries(groupedVariations).map(([typeName, variations]) => (
                  <div key={typeName} className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 capitalize min-w-[60px]">
                      {variations[0]?.type_label || typeName}:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {variations.map((variation, index) => (
                        <div
                          key={`${variation.option_id}-${index}`}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm"
                        >
                          {variation.hex_color && (
                            <div
                              className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0"
                              style={{ backgroundColor: variation.hex_color }}
                              title={`Color: ${variation.option_label}`}
                            />
                          )}
                          <span className="text-gray-700">
                            {variation.option_label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product Description (truncated) */}
          {item.product_description && (
            <p className="text-xs text-gray-500 mt-2 line-clamp-2">
              {item.product_description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderItemCard;
