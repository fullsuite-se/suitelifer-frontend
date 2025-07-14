import React, { useState, useEffect, useRef } from 'react';
import { suitebiteAPI } from '../../../utils/suitebiteAPI';
import {
  PlusIcon,
  XMarkIcon,
  PhotoIcon,
  SwatchIcon,
  CubeIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  ArrowUpTrayIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import useCategoryStore from '../../../store/stores/categoryStore';

/**
 * AddProductForm Component
 * 
 * Comprehensive product creation form with:
 * - Dynamic category creation
 * - Multiple image upload with previews
 * - Variation management (size, color, design)
 * - Auto-generated slugs
 * - Form validation
 * - Real-time preview
 */
const AddProductForm = ({ onProductAdded, onCancel, product = null, mode = 'add' }) => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_points: '',
    category: '',
    newCategory: '',
    slug: '',
    is_active: true // Always set to true since we removed the UI controls
  });

  // Image upload state
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Variation state
  const [variationTypes, setVariationTypes] = useState([]);
  const [variationOptions, setVariationOptions] = useState([]);
  const [selectedVariations, setSelectedVariations] = useState({ sizes: [], colors: [], designs: [] });
  // States for new variation options
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');
  const [newDesign, setNewDesign] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showVariationsModal, setShowVariationsModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  // Refs
  const fileInputRef = useRef(null);
  const imageUploadRef = useRef(null);

  // Category store
  const { getAllCategories, addCategory, removeCategory, refreshCategories } = useCategoryStore();

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Auto-generate slug from product name
  useEffect(() => {
    if (formData.name) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name]);

  // Prefill form if editing
  useEffect(() => {
    if (mode === 'edit' && product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price_points: product.price || product.price_points || '',
        category: product.category || '',
        slug: product.slug || '',
        is_active: true // Always set to true since we removed the UI controls
      });

      // Load product variations for editing
      suitebiteAPI.getProductVariations(product.product_id)
        .then(res => {
          if (res.success && Array.isArray(res.variations)) {
            const sizeSet = new Set();
            const colorSet = new Set();
            const designSet = new Set();

            res.variations.forEach(variation => {
              (variation.options || []).forEach(opt => {
                if (opt.type_name === 'size') sizeSet.add(opt.option_id);
                if (opt.type_name === 'color') colorSet.add(opt.option_id);
                if (opt.type_name === 'design') designSet.add(opt.option_id);
              });
            });

            setSelectedVariations({
              sizes: Array.from(sizeSet),
              colors: Array.from(colorSet),
              designs: Array.from(designSet)
            });
          }
        })
        .catch(err => {
          console.error('Error loading product variations:', err);
        });
    }
  }, [mode, product]);

  const loadInitialData = async () => {
    try {
      const [typesResponse, optionsResponse, categoriesResponse] = await Promise.all([
        suitebiteAPI.getVariationTypes(),
        suitebiteAPI.getVariationOptions(),
        suitebiteAPI.getAllCategories()
      ]);

      if (typesResponse.success) {
        setVariationTypes(typesResponse.variation_types || []);
      }
      if (optionsResponse.success) {
        setVariationOptions(optionsResponse.variation_options || []);
      }
      if (categoriesResponse.success) {
        // Sync database categories with local store
        const dbCategories = categoriesResponse.categories || [];
        dbCategories.forEach(dbCategory => {
          // Add category with database ID if it doesn't exist in store
          if (!getAllCategories().find(cat => cat.name === dbCategory.category_name)) {
            addCategory({
              name: dbCategory.category_name,
              category_id: dbCategory.category_id,
              color: '#6B7280',
              bgColor: '#F3F4F6',
              description: 'Database category'
            });
          }
        });
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      showNotification('error', 'Failed to load initial data');
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required';
    }
    if (!formData.price_points || formData.price_points <= 0) {
      newErrors.price_points = 'Valid price is required';
    }
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    // Price validation
    if (formData.price_points && (isNaN(formData.price_points) || formData.price_points < 1)) {
      newErrors.price_points = 'Price must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      // Validate file
      const validation = suitebiteAPI.validateImageFile(file);
      if (!validation.isValid) {
        showNotification('error', validation.errors[0]);
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target.result]);
        setImages(prev => [...prev, file]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddCategory = async () => {
    if (!formData.newCategory.trim()) {
      setErrors(prev => ({ ...prev, newCategory: 'Category name is required' }));
      return;
    }

    try {
      const response = await suitebiteAPI.addCategory({
        category_name: formData.newCategory.trim()
      });

      if (response.success) {
        addCategory(formData.newCategory.trim());
        setFormData(prev => ({ 
          ...prev, 
          category: formData.newCategory.trim(), 
          newCategory: '' 
        }));
        setShowCategoryModal(false);
        showNotification('success', `Category "${formData.newCategory.trim()}" added successfully`);
      } else {
        showNotification('error', 'Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      showNotification('error', 'Failed to add category');
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      const response = await suitebiteAPI.deleteCategory(categoryToDelete.category_id);

      if (response.success) {
        removeCategory(categoryToDelete.category_name);
        await refreshCategories(); // Refresh from backend
        // If the deleted category was selected, clear the selection
        if (formData.category === categoryToDelete.category_name) {
          setFormData(prev => ({ ...prev, category: '' }));
        }
        setShowDeleteCategoryModal(false);
        setCategoryToDelete(null);
        showNotification('success', `Category "${categoryToDelete.category_name}" deleted successfully`);
      } else {
        showNotification('error', 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      if (error?.response?.status === 404) {
        showNotification('error', `Category already deleted or not found.`);
        await refreshCategories(); // Ensure UI is up to date
      } else {
        showNotification('error', 'Failed to delete category');
      }
    }
  };

  const openDeleteCategoryModal = (category) => {
    setCategoryToDelete(category);
    setShowDeleteCategoryModal(true);
  };

  const handleVariationChange = (type, optionId, checked) => {
    setSelectedVariations(prev => ({
      ...prev,
      [type]: checked 
        ? [...prev[type], optionId]
        : prev[type].filter(id => id !== optionId)
    }));
  };
  // Handler to add new variation options on the fly
  const handleAddVariationOption = async (typeName) => {
    let value = '';
    let hex = '';
    if (typeName === 'size') value = newSize.trim();
    if (typeName === 'color') { value = newColor.trim(); hex = newColorHex; }
    if (typeName === 'design') value = newDesign.trim();
    if (!value) { showNotification('error', 'Option name is required'); return; }
    const variationType = variationTypes.find(v => v.type_name === typeName);
    if (!variationType) { showNotification('error', 'Variation type not loaded'); return; }
    try {
      const res = await suitebiteAPI.addVariationOption({
        variation_type_id: variationType.variation_type_id,
        option_value: value,
        option_label: value,
        ...(typeName === 'color' && { hex_color: hex })
      });
      if (res.success) {
        const newOption = {
          option_id: res.option_id,
          variation_type_id: variationType.variation_type_id,
          option_value: value,
          option_label: value,
          hex_color: typeName === 'color' ? hex : undefined,
          type_name: variationType.type_name,
          type_label: variationType.type_label,
          is_active: true
        };
        setVariationOptions(prev => [...prev, newOption]);
        handleVariationChange(typeName + 's', newOption.option_id, true);
        showNotification('success', `${variationType.type_label} added successfully`);
        if (typeName === 'size') setNewSize('');
        if (typeName === 'color') { setNewColor(''); setNewColorHex('#000000'); }
        if (typeName === 'design') setNewDesign('');
      } else {
        showNotification('error', res.message || `Failed to add ${variationType.type_label}`);
      }
    } catch (err) {
      console.error('Error adding variation option:', err);
      showNotification('error', `Failed to add ${typeName}`);
    }
  };

  const generateVariations = () => {
    const variations = [];
    const { sizes, colors, designs } = selectedVariations;

    // Generate all combinations
    const sizeOptions = sizes.length > 0 ? sizes : [null];
    const colorOptions = colors.length > 0 ? colors : [null];
    const designOptions = designs.length > 0 ? designs : [null];

    sizeOptions.forEach(sizeId => {
      colorOptions.forEach(colorId => {
        designOptions.forEach(designId => {
          if (sizeId || colorId || designId) {
            variations.push({
              size_id: sizeId,
              color_id: colorId,
              design_id: designId,
              price_adjustment: 0,
              sku_suffix: generateSkuSuffix(sizeId, colorId, designId)
            });
          }
        });
      });
    });

    return variations;
  };

  const generateSkuSuffix = (sizeId, colorId, designId) => {
    const suffixes = [];
    if (sizeId) {
      const size = variationOptions.find(opt => opt.option_id === sizeId);
      if (size) suffixes.push(size.option_value.toUpperCase());
    }
    if (colorId) {
      const color = variationOptions.find(opt => opt.option_id === colorId);
      if (color) suffixes.push(color.option_value.toUpperCase());
    }
    if (designId) {
      const design = variationOptions.find(opt => opt.option_id === designId);
      if (design) suffixes.push(design.option_value.toUpperCase());
    }
    return suffixes.join('-');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let productId;
      let productResponse;
      if (mode === 'edit' && product) {
        // Update product
        const updateData = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          price_points: parseInt(formData.price_points),
          category: formData.category,
          slug: formData.slug,
          is_active: formData.is_active
        };
        productResponse = await suitebiteAPI.updateProduct(product.product_id, updateData);
        if (!productResponse.success) {
          throw new Error(productResponse.message || 'Failed to update product');
        }
        productId = product.product_id;
      } else {
        // Add product
        const productData = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          price_points: parseInt(formData.price_points),
          category: formData.category,
          slug: formData.slug,
          is_active: formData.is_active
        };
        productResponse = await suitebiteAPI.addProduct(productData);
        if (!productResponse.success) {
          throw new Error(productResponse.message || 'Failed to create product');
        }
        productId = productResponse.product.product_id;
      }

      // 2. Upload images (add or edit)
      if (images.length > 0) {
        setUploadingImages(true);
        if (images.length === 1) {
          const imageResponse = await suitebiteAPI.uploadProductImage(productId, images[0]);
          if (!imageResponse.success) {
            throw new Error('Failed to upload product image');
          }
        } else {
          const imageResponse = await suitebiteAPI.uploadMultipleProductImages(productId, images);
          if (!imageResponse.success) {
            throw new Error('Failed to upload product images');
          }
        }
        setUploadingImages(false);
      }

      // 3. Create or update variations (add or edit)
      const variations = generateVariations();
      if (variations.length > 0) {
        for (const variation of variations) {
          try {
            await suitebiteAPI.addProductVariation({
              product_id: productId,
              ...variation
            });
          } catch (variationError) {
            console.warn('Failed to create variation:', variationError);
          }
        }
      }

      showNotification('success', `Product ${mode === 'edit' ? 'updated' : 'created'} successfully!`);
      onProductAdded?.(productResponse.product || product);
    } catch (error) {
      console.error('Error creating/updating product:', error);
      showNotification('error', error.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const categories = getAllCategories();

  return (
    <div className="add-product-form bg-white rounded-lg shadow-sm p-6">
      {/* Notification Toast */}
      {notification.show && (
        <div className={`notification-toast fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg text-sm font-medium max-w-sm ${
          notification.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{mode === 'edit' ? 'Edit Product' : 'Add New Product'}</h2>
          <p className="text-gray-600">{mode === 'edit' ? 'Update this product' : 'Create a new product for the Suitebite shop'}</p>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter product name"
                required
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Auto-generated Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent bg-gray-50"
                placeholder="Auto-generated from product name"
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">Auto-generated from product name</p>
            </div>

            {/* Product Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe your product..."
                required
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Price Points */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (Heartbits) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.price_points}
                onChange={(e) => setFormData({ ...formData, price_points: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent ${
                  errors.price_points ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter price in heartbits"
                required
                min="1"
              />
              {errors.price_points && <p className="text-red-500 text-sm mt-1">{errors.price_points}</p>}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent ${
                    errors.category ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(true)}
                  className="px-3 py-2 bg-[#0097b2] text-white rounded-lg hover:bg-[#007a8e] transition-colors"
                  title="Add Category"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              
              {/* Category Management */}
              {categories.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-600 mb-2">Manage Categories:</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <div
                        key={category.name}
                        className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs"
                      >
                        <span style={{ color: category.color }}>{category.name}</span>
                        <button
                          type="button"
                          onClick={() => openDeleteCategoryModal(category)}
                          className="text-red-500 hover:text-red-700 ml-1"
                          title={`Delete ${category.name} category`}
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>



            {/* Variations Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Variations
              </label>
              <button
                type="button"
                onClick={() => setShowVariationsModal(true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {Object.values(selectedVariations).flat().length > 0 
                      ? `${Object.values(selectedVariations).flat().length} variation(s) selected`
                      : 'Add variations (size, color, design)'
                    }
                  </span>
                  <CubeIcon className="h-4 w-4 text-gray-400" />
                </div>
              </button>

              {/* Selected Variations Display */}
              {Object.values(selectedVariations).flat().length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-600">Selected Variations:</p>
                    <button
                      type="button"
                      onClick={() => setSelectedVariations({ sizes: [], colors: [], designs: [] })}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Clear All
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {/* Sizes */}
                    {selectedVariations.sizes.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-700">Sizes:</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedVariations.sizes.map(sizeId => {
                            const option = variationOptions.find(opt => opt.option_id === sizeId);
                            return option ? (
                              <span
                                key={sizeId}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                              >
                                {option.option_label}
                                <button
                                  type="button"
                                  onClick={() => handleVariationChange('sizes', sizeId, false)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <XMarkIcon className="h-3 w-3" />
                                </button>
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {/* Colors */}
                    {selectedVariations.colors.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-700">Colors:</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedVariations.colors.map(colorId => {
                            const option = variationOptions.find(opt => opt.option_id === colorId);
                            return option ? (
                              <span
                                key={colorId}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                              >
                                {option.hex_color && (
                                  <div 
                                    className="w-3 h-3 rounded-full border border-gray-300"
                                    style={{ backgroundColor: option.hex_color }}
                                  />
                                )}
                                {option.option_label}
                                <button
                                  type="button"
                                  onClick={() => handleVariationChange('colors', colorId, false)}
                                  className="text-green-600 hover:text-green-800"
                                >
                                  <XMarkIcon className="h-3 w-3" />
                                </button>
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {/* Designs */}
                    {selectedVariations.designs.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-700">Designs:</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedVariations.designs.map(designId => {
                            const option = variationOptions.find(opt => opt.option_id === designId);
                            return option ? (
                              <span
                                key={designId}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded"
                              >
                                {option.option_label}
                                <button
                                  type="button"
                                  onClick={() => handleVariationChange('designs', designId, false)}
                                  className="text-purple-600 hover:text-purple-800"
                                >
                                  <XMarkIcon className="h-3 w-3" />
                                </button>
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Image Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images
          </label>
          
          {/* Image Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#0097b2] transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            <div className="space-y-4">
              <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[#0097b2] hover:text-[#007a8e] font-medium"
                >
                  Click to upload
                </button>
                <span className="text-gray-500"> or drag and drop</span>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF, WebP up to 10MB each
              </p>
            </div>
          </div>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Image Previews</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || uploadingImages}
            className="flex-1 px-4 py-2 bg-[#0097b2] text-white rounded-lg hover:bg-[#007a8e] transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating Product...' : uploadingImages ? 'Uploading Images...' : 'Create Product'}
          </button>
        </div>
      </form>

      {/* Add Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Category</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.newCategory}
                  onChange={(e) => setFormData({ ...formData, newCategory: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent ${
                    errors.newCategory ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter category name"
                />
                {errors.newCategory && <p className="text-red-500 text-sm mt-1">{errors.newCategory}</p>}
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCategory}
                className="flex-1 px-4 py-2 bg-[#0097b2] text-white rounded-lg hover:bg-[#007a8e] transition-colors"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Variations Modal */}
      {showVariationsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Product Variations</h3>
              <button
                onClick={() => setShowVariationsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Size Variations */}
              <div>
                {/* Add new size option */}
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="New size"
                    value={newSize}
                    onChange={e => setNewSize(e.target.value)}
                    className="flex-1 px-2 py-1 border rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddVariationOption('size')}
                    className="px-3 py-1 bg-[#0097b2] text-white rounded-lg hover:bg-[#007a8e] transition-colors"
                  >Add Size</button>
                </div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Sizes</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {variationOptions
                    .filter(option => option.type_name === 'size')
                    .map(option => (
                      <label key={option.option_id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedVariations.sizes.includes(option.option_id)}
                          onChange={e => handleVariationChange('sizes', option.option_id, e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">{option.option_label}</span>
                      </label>
                    ))}
                </div>
              </div>

              {/* Color Variations */}
              <div>
                {/* Add new color option */}
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="New color"
                    value={newColor}
                    onChange={e => setNewColor(e.target.value)}
                    className="px-2 py-1 border rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
                  />
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={e => setNewColorHex(e.target.value)}
                    className="w-8 h-8 p-0 border-0"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddVariationOption('color')}
                    className="px-3 py-1 bg-[#0097b2] text-white rounded-lg hover:bg-[#007a8e] transition-colors"
                  >Add Color</button>
                </div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Colors</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {variationOptions
                    .filter(option => option.type_name === 'color')
                    .map(option => (
                      <label key={option.option_id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedVariations.colors.includes(option.option_id)}
                          onChange={e => handleVariationChange('colors', option.option_id, e.target.checked)}
                          className="rounded"
                        />
                        <div className="flex items-center space-x-2">
                          {option.hex_color && (
                            <div
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: option.hex_color }}
                            />
                          )}
                          <span className="text-sm">{option.option_label}</span>
                        </div>
                      </label>
                    ))}
                </div>
              </div>

              {/* Design Variations */}
              <div>
                {/* Add new design option */}
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="New design"
                    value={newDesign}
                    onChange={e => setNewDesign(e.target.value)}
                    className="flex-1 px-2 py-1 border rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddVariationOption('design')}
                    className="px-3 py-1 bg-[#0097b2] text-white rounded-lg hover:bg-[#007a8e] transition-colors"
                  >Add Design</button>
                </div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Designs</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {variationOptions
                    .filter(option => option.type_name === 'design')
                    .map(option => (
                      <label key={option.option_id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedVariations.designs.includes(option.option_id)}
                          onChange={e => handleVariationChange('designs', option.option_id, e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">{option.option_label}</span>
                      </label>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t mt-6">
              <button
                type="button"
                onClick={() => setShowVariationsModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Confirmation Modal */}
      {showDeleteCategoryModal && categoryToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Delete Category</h3>
              <button
                onClick={() => {
                  setShowDeleteCategoryModal(false);
                  setCategoryToDelete(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <ExclamationTriangleIcon className="h-8 w-8 text-amber-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Are you sure you want to delete the category "{categoryToDelete.category_name}"?
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    This action cannot be undone. Products using this category will lose their category assignment.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteCategoryModal(false);
                  setCategoryToDelete(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCategory}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProductForm; 