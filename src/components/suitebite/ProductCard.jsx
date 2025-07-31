import { useState, useEffect } from 'react';
import { suitebiteAPI } from '../../utils/suitebiteAPI';
import { HeartIcon, ShoppingBagIcon, ShoppingCartIcon, EyeIcon } from '@heroicons/react/24/outline';
import useCategoryStore from '../../store/stores/categoryStore';
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
        <div className="relative">
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
        {/* Category Badge */}
          {product.category && (
            <span 
            className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold shadow-sm`}
            style={{ backgroundColor: categoryBgColor, color: categoryColor, zIndex: 2 }}
            >
              {product.category}
            </span>
          )}
        </div>
        {/* Product Information Section */}
        <div className="product-info p-4">
          <h3 className="product-name text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>
          <p className="product-description text-sm text-gray-600 mb-4 line-clamp-2">
            {product.description || 'Premium quality product curated for your needs.'}
          </p>
          <div className="flex items-center justify-between mb-4">
            <div className="heartbits-price flex items-center gap-2">
              <div className="flex flex-col">
              <span className="text-2xl font-bold text-[#0097b2] flex items-center gap-1">{product.price_points || product.price || 0}<HeartIcon className="h-5 w-5 text-red-500 ml-1" /></span>
            </div>
          </div>
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
          <div className="total-cost-display bg-gray-50 p-2 rounded-lg mb-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total for {quantity}:</span>
            <span className="font-semibold text-gray-900 flex items-center gap-1">{(product.price_points || product.price || 0) * quantity}<HeartIcon className="h-4 w-4 text-red-500 ml-1" /></span>
          </div>
        </div>
          <div className="action-buttons space-y-2">
            <button
            onClick={e => {
              e.stopPropagation();
              onBuyNow(product.product_id, quantity);
            }}
            disabled={!canAfford}
            className="buy-now-btn w-full bg-[#0097b2] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#007a8e] transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                  <ShoppingBagIcon className="h-4 w-4" />
                  <span>{!canAfford ? `Need ${totalCost - userHeartbits} more heartbits` : 'Buy Now'}</span>
            </button>
            <button
            onClick={e => {
              e.stopPropagation();
              onAddToCart(product, quantity);
            }}
            className="add-to-cart-btn w-full bg-white text-[#0097b2] py-2 px-4 rounded-lg font-medium border border-[#0097b2] hover:bg-[#0097b2] hover:text-white transition-colors duration-200 flex items-center justify-center gap-2"
            >
                  <ShoppingCartIcon className="h-4 w-4" />
                  <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
  );
};

export default ProductCard;
