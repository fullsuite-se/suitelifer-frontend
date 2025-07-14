import { useState, useEffect } from 'react';
import { suitebiteAPI } from '../../utils/suitebiteAPI';
import { HeartIcon, ShoppingBagIcon, ShoppingCartIcon, EyeIcon } from '@heroicons/react/24/outline';
import useCategoryStore from '../../store/stores/categoryStore';
import ProductDetailModal from './ProductDetailModal';

/**
 * ProductCard Component - Enhanced with Product Variations Support
 * 
 * Displays individual products in the shop with purchase functionality and variation selection.
 * Features include:
 * - Product image and details display
 * - Color-coded category badges
 * - Product variation selection (sizes, colors, styles)
 * - Quantity selection
 * - Add to cart and buy now functionality
 * - Heartbits cost display with variation pricing
 * - View details modal for enhanced product information
 * 
 * @param {Object} product - Product data object with variations
 * @param {Function} onAddToCart - Callback when product is added to cart
 * @param {Function} onBuyNow - Callback when buy now is triggered
 * @param {number} userHeartbits - User's current heartbits balance
 */
const ProductCard = ({ product, onAddToCart, onBuyNow, userHeartbits }) => {
  // Local state for cart interaction
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Variation selection state
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
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
   * Handles adding the product to cart with selected quantity and variation
   */
  const handleAddToCart = async () => {
    if (isAddingToCart || isBuying) return;

    // If this product has variations, open the detail modal to select options
    if (availableVariations.length > 0) {
      setIsModalOpen(true);
      return;
    }

    try {
      setIsAddingToCart(true);
      await onAddToCart(product.product_id, quantity, selectedVariation?.variation_id);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  /**
   * Handles direct purchase (buy now) - opens modal for detailed view
   */
  const handleBuyNow = async () => {
    setIsModalOpen(true);
  };

  /**
   * Handles view details - opens modal for detailed view
   */
  const handleViewDetails = () => {
    setIsModalOpen(true);
  };

  // Calculate product availability and affordability
  const finalPrice = getFinalPrice();
  const totalCost = finalPrice * quantity;
  const canAfford = userHeartbits >= totalCost;
  const isActive = product.is_active;

  // Get category colors
  const categoryColor = getCategoryColor(product.category);
  const categoryBgColor = getCategoryBgColor(product.category);

  return (
    <>
      <div className="product-card bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
        {/* Product Image Section */}
        <div className="product-image relative h-48 bg-gradient-to-br from-gray-50 to-gray-100">
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
              <ShoppingBagIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-400">Product Image</p>
            </div>
          </div>
          
          {/* Enhanced Color-Coded Category Badge */}
          {product.category && (
            <div className="absolute top-3 left-3">
              <span 
                className="category-badge px-3 py-1 rounded-full text-xs font-semibold shadow-sm border border-white border-opacity-20"
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
          
          {/* Variations Available Badge */}
          {availableVariations.length > 0 && (
            <div className="absolute bottom-3 left-3">
              <span className="variations-badge bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-sm">
                {availableVariations.length} Options
              </span>
            </div>
          )}

          {/* View Details Button */}
          <div className="absolute top-3 right-3">
            <button
              onClick={handleViewDetails}
              className="view-details-btn bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-sm transition-all duration-200"
              title="View Details"
            >
              <EyeIcon className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Product Information Section */}
        <div className="product-info p-4">
          {/* Product Name */}
          <h3 className="product-name text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          {/* Product Description */}
          <p className="product-description text-sm text-gray-600 mb-4 line-clamp-2">
            {product.description || 'Premium quality product curated for your needs.'}
          </p>

          {/* Variations are selected in the product details modal */}
          
          {/* Price and Quantity Row */}
          <div className="flex items-center justify-between mb-4">
            {/* Price */}
            <div className="heartbits-price flex items-center gap-2">
              <div className="flex flex-col">
                {selectedVariation && selectedVariation.price_adjustment !== 0 ? (
                  <>
                    <div className="flex items-center gap-1">
                      <span className="text-lg text-gray-400 line-through">{product.price_points}</span>
                      <span className="text-2xl font-bold text-[#0097b2] flex items-center gap-1">{finalPrice}<HeartIcon className="h-5 w-5 text-red-500 ml-1" /></span>
                    </div>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-[#0097b2] flex items-center gap-1">{finalPrice}<HeartIcon className="h-5 w-5 text-red-500 ml-1" /></span>
                )}
              </div>
            </div>
            {/* Quantity Selector */}
            <div className="quantity-selector flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="quantity-btn w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-semibold hover:bg-gray-300 transition-colors duration-200"
              >
                -
              </button>
              <span className="quantity-display text-lg font-semibold text-gray-900 min-w-[2rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="quantity-btn w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-semibold hover:bg-gray-300 transition-colors duration-200"
              >
                +
              </button>
            </div>
          </div>

          {/* Total Cost Display */}
          <div className="total-cost-display bg-gray-50 p-2 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total for {quantity}:</span>
              <span className="font-semibold text-gray-900 flex items-center gap-1">{totalCost}<HeartIcon className="h-4 w-4 text-red-500 ml-1" /></span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons space-y-2">
            {/* Buy Now Button */}
            <button
              onClick={handleBuyNow}
              disabled={!canAfford || !isActive || isBuying || isAddingToCart}
              className="buy-now-btn w-full bg-[#0097b2] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#007a8e] transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBuying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : !canAfford ? (
                <>
                  <HeartIcon className="h-4 w-4" />
                  <span>Need {totalCost - userHeartbits} more</span>
                </>
              ) : (
                <>
                  <ShoppingBagIcon className="h-4 w-4" />
                  <span>Buy Now</span>
                </>
              )}
            </button>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!isActive || isAddingToCart || isBuying}
              className="add-to-cart-btn w-full bg-white text-[#0097b2] py-2 px-4 rounded-lg font-medium border border-[#0097b2] hover:bg-[#0097b2] hover:text-white transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAddingToCart ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0097b2] border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <ShoppingCartIcon className="h-4 w-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={onAddToCart}
        onBuyNow={onBuyNow}
        userHeartbits={userHeartbits}
      />
    </>
  );
};

export default ProductCard;
