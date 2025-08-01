import React, { useState, useEffect } from 'react';
import { useSuitebiteStore } from '../../store/stores/suitebiteStore';
import useCategoryStore from '../../store/stores/categoryStore';
import { suitebiteAPI } from '../../utils/suitebiteAPI';
import useIsMobile from '../../utils/useIsMobile';
import ProductCard from './ProductCard';
import ShoppingCart from './ShoppingCart';
import OrderHistory from './OrderHistory';
import ProductDetailModal from './ProductDetailModal';

import { MagnifyingGlassIcon, ShoppingBagIcon, ShoppingCartIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

/**
 * ShopTabContent Component - Enhanced with Color-Coded Categories
 * 
 * Main shop interface with product browsing, cart management, and order history.
 * Features include:
 * - Product search and filtering with color-coded categories
 * - Shopping cart sidebar
 * - Order history viewing
 * - Digital receipt generation
 * - Heartbits balance display
 * - Enhanced category filtering with visual indicators
 * 
 * This component manages the entire shopping experience within Suitebite
 */
const ShopTabContent = () => {
  // Global state from Zustand store
  const {
    products,
    cart,
    userHeartbits,
    setProducts,
    setCart,
    setUserHeartbits
  } = useSuitebiteStore();

  // Category store for color-coded categories
  const { syncCategoriesFromProducts, getCategoriesForFilter, getAllCategories, getCategoryColor, getCategoryBgColor } = useCategoryStore();

  // Mobile detection
  const isMobile = useIsMobile();

  // Local component state
  const [activeTab, setActiveTab] = useState('products'); // Current tab: 'products' or 'orders'
  const [loading, setLoading] = useState(false); // Data loading state
  const [cartVisible, setCartVisible] = useState(false); // Cart sidebar visibility

  const [notification, setNotification] = useState({ show: false, type: '', message: '' }); // Toast notifications

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState(''); // Product search query
  const [selectedCategory, setSelectedCategory] = useState('all'); // Selected product category
  const [sortBy, setSortBy] = useState('name'); // Product sorting method
  const [priceRange, setPriceRange] = useState({ min: 1, max: 10000 }); // Price filter range

  // Admin grant state
  const [adminGrantUserId, setAdminGrantUserId] = useState('');
  const [adminGrantMessage, setAdminGrantMessage] = useState('');
  const [adminGrantPoints, setAdminGrantPoints] = useState(1);
  const [adminGrantLoading, setAdminGrantLoading] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);
  const [modalMode, setModalMode] = useState('buy-now');
  const [modalInitialQuantity, setModalInitialQuantity] = useState(1);
  const [modalInitialSelectedOptions, setModalInitialSelectedOptions] = useState({});

  // Detect if current user is admin (assume user type is available in localStorage for demo)
  const isAdmin = localStorage.getItem('user_type') === 'admin';

  // Admin grant handler
  const handleAdminGrant = async (e) => {
    e.preventDefault();
    if (!adminGrantUserId || !adminGrantMessage || adminGrantPoints <= 0) return;
    setAdminGrantLoading(true);
    try {
      const response = await suitebiteAPI.createCheerPost({
        peer_id: adminGrantUserId,
        post_body: adminGrantMessage,
        heartbits_given: adminGrantPoints,
        as_admin: true
      });
      if (response.success) {
        showNotification('success', 'Heartbits/message sent as Admin!');
        setAdminGrantUserId('');
        setAdminGrantMessage('');
        setAdminGrantPoints(1);
        loadShopData();
      } else {
        showNotification('error', response.message || 'Failed to send as Admin');
      }
    } catch (err) {
      showNotification('error', 'Error sending as Admin');
    } finally {
      setAdminGrantLoading(false);
    }
  };
  // Load shop data on component mount and when category changes
  useEffect(() => {
    loadShopData();
    // eslint-disable-next-line
  }, [selectedCategory]);

  /**
   * Shows toast notification with specified type and message
   * @param {string} type - Notification type: 'success', 'error', 'info'
   * @param {string} message - Notification message
   */
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
  };

  /**
   * Loads all shop data including products, cart, and user heartbits
   * Called on component mount and after successful operations
   */
  const loadShopData = async () => {
    try {
      setLoading(true);
      
      const [productsResponse, cartResponse, heartbitsResponse] = await Promise.all([
        suitebiteAPI.getProductsWithVariations('true', selectedCategory),
        suitebiteAPI.getCart(),
        suitebiteAPI.getUserHeartbits()
      ]);

      if (productsResponse.success) {
        setProducts(productsResponse.products);
        // Sync categories from loaded products
        syncCategoriesFromProducts(productsResponse.products);
      }

      if (cartResponse.success) {
        // Parse cart data correctly from backend response
        const cartItems = cartResponse.data?.cartItems || [];
        setCart(cartItems);
      }

      if (heartbitsResponse.success) {
        setUserHeartbits(heartbitsResponse.heartbits_balance);
      }
    } catch (error) {
      console.error('Error loading shop data:', error);
      showNotification('error', 'Failed to load shop data');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Adds a product to the shopping cart
   * @param {number} productId - ID of the product to add
   * @param {number} quantity - Quantity to add (default: 1)
   * @param {number} variationId - Optional variation ID (legacy support)
   * @param {Array} variations - Array of variation selections
   */
  const handleAddToCart = async (productId, quantity = 1) => {
    try {
      // Get full product details for the modal
      const response = await suitebiteAPI.getProductById(productId);
      if (response.success && response.product) {
        setModalProduct(response.product);
        setModalInitialQuantity(quantity);
        setModalInitialSelectedOptions({});
        setModalMode('add-to-cart');
        setIsModalOpen(true);
      } else {
        showNotification('error', 'Product not found');
      }
    } catch (error) {
      console.error('Error opening add to cart modal:', error);
      showNotification('error', 'Failed to open product details');
    }
  };

  /**
   * Handles opening the product detail modal for buy now
   * @param {number} productId - ID of the product to buy
   * @param {number} quantity - Quantity to buy (default: 1)
   */
  const handleBuyNow = async (productId, quantity = 1) => {
    try {
      // Get full product details for the modal
      const response = await suitebiteAPI.getProductById(productId);
      if (response.success && response.product) {
        setModalProduct(response.product);
        setModalInitialQuantity(quantity);
        setModalInitialSelectedOptions({});
        setModalMode('buy-now');
        setIsModalOpen(true);
      } else {
        showNotification('error', 'Product not found');
      }
    } catch (error) {
      console.error('Error opening buy now modal:', error);
      showNotification('error', 'Failed to open product details');
    }
  };

  /**
   * Processes checkout and creates order
   * Handles payment with heartbits
   */
  const handleCheckout = async (selectedItems) => {
    try {
      const response = await suitebiteAPI.checkout({
        items: selectedItems
      });
      if (response.success) {
        // Refresh all data after successful checkout
        await loadShopData();
        setCartVisible(false);
        showNotification('success', 'Order placed successfully! 🎉');
      }
    } catch (error) {
      // Error handling for production - replace console.error with proper logging
      console.error('Error during checkout:', error);
      
      // Show specific error message from backend
      if (error.response?.data?.message) {
        showNotification('error', error.response.data.message);
      } else {
        showNotification('error', 'Checkout failed. Please try again.');
      }
    }
  };

  // Filter and sort products based on current filters
  const filteredAndSortedProducts = products
    .filter(product => {
      // Search filter - matches product name or description
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      // Category filter
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      // Price range filter
      const productPrice = product.price_points || product.price || 0;
      const matchesPrice = productPrice >= priceRange.min && productPrice <= priceRange.max;
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      // Sort products based on selected criteria
      switch (sortBy) {
        case 'price-low':
          const priceA = a.price_points || a.price || 0;
          const priceB = b.price_points || b.price || 0;
          return priceA - priceB;
        case 'price-high':
          const priceHighA = a.price_points || a.price || 0;
          const priceHighB = b.price_points || b.price || 0;
          return priceHighB - priceHighA;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  // Get categories from centralized store
  const categories = getCategoriesForFilter();
  const allCategories = getAllCategories();
  
  // Calculate cart totals
  const cartTotal = cart.reduce((total, item) => total + (item.points_cost * item.quantity), 0);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  /**
   * Resets all filters to default values
   */
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('name');
    setPriceRange({ min: 1, max: 10000 });
    showNotification('info', 'Filters reset');
  };

  /**
   * Renders a color-coded category option
   * @param {string} category - Category name
   * @returns {JSX.Element} Category option with color coding
   */
  const renderCategoryOption = (category) => {
    if (category === 'all') {
      return (
        <option key="all" value="all">
          All Categories
        </option>
      );
    }
    
    return (
      <option key={category} value={category}>
        {category}
      </option>
    );
  };

  /**
   * Renders category filter pills with color coding
   * @returns {JSX.Element} Category filter pills
   */
  const renderCategoryPills = () => {
    return (
      <div className="category-pills flex flex-wrap gap-2 mb-3 sm:mb-4 overflow-x-auto pb-2 sm:pb-0">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`category-pill px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 flex-shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-[#0097b2] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Categories
        </button>
        {allCategories.map(categoryObj => (
          <button
            key={categoryObj.name}
            onClick={() => setSelectedCategory(categoryObj.name)}
            className={`category-pill px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 border flex-shrink-0 ${
              selectedCategory === categoryObj.name
                ? 'text-white'
                : 'text-gray-700 hover:text-white'
            }`}
            style={{
              backgroundColor: selectedCategory === categoryObj.name ? categoryObj.color : 'transparent',
              borderColor: categoryObj.color,
              color: selectedCategory === categoryObj.name ? 'white' : categoryObj.color
            }}
            onMouseEnter={(e) => {
              if (selectedCategory !== categoryObj.name) {
                e.target.style.backgroundColor = categoryObj.color;
                e.target.style.color = 'white';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCategory !== categoryObj.name) {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = categoryObj.color;
              }
            }}
          >
            {categoryObj.name}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="suitebite-shop-tab bg-gray-50">
      {/* Admin heartbits/message grant UI */}
      {isAdmin && (
        <div className="admin-grant-box bg-[#f7f7f7] border border-[#0097b2] rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
          <h3 className="font-bold text-[#0097b2] mb-2 text-sm sm:text-base">Grant Heartbits/Message as Admin</h3>
          <form onSubmit={handleAdminGrant} className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Recipient User ID"
              value={adminGrantUserId}
              onChange={e => setAdminGrantUserId(e.target.value)}
              className="border px-3 py-2 rounded text-sm"
              required
            />
            <textarea
              placeholder="Message to recipient"
              value={adminGrantMessage}
              onChange={e => setAdminGrantMessage(e.target.value)}
              className="border px-3 py-2 rounded text-sm"
              required
            />
            <input
              type="number"
              min={1}
              value={adminGrantPoints}
              onChange={e => setAdminGrantPoints(Number(e.target.value))}
              className="border px-3 py-2 rounded text-sm"
              required
            />
            <button
              type="submit"
              disabled={adminGrantLoading}
              className="bg-[#0097b2] text-white px-3 sm:px-4 py-2 rounded font-bold hover:bg-[#007a8e] text-sm"
            >
              {adminGrantLoading ? 'Sending...' : 'Send as Admin'}
            </button>
          </form>
        </div>
      )}
      {/* Toast Notification System */}
      {notification.show && (
        <div className={`notification-toast fixed top-16 sm:top-20 right-2 sm:right-4 z-50 p-3 sm:p-4 rounded-lg shadow-lg text-xs sm:text-sm font-medium max-w-xs sm:max-w-sm ${
          notification.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : notification.type === 'error'
            ? 'bg-red-50 text-red-800 border border-red-200'
            : 'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Header with Heartbits Display and Cart Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-6">
        {/* User's Heartbits Balance */}
        <div className="heartbits-display bg-[#0097b2] text-white px-3 py-1.5 sm:py-2 rounded-lg w-full sm:w-auto">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-sm sm:text-lg">❤️</span>
            <span className="font-semibold text-sm sm:text-base">{userHeartbits}</span>
            <span className="text-xs sm:text-sm opacity-90">heartbits</span>
          </div>
        </div>
        
        {/* Cart Toggle Button */}
        <button 
          className="cart-btn bg-[#0097b2] text-white px-3 py-1.5 sm:py-2 rounded-lg font-medium hover:bg-[#007a8e] transition-colors duration-200 flex items-center justify-center gap-2 w-full sm:w-auto"
          onClick={() => setCartVisible(!cartVisible)}
        >
          <ShoppingCartIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Cart ({cartItemCount})</span>
        </button>
      </div>

      {/* Shopping Cart Sidebar */}
      {cartVisible && (
        <>
          {/* Overlay backdrop for mobile */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
            onClick={() => setCartVisible(false)}
          />
          
          {/* Cart sidebar */}
          <div className="cart-sidebar-overlay fixed top-0 right-0 h-full w-full max-w-sm sm:max-w-md lg:max-w-lg bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto">
            <ShoppingCart 
              cart={cart}
              userHeartbits={userHeartbits}
              onCheckout={handleCheckout}
              onUpdateCart={loadShopData}
              onAddToCart={handleAddToCart}
              onClose={() => setCartVisible(false)}
              isVisible={cartVisible}
            />
          </div>
        </>
      )}



      {/* Main Content Area */}
      <div className="shop-content flex-1 flex flex-col">
        {/* Products Tab - Main shopping interface */}
        {activeTab === 'products' && (
          <div className="products-section flex-1">
            {/* Search and Filter Controls */}
            <div className="flex flex-col gap-2 mb-3 sm:mb-6">
              {/* Search Input */}
              <div className="flex gap-2 items-center w-full">
                <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>
              
              {/* Compact Filter Row for Mobile */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {/* Category Filter - Compact */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex-shrink-0 px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-xs bg-white min-w-[120px]"
                >
                  {categories.map(renderCategoryOption)}
                </select>
                
                {/* Sort Options - Compact */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-shrink-0 px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-xs bg-white min-w-[100px]"
                >
                  <option value="name">Name</option>
                  <option value="price-low">Price ↑</option>
                  <option value="price-high">Price ↓</option>
                  <option value="category">Category</option>
                </select>
                
                {/* Price Range - Ultra Compact */}
                <div className="flex items-center gap-1 flex-shrink-0 bg-gray-50 px-2 py-1 rounded-md border">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 1 })}
                    className="w-12 px-1 py-0.5 border-none bg-transparent text-xs focus:outline-none"
                    placeholder="1"
                    min="1"
                    max="99999"
                  />
                  <span className="text-gray-400 text-xs">-</span>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 10000 })}
                    className="w-14 px-1 py-0.5 border-none bg-transparent text-xs focus:outline-none"
                    placeholder="10k"
                    min="1"
                    max="100000"
                  />
                </div>
                
                {/* Reset Button - Compact */}
                <button
                  onClick={resetFilters}
                  className="flex-shrink-0 px-2 py-1.5 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors duration-200 text-xs"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Compact Category Pills for Mobile */}
            <div className="mb-3 sm:mb-4">
              <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                    selectedCategory === 'all'
                      ? 'bg-[#0097b2] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {allCategories.slice(0, 6).map(categoryObj => (
                  <button
                    key={categoryObj.name}
                    onClick={() => setSelectedCategory(categoryObj.name)}
                    className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200 border ${
                      selectedCategory === categoryObj.name
                        ? 'text-white'
                        : 'text-gray-700 hover:text-white'
                    }`}
                    style={{
                      backgroundColor: selectedCategory === categoryObj.name ? categoryObj.color : 'transparent',
                      borderColor: categoryObj.color,
                      color: selectedCategory === categoryObj.name ? 'white' : categoryObj.color
                    }}
                  >
                    {categoryObj.name}
                  </button>
                ))}
                {allCategories.length > 6 && (
                  <span className="flex-shrink-0 px-2 py-1 text-xs text-gray-500">+{allCategories.length - 6} more</span>
                )}
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="text-center py-6 sm:py-8">
                <div className="spinner mx-auto"></div>
                <p className="text-gray-600 mt-4 text-sm sm:text-base">Loading products...</p>
              </div>
            ) : filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <ShoppingBagIcon className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 text-sm sm:text-base">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
                {filteredAndSortedProducts.map(product => (
                  <ProductCard
                    key={product.product_id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                    userHeartbits={userHeartbits}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab - Order history interface */}
        {activeTab === 'orders' && (
          <div className="orders-section h-full flex flex-col">
            <OrderHistory onCartUpdate={loadShopData} onHeartbitsUpdate={loadShopData} />
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation mt-2">
        <div className="flex border-b border-gray-200">
          {/* Products Tab */}
          <button
            className={`tab-btn flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors duration-200 ${
              activeTab === 'products'
                ? 'border-[#0097b2] text-[#0097b2]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('products')}
          >
            <ShoppingBagIcon className="h-4 w-4 sm:h-5 sm:w-5 inline mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Products</span>
            <span className="sm:hidden">Shop</span>
          </button>
          
          {/* Orders Tab */}
          <button
            className={`tab-btn flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors duration-200 ${
              activeTab === 'orders'
                ? 'border-[#0097b2] text-[#0097b2]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('orders')}
          >
            <ClipboardDocumentListIcon className="h-4 w-4 sm:h-5 sm:w-5 inline mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Order History</span>
            <span className="sm:hidden">Orders</span>
          </button>
        </div>
      </div>

      {/* Product Detail Modal for Add to Cart / Buy Now */}
      {isModalOpen && modalProduct && (
        <ProductDetailModal
          product={modalProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddToCart={handleAddToCart}
          onBuyNow={async (productId, quantity, variationId, variations) => {
            // Buy Now: Create order directly without adding to cart
            try {
              // Prepare order data
              const orderData = {
                items: [{
                  product_id: productId,
                  quantity: quantity,
                  ...(variationId && { variation_id: variationId }),
                  ...(variations && variations.length > 0 && { variations: variations })
                }]
              };

              // Create order directly
              const response = await suitebiteAPI.checkout(orderData);
              
              if (response.success) {
                showNotification('success', 'Order placed successfully!');
                setIsModalOpen(false);
                await loadShopData(); // Refresh data to update heartbits and order history
              } else {
                showNotification('error', response.message || 'Failed to place order');
              }
            } catch (error) {
              console.error('Error with buy now:', error);
              showNotification('error', 'Buy now failed. Please try again.');
            }
          }}
          userHeartbits={userHeartbits}
          mode={modalMode}
          initialQuantity={modalInitialQuantity}
          initialSelectedOptions={modalInitialSelectedOptions}
        />
      )}
    </div>
  );
};

export default ShopTabContent; 