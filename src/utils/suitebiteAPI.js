import axios from 'axios';
import config from '../config';

const API_BASE_URL = `${config.apiBaseUrl}/api/suitebite`;

// Create axios instance with auth header
const createAuthHeaders = () => {
  const token = localStorage.getItem('token');
  
  if (token) {
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    };
  } else {
    // Fallback to cookie-based authentication if no token in localStorage
    return {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      withCredentials: true
    };
  }
};

export const suitebiteAPI = {
  // ========== CHEER POSTS ==========
  
  createCheerPost: async (postData) => {
    const response = await axios.post(`${API_BASE_URL}/cheers/post`, postData, createAuthHeaders());
    return response.data;
  },
  
  getCheerFeed: async (page = 1, limit = 20) => {
    const timestamp = Date.now();
    const response = await axios.get(`${API_BASE_URL}/cheers/feed?page=${page}&limit=${limit}&_t=${timestamp}`, createAuthHeaders());
    return response.data;
  },
  
  getCheerPost: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/cheers/post/${id}`, createAuthHeaders());
    return response.data;
  },
  
  addCheerComment: async (commentData) => {
    const response = await axios.post(`${API_BASE_URL}/cheers/comment`, commentData, createAuthHeaders());
    return response.data;
  },
  
  toggleCheerLike: async (likeData) => {
    const response = await axios.post(`${API_BASE_URL}/cheers/like`, likeData, createAuthHeaders());
    return response.data;
  },
  
  // ========== SHOP & PRODUCTS ==========
  
  // ========== PRODUCTS ENDPOINTS ==========
  
  getAllProducts: async (activeOnly = 'true') => {
    const response = await axios.get(`${API_BASE_URL}/products?active_only=${activeOnly}`, createAuthHeaders());
    return response.data;
  },
  
  getProductById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`, createAuthHeaders());
    return response.data;
  },
  
  checkProductOrderUsage: async (productId) => {
    const response = await axios.get(`${API_BASE_URL}/products/${productId}/order-usage`, createAuthHeaders());
    return response.data;
  },
  
  // ========== CART ==========
  
  getCart: async () => {
    const response = await axios.get(`${API_BASE_URL}/cart`, createAuthHeaders());
    return response.data;
  },
  
  addToCart: async (cartData) => {
    // Support both old and new variation formats
    const requestData = {
      product_id: cartData.product_id,
      quantity: cartData.quantity || 1,
      variations: cartData.variations || [],
      variation_id: cartData.variation_id || null // Legacy support
    };
    
    const response = await axios.post(`${API_BASE_URL}/cart/add`, requestData, createAuthHeaders());
    return response.data;
  },
  
  updateCartItem: async (itemId, updateData) => {
    const response = await axios.put(`${API_BASE_URL}/cart/update/${itemId}`, updateData, createAuthHeaders());
    return response.data;
  },
  
  removeFromCart: async (itemId) => {
    const response = await axios.delete(`${API_BASE_URL}/cart/remove/${itemId}`, createAuthHeaders());
    return response.data;
  },
  
  clearCart: async () => {
    const response = await axios.delete(`${API_BASE_URL}/cart/clear`, createAuthHeaders());
    return response.data;
  },

  // ========== PRODUCT VARIATIONS ==========
  
  // Get all variation types
  getVariationTypes: async () => {
    const response = await axios.get(`${API_BASE_URL}/variations/types`, createAuthHeaders());
    return response.data;
  },
  
  // Get variation options (optionally filtered by type)
  getVariationOptions: async (variationTypeId = null) => {
    const params = variationTypeId ? { variation_type_id: variationTypeId } : {};
    const response = await axios.get(`${API_BASE_URL}/variations/options`, {
      ...createAuthHeaders(),
      params
    });
    return response.data;
  },
  
  // Get product variations for a specific product
  getProductVariations: async (productId) => {
    const response = await axios.get(`${API_BASE_URL}/products/${productId}/variations`, createAuthHeaders());
    return response.data;
  },
  
  // Get products with their variations for shop display
  getProductsWithVariations: async (activeOnly = 'true', category = null) => {
    const params = new URLSearchParams({ active_only: activeOnly });
    if (category && category !== 'all') {
      params.append('category', category);
    }
    const response = await axios.get(`${API_BASE_URL}/products/with-variations?${params.toString()}`, createAuthHeaders());
    return response.data;
  },

  // ========== ADMIN VARIATION MANAGEMENT ==========
  
  // Add new variation type (Admin only)
  addVariationType: async (typeData) => {
    const response = await axios.post(`${API_BASE_URL}/admin/variations/types`, typeData, createAuthHeaders());
    return response.data;
  },
  
  // Add new variation option (Admin only)
  addVariationOption: async (optionData) => {
    const response = await axios.post(`${API_BASE_URL}/admin/variations/options`, optionData, createAuthHeaders());
    return response.data;
  },
  
  // Add product variation (Admin only)
  addProductVariation: async (variationData) => {
    const response = await axios.post(`${API_BASE_URL}/admin/variations/products`, variationData, createAuthHeaders());
    return response.data;
  },
  
  // Update product variation (Admin only)
  updateProductVariation: async (variationId, updateData) => {
    const response = await axios.put(`${API_BASE_URL}/admin/variations/products/${variationId}`, updateData, createAuthHeaders());
    return response.data;
  },
  
  // Delete product variation (Admin only)
  deleteProductVariation: async (variationId) => {
    const response = await axios.delete(`${API_BASE_URL}/admin/variations/products/${variationId}`, createAuthHeaders());
    return response.data;
  },
  
  // Delete variation type (Admin only)
  deleteVariationType: async (variationTypeId) => {
    const response = await axios.delete(`${API_BASE_URL}/admin/variations/types/${variationTypeId}`, createAuthHeaders());
    return response.data;
  },

  // Delete variation option (Admin only)
  deleteVariationOption: async (optionId) => {
    const response = await axios.delete(`${API_BASE_URL}/admin/variations/options/${optionId}`, createAuthHeaders());
    return response.data;
  },
  
  // ========== ORDERS ==========
  
  checkout: async (orderData) => {
    const response = await axios.post(`${API_BASE_URL}/orders/checkout`, orderData, createAuthHeaders());
    return response.data;
  },
  
  getOrderHistory: async () => {
    const response = await axios.get(`${API_BASE_URL}/orders/history`, createAuthHeaders());
    return response.data;
  },
  
  getOrderById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/orders/${id}`, createAuthHeaders());
    return response.data;
  },

  cancelOrder: async (orderId, reason) => {
    const response = await axios.put(`${API_BASE_URL}/orders/${orderId}/cancel`, { reason }, createAuthHeaders());
    return response.data;
  },

  // Admin order management
  getAllOrders: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    
    const response = await axios.get(`${API_BASE_URL}/admin/orders?${params}`, createAuthHeaders());
    return response.data;
  },

  approveOrder: async (orderId) => {
    const response = await axios.put(`${API_BASE_URL}/admin/orders/${orderId}/approve`, {}, createAuthHeaders());
    return response.data;
  },

  completeOrder: async (orderId) => {
    const response = await axios.put(`${API_BASE_URL}/admin/orders/${orderId}/complete`, {}, createAuthHeaders());
    return response.data;
  },

  deleteOrder: async (orderId, reason) => {
    const response = await axios.delete(`${API_BASE_URL}/admin/orders/${orderId}`, {
      ...createAuthHeaders(),
      data: { reason }
    });
    return response.data;
  },
  
  // ========== LEADERBOARD ==========
  
  getLeaderboard: async (type = 'received', period = 'all') => {
    const timestamp = Date.now();
    const response = await axios.get(`${API_BASE_URL}/leaderboard?type=${type}&period=${period}&_t=${timestamp}`, createAuthHeaders());
    return response.data;
  },
  
  getMonthlyLeaderboard: async () => {
    const response = await axios.get(`${API_BASE_URL}/leaderboard/monthly`, createAuthHeaders());
    return response.data;
  },
  
  getCheerLeaderboard: async (params = {}) => {
    // Accepts params: { timePeriod, leaderboardType, startDate, endDate }
    const {
      timePeriod = 'month',
      leaderboardType = 'receivers',
      startDate,
      endDate
    } = params;

    // Map to backend expected query params
    const type = leaderboardType === 'givers' ? 'given' : 'received';
    const period =
      timePeriod === 'all-time'
        ? 'all'
        : timePeriod === 'monthly'
        ? 'month'
        : timePeriod === 'weekly'
        ? 'week'
        : timePeriod === 'daily'
        ? 'day'
        : timePeriod;

    let url = `${API_BASE_URL}/leaderboard?type=${type}&period=${period}`;
    if (startDate) url += `&start_date=${encodeURIComponent(startDate)}`;
    if (endDate) url += `&end_date=${encodeURIComponent(endDate)}`;

    const response = await axios.get(url, createAuthHeaders());
    return response.data;
  },
  
  // ========== USER HEARTBITS ==========
  
  getUserHeartbits: async () => {
    const timestamp = Date.now();
    const response = await axios.get(`${API_BASE_URL}/heartbits?_t=${timestamp}`, createAuthHeaders());
    return response.data;
  },
  
  searchUsers: async (searchTerm) => {
    const response = await axios.get(`${API_BASE_URL}/users/search?q=${encodeURIComponent(searchTerm)}`, createAuthHeaders());
    return response.data;
  },
  
  getMonthlyLimits: async () => {
    const timestamp = Date.now();
    const response = await axios.get(`${API_BASE_URL}/limits/monthly?_t=${timestamp}`, createAuthHeaders());
    return response.data;
  },

  // Add missing function for peers who cheered
  getPeersWhoCheered: async () => {
    const timestamp = Date.now();
    const response = await axios.get(`${API_BASE_URL}/peers/cheered?_t=${timestamp}`, createAuthHeaders());
    return response.data;
  },

  // ========== ADMIN ENDPOINTS ==========
  
  // Product Management (Admin)
  addProduct: async (productData) => {
    const response = await axios.post(`${API_BASE_URL}/products`, productData, createAuthHeaders());
    return response.data;
  },
  
  updateProduct: async (id, productData) => {
    const response = await axios.put(`${API_BASE_URL}/products/${id}`, productData, createAuthHeaders());
    return response.data;
  },
  
  deleteProduct: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/products/${id}`, createAuthHeaders());
    return response.data;
  },

  // ========== CATEGORIES ENDPOINTS ==========
  
  getAllCategories: async () => {
    const response = await axios.get(`${API_BASE_URL}/categories`, createAuthHeaders());
    return response.data;
  },
  
  getCategoryById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/categories/${id}`, createAuthHeaders());
    return response.data;
  },
  
  addCategory: async (categoryData) => {
    const response = await axios.post(`${API_BASE_URL}/categories`, categoryData, createAuthHeaders());
    return response.data;
  },
  
  updateCategory: async (id, categoryData) => {
    const response = await axios.put(`${API_BASE_URL}/categories/${id}`, categoryData, createAuthHeaders());
    return response.data;
  },
  
  deleteCategory: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/categories/${id}`, createAuthHeaders());
    return response.data;
  },
  
  // Admin Management
  getCheerPostsAdmin: async (page = 1, limit = 20, search = '', dateFrom = '', dateTo = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(dateFrom && { date_from: dateFrom }),
      ...(dateTo && { date_to: dateTo })
    });
    const response = await axios.get(`${API_BASE_URL}/admin/cheers?${params}`, createAuthHeaders());
    return response.data;
  },
  
  deleteCheerPost: async (id, reason) => {
    const response = await axios.delete(`${API_BASE_URL}/admin/cheers/${id}`, {
      ...createAuthHeaders(),
      data: { reason }
    });
    return response.data;
  },
  
  moderateCheerPost: async (id, action, reason) => {
    const response = await axios.put(`${API_BASE_URL}/admin/cheers/${id}/moderate`, 
      { action, reason }, 
      createAuthHeaders()
    );
    return response.data;
  },
  
  getUsersWithHeartbits: async (page = 1, limit = 50, search = '', sortBy = 'total_heartbits') => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      sort_by: sortBy
    });
    const response = await axios.get(`${API_BASE_URL}/admin/users/heartbits?${params}`, createAuthHeaders());
    return response.data;
  },
  
  updateUserHeartbits: async (userId, amount, reason) => {
    const action = amount >= 0 ? "add" : "subtract";
    const heartbits = Math.abs(amount);
    
    const response = await axios.put(`${API_BASE_URL}/admin/heartbits`, 
      { user_id: userId, heartbits, action, reason }, 
      createAuthHeaders()
    );
    return response.data;
  },
  
  setMonthlyLimit: async (userId, limit, monthYear) => {
    const response = await axios.put(`${API_BASE_URL}/admin/users/${userId}/limit`, 
      { limit, month_year: monthYear }, 
      createAuthHeaders()
    );
    return response.data;
  },
  
  resetUserMonthlyStats: async (userId, monthYear) => {
    const response = await axios.put(`${API_BASE_URL}/admin/users/${userId}/reset-monthly`, 
      { month_year: monthYear }, 
      createAuthHeaders()
    );
    return response.data;
  },
  
  getUserAnalytics: async (userId, period = 'month') => {
    const response = await axios.get(`${API_BASE_URL}/admin/users/${userId}/analytics?period=${period}`, createAuthHeaders());
    return response.data;
  },
  
  bulkUpdateHeartbits: async (userIds, amount, reason) => {
    const updates = userIds.map(userId => ({
      user_id: userId,
      heartbits: amount,
      reason
    }));
    
    const response = await axios.put(`${API_BASE_URL}/admin/heartbits/bulk-update`, 
      { updates }, 
      createAuthHeaders()
    );
    return response.data;
  },
  
  getSystemStats: async (period = 'month') => {
    const response = await axios.get(`${API_BASE_URL}/admin/stats?period=${period}`, createAuthHeaders());
    return response.data;
  },
  
  getSystemConfiguration: async () => {
    const response = await axios.get(`${API_BASE_URL}/admin/config`, createAuthHeaders());
    return response.data;
  },
  
  updateSystemConfiguration: async (key, value, reason) => {
    const response = await axios.put(`${API_BASE_URL}/admin/config`, 
      { key, value, reason }, 
      createAuthHeaders()
    );
    return response.data;
  },
  
  getAdvancedAnalytics: async (period = 'month', metric = 'all') => {
    const response = await axios.get(`${API_BASE_URL}/admin/analytics?period=${period}&metric=${metric}`, createAuthHeaders());
    return response.data;
  },

  // Add this function for cheer analytics
  getCheerAnalytics: async (params = {}) => {
    const { period = 'month', metric = 'all' } = params;
    const response = await axios.get(`${API_BASE_URL}/admin/analytics?period=${period}&metric=${metric}`, createAuthHeaders());
    return response.data;
  },
  
  getSystemHealthCheck: async () => {
    const response = await axios.get(`${API_BASE_URL}/admin/health`, createAuthHeaders());
    return response.data;
  },
  
  getAdminActionLogs: async (page = 1, limit = 50, adminId = '', actionType = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(adminId && { admin_id: adminId }),
      ...(actionType && { action_type: actionType })
    });
    const response = await axios.get(`${API_BASE_URL}/admin/logs?${params}`, createAuthHeaders());
    return response.data;
  },
  
  getAllOrders: async () => {
    const response = await axios.get(`${API_BASE_URL}/admin/orders`, createAuthHeaders());
    return response.data;
  },
  
  // ========== SUPER ADMIN ENDPOINTS ==========
  
  getSystemConfiguration: async () => {
    const response = await axios.get(`${API_BASE_URL}/admin/config`, createAuthHeaders());
    return response.data;
  },
  
  updateSystemConfiguration: async (configKey, configValue, description) => {
    const response = await axios.put(`${API_BASE_URL}/admin/config`, 
      { config_key: configKey, config_value: configValue, description }, 
      createAuthHeaders()
    );
    return response.data;
  },
  
  getAllAdminUsers: async (page = 1, limit = 50, search = '', status = 'all') => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(status !== 'all' && { status })
    });
    const response = await axios.get(`${API_BASE_URL}/superadmin/users?${params}`, createAuthHeaders());
    return response.data;
  },
  
  promoteToAdmin: async (userId, role = 'admin') => {
    const response = await axios.put(`${API_BASE_URL}/superadmin/users/${userId}/promote`, 
      { role }, 
      createAuthHeaders()
    );
    return response.data;
  },
  
  demoteFromAdmin: async (userId) => {
    const response = await axios.put(`${API_BASE_URL}/superadmin/users/${userId}/demote`, 
      {}, 
      createAuthHeaders()
    );
    return response.data;
  },
  
  suspendUser: async (userId, reason, duration = null) => {
    const response = await axios.put(`${API_BASE_URL}/superadmin/users/${userId}/suspend`, 
      { reason, duration }, 
      createAuthHeaders()
    );
    return response.data;
  },
  
  unsuspendUser: async (userId) => {
    const response = await axios.put(`${API_BASE_URL}/superadmin/users/${userId}/unsuspend`, 
      {}, 
      createAuthHeaders()
    );
    return response.data;
  },
  
  getSystemAuditLogs: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await axios.get(`${API_BASE_URL}/superadmin/audit-logs?${params}`, createAuthHeaders());
    return response.data;
  },
  
  getAdvancedSystemAnalytics: async () => {
    const response = await axios.get(`${API_BASE_URL}/superadmin/analytics`, createAuthHeaders());
    return response.data;
  },
  
  performSystemMaintenance: async (action, options = {}) => {
    const response = await axios.post(`${API_BASE_URL}/superadmin/maintenance`, 
      { action, options }, 
      createAuthHeaders()
    );
    return response.data;
  },
  
  exportSystemData: async (dataType, format = 'json') => {
    const response = await axios.post(`${API_BASE_URL}/superadmin/export`, 
      { data_type: dataType, format }, 
      createAuthHeaders()
    );
    return response.data;
  },

  // ========== PRODUCT IMAGE MANAGEMENT ==========

  /**
   * Get all images for a product
   * @param {string} productId - Product ID
   * @returns {Promise} Response with images array
   */
  getProductImages: async (productId) => {
    const response = await axios.get(
      `${API_BASE_URL}/products/${productId}/images`,
      createAuthHeaders()
    );
    return response.data;
  },

  /**
   * Add a new image to a product
   * @param {string} productId - Product ID
   * @param {Object} imageData - Image data (image_url, thumbnail_url, etc.)
   * @returns {Promise} Response with image ID
   */
  addProductImage: async (productId, imageData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/products/${productId}/images`,
        imageData,
        createAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('🔍 API - Add product image error:', error);
      console.error('🔍 API - Error response:', error.response?.data);
      console.error('🔍 API - Error status:', error.response?.status);
      throw error;
    }
  },

  /**
   * Update a product image
   * @param {string} imageId - Image ID
   * @param {Object} updateData - Update data
   * @returns {Promise} Response
   */
  updateProductImage: async (imageId, updateData) => {
    const response = await axios.put(
      `${API_BASE_URL}/products/images/${imageId}`,
      updateData,
      createAuthHeaders()
    );
    return response.data;
  },

  /**
   * Delete a product image
   * @param {string} imageId - Image ID
   * @returns {Promise} Response
   */
  deleteProductImage: async (imageId) => {
    console.log('🔍 API - deleteProductImage called with imageId:', imageId);
    console.log('🔍 API - API_BASE_URL:', API_BASE_URL);
    console.log('🔍 API - Full URL:', `${API_BASE_URL}/products/images/${imageId}`);
    console.log('🔍 API - Environment check - VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
    console.log('🔍 API - Headers:', createAuthHeaders());
    
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/products/images/${imageId}`,
        createAuthHeaders()
      );
      console.log('🔍 API - Delete response:', response.data);
      return response.data;
    } catch (error) {
      console.error('🔍 API - Delete error:', error);
      console.error('🔍 API - Error response:', error.response?.data);
      console.error('🔍 API - Error status:', error.response?.status);
      throw error;
    }
  },

  /**
   * Reorder product images
   * @param {string} productId - Product ID
   * @param {Array} imageIds - Array of image IDs in new order
   * @returns {Promise} Response
   */
  reorderProductImages: async (productId, imageIds) => {
    const response = await axios.put(
      `${API_BASE_URL}/products/${productId}/images/reorder`,
      { imageIds },
      createAuthHeaders()
    );
    return response.data;
  },

  /**
   * Set primary image for a product
   * @param {string} imageId - Image ID to set as primary
   * @returns {Promise} Response
   */
  setPrimaryImage: async (imageId) => {
    const response = await axios.put(
      `${API_BASE_URL}/products/images/${imageId}/primary`,
      {},
      createAuthHeaders()
    );
    return response.data;
  },

  /**
   * Upload a single product image
   * @param {string} productId - Product ID
   * @param {File} imageFile - Image file to upload
   * @returns {Promise} Response with image URLs
   */
  uploadProductImage: async (productId, imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await axios.post(
      `${API_BASE_URL}/products/${productId}/image`, 
      formData,
      {
        ...createAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    );
    return response.data;
  },

  /**
   * Upload multiple product images (up to 10 files)
   * @param {string} productId - Product ID
   * @param {FileList|Array} imageFiles - Array of image files (max 10)
   * @returns {Promise} Response with image URLs
   */
  uploadMultipleProductImages: async (productId, imageFiles) => {
    const formData = new FormData();
    
    // Handle both FileList and Array
    const files = Array.from(imageFiles);
    
    // Limit to 10 files
    const limitedFiles = files.slice(0, 10);
    
    limitedFiles.forEach(file => {
      formData.append('images', file);
    });
    
    const response = await axios.post(
      `${API_BASE_URL}/products/${productId}/images`, 
      formData,
      {
        ...createAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    );
    return response.data;
  },

  /**
   * Upload a single image to Cloudinary for new products (no productId required)
   * @param {File} imageFile - Image file to upload
   * @param {string} folder - Cloudinary folder (e.g. 'products')
   * @returns {Promise} Response with imageUrl
   */
  uploadGenericProductImage: async (imageFile, folder = 'products') => {
    console.log('🚀 API - uploadGenericProductImage called');
    console.log('- File name:', imageFile.name);
    console.log('- File type:', imageFile.type);
    console.log('- File size:', imageFile.size);
    console.log('- Folder:', folder);
    
    const formData = new FormData();
    formData.append('file', imageFile);
    
    // Use the correct API endpoint (cloudinary routes are mounted at /api, not /api/suitebite)
    const uploadUrl = `${config.apiBaseUrl}/api/upload-image/${folder}`;
    console.log('- Upload URL:', uploadUrl);
    
    // Get auth headers but DON'T override Content-Type for file upload - let browser set it
    const authHeaders = createAuthHeaders();
    const uploadHeaders = {
      ...authHeaders.headers
      // Don't set Content-Type manually for FormData - browser will set it with boundary
    };
    delete uploadHeaders['Content-Type']; // Remove if it exists
    console.log('- Headers:', Object.keys(uploadHeaders));
    
    try {
      console.log('- Making POST request...');
      const response = await axios.post(
        uploadUrl,
        formData,
        {
          headers: uploadHeaders,
          withCredentials: authHeaders.withCredentials
        }
      );
      console.log('- Response status:', response.status);
      console.log('- Response data:', response.data);
      return response.data;
    } catch (error) {
      console.error('🔍 API - Upload error:', error);
      console.error('🔍 API - Error response:', error.response?.data);
      console.error('🔍 API - Error status:', error.response?.status);
      throw error;
    }
  },



  /**
   * Get optimized image URL
   * @param {string} publicId - Cloudinary public ID
   * @param {Object} options - Transformation options (width, height, crop, quality)
   * @returns {Promise} Response with optimized URL
   */
  getOptimizedImageUrl: async (publicId, options = {}) => {
    const params = new URLSearchParams(options);
    const response = await axios.get(
      `${API_BASE_URL}/images/${publicId}/optimize?${params}`
    );
    return response.data;
  },

  /**
   * Validate image file before upload
   * @param {File} file - Image file to validate
   * @returns {Object} Validation result
   */
  validateImageFile: (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const maxFiles = 10; // Maximum 10 files
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    const validation = {
      isValid: true,
      errors: []
    };
    
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      validation.isValid = false;
      validation.errors.push('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.');
    }
    
    // Check file size
    if (file.size > maxSize) {
      validation.isValid = false;
      validation.errors.push('File size too large. Maximum size is 10MB.');
    }
    
    // Check if file exists
    if (!file || file.size === 0) {
      validation.isValid = false;
      validation.errors.push('No file selected or file is empty.');
    }
    
    return validation;
  },

  /**
   * Generate thumbnail URL from Cloudinary URL
   * @param {string} imageUrl - Original Cloudinary URL
   * @param {number} size - Thumbnail size (default: 300)
   * @returns {string} Thumbnail URL
   */
  generateThumbnailUrl: (imageUrl, size = 300) => {
    if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
      return imageUrl; // Return original if not a Cloudinary URL
    }
    
    // Insert transformation parameters into Cloudinary URL
    const transformation = `c_fill,w_${size},h_${size},q_auto,f_auto`;
    return imageUrl.replace('/upload/', `/upload/${transformation}/`);
  },

  /**
   * Generate responsive image URLs
   * @param {string} imageUrl - Original Cloudinary URL
   * @returns {Object} Object with different sizes
   */
  generateResponsiveImageUrls: (imageUrl) => {
    if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
      return {
        thumbnail: imageUrl,
        small: imageUrl,
        medium: imageUrl,
        large: imageUrl,
        original: imageUrl
      };
    }
    
    const baseTransform = 'q_auto,f_auto';
    
    return {
      thumbnail: imageUrl.replace('/upload/', `/upload/c_fill,w_150,h_150,${baseTransform}/`),
      small: imageUrl.replace('/upload/', `/upload/c_fill,w_300,h_300,${baseTransform}/`),
      medium: imageUrl.replace('/upload/', `/upload/c_limit,w_600,h_600,${baseTransform}/`),
      large: imageUrl.replace('/upload/', `/upload/c_limit,w_1200,h_1200,${baseTransform}/`),
      original: imageUrl
    };
  },

  triggerMonthlyReset: async () => {
    try {
      // Try admin endpoint first
      const response = await axios.post(`${API_BASE_URL}/admin/monthly-reset`, {}, createAuthHeaders());
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        // If admin endpoint fails, try superadmin endpoint
        const superAdminResponse = await axios.post(`${API_BASE_URL}/superadmin/monthly-reset`, {}, createAuthHeaders());
        return superAdminResponse.data;
      }
      throw error;
    }
  }
};
