import { useState, useEffect } from 'react';
import { XMarkIcon, HeartIcon, ShoppingBagIcon, ShoppingCartIcon, EyeIcon } from '@heroicons/react/24/outline';
import useCategoryStore from '../../store/stores/categoryStore';

/**
 * ProductDetailModal Component - Enhanced Product Detail View
 * 
 * Shows detailed product information with variation selection, quantity, and purchase options.
 * Features include:
 * - Large product image display
 * - Detailed product information
 * - Variation selection (size, color, etc.)
 * - Quantity selection with price calculation
 * - Add to cart and buy now functionality
 * - Responsive design
 * 
 * @param {Object} product - Product data object with variations
 * @param {boolean} isOpen - Modal open state
 * @param {Function} onClose - Callback to close modal
 * @param {Function} onAddToCart - Callback when product is added to cart
 * @param {Function} onBuyNow - Callback when buy now is triggered
 * @param {number} userHeartbits - User's current heartbits balance
 * @param {string} mode - Modal mode: 'buy-now' or 'add-to-cart'
 * @param {number} initialQuantity - Initial quantity (default: 1)
 * @param {Object} initialSelectedOptions - Initial selected options
 */
const ProductDetailModal = ({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart, 
  onBuyNow, 
  userHeartbits, 
  mode = 'buy-now',
  initialQuantity = 1, 
  initialSelectedOptions 
}) => {
  // Local state for cart interaction
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [quantity, setQuantity] = useState(initialQuantity);
  
  // Variation selection state
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState(initialSelectedOptions || {});
  const [availableVariations, setAvailableVariations] = useState([]);
  const [variationTypes, setVariationTypes] = useState([]);

  // Get category color information from store
  const { getCategoryColor, getCategoryBgColor } = useCategoryStore();

  // Load product variations when component mounts
  useEffect(() => {
    if (product.variations && product.variations.length > 0) {
      setAvailableVariations(product.variations);
      
      // Extract unique variation types from the product's variations
      const types = new Set();
      product.variations.forEach(variation => {
        variation.options?.forEach(option => {
          types.add(option.type_name);
        });
      });
      setVariationTypes(Array.from(types));
    }
  }, [product]);

  // Update selected variation when options change
  useEffect(() => {
    if (availableVariations.length > 0 && Object.keys(selectedOptions).length > 0) {
      const matchingVariation = availableVariations.find(variation => {
        return variation.options?.every(option => 
          selectedOptions[option.type_name] === option.option_id
        );
      });
      setSelectedVariation(matchingVariation || null);
    }
  }, [selectedOptions, availableVariations]);

  /**
   * Handles variation option selection
   */
  const handleOptionSelect = (typeName, optionId) => {
    setSelectedOptions(prev => ({
      ...prev,
      [typeName]: optionId
    }));
  };

  /**
   * Gets available options for a specific variation type
   */
  const getAvailableOptions = (typeName) => {
    const options = new Set();
    availableVariations.forEach(variation => {
      variation.options?.forEach(option => {
        if (option.type_name === typeName) {
          options.add(JSON.stringify({
            id: option.option_id,
            value: option.option_value,
            label: option.option_label,
            hexColor: option.hex_color
          }));
        }
      });
    });
    return Array.from(options).map(opt => JSON.parse(opt));
  };

  /**
   * Calculates the final price including variation adjustments
   */
  const getFinalPrice = () => {
    const basePrice = product.price_points || product.price || 0;
    const adjustment = selectedVariation?.price_adjustment || 0;
    return basePrice + adjustment;
  };

  /**
   * Handles confirming the order with selected quantity and variation
   */
  const handleAddToCartFromModal = async () => {
    if (isAddingToCart) return;

    // Ensure variation selection if required
    if (availableVariations.length > 0 && variationTypes.length > 0) {
      const allTypesSelected = variationTypes.every(type => selectedOptions[type]);
      if (!allTypesSelected) {
        alert('Please select all product options before adding to cart.');
        return;
      }
    }

    try {
      setIsAddingToCart(true);
      
      // Prepare variation data in the new format
      const variations = Object.entries(selectedOptions).map(([typeName, optionId]) => {
        const option = availableVariations
          .flatMap(v => v.options || [])
          .find(opt => opt.option_id === optionId && opt.type_name === typeName);
        
        console.log(`🔍 ProductDetailModal - Processing variation:`, {
          typeName,
          optionId,
          optionIdType: typeof optionId,
          foundOption: option,
          allOptionsForType: availableVariations
            .flatMap(v => v.options || [])
            .filter(opt => opt.type_name === typeName)
            .map(opt => ({ option_id: opt.option_id, type: typeof opt.option_id })),
          availableVariations: availableVariations.length
        });
        
        const variation = {
          variation_type_id: option?.variation_type_id,
          option_id: optionId
        };
        
        console.log(`🔍 ProductDetailModal - Created variation object:`, {
          variation,
          hasTypeId: !!variation.variation_type_id,
          hasOptionId: !!variation.option_id,
          willBeFiltered: !(variation.variation_type_id && variation.option_id)
        });
        
        return variation;
      }).filter(v => v.variation_type_id && v.option_id);

      // Debug: Log selected variations
      console.log('🎯 ProductDetailModal - Adding to cart with variations:', {
        selectedOptions,
        preparedVariations: variations,
        product: product.name,
        filteredCount: variations.length
      });

      await onAddToCart(product.product_id, quantity, null, variations);
      onClose(); // Close modal after adding to cart
    } catch (error) {
      console.error('Error adding to cart from modal:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  /**
   * Handles direct purchase (buy now) from modal
   */
  const handleBuyNowFromModal = async () => {
    if (isBuying) return;

    // Ensure variation selection if required
    if (availableVariations.length > 0 && variationTypes.length > 0) {
      const allTypesSelected = variationTypes.every(type => selectedOptions[type]);
      if (!allTypesSelected) {
        alert('Please select all product options before confirming order.');
        return;
      }
    }

    try {
      setIsBuying(true);
      
      // Prepare variation data in the new format
      const variations = Object.entries(selectedOptions).map(([typeName, optionId]) => {
        const option = availableVariations
          .flatMap(v => v.options || [])
          .find(opt => opt.option_id === optionId && opt.type_name === typeName);
        
        return {
          variation_type_id: option?.variation_type_id,
          option_id: optionId
        };
      }).filter(v => v.variation_type_id && v.option_id);

      await onBuyNow(product.product_id, quantity, null, variations);
      onClose(); // Close modal after purchase
    } catch (error) {
      console.error('Error processing buy now from modal:', error);
    } finally {
      setIsBuying(false);
    }
  };

  // Calculate product availability and affordability
  const finalPrice = getFinalPrice();
  const totalCost = finalPrice * quantity;
  const canAfford = userHeartbits >= totalCost;
  const isActive = product.is_active;

  // Get category colors
  const categoryColor = getCategoryColor(product.category);
  const categoryBgColor = getCategoryBgColor(product.category);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
            {mode === 'edit' && (
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                Editing Cart Item
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image Section */}
            <div className="product-image-section">
              <div className="relative h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                
                {/* Placeholder when no image is available */}
                <div className="w-full h-full flex items-center justify-center" style={{ display: product.image_url ? 'none' : 'flex' }}>
                  <div className="text-center">
                    <ShoppingBagIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm text-gray-400">Product Image</p>
                  </div>
                </div>
                
                {/* Category Badge */}
                {product.category && (
                  <div className="absolute top-4 left-4">
                    <span 
                      className="category-badge px-3 py-1 rounded-full text-sm font-semibold shadow-sm border border-white border-opacity-20"
                      style={{ 
                        backgroundColor: categoryColor,
                        color: 'white',
                        textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                      }}
                    >
                      {product.category}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Information Section */}
            <div className="product-info-section">
              {/* Product Name */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              {/* Product Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {product.description || 'Premium quality product curated for your needs.'}
              </p>

              {/* Price Display */}
              <div className="price-section mb-6">
                <div className="flex items-center gap-3">
                  {selectedVariation && selectedVariation.price_adjustment !== 0 ? (
                    <>
                      <span className="text-2xl text-gray-400 line-through">{product.price_points}</span>
                      <span className="text-4xl font-bold text-[#0097b2] flex items-center gap-2">
                        {finalPrice}
                        <HeartIcon className="h-8 w-8 text-red-500" />
                      </span>
                    </>
                  ) : (
                    <span className="text-4xl font-bold text-[#0097b2] flex items-center gap-2">
                      {finalPrice}
                      <HeartIcon className="h-8 w-8 text-red-500" />
                    </span>
                  )}
                </div>
                {selectedVariation && selectedVariation.price_adjustment !== 0 && (
                  <p className="text-sm text-blue-600 mt-1">
                    Price adjustment: {selectedVariation.price_adjustment > 0 ? '+' : ''}{selectedVariation.price_adjustment} heartbits
                  </p>
                )}
              </div>

              {/* Product Variations Selection */}
              {availableVariations.length > 0 && (
                <div className="variations-section mb-6 p-4 bg-gray-50 rounded-lg border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Options:</h3>
                  
                  {variationTypes.map(typeName => (
                    <div key={typeName} className="variation-type mb-4 last:mb-0">
                      <label className="block text-sm font-medium text-gray-700 mb-3 capitalize">
                        {typeName}:
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {getAvailableOptions(typeName).map(option => (
                          <button
                            key={option.id}
                            onClick={() => handleOptionSelect(typeName, option.id)}
                            className={`option-button px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                              selectedOptions[typeName] === option.id
                                ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                            }`}
                            style={typeName === 'color' && option.hexColor ? {
                              backgroundColor: selectedOptions[typeName] === option.id ? undefined : option.hexColor,
                              color: selectedOptions[typeName] === option.id ? undefined : (option.hexColor === '#FFFFFF' ? '#000' : '#fff'),
                              borderColor: selectedOptions[typeName] === option.id ? undefined : option.hexColor
                            } : {}}
                          >
                            {typeName === 'color' ? (
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-4 h-4 rounded-full border border-gray-300"
                                  style={{ backgroundColor: option.hexColor }}
                                />
                                <span>{option.label}</span>
                              </div>
                            ) : (
                              option.label
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Selected Variation Info */}
                  {selectedVariation && (
                    <div className="selected-variation-info mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-blue-800">Selected Options:</span>
                        <span className="text-blue-600">
                          {selectedVariation.options?.map(opt => opt.option_label).join(' + ')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity Selection */}
              <div className="quantity-section mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Quantity:
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="quantity-btn w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-semibold hover:bg-gray-300 transition-colors duration-200"
                  >
                    -
                  </button>
                  <span className="quantity-display text-2xl font-semibold text-gray-900 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="quantity-btn w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-semibold hover:bg-gray-300 transition-colors duration-200"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total Cost Display */}
              <div className="total-cost-display bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg text-gray-600">Total for {quantity}:</span>
                  <span className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    {totalCost}
                    <HeartIcon className="h-6 w-6 text-red-500" />
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Your balance: {userHeartbits} heartbits
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                {(mode === 'buy-now' || mode === 'details') ? (
                  /* Confirm Order Button for Buy Now mode */
                  <button
                    onClick={handleBuyNowFromModal}
                    disabled={!canAfford || !isActive || isBuying || isAddingToCart}
                    className="confirm-order-btn w-full bg-[#0097b2] text-white py-4 px-6 rounded-lg font-semibold hover:bg-[#007a8e] transition-colors duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  >
                    {isBuying ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : !canAfford ? (
                      <>
                        <HeartIcon className="h-5 w-5" />
                        <span>Need {totalCost - userHeartbits} more heartbits</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBagIcon className="h-5 w-5" />
                        <span>Confirm Order</span>
                      </>
                    )}
                  </button>
                ) : (
                  /* Add to Cart Button for Add to Cart mode */
                  <button
                    onClick={handleAddToCartFromModal}
                    disabled={!canAfford || !isActive || isBuying || isAddingToCart}
                    className="add-to-cart-btn w-full bg-[#0097b2] text-white py-4 px-6 rounded-lg font-semibold hover:bg-[#007a8e] transition-colors duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  >
                    {isAddingToCart ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>{mode === 'edit' ? 'Updating...' : 'Adding...'}</span>
                      </>
                    ) : !canAfford ? (
                      <>
                        <HeartIcon className="h-5 w-5" />
                        <span>Need {totalCost - userHeartbits} more heartbits</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCartIcon className="h-5 w-5" />
                        <span>{mode === 'edit' ? 'Update Cart Item' : 'Add to Cart'}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal; 