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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pendingDeleteProduct, setPendingDeleteProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(false);

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
      const response = await suitebiteAPI.getVariationTypes();
      if (response.success) {
        setVariationTypes(response.variationTypes || []);
      }
    } catch (error) {
      console.error('Error loading variation types:', error);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 4000);
  };

  const handleAddProduct = () => {
    setModalMode('add');
    setSelectedProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price_points || !formData.category) {
      showNotification('error', 'Please fill in all required fields');
      return;
    }

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price_points: parseInt(formData.price_points),
        category: formData.category,
        image_url: imagePreview || formData.image_url
      };

      let response;
      if (modalMode === 'add') {
        response = await suitebiteAPI.createProduct(productData);
      } else {
        response = await suitebiteAPI.updateProduct(selectedProduct.product_id, productData);
      }

      if (response.success) {
        showNotification('success', `Product ${modalMode === 'add' ? 'created' : 'updated'} successfully!`);
        setShowModal(false);
        setFormData({
          name: '',
          description: '',
          price_points: '',
          category: '',
          image_url: ''
        });
        setImageFile(null);
        setImagePreview('');
        await loadProducts();
      } else {
        showNotification('error', response.message || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      showNotification('error', 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    setPendingDeleteProduct(productId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteProduct) return;

    try {
      setDeletingProduct(true);
      const response = await suitebiteAPI.deleteProduct(pendingDeleteProduct);
      if (response.success) {
        showNotification('success', 'Product deleted successfully!');
        setShowDeleteConfirm(false);
        setPendingDeleteProduct(null);
        await loadProducts();
      } else {
        showNotification('error', response.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showNotification('error', 'Failed to delete product');
    } finally {
      setDeletingProduct(false);
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteConfirm(false);
    setPendingDeleteProduct(null);
    setDeletingProduct(false);
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
    const categoryName = prompt('Enter new category name:');
    if (categoryName && categoryName.trim()) {
      try {
        const response = await addCategory(categoryName.trim());
        if (response.success) {
          showNotification('success', 'Category added successfully!');
          await loadProducts(); // Refresh to sync categories
        } else {
          showNotification('error', response.message || 'Failed to add category');
        }
      } catch (error) {
        console.error('Error adding category:', error);
        showNotification('error', 'Failed to add category');
      }
    }
  };

  // Get categories for filtering
  const categories = getCategoriesForFilter();
  const allCategories = getAllCategories();

  // Filter and sort products
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
      
      if (sortBy === 'price_points') {
        aValue = parseInt(aValue) || 0;
        bValue = parseInt(bValue) || 0;
      } else {
        aValue = String(aValue || '').toLowerCase();
        bValue = String(bValue || '').toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const renderCategoryBadge = (categoryName) => {
    if (!categoryName) return null;
    
    const color = getCategoryColor(categoryName);
    const bgColor = getCategoryBgColor(categoryName);
    
    return (
      <span 
        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
        style={{ 
          backgroundColor: bgColor, 
          color: color 
        }}
      >
        {categoryName}
      </span>
    );
  };

  const renderCategoryOption = (category) => {
    if (category === 'all') {
      return (
        <option key="all" value="all" className="text-base">
          All Categories
        </option>
      );
    }
    
    return (
      <option key={category} value={category} className="text-base">
        {category}
      </option>
    );
  };

  const renderCategoryFormSelection = () => {
    return (
      <div>
        <label className="block text-base font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent text-base"
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
        <div className={`notification-toast fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg text-base font-medium max-w-sm ${
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent text-base"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="category-filter">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent text-base"
            >
              {categories.map(renderCategoryOption)}
            </select>
          </div>

          {/* Sort By */}
          <div className="sort-field">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent text-base"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent text-base"
            >
              <option key="asc" value="asc">Ascending</option>
              <option key="desc" value="desc">Descending</option>
            </select>
          </div>

          {/* Add Product Button - moved here */}
          <div className="flex justify-end md:col-span-1">
            <button
              onClick={handleAddProduct}
              className="bg-[#0097b2] text-white px-4 py-2 rounded-lg hover:bg-[#007a8e] transition-colors duration-200 flex items-center gap-2 w-full md:w-auto text-base"
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
            <p className="text-gray-600 text-base">Loading products...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border-b font-medium text-gray-700 text-base">Image</th>
                  <th className="text-left p-2 border-b font-medium text-gray-700 text-base">Name</th>
                  <th className="text-left p-2 border-b font-medium text-gray-700 text-base">Category</th>
                  <th className="text-left p-2 border-b font-medium text-gray-700 text-base">Price</th>
                  <th className="text-left p-2 border-b font-medium text-gray-700 text-base">Actions</th>
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
                        <p className="font-medium text-gray-900 text-base">{product.name}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {product.description}
                        </p>
                      </div>
                    </td>
                    <td className="p-2 border-b">
                      {renderCategoryBadge(product.category)}
                    </td>
                    <td className="p-2 border-b">
                      <span className="font-medium text-[#0097b2] text-base">
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Deletion</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={closeDeleteModal}
                disabled={deletingProduct}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deletingProduct}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {deletingProduct ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
