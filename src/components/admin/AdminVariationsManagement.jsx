import React, { useState, useEffect } from 'react';
import { suitebiteAPI } from '../../utils/suitebiteAPI';
import {
  TagIcon,
  SwatchIcon,
  CubeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

/**
 * AdminVariationsManagement Component
 * 
 * Comprehensive admin interface for managing product variations.
 * Features include:
 * - Variation types management (Size, Color, Style, etc.)
 * - Variation options management (Small, Red, Classic, etc.)
 * - Product variations management (linking products to specific options)
 */
const AdminVariationsManagement = () => {
  // State management
  const [activeTab, setActiveTab] = useState('types');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'add-type', 'edit-type', 'add-option', etc.
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Data state
  const [variationTypes, setVariationTypes] = useState([]);
  const [variationOptions, setVariationOptions] = useState([]);
  const [products, setProducts] = useState([]);
  const [productVariations, setProductVariations] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  /**
   * Load all variation data
   */
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [typesRes, optionsRes, productsRes] = await Promise.all([
        suitebiteAPI.getVariationTypes(),
        suitebiteAPI.getVariationOptions(),
        suitebiteAPI.getAllProducts()
      ]);

      if (typesRes.success) setVariationTypes(typesRes.variation_types || []);
      if (optionsRes.success) setVariationOptions(optionsRes.variation_options || []);
      if (productsRes.success) setProducts(productsRes.products || []);
    } catch (error) {
      console.error('Error loading variation data:', error);
      showNotification('Error loading variation data. Please try again.', 'error');
    }
    setLoading(false);
  };

  /**
   * Show notification message
   */
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      let response;
      
      switch (modalType) {
        case 'add-type':
          response = await suitebiteAPI.addVariationType(formData);
          break;
        case 'edit-type':
          response = await suitebiteAPI.updateVariationType(selectedItem.variation_type_id, formData);
          break;
        case 'add-option':
          response = await suitebiteAPI.addVariationOption(formData);
          break;
        case 'edit-option':
          response = await suitebiteAPI.updateVariationOption(selectedItem.option_id, formData);
          break;
        case 'add-product-variation':
          response = await suitebiteAPI.addProductVariation(formData);
          break;
        case 'edit-product-variation':
          response = await suitebiteAPI.updateProductVariation(selectedItem.variation_id, formData);
          break;
        default:
          throw new Error('Unknown modal type');
      }

      if (response.success) {
        showNotification(response.message || 'Operation completed successfully!');
        setShowModal(false);
        setFormData({});
        await loadAllData();
      } else {
        setErrors(response.errors || { general: response.message || 'An error occurred' });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ general: error.message || 'An error occurred while saving' });
    }
    setLoading(false);
  };

  /**
   * Handle delete operations
   */
  const handleDelete = async (type, id) => {
    try {
      let response;
      
      switch (type) {
        case 'type':
          response = await suitebiteAPI.deleteVariationType(id);
          break;
        case 'option':
          response = await suitebiteAPI.deleteVariationOption(id);
          break;
        case 'product-variation':
          response = await suitebiteAPI.deleteProductVariation(id);
          break;
        default:
          throw new Error('Unknown delete type');
      }

      if (response.success) {
        showNotification(response.message || 'Deleted successfully!');
        await loadAllData();
      } else {
        showNotification(response.message || 'Error deleting item', 'error');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showNotification('Error deleting item. Please try again.', 'error');
    }
    setConfirmDelete(null);
  };

  /**
   * Open modal for adding/editing items
   */
  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setFormData(item || {});
    setErrors({});
    setShowModal(true);
  };

  /**
   * Close modal
   */
  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedItem(null);
    setFormData({});
    setErrors({});
  };

  // Tab configuration
  const tabs = [
    { id: 'types', label: 'Variation Types', icon: TagIcon },
    { id: 'options', label: 'Variation Options', icon: SwatchIcon },
    { id: 'products', label: 'Product Variations', icon: CubeIcon }
  ];

  return (
    <div className="admin-variations bg-gray-50 min-h-screen">
      <div className="admin-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="header mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Variations Management</h1>
          <p className="text-gray-600">Manage product variation types, options, and configurations</p>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-nav-tabs bg-white rounded-lg shadow-sm p-1 mb-8">
          <div className="flex space-x-1">
            {tabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`nav-tab flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === tab.id 
                      ? 'bg-[#0097b2] text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <IconComponent className="h-5 w-5 mr-2" />
                  <span className="tab-label">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`notification p-4 rounded-lg mb-6 ${
            notification.type === 'error' 
              ? 'bg-red-50 border border-red-200 text-red-800' 
              : 'bg-green-50 border border-green-200 text-green-800'
          }`}>
            {notification.message}
          </div>
        )}

        {/* Tab Content */}
        <div className="admin-content">
          
          {/* Variation Types Tab */}
          {activeTab === 'types' && (
            <VariationTypesTab 
              variationTypes={variationTypes}
              loading={loading}
              onAddType={() => openModal('add-type')}
              onEditType={(type) => openModal('edit-type', type)}
              onDeleteType={(typeId) => setConfirmDelete({ type: 'type', id: typeId, name: variationTypes.find(t => t.variation_type_id === typeId)?.type_label })}
            />
          )}

          {/* Variation Options Tab */}
          {activeTab === 'options' && (
            <VariationOptionsTab 
              variationOptions={variationOptions}
              variationTypes={variationTypes}
              loading={loading}
              onAddOption={() => openModal('add-option')}
              onEditOption={(option) => openModal('edit-option', option)}
              onDeleteOption={(optionId) => setConfirmDelete({ type: 'option', id: optionId, name: variationOptions.find(o => o.option_id === optionId)?.option_label })}
            />
          )}

          {/* Product Variations Tab */}
          {activeTab === 'products' && (
            <ProductVariationsTab 
              products={products}
              productVariations={productVariations}
              loading={loading}
              onAddVariation={(productId) => openModal('add-product-variation', { product_id: productId })}
              onEditVariation={(variation) => openModal('edit-product-variation', variation)}
              onDeleteVariation={(variationId) => setConfirmDelete({ type: 'product-variation', id: variationId, name: `Variation ${variationId}` })}
            />
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <VariationModal
          type={modalType}
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          variationTypes={variationTypes}
          products={products}
          onSubmit={handleSubmit}
          onClose={closeModal}
          loading={loading}
        />
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <DeleteConfirmationModal
          item={confirmDelete}
          onConfirm={() => handleDelete(confirmDelete.type, confirmDelete.id)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
};

/**
 * Variation Types Tab Component
 */
const VariationTypesTab = ({ variationTypes, loading, onAddType, onEditType, onDeleteType }) => (
  <div className="variation-types-tab">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-900">Variation Types</h2>
      <button
        onClick={onAddType}
        className="bg-[#0097b2] text-white px-4 py-2 rounded-lg hover:bg-[#007a94] transition-colors flex items-center"
      >
        <PlusIcon className="h-5 w-5 mr-2" />
        Add Type
      </button>
    </div>

    {loading ? (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0097b2] mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading variation types...</p>
      </div>
    ) : variationTypes.length === 0 ? (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <TagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No variation types yet</h3>
        <p className="text-gray-600 mb-4">Create your first variation type to get started.</p>
        <button
          onClick={onAddType}
          className="bg-[#0097b2] text-white px-4 py-2 rounded-lg hover:bg-[#007a94] transition-colors"
        >
          Add First Type
        </button>
      </div>
    ) : (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Label
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {variationTypes.map((type) => (
              <tr key={type.variation_type_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {type.type_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {type.type_label}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEditType(type)}
                    className="text-[#0097b2] hover:text-[#007a94] mr-3 p-1 rounded"
                    title="Edit variation type"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDeleteType(type.variation_type_id)}
                    className="text-red-600 hover:text-red-900 p-1 rounded"
                    title="Delete variation type"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

/**
 * Variation Options Tab Component
 */
const VariationOptionsTab = ({ variationOptions, variationTypes, loading, onAddOption, onEditOption, onDeleteOption }) => (
  <div className="variation-options-tab">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-900">Variation Options</h2>
      <button
        onClick={onAddOption}
        className="bg-[#0097b2] text-white px-4 py-2 rounded-lg hover:bg-[#007a94] transition-colors flex items-center"
      >
        <PlusIcon className="h-5 w-5 mr-2" />
        Add Option
      </button>
    </div>

    {loading ? (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0097b2] mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading variation options...</p>
      </div>
    ) : variationOptions.length === 0 ? (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <SwatchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No variation options yet</h3>
        <p className="text-gray-600 mb-4">Add options like sizes, colors, or styles to your variation types.</p>
        <button
          onClick={onAddOption}
          className="bg-[#0097b2] text-white px-4 py-2 rounded-lg hover:bg-[#007a94] transition-colors"
        >
          Add First Option
        </button>
      </div>
    ) : (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Label
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Color
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {variationOptions.map((option) => {
              const variationType = variationTypes.find(t => t.variation_type_id === option.variation_type_id);
              return (
                <tr key={option.option_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {variationType?.type_label || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {option.option_value}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {option.option_label}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {option.hex_color && (
                      <div className="flex items-center">
                        <div 
                          className="w-6 h-6 rounded-full border border-gray-300 mr-2 shadow-sm"
                          style={{ backgroundColor: option.hex_color }}
                        />
                        <span className="text-xs font-mono">{option.hex_color}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEditOption(option)}
                      className="text-[#0097b2] hover:text-[#007a94] mr-3 p-1 rounded"
                      title="Edit variation option"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteOption(option.option_id)}
                      className="text-red-600 hover:text-red-900 p-1 rounded"
                      title="Delete variation option"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

/**
 * Product Variations Tab Component
 */
const ProductVariationsTab = ({ products, productVariations, loading, onAddVariation, onEditVariation, onDeleteVariation }) => (
  <div className="product-variations-tab">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-900">Product Variations</h2>
      <button
        onClick={() => onAddVariation()}
        className="bg-[#0097b2] text-white px-4 py-2 rounded-lg hover:bg-[#007a94] transition-colors flex items-center"
      >
        <PlusIcon className="h-5 w-5 mr-2" />
        Add Product Variation
      </button>
    </div>

    {loading ? (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0097b2] mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading products...</p>
      </div>
    ) : products.length === 0 ? (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <CubeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600">Create some products first before adding variations.</p>
      </div>
    ) : (
      <div className="grid gap-6">
        {products.slice(0, 10).map((product) => (
          <div key={product.product_id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start space-x-4">
                {product.image_url && (
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                  <p className="text-gray-500">Base price: {product.price || product.price_points} heartbits</p>
                  {product.description && (
                    <p className="text-gray-400 text-sm mt-1">{product.description}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => onAddVariation(product.product_id)}
                className="text-[#0097b2] hover:text-[#007a94] text-sm bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
              >
                Add Variation
              </button>
            </div>
            
            <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
              <p>💡 No variations configured yet. Click "Add Variation" to create product variations with different sizes, colors, or styles.</p>
            </div>
          </div>
        ))}
        
        {products.length > 10 && (
          <div className="text-center py-4">
            <p className="text-gray-500">Showing first 10 products. Total: {products.length} products</p>
          </div>
        )}
      </div>
    )}
  </div>
);

/**
 * Delete Confirmation Modal
 */
const DeleteConfirmationModal = ({ item, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
      <div className="flex items-center mb-4">
        <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
        <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
      </div>
      
      <p className="text-gray-600 mb-6">
        Are you sure you want to delete "{item.name}"? This action cannot be undone.
      </p>
      
      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

/**
 * Modal Component for Adding/Editing Variations
 */
const VariationModal = ({ type, formData, setFormData, errors, variationTypes, products, onSubmit, onClose, loading }) => {
  const getModalTitle = () => {
    switch (type) {
      case 'add-type': return 'Add Variation Type';
      case 'edit-type': return 'Edit Variation Type';
      case 'add-option': return 'Add Variation Option';
      case 'edit-option': return 'Edit Variation Option';
      case 'add-product-variation': return 'Add Product Variation';
      case 'edit-product-variation': return 'Edit Product Variation';
      default: return 'Modal';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">{getModalTitle()}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          {/* Variation Type Form */}
          {(type === 'add-type' || type === 'edit-type') && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.type_name || ''}
                  onChange={(e) => setFormData({...formData, type_name: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
                  placeholder="e.g., size, color, style"
                  required
                />
                {errors.type_name && <p className="text-red-500 text-xs mt-1">{errors.type_name}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type Label <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.type_label || ''}
                  onChange={(e) => setFormData({...formData, type_label: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
                  placeholder="e.g., Size, Color, Material"
                  required
                />
                {errors.type_label && <p className="text-red-500 text-xs mt-1">{errors.type_label}</p>}
              </div>
            </div>
          )}

          {/* Variation Option Form */}
          {(type === 'add-option' || type === 'edit-option') && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Variation Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.variation_type_id || ''}
                  onChange={(e) => setFormData({...formData, variation_type_id: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
                  required
                >
                  <option value="">Select a type</option>
                  {variationTypes.map(type => (
                    <option key={type.variation_type_id} value={type.variation_type_id}>
                      {type.type_label}
                    </option>
                  ))}
                </select>
                {errors.variation_type_id && <p className="text-red-500 text-xs mt-1">{errors.variation_type_id}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Option Value <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.option_value || ''}
                  onChange={(e) => setFormData({...formData, option_value: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
                  placeholder="e.g., xs, red, classic"
                  required
                />
                {errors.option_value && <p className="text-red-500 text-xs mt-1">{errors.option_value}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Label <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.option_label || ''}
                  onChange={(e) => setFormData({...formData, option_label: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
                  placeholder="e.g., Extra Small, Red, Classic"
                  required
                />
                {errors.option_label && <p className="text-red-500 text-xs mt-1">{errors.option_label}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color (for color options)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={formData.hex_color || '#000000'}
                    onChange={(e) => setFormData({...formData, hex_color: e.target.value})}
                    className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.hex_color || ''}
                    onChange={(e) => setFormData({...formData, hex_color: e.target.value})}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097b2] focus:border-transparent font-mono text-sm"
                    placeholder="#000000"
                    pattern="^#[0-9A-Fa-f]{6}$"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Optional: Only needed for color-based variations</p>
              </div>
            </div>
          )}

          {/* Product Variation Form */}
          {(type === 'add-product-variation' || type === 'edit-product-variation') && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.product_id || ''}
                  onChange={(e) => setFormData({...formData, product_id: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
                  required
                >
                  <option value="">Select a product</option>
                  {products.map(product => (
                    <option key={product.product_id} value={product.product_id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                {errors.product_id && <p className="text-red-500 text-xs mt-1">{errors.product_id}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU (optional)
                </label>
                <input
                  type="text"
                  value={formData.variation_sku || ''}
                  onChange={(e) => setFormData({...formData, variation_sku: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
                  placeholder="Unique SKU for this variation"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Adjustment (heartbits)
                </label>
                <input
                  type="number"
                  value={formData.price_adjustment || 0}
                  onChange={(e) => setFormData({...formData, price_adjustment: parseInt(e.target.value) || 0})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
                  placeholder="0 for no change, positive for increase, negative for decrease"
                />
                <p className="text-xs text-gray-500 mt-1">Amount to add/subtract from base product price</p>
              </div>
            </div>
          )}

          {/* Error Display */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded mt-4">
              {errors.general}
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#0097b2] text-white rounded-md hover:bg-[#007a94] disabled:opacity-50 transition-colors flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminVariationsManagement; 