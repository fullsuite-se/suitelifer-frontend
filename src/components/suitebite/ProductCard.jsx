import { useState, useEffect } from 'react';
import { suitebiteAPI } from '../../utils/suitebiteAPI';
import { HeartIcon, ShoppingBagIcon, ShoppingCartIcon, EyeIcon } from '@heroicons/react/24/outline';
import useCategoryStore from '../../store/stores/categoryStore';
import useIsMobile from '../../utils/useIsMobile';
import ProductDetailModal from './ProductDetailModal';
import ProductImageCarousel from './ProductImageCarousel';

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
  // Mobile detection
  const isMobile = useIsMobile();

  // Local state for cart interaction
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
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
   * Handles adding the product to the shopping cart with selected quantity and variation
   */
  const handleAddToCart = async () => {
    // Always open the modal for add-to-cart
          try {
            const res = await suitebiteAPI.getProductById(product.product_id);
            if (res.success && res.product) {
        // setModalProduct(res.product); // This line is removed
            } else {
        // setModalProduct(product); // This line is removed
            }
          } catch (e) {
      // setModalProduct(product); // This line is removed
          }
    // setIsModalOpen(true); // This line is removed
    // setModalMode('add-to-cart'); // This line is removed
  };

  /**
   * Handles direct purchase (buy now) - opens modal for detailed view
   */
  const handleBuyNow = async () => {
    // Always open the modal for buy-now
    try {
      const res = await suitebiteAPI.getProductById(product.product_id);
      if (res.success && res.product) {
        // setModalProduct(res.product); // This line is removed
      } else {
        // setModalProduct(product); // This line is removed
      }
    } catch (e) {
      // setModalProduct(product); // This line is removed
    }
    // setIsModalOpen(true); // This line is removed
    // setModalMode('buy-now'); // This line is removed
  };

  /**
   * Handles view details - opens modal for detailed view
   */
  const handleViewDetails = () => {
    // Fetch full product details before opening modal
    (async () => {
      try {
        const res = await suitebiteAPI.getProductById(product.product_id);
        if (res.success && res.product) {
          // setModalProduct(res.product); // This line is removed
        } else {
          // setModalProduct(product); // This line is removed
        }
      } catch (e) {
        // setModalProduct(product); // This line is removed
      }
      // setIsModalOpen(true); // This line is removed
      // setModalMode('view-details'); // This line is removed
    })();
  };

  // Remove all price adjustment and is_active logic
  // Remove selectedVariation, getFinalPrice, and isActive
  // Always use product.price_points or product.price for price display and calculations
  // Remove any strikethrough or price adjustment UI
  // Remove any checks or disables based on isActive

  // Calculate product affordability
  const finalPrice = product.price_points || product.price || 0;
  const totalCost = finalPrice * quantity;
  const canAfford = userHeartbits >= totalCost;

  // Get category colors
  const categoryColor = getCategoryColor(product.category && product.category.toUpperCase());
  const categoryBgColor = getCategoryBgColor(product.category && product.category.toUpperCase());

  return (
      <div className="product-card bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-105">
        {/* Product Image Section with overlayed category badge */}
        <div className="relative overflow-hidden">
          <ProductImageCarousel 
            images={(() => {
              let imageData = [];
              if (product.images && Array.isArray(product.images) && product.images.length > 0) {
                imageData = product.images;
              } else if (product.product_images && Array.isArray(product.product_images) && product.product_images.length > 0) {
                imageData = product.product_images;
              } else if (product.image_url) {
                imageData = [{ image_url: product.image_url, alt_text: product.name }];
              }
              return imageData;
            })()}
            productName={product.name}
            className="product-image"
          />
          {/* Category Badge - Fixed positioning */}
          {product.category && (
            <span 
              className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold shadow-sm max-w-[calc(100%-1rem)] truncate z-10"
              style={{ backgroundColor: categoryBgColor, color: categoryColor }}
            >
              {product.category}
            </span>
          )}
        </div>
        {/* Product Information Section */}
        <div className="product-info p-3 sm:p-4">
          <h3 className="product-name text-sm sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
            {product.name}
          </h3>
          <p className="product-description text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
            {product.description || 'Premium quality product curated for your needs.'}
          </p>
          
          {/* Price and Quantity on same line */}
          <div className="flex items-center justify-between mb-3">
            <div className="heartbits-price flex items-center">
              <span className="text-lg sm:text-xl font-bold text-[#0097b2] flex items-center gap-1">
                {product.price_points || product.price || 0}
                <HeartIcon className="h-4 w-4 text-red-500" />
              </span>
            </div>
            
            <div className="quantity-selector flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="quantity-btn w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center font-semibold hover:bg-gray-300 transition-colors duration-200 text-sm touch-manipulation"
              >
                -
              </button>
              <span className="quantity-display text-sm font-semibold text-gray-900 min-w-[1.5rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="quantity-btn w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center font-semibold hover:bg-gray-300 transition-colors duration-200 text-sm touch-manipulation"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Total Cost Display */}
          <div className="total-cost-display bg-gray-50 p-2 rounded-lg mb-3">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-600">Total for {quantity}:</span>
              <span className="font-semibold text-gray-900 flex items-center gap-1">
                {(product.price_points || product.price || 0) * quantity}
                <HeartIcon className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
              </span>
            </div>
          </div>
          <div className="action-buttons space-y-2">
            <button
              onClick={e => {
                e.stopPropagation();
                onBuyNow(product.product_id, quantity);
              }}
              disabled={!canAfford}
              className="buy-now-btn w-full bg-[#0097b2] text-white py-2.5 px-3 rounded-lg font-semibold hover:bg-[#007a8e] transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm min-h-[2.5rem]"
            >
              <ShoppingBagIcon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{!canAfford ? `Need ${totalCost - userHeartbits} more` : 'Buy Now'}</span>
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                onAddToCart(product, quantity);
              }}
              className="add-to-cart-btn w-full bg-white text-[#0097b2] py-2.5 px-3 rounded-lg font-medium border border-[#0097b2] hover:bg-[#0097b2] hover:text-white transition-colors duration-200 flex items-center justify-center gap-2 text-sm min-h-[2.5rem]"
            >
              <ShoppingCartIcon className="h-4 w-4 flex-shrink-0" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
  );
};

export default ProductCard;
