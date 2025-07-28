import React, { useState, useEffect } from 'react';
import { suitebiteAPI } from '../../../utils/suitebiteAPI';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  PhotoIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  DocumentArrowDownIcon,
  ChartBarIcon,
  CubeIcon,
  CheckCircleIcon,
  XCircleIcon,
  CloudArrowUpIcon,
  SwatchIcon,
} from '@heroicons/react/24/outline';
import useCategoryStore from '../../../store/stores/categoryStore';
import AddProductForm from './AddProductForm';

/**
 * ProductManagement Component - Enhanced with Variations Support
 * 
 * Combined product and variation management interface.
 * Features include:
 * - Product CRUD operations with color-coded categories
 * - Variation integration for sizes, colors, styles, etc.
 * - Advanced filtering and search
 * - Image upload functionality
 * - Dynamic category management with color coding
 */
const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  
  // Enhanced category store with color coding
  const { 
    getAllCategories, 
    getCategoriesForFilter, 
    getCategoryColor, 
    getCategoryBgColor,
    getCategoryByName,
    addCategory,
    syncCategoriesFromProducts 
  } = useCategoryStore();

  // Form state for add/edit modal
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_points: '',
    category: '',
    image_url: ''
  });

  // File upload state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Variation state
  const [variationTypes, setVariationTypes] = useState([]);
  const [variationOptions, setVariationOptions] = useState([]);
  const [selectedVariations, setSelectedVariations] = useState([]);
  const [showVariationsModal, setShowVariationsModal] = useState(false);

  useEffect(() => {
    loadProducts();
    loadVariationData();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await suitebiteAPI.getAllProducts(false); // Include inactive products
      
      if (response.success) {
        setProducts(response.products || []);
        // Sync categories from products
        syncCategoriesFromProducts(response.products || []);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      showNotification('error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadVariationData = async () => {
    try {
      const [typesResponse, optionsResponse] = await Promise.all([
        suitebiteAPI.getVariationTypes(),
        suitebiteAPI.getVariationOptions()
      ]);

      if (typesResponse.success) {
        setVariationTypes(typesResponse.variation_types || []);
      }
      if (optionsResponse.success) {
        setVariationOptions(optionsResponse.variation_options || []);
      }
    } catch (error) {
      console.error('Error loading variation data:', error);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
  };

  const handleAddProduct = () => {
    setModalMode('add');
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price_points: product.price || product.price_points || '', // Handle both price and price_points
      category: product.category || '',
      image_url: product.image_url || ''
    });
    setSelectedVariations([]);
    setImageFile(null);
    setImagePreview(product.image_url || '');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      let submitData = { ...formData };
      
      // Handle image upload if file is selected
      if (imageFile) {
        // This would typically upload to Cloudinary or similar service
        // For now, we'll use a placeholder
        submitData.image_url = imagePreview;
      }
      
      let response;
      if (modalMode === 'add') {
        response = await suitebiteAPI.addProduct(submitData);
        
        // If variations are selected, add them to the product
        if (response.success && selectedVariations.length > 0) {
          for (const variation of selectedVariations) {
            try {
              await suitebiteAPI.addProductVariation({
                product_id: response.product.product_id,
                variation_option_ids: variation.optionIds,
                price_adjustment: variation.priceAdjustment || 0,
                sku_suffix: variation.skuSuffix || ''
              });
            } catch (variationError) {
              console.warn('Failed to add variation:', variationError);
            }
          }
        }
      } else {
        response = await suitebiteAPI.updateProduct(selectedProduct.product_id, submitData);
      }
      
      if (response.success) {
        showNotification('success', `Product ${modalMode === 'add' ? 'added' : 'updated'} successfully`);
        setShowModal(false);
        await loadProducts();
      } else {
        showNotification('error', response.message || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      showNotification('error', 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await suitebiteAPI.deleteProduct(productId);
      if (response.success) {
        showNotification('success', 'Product deleted successfully');
        await loadProducts();
      } else {
        showNotification('error', 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showNotification('error', 'Failed to delete product');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddCategory = async () => {
    const newCategory = prompt('Enter new category name:');
    if (newCategory && newCategory.trim()) {
      try {
        const response = await suitebiteAPI.addCategory({
          category_name: newCategory.trim(),
          category_description: `${newCategory.trim()} products`,
          is_active: true
        });
        
        if (response.success) {
          addCategory(newCategory.trim());
          showNotification('success', `Category "${newCategory}" added successfully`);
          await loadProducts(); // Refresh to sync categories
        } else {
          showNotification('error', 'Failed to add category');
        }
      } catch (error) {
        console.error('Error adding category:', error);
        showNotification('error', 'Failed to add category');
      }
    }
  };

  // Get all categories for filter dropdown
  const categories = getCategoriesForFilter();
  const allCategories = getAllCategories();

  // Filter and sort products - Fixed to handle price correctly
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Handle price field correctly
      if (sortBy === 'price_points' || sortBy === 'price') {
        aValue = Number(a.price || a.price_points) || 0;
        bValue = Number(b.price || b.price_points) || 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  /**
   * Renders a color-coded category badge
   * @param {string} categoryName - Category name
   * @returns {JSX.Element} Colored category badge
   */
  const renderCategoryBadge = (categoryName) => {
    if (!categoryName) return <span className="text-gray-400">No category</span>;
    
    const categoryColor = getCategoryColor(categoryName);
    const categoryBgColor = getCategoryBgColor(categoryName);
    
    return (
      <span 
        className={`px-2 py-1 rounded-full text-xs font-medium ${categoryBgColor} ${categoryColor}`}
      >
        {categoryName}
      </span>
    );
  };

  /**
   * Renders category option for dropdown with color indicator
   * @param {string} category - Category name
   * @returns {JSX.Element} Category option element
   */
  const renderCategoryOption = (category) => {
    const isAllOption = category === 'all';
    
    return (
      <option key={category} value={category}>
        {isAllOption ? 'All Categories' : category}
      </option>
    );
  };

  /**
   * Renders category selection for product form
   */
  const renderCategoryFormSelection = () => {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
        >
          <option value="">Select a category</option>
          {allCategories.map(categoryObj => (
            <option key={categoryObj.name} value={categoryObj.name}>
              {categoryObj.name}
            </option>
          ))}
        </select>
        
        {/* Category preview */}
        {formData.category && (
          <div className="mt-2">
            <span className="text-sm text-gray-600">Preview: </span>
            {renderCategoryBadge(formData.category)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="product-management-container bg-white rounded-lg shadow-sm">
      {/* Toast Notification */}
      {notification.show && (
        <div className={`notification-toast fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg text-sm font-medium max-w-sm ${
          notification.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : notification.type === 'error'
            ? 'bg-red-50 text-red-800 border border-red-200'
            : 'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Filters and Search */}
      <div className="filters-section sticky top-0 z-10 bg-white pb-1">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          {/* Search */}
          <div className="search-field">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="category-filter">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
            >
              {categories.map(renderCategoryOption)}
            </select>
          </div>

          {/* Sort By */}
          <div className="sort-field">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
            >
              <option key="name" value="name">Sort by Name</option>
              <option key="price_points" value="price_points">Sort by Price</option>
              <option key="category" value="category">Sort by Category</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="sort-order">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
            >
              <option key="asc" value="asc">Ascending</option>
              <option key="desc" value="desc">Descending</option>
            </select>
          </div>

          {/* Add Product Button - moved here */}
          <div className="flex justify-end md:col-span-1">
            <button
              onClick={handleAddProduct}
              className="bg-[#0097b2] text-white px-4 py-2 rounded-lg hover:bg-[#007a8e] transition-colors duration-200 flex items-center gap-2 w-full md:w-auto"
            >
              <PlusIcon className="h-5 w-5" />
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="products-table-container max-h-[80vh] overflow-y-auto rounded-lg border mb-0">
        {loading ? (
          <div className="text-center py-8">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border-b font-medium text-gray-700">Image</th>
                  <th className="text-left p-2 border-b font-medium text-gray-700">Name</th>
                  <th className="text-left p-2 border-b font-medium text-gray-700">Category</th>
                  <th className="text-left p-2 border-b font-medium text-gray-700">Price</th>
                  <th className="text-left p-2 border-b font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.product_id} className="hover:bg-gray-50">
                    <td className="p-2 border-b">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <PhotoIcon className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="p-2 border-b">
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {product.description}
                        </p>
                      </div>
                    </td>
                    <td className="p-2 border-b">
                      {renderCategoryBadge(product.category)}
                    </td>
                    <td className="p-2 border-b">
                      <span className="font-medium text-[#0097b2]">
                        {product.price || product.price_points || 0} pts
                      </span>
                    </td>
                    <td className="p-2 border-b">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.product_id)}
                          className="p-1 text-red-600 hover:text-red-800 transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal (Unified) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <AddProductForm
              onProductAdded={async (product) => {
                showNotification('success', `Product ${modalMode === 'add' ? 'created' : 'updated'} successfully!`);
                setShowModal(false);
                await loadProducts();
              }}
              onCancel={() => setShowModal(false)}
              product={modalMode === 'edit' ? selectedProduct : null}
              mode={modalMode}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
