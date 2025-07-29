import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSuitebiteStore } from '../../store/stores/suitebiteStore';
import useCategoryStore from '../../store/stores/categoryStore';
import { suitebiteAPI } from '../../utils/suitebiteAPI';
import ProductCard from '../../components/suitebite/ProductCard';
import ProductDetailModal from '../../components/suitebite/ProductDetailModal';
import ShoppingCart from '../../components/suitebite/ShoppingCart';
import OrderHistory from '../../components/suitebite/OrderHistory';

import { MagnifyingGlassIcon, FunnelIcon, ShoppingBagIcon, ShoppingCartIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

const SuitebiteShop = () => {
  // Modal state for product details, add to cart, buy now
  const [modalProduct, setModalProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view-details'); // 'add-to-cart' | 'buy-now' | 'view-details'
  const [modalInitialQuantity, setModalInitialQuantity] = useState(1);
  const [modalInitialSelectedOptions, setModalInitialSelectedOptions] = useState({});
  const navigate = useNavigate();
  const {
    products,
    cart,
    userHeartbits,
    setProducts,
    setCart,
    setUserHeartbits
  } = useSuitebiteStore();
  
  const { syncCategoriesFromProducts } = useCategoryStore();

  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(false);
  // Remove showCart, use activeTab === 'cart' instead

  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('name-asc');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [variationOptions, setVariationOptions] = useState([]);
  const [variationTypes, setVariationTypes] = useState([]);

  useEffect(() => {
    loadShopData();
    // Fetch variation options and types on mount
    const fetchVariationData = async () => {
      try {
        const optionsRes = await suitebiteAPI.getVariationOptions();
        if (optionsRes.success) setVariationOptions(optionsRes.options);
        const typesRes = await suitebiteAPI.getVariationTypes();
        if (typesRes.success) setVariationTypes(typesRes.types);
      } catch (e) {
        console.warn('Could not load variation options/types:', e.message);
      }
    };
    fetchVariationData();
  }, []);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
  };

  const loadShopData = async () => {
    try {
      setLoading(true);
      
      const [productsResponse, cartResponse, heartbitsResponse] = await Promise.all([
        suitebiteAPI.getProductsWithVariations('true'), // Get products with variations for shop
        suitebiteAPI.getCart(),
        suitebiteAPI.getUserHeartbits()
      ]);

      if (productsResponse.success) {
        // Map backend product data to match expected frontend structure
        const mappedProducts = productsResponse.products.map(product => ({
          product_id: product.product_id,
          name: product.name || product.product_name,
          description: product.description || product.product_description,
          price_points: product.price || product.price_points,
          category: product.category || product.category_name,
          is_active: product.is_active,
          image_url: product.image_url,
          images: Array.isArray(product.images) ? product.images : [],
          product_images: Array.isArray(product.product_images) ? product.product_images : [],
          variations: Array.isArray(product.variations) ? product.variations : []
        }));
        
        setProducts(mappedProducts);
        // Sync categories from loaded products
        syncCategoriesFromProducts(mappedProducts);
        
        console.log(`✅ Loaded ${mappedProducts.length} active products`); // Debug log
      } else {
        showNotification('error', 'Failed to load products');
        console.error('❌ Products response failed:', productsResponse);
      }

      if (cartResponse.success) {
        // Map backend cart data to match expected frontend structure
        const backendCartItems = cartResponse.data?.cartItems || [];
        console.log('🛒 Raw cart items from backend:', backendCartItems);
        
        const mappedCart = backendCartItems.map(item => {
          console.log('🔍 Processing cart item:', {
            cart_item_id: item.cart_item_id,
            product_name: item.product_name,
            variations: item.variations,
            variation_details: item.variation_details,
            hasVariations: item.variations && Array.isArray(item.variations) && item.variations.length > 0
          });
          
          return {
            cart_item_id: item.cart_item_id, // Use the correct unique identifier
            product_id: item.product_id,
            product_name: item.product_name || item.name,
            points_cost: item.price_points || item.points_cost || item.price,
            quantity: item.quantity,
            image_url: item.image_url,
            images: item.images, // Include images array for cart items
            product_images: item.product_images, // Include product_images from backend
            variation_id: item.variation_id,
            variations: item.variations, // Add support for new variation format
            variation_details: item.variation_details
          };
        });
        
        setCart(mappedCart);
        console.log(`🛒 Loaded ${mappedCart.length} cart items`); // Debug log
      } else {
        console.warn('⚠️ Cart response failed:', cartResponse);
        // Set empty cart on failure
        setCart([]);
      }

      if (heartbitsResponse.success) {
        const heartbits = heartbitsResponse.heartbits_balance || heartbitsResponse.balance || 0;
        setUserHeartbits(heartbits);
        console.log(`💖 User heartbits: ${heartbits}`); // Debug log
      } else {
        console.error('❌ Heartbits response failed:', heartbitsResponse);
        showNotification('error', 'Failed to load heartbits balance');
        // Set 0 heartbits as fallback
        setUserHeartbits(0);
      }
    } catch (error) {
      console.error('Error loading shop data:', error);
      showNotification('error', 'Failed to load shop data');
      // Set fallback values on error
      setProducts([]);
      setCart([]);
      setUserHeartbits(0);
    } finally {
      setLoading(false);
    }
  };

  // Optimized functions for updating specific data (for performance)
  const updateCartAndHeartbits = async () => {
    try {
      const [cartResponse, heartbitsResponse] = await Promise.all([
        suitebiteAPI.getCart(),
        suitebiteAPI.getUserHeartbits()
      ]);

      if (cartResponse.success) {
        const backendCartItems = cartResponse.data?.cartItems || [];
        const mappedCart = backendCartItems.map(item => ({
          cart_item_id: item.cart_item_id,
          product_id: item.product_id,
          product_name: item.product_name || item.name,
          points_cost: item.price_points || item.points_cost || item.price,
          quantity: item.quantity,
          image_url: item.image_url,
          images: item.images,
          product_images: item.product_images,
          variation_id: item.variation_id,
          variations: item.variations,
          variation_details: item.variation_details
        }));
        setCart(mappedCart);
      }

      if (heartbitsResponse.success) {
        const heartbits = heartbitsResponse.heartbits_balance || heartbitsResponse.balance || 0;
        setUserHeartbits(heartbits);
      }
    } catch (error) {
      console.error('Error updating cart and heartbits:', error);
    }
  };

  const updateHeartbitsOnly = async () => {
    try {
      const heartbitsResponse = await suitebiteAPI.getUserHeartbits();
      if (heartbitsResponse.success) {
        const heartbits = heartbitsResponse.heartbits_balance || heartbitsResponse.balance || 0;
        setUserHeartbits(heartbits);
      }
    } catch (error) {
      console.error('Error updating heartbits:', error);
    }
  };

  // Fix: Remove the logic that opens the modal if isModalOpen is true
  const handleAddToCart = async (productId, quantity = 1, variationId = null, variations = []) => {
    try {
      const cartData = { product_id: productId, quantity };
      if (variationId) cartData.variation_id = variationId;
      if (variations && variations.length > 0) {
        cartData.variations = variations;
      }
      const response = await suitebiteAPI.addToCart(cartData);
      if (response.success) {
        setIsModalOpen(false); // Always close modal after add
        await updateCartAndHeartbits(); // Only update cart and heartbits, not products
        showNotification('success', 'Item added to cart! 🛒');
      } else {
        showNotification('error', response.message || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      showNotification('error', 'Failed to add item to cart');
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        await handleRemoveItem(itemId);
        return;
      }

      const response = await suitebiteAPI.updateCartItem(itemId, { quantity: newQuantity });
      
      if (response.success) {
        // Update cart locally
        setCart(prevCart => 
          prevCart.map(item => 
            item.cart_item_id === itemId 
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
        showNotification('success', 'Quantity updated!');
      } else {
        showNotification('error', response.message || 'Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      showNotification('error', 'Failed to update quantity');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const response = await suitebiteAPI.removeFromCart(itemId);
      
      if (response.success) {
        // Remove item from cart locally
        setCart(prevCart => prevCart.filter(item => item.cart_item_id !== itemId));
        showNotification('success', 'Item removed from cart');
      } else {
        showNotification('error', response.message || 'Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      showNotification('error', 'Failed to remove item');
    }
  };

  const handleCheckout = async (selectedItems) => {
    try {
      console.log('CHECKOUT PAYLOAD:', selectedItems);
      const response = await suitebiteAPI.checkout({
        items: selectedItems
      });
      
      if (response.success) {
        // Refresh cart from backend instead of clearing it
        await updateCartAndHeartbits();
        
        showNotification('success', 'Order placed successfully! Awaiting admin approval. 🎉');
        

      } else {
        showNotification('error', response.message || 'Checkout failed');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Show specific error message from backend
      if (error.response?.data?.message) {
        showNotification('error', error.response.data.message);
      } else {
        showNotification('error', 'Checkout failed. Please try again.');
      }
    }
  };

  // Enhanced: Open modal and fetch full product details for Buy Now
  const handleBuyNow = async (productId, quantity = 1, variationId = null, variations = []) => {
    console.log('💳 SuitebiteShop - handleBuyNow called with:', {
      productId,
      quantity,
      variationId,
      variations,
      productIdType: typeof productId,
      quantityType: typeof quantity
    });
    
    try {
      // Fetch full product details including all images
      const res = await suitebiteAPI.getProductById(productId);
      let product = res.success && res.product ? res.product : products.find(p => p.product_id === productId);
      
      if (product) {
        // Always provide images array - ensure we get all product images
        product = {
          ...product,
          images: Array.isArray(product.images) && product.images.length > 0
            ? product.images
            : product.image_url
              ? [{ image_url: product.image_url, alt_text: product.name }]
              : []
        };
        
        console.log('🖼️ Product images for modal:', product.images);
        
        setModalProduct(product);
        setIsModalOpen(true);
        setModalMode('buy-now');
        setModalInitialQuantity(quantity);
        
        // Handle initial selected options from variations array
        const initialOptions = {};
        if (variations && variations.length > 0) {
          variations.forEach(variation => {
            if (variation.type_name && variation.option_id) {
              initialOptions[variation.type_name] = variation.option_id;
            }
          });
        }
        setModalInitialSelectedOptions(initialOptions);
      } else {
        showNotification('error', 'Product not found');
      }
    } catch (error) {
      console.error('Error fetching product for modal:', error);
      showNotification('error', 'Failed to load product details');
    }
  };

  const getCategories = () => {
    const categories = new Set(products.map(product => product.category).filter(Boolean));
    return Array.from(categories).sort();
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortOption('name-asc');
    setPriceRange({ min: 0, max: 5000 });
  };

  // Filter and sort products
  const filteredAndSortedProducts = products
    .filter(product => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(searchLower);
        const matchesDescription = product.description.toLowerCase().includes(searchLower);
        const matchesCategory = product.category.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesDescription && !matchesCategory) return false;
      }
      
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
      
      // Price range filter
      if (product.price_points < priceRange.min || product.price_points > priceRange.max) return false;
      
      return true;
    })
    .sort((a, b) => {
      // Fallbacks for missing fields
      const aName = a.name ?? '';
      const bName = b.name ?? '';
      const aPrice = a.price_points ?? 0;
      const bPrice = b.price_points ?? 0;
      const aCategory = a.category ?? '';
      const bCategory = b.category ?? '';
      switch (sortOption) {
        case 'name-asc':
          return aName.localeCompare(bName);
        case 'name-desc':
          return bName.localeCompare(aName);
        case 'price-asc':
          return aPrice - bPrice;
        case 'price-desc':
          return bPrice - aPrice;
        case 'category-asc':
          return aCategory.localeCompare(bCategory);
        case 'category-desc':
          return bCategory.localeCompare(aCategory);
        default:
          return 0;
      }
    });

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="suitebite-shop-container h-full flex flex-col p-4">
      {/* Navigation Tabs - Fixed */}
      <div className="tabs flex-shrink-0 mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'products'
                ? 'bg-white text-[#0097b2] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShoppingBagIcon className="h-4 w-4" />
            Products
          </button>
          <button
            onClick={() => setActiveTab('cart')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'cart'
                ? 'bg-white text-[#0097b2] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShoppingCartIcon className="h-4 w-4" />
            Cart
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'orders'
                ? 'bg-white text-[#0097b2] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ClipboardDocumentListIcon className="h-4 w-4" />
            Order History
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="content flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="products-tab flex flex-col h-full min-h-0">
            {/* Filters - Fixed */}
            <div className="filters flex-shrink-0 mb-6 bg-white rounded-lg shadow-sm border p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search products..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
                    />
                  </div>
                </div>
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {getCategories().map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      min="0"
                      value={priceRange.min}
                      onChange={e => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                      className="w-1/2 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
                      placeholder="Min"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      min="0"
                      value={priceRange.max}
                      onChange={e => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                      className="w-1/2 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
                      placeholder="Max"
                    />
                  </div>
                </div>
                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort</label>
                  <select
                    value={sortOption}
                    onChange={e => setSortOption(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
                  >
                    <option value="name-asc">Name: A-Z</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="category-asc">Category: A-Z</option>
                  </select>
                </div>
                {/* Reset Filters */}
                <div>
                  <button
                    onClick={resetFilters}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
                {/* Heartbits Balance */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Balance</label>
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                    <span className="text-[#0097b2] font-bold text-lg">{userHeartbits}</span>
                    <span className="text-pink-400 text-lg">💖</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid - Scrollable only */}
            <div className="products-grid-container flex-1 min-h-0 overflow-y-auto">
              <div className="pr-1">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0097b2] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading products...</p>
                  </div>
                ) : filteredAndSortedProducts.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
                    <ShoppingBagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600">Try adjusting your search or filters.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
                    {filteredAndSortedProducts.map(product => {
                      const productWithImages = {
                        ...product,
                        images: Array.isArray(product.product_images) && product.product_images.length > 0
                          ? product.product_images
                          : Array.isArray(product.images) && product.images.length > 0
                            ? product.images
                            : product.image_url
                              ? [{ image_url: product.image_url, alt_text: product.name }]
                              : [],
                        product_images: Array.isArray(product.product_images) ? product.product_images : []
                      };
                      return (
                        <ProductCard
                          key={product.product_id}
                          product={productWithImages}
                          onAddToCart={() => {
                            setModalProduct(productWithImages);
                            setIsModalOpen(true);
                            setModalMode('add-to-cart');
                            setModalInitialQuantity(1);
                            setModalInitialSelectedOptions({});
                          }}
                          onBuyNow={() => {
                            setModalProduct(productWithImages);
                            setIsModalOpen(true);
                            setModalMode('buy-now');
                            setModalInitialQuantity(1);
                            setModalInitialSelectedOptions({});
                          }}
                          userHeartbits={userHeartbits}
                        />
                      );
                    })}
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
                await updateHeartbitsOnly(); // Only update heartbits after order
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
                )}
              </div>
            </div>
          </div>
        )}

        {/* Cart Tab */}
        {activeTab === 'cart' && (
          <div className="cart-tab h-full overflow-y-auto">
            <ShoppingCart
              cart={cart}
              userHeartbits={userHeartbits}
              onCheckout={handleCheckout}
              onClose={() => setActiveTab('products')}
              onUpdateCart={loadShopData}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onAddToCart={handleAddToCart}
              isVisible={true}
              variationOptions={variationOptions}
              variationTypes={variationTypes}
            />
          </div>
        )}

        {/* Order History Tab */}
        {activeTab === 'orders' && (
          <div className="orders-tab h-full overflow-y-auto">
            <OrderHistory onCartUpdate={loadShopData} onHeartbitsUpdate={loadShopData} />
          </div>
        )}
      </div>



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
  );
};

export default SuitebiteShop;
