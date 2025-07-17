import { useState, useEffect } from 'react';
import { suitebiteAPI } from '../../utils/suitebiteAPI';
import { XMarkIcon, TrashIcon, CheckIcon, HeartIcon, ShoppingBagIcon, CurrencyDollarIcon, EyeIcon } from '@heroicons/react/24/outline';
import ProductDetailModal from './ProductDetailModal';

/**
 * ShoppingCart Component - Enhanced with Real-Time Updates
 * 
 * Advanced shopping cart with real-time heartbit updates and improved UX.
 * Features include:
 * - Real-time heartbits balance updates
 * - Optimistic UI updates for better performance
 * - Loading states and error handling
 * - Enhanced item selection and checkout flow
 * - Better visual feedback and animations
 * - Improved quantity management
 * - Integrated design for better UX
 */
const ShoppingCart = ({ cart, userHeartbits, onCheckout, onClose, onUpdateCart, onUpdateQuantity, onRemoveItem, isVisible = false }) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [itemLoadingStates, setItemLoadingStates] = useState({});
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [realTimeHeartbits, setRealTimeHeartbits] = useState(userHeartbits);
  const [cartItemToEdit, setCartItemToEdit] = useState(null);
  const [productModalData, setProductModalData] = useState(null);
  const [modalInitialOptions, setModalInitialOptions] = useState({});
  const [modalInitialQuantity, setModalInitialQuantity] = useState(1);

  // Update real-time heartbits when prop changes
  useEffect(() => {
    setRealTimeHeartbits(userHeartbits);
  }, [userHeartbits]);

  // Only auto-select all items if cart is non-empty and nothing is selected yet (and not on every cart change)
  useEffect(() => {
    if (cart.length > 0 && selectedItems.size === 0) {
      setSelectedItems(new Set(cart.map(item => item.cart_item_id)));
    }
    if (cart.length === 0 && selectedItems.size > 0) {
      setSelectedItems(new Set());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.length]);

  // Filter out duplicate cart items by cart_item_id
  const uniqueCart = [];
  const seenIds = new Set();
  for (const item of cart) {
    if (!seenIds.has(item.cart_item_id)) {
      uniqueCart.push(item);
      seenIds.add(item.cart_item_id);
    } else {
      // Log duplicate for debugging
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn('Duplicate cart_item_id in cart:', item.cart_item_id, item);
      }
    }
  }

  const total = uniqueCart.reduce((sum, item) => sum + (item.points_cost * item.quantity), 0);
  const itemCount = uniqueCart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Calculate selected items totals
  const selectedItemsTotal = uniqueCart.reduce((sum, item) => {
    if (selectedItems.has(item.cart_item_id)) {
      return sum + (item.points_cost * item.quantity);
    }
    return sum;
  }, 0);
  
  const selectedItemsCount = uniqueCart.reduce((sum, item) => {
    if (selectedItems.has(item.cart_item_id)) {
      return sum + item.quantity;
    }
    return sum;
  }, 0);

  const canCheckout = () => {
    return selectedItems.size > 0 && realTimeHeartbits >= selectedItemsTotal;
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000);
  };

  const setItemLoadingState = (itemId, state) => {
    setItemLoadingStates(prev => ({ ...prev, [itemId]: state }));
  };

  const handleSelectAll = () => {
    if (selectedItems.size === uniqueCart.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(uniqueCart.map(item => item.cart_item_id)));
    }
  };

  const handleClearAll = () => {
    setSelectedItems(new Set());
  };

  const handleItemSelect = (itemId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleCheckout = async () => {
    if (!canCheckout() || isCheckingOut) return;

    try {
      setIsCheckingOut(true);
      
      // Update real-time heartbits optimistically
      setRealTimeHeartbits(prev => Math.max(0, prev - selectedItemsTotal));
      
      // Filter cart to only selected items
      const selectedCartItems = uniqueCart.filter(item => selectedItems.has(item.cart_item_id));
      await onCheckout(selectedCartItems);
      
      // Clear selected items after successful checkout
      setSelectedItems(new Set());
      showNotification('success', 'Order placed successfully! Awaiting admin approval. 🎉');
      
    } catch (error) {
      // Revert optimistic update on error
      setRealTimeHeartbits(userHeartbits);
      showNotification('error', 'Checkout failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const currentItem = uniqueCart.find(item => item.cart_item_id === itemId);
    if (!currentItem) return;

    try {
      setItemLoadingState(itemId, 'updating');
      
      const response = await suitebiteAPI.updateCartItem(itemId, { quantity: newQuantity });
      
      if (response.success) {
        onUpdateCart();
        showNotification('success', 'Quantity updated');
      } else {
        showNotification('error', 'Failed to update quantity');
      }
      
    } catch (error) {
      console.error('Error updating quantity:', error);
      showNotification('error', 'Failed to update quantity');
    } finally {
      setItemLoadingState(itemId, null);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      setItemLoadingState(itemId, 'removing');
      
      // Remove from selected items optimistically
      const newSelected = new Set(selectedItems);
      newSelected.delete(itemId);
      setSelectedItems(newSelected);
      
      const response = await suitebiteAPI.removeFromCart(itemId);
      
      if (response.success) {
        onUpdateCart();
        showNotification('success', 'Item removed from cart');
      } else {
        showNotification('error', 'Failed to remove item');
      }
      
    } catch (error) {
      console.error('Error removing item:', error);
      showNotification('error', 'Failed to remove item');
    } finally {
      setItemLoadingState(itemId, null);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your entire cart?')) return;
    
    try {
      setIsUpdating(true);
      const response = await suitebiteAPI.clearCart();
      if (response.success) {
        onUpdateCart();
        setSelectedItems(new Set());
        showNotification('success', 'Cart cleared');
      } else {
        showNotification('error', 'Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      showNotification('error', 'Failed to clear cart');
    } finally {
      setIsUpdating(false);
    }
  };

  // Open product detail modal to edit a cart item
  const openEditModal = async (item) => {
    try {
      const [prodRes, varRes] = await Promise.all([
        suitebiteAPI.getProductById(item.product_id),
        suitebiteAPI.getProductVariations(item.product_id)
      ]);
      if (prodRes.success && varRes.success) {
        const productData = {
          ...prodRes.product,
          variations: varRes.variations
        };
        setProductModalData(productData);
        
        // Build initial options mapping from variations array
        let initialOpts = {};
        if (item.variations && Array.isArray(item.variations)) {
          item.variations.forEach(variation => {
            if (variation.type_name && variation.option_id) {
              initialOpts[variation.type_name] = variation.option_id;
            }
          });
        }
        // Legacy support for variation_details
        else if (item.variation_details) {
          const details = Array.isArray(item.variation_details)
            ? item.variation_details
            : [item.variation_details];
          details.forEach(opt => {
            if (opt.type_name && opt.option_id) {
              initialOpts[opt.type_name] = opt.option_id;
            }
          });
        }
        
        setModalInitialOptions(initialOpts);
        setModalInitialQuantity(item.quantity);
        setCartItemToEdit(item);
      }
    } catch (error) {
      console.error('Error opening edit modal:', error);
    }
  };

  // Save edited cart item via updateCartItem with new variation format
  const handleSaveCartEdit = async (_productId, quantity, variationId, variations = []) => {
    if (!cartItemToEdit) return;
    try {
      const updateData = { quantity };
      
      // If variations are provided (new format), use them
      if (variations && variations.length > 0) {
        updateData.variations = variations;
      }
      // Legacy support: convert variationId to new format if provided
      else if (variationId && productModalData.variations) {
        const variation = productModalData.variations.find(v => v.variation_id === variationId);
        if (variation && variation.options) {
          updateData.variations = variation.options.map(option => ({
            variation_type_id: option.variation_type_id,
            option_id: option.option_id
          }));
        }
      }
      
      const res = await suitebiteAPI.updateCartItem(cartItemToEdit.cart_item_id, updateData);
      if (res.success) {
        onUpdateCart();
        showNotification('success', 'Cart item updated successfully');
      } else {
        showNotification('error', 'Failed to update cart item');
      }
    } catch (err) {
      console.error('Error saving cart edit:', err);
      showNotification('error', 'Failed to update cart item');
    } finally {
      setCartItemToEdit(null);
    }
  };

  if (!isVisible) return null;

  // Debug cart items with variations
  if (process.env.NODE_ENV !== 'production') {
    console.log('🛒 ShoppingCart Debug - Cart Items:', uniqueCart.map(item => ({
      cart_item_id: item.cart_item_id,
      product_name: item.product_name,
      variations: item.variations,
      variation_details: item.variation_details,
      hasVariations: (item.variations && Array.isArray(item.variations) && item.variations.length > 0) || item.variation_details
    })));
  }

  return (
    <>
      <div className="shopping-cart-container bg-white rounded-lg shadow-sm border p-4 mb-6 pb-8">
      {/* Cart Header */}
      <div className="cart-header flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ShoppingBagIcon className="h-6 w-6 text-[#0097b2]" />
          <span className="font-bold text-xl text-gray-900">Shopping Cart</span>
          <span className="ml-2 text-sm font-medium text-gray-500">({itemCount} items)</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-full focus:outline-none"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

        {/* Cart Content */}
        <div className="cart-content p-4 max-h-[60vh] overflow-y-auto mb-4">
          {uniqueCart.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600">Add some items to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Selection Controls */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === uniqueCart.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-[#0097b2] focus:ring-[#0097b2]"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Select All ({uniqueCart.length})
                  </span>
                </div>
                <button
                  onClick={handleClearAll}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear All
                </button>
              </div>

              {/* Cart Items */}
              {uniqueCart.map((item) => (
                <div key={item.cart_item_id} className="cart-item bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    {/* Item Selection */}
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.cart_item_id)}
                      onChange={() => handleItemSelect(item.cart_item_id)}
                      className="mt-1 rounded border-gray-300 text-[#0097b2] focus:ring-[#0097b2]"
                    />
                    
                    {/* Item Image */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.product_name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <ShoppingBagIcon className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.product_name}
                      </h3>
                      
                      {/* Enhanced Variations Display */}
                      <div className="mt-2">
                        {(() => {
                          const hasVariations = (item.variations && Array.isArray(item.variations) && item.variations.length > 0) || item.variation_details;
                          
                          // Debug cart item variations
                          if (process.env.NODE_ENV !== 'production') {
                            console.log(`🛒 Cart Item Debug: ${item.product_name}`, {
                              variations: item.variations,
                              variation_details: item.variation_details,
                              hasVariations
                            });
                          }
                          
                          if (hasVariations) {
                            let variationText = '';
                            let variationElements = [];
                            
                            if (item.variations && Array.isArray(item.variations) && item.variations.length > 0) {
                              variationElements = item.variations.map((v, index) => (
                                <span key={index} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200 mr-1">
                                  {v.option_label || v.option_value || `${v.type_name}: Unknown`}
                                </span>
                              ));
                            } else if (item.variation_details) {
                              const details = Array.isArray(item.variation_details) ? item.variation_details : [item.variation_details];
                              variationElements = details.map((opt, index) => (
                                <span key={index} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200 mr-1">
                                  {opt.option_label || opt.option_value || 'Unknown'}
                                </span>
                              ));
                            }
                            
                            return (
                              <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-1">
                                  {variationElements.length > 0 ? variationElements : (
                                    <span className="text-xs px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full border border-yellow-200">
                                      Variations not loaded
                                    </span>
                                  )}
                                </div>
                                <button
                                  onClick={() => openEditModal(item)}
                                  className="text-blue-600 text-xs hover:text-blue-800 hover:underline font-medium"
                                  title="Edit product options"
                                >
                                  Edit Options
                                </button>
                              </div>
                            );
                          } else {
                            return (
                              <div className="flex items-center justify-between">
                                <span className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded-full border border-gray-200">
                                  Standard
                                </span>
                                <button
                                  onClick={() => openEditModal(item)}
                                  className="text-gray-500 text-xs hover:text-gray-700 hover:underline"
                                  title="View product details"
                                >
                                  View Details
                                </button>
                              </div>
                            );
                          }
                        })()}
                      </div>
                      
                      {/* Price and Quantity */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <HeartIcon className="h-4 w-4 text-red-500" />
                          <span className="text-sm font-medium text-[#0097b2]">
                            {item.points_cost} pts
                          </span>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity - 1)}
                            disabled={itemLoadingStates[item.cart_item_id] === 'updating'}
                            className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="text-sm font-medium min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity + 1)}
                            disabled={itemLoadingStates[item.cart_item_id] === 'updating'}
                            className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Total for this item */}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          Total: {item.points_cost * item.quantity} pts
                        </span>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.cart_item_id)}
                          disabled={itemLoadingStates[item.cart_item_id] === 'removing'}
                          className="text-red-500 hover:text-red-700 p-1 rounded transition-colors disabled:opacity-50"
                          title="Remove item"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Loading State */}
                  {itemLoadingStates[item.cart_item_id] && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#0097b2]"></div>
                      {itemLoadingStates[item.cart_item_id] === 'updating' ? 'Updating...' : 'Removing...'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Footer */}
        {uniqueCart.length > 0 && (
          <div className="cart-footer border-t border-gray-200 p-4 pb-8">
            {/* Selected Items Summary */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700">
                  {selectedItemsCount} item{selectedItemsCount !== 1 ? 's' : ''} selected
                </span>
              </div>
              <span className="text-sm text-gray-500">
                Total: {selectedItemsTotal} pts
              </span>
            </div>

            {/* Heartbits Balance */}
            <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <HeartIcon className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-gray-700">Your Balance:</span>
              </div>
              <span className={`text-sm font-semibold ${realTimeHeartbits >= selectedItemsTotal ? 'text-green-600' : 'text-red-600'}`}>
                {realTimeHeartbits} pts
              </span>
            </div>

            {/* Affordability Indicator */}
            {realTimeHeartbits < selectedItemsTotal && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <span className="text-sm font-medium">Insufficient Balance</span>
                </div>
                <p className="text-xs text-red-600 mt-1">
                  You need {selectedItemsTotal - realTimeHeartbits} more heartbits to complete this purchase.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleClearCart}
                disabled={isUpdating}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {isUpdating ? 'Clearing...' : 'Clear Cart'}
              </button>
              
              <button
                onClick={handleCheckout}
                disabled={!canCheckout() || isCheckingOut}
                className="flex-1 px-4 py-2 bg-[#0097b2] text-white rounded-lg hover:bg-[#007a8e] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isCheckingOut ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-4 w-4" />
                    Checkout ({selectedItemsCount})
                  </>
                )}
              </button>
            </div>
          </div>
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
      {cartItemToEdit && productModalData && (
        <ProductDetailModal
          product={productModalData}
          isOpen={true}
          onClose={() => setCartItemToEdit(null)}
          onAddToCart={handleSaveCartEdit}
          userHeartbits={realTimeHeartbits}
          initialQuantity={modalInitialQuantity}
          initialSelectedOptions={modalInitialOptions}
        />
      )}
    </>
  );
};

export default ShoppingCart;
