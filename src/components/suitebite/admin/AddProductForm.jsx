import React, { useState, useEffect, useRef, useCallback } from 'react';
import ProductImageUploadNew from './ProductImageUploadNew';
import ProductImageCarousel from '../admin/ProductImageCarousel';
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
    slug: '' // Removed is_active
  });

  // Image upload state (New system)
  const [selectedImages, setSelectedImages] = useState([]); // Selected files for preview
  const [uploadingImages, setUploadingImages] = useState(false);
  const [productImages, setProductImages] = useState([]); // Array of product images from database
  const [originalProductImages, setOriginalProductImages] = useState([]); // Track original images for deletion
  const uploadRef = useRef(null); // Reference to upload function

  // Variation state
  const [variationTypes, setVariationTypes] = useState([]);
  const [variationOptions, setVariationOptions] = useState([]);
  const [selectedVariations, setSelectedVariations] = useState({ sizes: [], colors: [], designs: [] });
  // States for new variation options
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');
  const [newDesign, setNewDesign] = useState('');

  // New integrated variation state
  const [hasVariations, setHasVariations] = useState(false);
  const [selectedVariationTypes, setSelectedVariationTypes] = useState([]);
  const [selectedVariationsByType, setSelectedVariationsByType] = useState({});
  const [showAddOptionModal, setShowAddOptionModal] = useState(false);
  const [newOptionData, setNewOptionData] = useState({ typeId: null, typeName: '', value: '', hexColor: '#000000' });

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showVariationsModal, setShowVariationsModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  // Warning state for order impact
  const [orderWarning, setOrderWarning] = useState(null);
  const [showOrderWarningModal, setShowOrderWarningModal] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);

  // Refs
  // Remove unused file input refs

  // Category store
  const { getAllCategories, addCategory, removeCategory, refreshCategories } = useCategoryStore();

  // Remove inline add type state, add modal state
  const [showAddTypeModal, setShowAddTypeModal] = useState(false);
  const [newTypeData, setNewTypeData] = useState({ type_name: '', type_label: '' });
  const [addTypeError, setAddTypeError] = useState('');
  const [addTypeLoading, setAddTypeLoading] = useState(false);
  const [addOptionError, setAddOptionError] = useState('');
  const [addOptionLoading, setAddOptionLoading] = useState(false);

  // Auto-generate type_name from type_label
  useEffect(() => {
    if (showAddTypeModal && newTypeData.type_label.trim()) {
      const generatedTypeName = newTypeData.type_label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
      
      setNewTypeData(prev => ({
        ...prev,
        type_name: generatedTypeName || prev.type_label.toLowerCase()
      }));
    }
  }, [newTypeData.type_label, showAddTypeModal]);

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
      console.log('🔍 AddProductForm - Edit mode detected:', { product_id: product.product_id, name: product.name });
      
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price_points: product.price || product.price_points || '',
        category: product.category || '',
        slug: product.slug || '' // Removed is_active
      });

      // Load product images for editing
      if (product.product_id) {
        console.log('🔍 AddProductForm - Loading images for product ID:', product.product_id);
        
        suitebiteAPI.getProductImages(product.product_id)
          .then(res => {
            console.log('🔍 AddProductForm - API response:', res);
            if (res.success) {
              console.log('🔍 AddProductForm - Setting product images:', res.images);
              setProductImages(res.images || []);
              // Track original images for deletion comparison
              setOriginalProductImages(res.images || []);
            } else {
              console.error('🔍 AddProductForm - API returned error:', res.message);
            }
          })
          .catch(err => {
            console.error('🔍 AddProductForm - Error loading product images:', err);
          });
      } else {
        console.log('🔍 AddProductForm - No product_id found in product object');
      }

      // Load product variations for editing
      suitebiteAPI.getProductVariations(product.product_id)
        .then(res => {
          if (res.success && Array.isArray(res.variations)) {
            if (res.variations.length > 0) {
              setHasVariations(true);
              
              // Group variations by type
              const variationsByType = {};
              const usedTypes = new Set();
              
              res.variations.forEach(variation => {
                (variation.options || []).forEach(opt => {
                  const typeId = opt.variation_type_id;
                  usedTypes.add(typeId);
                  
                  if (!variationsByType[typeId]) {
                    variationsByType[typeId] = new Set();
                  }
                  variationsByType[typeId].add(opt.option_id);
                });
              });

              // Convert sets to arrays
              const finalVariationsByType = {};
              Object.keys(variationsByType).forEach(typeId => {
                finalVariationsByType[parseInt(typeId)] = Array.from(variationsByType[typeId]);
              });

              setSelectedVariationTypes(Array.from(usedTypes));
              setSelectedVariationsByType(finalVariationsByType);

              // Keep backward compatibility with old system
              const oldVariations = res.variations.map(v => ({
                variation_type_id: v.variation_type_id,
                option_id: v.option_id
              }));
              setSelectedVariations(oldVariations);
            }
          }
        })
        .catch(err => {
          console.error('Error loading product variations:', err);
        });
    }
  }, [mode, product]);

  const loadInitialData = async () => {
    try {
      const [typesResponse, optionsResponse] = await Promise.all([
        suitebiteAPI.getVariationTypes(),
        suitebiteAPI.getVariationOptions(),
        refreshCategories() // Use the store's refresh method instead
      ]);

      if (typesResponse.success) {
        setVariationTypes(typesResponse.variation_types || []);
      }
      if (optionsResponse.success) {
        setVariationOptions(optionsResponse.variation_options || []);
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

    // Variation validation
    if (hasVariations) {
      if (selectedVariationTypes.length === 0) {
        newErrors.variations = 'Please select at least one variation type or disable variations';
      } else {
        // Check if each selected variation type has at least one option
        const typesWithoutOptions = [];
        selectedVariationTypes.forEach(typeId => {
          const selectedOptions = getSelectedOptionsForType(typeId);
          if (selectedOptions.length === 0) {
            const variationType = variationTypes.find(t => t.variation_type_id === typeId);
            if (variationType) {
              typesWithoutOptions.push(variationType.type_label);
            }
          }
        });
        
        if (typesWithoutOptions.length > 0) {
          newErrors.variations = `Please select at least one option for: ${typesWithoutOptions.join(', ')}`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Image selection handler (new system)
  const handleImagesChange = useCallback((imageData) => {
    console.log('📸 Images changed in AddProductForm:', imageData);
    setSelectedImages(imageData);
  }, []);

  // Function to refresh product images after changes
  const refreshProductImages = useCallback(async () => {
    if (mode === 'edit' && product?.product_id) {
      try {
        console.log('🔄 Refreshing product images...');
        const res = await suitebiteAPI.getProductImages(product.product_id);
        if (res.success) {
          console.log('🔄 Updated product images:', res.images?.length || 0);
          setProductImages(res.images || []);
          // Update original images to reflect current state after deletions
          setOriginalProductImages(res.images || []);
          
          // Also update the selected images to remove any deleted existing images
          setSelectedImages(prev => {
            const existingImageUrls = (res.images || []).map(img => img.image_url);
            return prev.filter(img => {
              if (img.isExisting) {
                // Keep only existing images that still exist in the database
                return existingImageUrls.includes(img.url);
              }
              // Keep all new files that haven't been uploaded yet
              return true;
            });
          });
        }
      } catch (err) {
        console.error('Error refreshing product images:', err);
      }
    }
  }, [mode, product?.product_id]);

  // Upload images to Cloudinary and get URLs
  const uploadSelectedImages = async () => {
    if (!uploadRef.current) return { success: true, imageUrls: [] };
    
    setUploadingImages(true);
    try {
      const result = await uploadRef.current();
      setUploadingImages(false);
      return result;
    } catch (error) {
      setUploadingImages(false);
      console.error('Error uploading images:', error);
      return { success: false, error: error.message };
    }
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
        // Refresh categories from backend to ensure new category has proper category_id
        await refreshCategories();
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
      // If the category doesn't have a category_id, it's likely a frontend-only category
      if (!categoryToDelete.category_id) {
        showNotification('warning', 'This category exists only in the frontend. Please refresh the page to sync with database.');
        // Remove from frontend store only
        removeCategory(categoryToDelete.name || categoryToDelete.category_name);
        setShowDeleteCategoryModal(false);
        setCategoryToDelete(null);
        return;
      }

      const response = await suitebiteAPI.deleteCategory(categoryToDelete.category_id);

      if (response.success) {
        removeCategory(categoryToDelete.name || categoryToDelete.category_name);
        await refreshCategories(); // Refresh from backend
        // If the deleted category was selected, clear the selection
        if (formData.category === (categoryToDelete.name || categoryToDelete.category_name)) {
          setFormData(prev => ({ ...prev, category: '' }));
        }
        setShowDeleteCategoryModal(false);
        setCategoryToDelete(null);
        showNotification('success', `Category "${categoryToDelete.name || categoryToDelete.category_name}" deleted successfully`);
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

  // Update generateVariations to return an array of option IDs for each combination
  const generateVariations = () => {
    if (!hasVariations || selectedVariationTypes.length === 0) {
      return [];
    }

    // Get all selected options for each variation type
    const variationData = [];
    selectedVariationTypes.forEach(typeId => {
      const selectedOptions = getSelectedOptionsForType(typeId);
      if (selectedOptions.length > 0) {
        variationData.push({
          typeId,
          options: selectedOptions.map(optionId =>
            variationOptions.find(opt => opt.option_id === optionId)
          ).filter(Boolean)
        });
      }
    });

    if (variationData.length === 0) return [];

    // Generate all combinations
    const generateCombinations = (index, currentCombination) => {
      if (index >= variationData.length) {
        return [currentCombination.slice()];
      }

      const combinations = [];
      const currentType = variationData[index];
      currentType.options.forEach(option => {
        currentCombination.push(option);
        combinations.push(...generateCombinations(index + 1, currentCombination));
        currentCombination.pop();
      });
      return combinations;
    };

    const allCombinations = generateCombinations(0, []);

    // Return array of { options: [option_id, ...], variation_sku }
    return allCombinations.map(combination => ({
      options: combination.map(opt => opt.option_id),
      variation_sku: combination.map(opt => opt.option_value.toUpperCase()).join('-')
      // Removed price_adjustment
    }));
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

    // For edit mode, check if variations changed and product has orders
    if (mode === 'edit' && product && hasVariations) {
      const hasOrderImpact = await checkOrderImpact(product.product_id);
      if (hasOrderImpact && !pendingSubmit) {
        setShowOrderWarningModal(true);
        return;
      }
    }

    await executeSubmit();
  };

  const executeSubmit = async () => {
    setLoading(true);
    setPendingSubmit(false);
    setShowOrderWarningModal(false);

    try {
      let productId;
      let productResponse;
      let isNewProduct = false;
      
      if (mode === 'edit' && product) {
        // Update product
        const updateData = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          price_points: parseInt(formData.price_points),
          category: formData.category.trim(),
          slug: formData.slug
          // Removed is_active
        };
        productResponse = await suitebiteAPI.updateProduct(product.product_id, updateData);
        if (!productResponse.success) {
          throw new Error(productResponse.message || 'Failed to update product');
        }
        productId = product.product_id;

        // Smart variation management for edit mode
        if (hasVariations) {
          // Get current variations to compare
          const existingVariationsRes = await suitebiteAPI.getProductVariations(productId);
          const existingVariations = existingVariationsRes.success ? existingVariationsRes.variations : [];

          // Generate new variations
          const newVariations = generateVariations();

          // Helper to get a unique key for a variation based on its option IDs
          const optionsKey = (variation) =>
            (variation.options || [])
              .map(opt => opt.option_id)
              .sort()
              .join('-');

          // Remove only variations that are no longer needed
          const variationsToRemove = existingVariations.filter(existing => {
            const existingKey = optionsKey(existing);
            return !newVariations.some(newVar => optionsKey(newVar) === existingKey);
          });

          // Remove unused variations
          for (const variation of variationsToRemove) {
            try {
              await suitebiteAPI.deleteProductVariation(variation.variation_id);
            } catch (error) {
              console.warn('Failed to delete variation:', error);
            }
          }

          // Add only new variations
          const variationsToAdd = newVariations.filter(newVar => {
            const newKey = optionsKey(newVar);
            return !existingVariations.some(existing => optionsKey(existing) === newKey);
          });

          // Add new variations
          for (const variation of variationsToAdd) {
            try {
              await suitebiteAPI.addProductVariation({
                product_id: productId,
                options: variation.options,
                variation_sku: variation.variation_sku
              });
            } catch (variationError) {
              console.warn('Failed to create variation:', variationError);
            }
          }
        } else {
          // Remove all variations if variations are disabled
          const existingVariationsRes = await suitebiteAPI.getProductVariations(productId);
          if (existingVariationsRes.success && Array.isArray(existingVariationsRes.variations)) {
            for (const variation of existingVariationsRes.variations) {
              try {
                await suitebiteAPI.deleteProductVariation(variation.variation_id);
              } catch (error) {
                console.warn('Failed to delete variation:', error);
              }
            }
          }
        }
      } else {
        // Add product (original logic)
        const productData = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          price_points: parseInt(formData.price_points),
          category: formData.category.trim(),
          slug: formData.slug
          // Removed is_active
        };
        productResponse = await suitebiteAPI.addProduct(productData);
        if (!productResponse.success) {
          throw new Error(productResponse.message || 'Failed to create product');
        }
        productId = productResponse.product.product_id;
        isNewProduct = true;

        // Add variations for new product
        if (hasVariations) {
          const variations = generateVariations();
          for (const variation of variations) {
            try {
              await suitebiteAPI.addProductVariation({
                product_id: productId,
                options: variation.options,
                variation_sku: variation.variation_sku
                // Removed price_adjustment
              });
            } catch (variationError) {
              console.warn('Failed to create variation:', variationError);
            }
          }
        }
      }

      // --- Handle Image Deletions for Edit Mode ---
      if (mode === 'edit' && product?.product_id) {
        console.log('🗑️ Checking for image deletions...');
        console.log('- Original images:', originalProductImages.map(img => ({ id: img.image_id, url: img.image_url })));
        console.log('- Selected images:', selectedImages.map(img => ({ isExisting: img.isExisting, image_id: img.image_id, url: img.url })));
        console.log('- Currently selected existing images:', selectedImages.filter(img => img.isExisting).length);
        
        // Get IDs of currently selected existing images
        const currentlySelectedImageIds = selectedImages
          .filter(img => img.isExisting && img.image_id)
          .map(img => img.image_id);
        
        console.log('- Currently selected image IDs:', currentlySelectedImageIds);
        
        // Find images that were originally loaded but are no longer selected (deleted)
        const imagesToDelete = originalProductImages.filter(originalImg => 
          !currentlySelectedImageIds.includes(originalImg.image_id)
        );
        
        console.log('- Images to delete:', imagesToDelete.length, imagesToDelete.map(img => ({ id: img.image_id, url: img.image_url })));
        
        // Delete images that were removed from preview
        for (const imageToDelete of imagesToDelete) {
          try {
            console.log(`🗑️ Deleting image ${imageToDelete.image_id}...`);
            const deleteResult = await suitebiteAPI.deleteProductImage(imageToDelete.image_id);
            console.log(`🗑️ Delete result for image ${imageToDelete.image_id}:`, deleteResult);
            
            if (!deleteResult.success) {
              console.warn(`Failed to delete image ${imageToDelete.image_id}:`, deleteResult.message);
            }
          } catch (error) {
            console.error(`Error deleting image ${imageToDelete.image_id}:`, error);
          }
        }
        
        if (imagesToDelete.length > 0) {
          // Refresh the product images state after deletions
          console.log('🔄 Refreshing product images after deletions...');
          await refreshProductImages();
        }
      }

      // --- New Image Upload System ---
      // Upload selected images to Cloudinary first
      console.log('🚀 Starting image upload process...');
      console.log('- Selected images count:', selectedImages.length);
      console.log('- Selected images data:', selectedImages);
      
      if (selectedImages.length > 0 && productId) {
        // Filter for only new files that need to be uploaded
        const newFilesToUpload = selectedImages.filter(img => img.file && !img.isExisting);
        console.log('- New files to upload:', newFilesToUpload);
        
        if (newFilesToUpload.length > 0) {
          console.log('- Calling uploadSelectedImages...');
          const uploadResult = await uploadSelectedImages();
          console.log('- Upload result:', uploadResult);
          
          if (uploadResult.success && uploadResult.imageUrls.length > 0) {
            console.log('- Successfully got image URLs:', uploadResult.imageUrls);
            console.log('- Public IDs:', uploadResult.publicIds);
            console.log('- Upload results details:', uploadResult.uploadResults);
            
            // Add all uploaded images to carousel
            for (let i = 0; i < uploadResult.imageUrls.length; i++) {
              const imageUrl = uploadResult.imageUrls[i];
              const publicId = uploadResult.publicIds?.[i] || '';
              const uploadDetail = uploadResult.uploadResults?.[i] || {};
              
              const imageData = {
                image_url: imageUrl,
                thumbnail_url: uploadDetail.thumbnailUrl || imageUrl,
                medium_url: uploadDetail.mediumUrl || imageUrl,
                large_url: uploadDetail.largeUrl || imageUrl,
                public_id: publicId,
                alt_text: formData.name + (i === 0 ? ' (Primary)' : ''),
                sort_order: i,
                is_primary: i === 0, // First image is primary
                is_active: true
              };
              console.log(`- Adding image ${i + 1} to database:`, imageData);
              const addResult = await suitebiteAPI.addProductImage(productId, imageData);
              console.log(`- Add image ${i + 1} result:`, addResult);
            }
            // Optionally update legacy image_url to first image for fallback
            await suitebiteAPI.updateProduct(productId, { image_url: uploadResult.imageUrls[0] });
            
            // Clear only the new selected images after successful upload, preserve existing ones
            const newFilesToClear = selectedImages.filter(img => img.file && !img.isExisting);
            console.log('- Clearing new uploaded files:', newFilesToClear.length);
            console.log('- Keeping existing images:', selectedImages.filter(img => img.isExisting).length);
            
            // Keep only existing images in the selected images
            setSelectedImages(prev => prev.filter(img => img.isExisting));
          } else if (uploadResult.error) {
            console.error('❌ Upload failed:', uploadResult.error);
            throw new Error('Failed to upload images: ' + uploadResult.error);
          }
        } else {
          console.log('- No new files to upload (only existing images)');
        }
      } else {
        console.log('- No images to upload or no product ID');
      }

      // After adding images, fetch carousel images for display
      if (isNewProduct || mode === 'edit') {
        const res = await suitebiteAPI.getProductImages(productId);
        if (res.success) {
          setProductImages(res.images || []);
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

  // Integrated variation helper functions
  const handleVariationTypeChange = (type, checked) => {
    if (checked) {
      setSelectedVariationTypes(prev => [...prev, type]);
      setSelectedVariationsByType(prev => ({ ...prev, [type]: [] }));
    } else {
      setSelectedVariationTypes(prev => prev.filter(id => id !== type));
      setSelectedVariationsByType(prev => {
        const newState = { ...prev };
        delete newState[type];
        return newState;
      });
    }
  };

  const handleVariationOptionChange = (typeId, optionId, checked) => {
    setSelectedVariationsByType(prev => ({
      ...prev,
      [typeId]: checked 
        ? [...(prev[typeId] || []), optionId]
        : (prev[typeId] || []).filter(id => id !== optionId)
    }));
  };

  const getSelectedOptionsForType = (typeId) => {
    return selectedVariationsByType[typeId] || [];
  };

  const openAddOptionModal = (typeId, typeName) => {
    setNewOptionData({ typeId, typeName, value: '', hexColor: '#000000' });
    setShowAddOptionModal(true);
  };

  // Update handleAddNewOption to robustly add new options for any type
  const handleAddNewOption = async () => {
    setAddOptionError('');
    if (!newOptionData.typeId || !newOptionData.value.trim()) {
      setAddOptionError('Option name is required');
      return;
    }
    setAddOptionLoading(true);
    
    console.log('Adding new variation option:', {
      variation_type_id: newOptionData.typeId,
      option_value: newOptionData.value.trim(),
      option_label: newOptionData.value.trim(),
      hex_color: newOptionData.typeName === 'color' ? newOptionData.hexColor : undefined
    });
    
    try {
      const res = await suitebiteAPI.addVariationOption({
        variation_type_id: newOptionData.typeId,
        option_value: newOptionData.value.trim(),
        option_label: newOptionData.value.trim(),
        hex_color: newOptionData.typeName === 'color' ? newOptionData.hexColor : undefined
      });
      
      console.log('Add variation option response:', res);
      if (res.success && res.option_id) {
        // Add the new option to variationOptions state
        setVariationOptions(prev => [
          ...prev,
          {
            option_id: res.option_id,
            variation_type_id: newOptionData.typeId,
            option_value: newOptionData.value.trim(),
            option_label: newOptionData.value.trim(),
            hex_color: newOptionData.typeName === 'color' ? newOptionData.hexColor : undefined,
            type_name: newOptionData.typeName,
            type_label: variationTypes.find(t => t.variation_type_id === newOptionData.typeId)?.type_label,
            is_active: true
          }
        ]);
        // Immediately select the new option for this type
        setSelectedVariationsByType(prev => ({
          ...prev,
          [newOptionData.typeId]: [...(prev[newOptionData.typeId] || []), res.option_id]
        }));
        setShowAddOptionModal(false);
        setNewOptionData({ typeId: null, typeName: '', value: '', hexColor: '#000000' });
        setAddOptionError('');
      } else {
        setAddOptionError(res.message || 'Failed to add option');
      }
    } catch (err) {
      setAddOptionError('Failed to add option');
    } finally {
      setAddOptionLoading(false);
    }
  };

  const generateVariationPreview = () => {
    const combinations = [];
    const selectedTypes = selectedVariationTypes.filter(typeId => 
      getSelectedOptionsForType(typeId).length > 0
    );

    if (selectedTypes.length === 0) return [];

    const generateCombinations = (typeIndex, currentCombination) => {
      if (typeIndex >= selectedTypes.length) {
        combinations.push([...currentCombination]);
        return;
      }

      const typeId = selectedTypes[typeIndex];
      const options = getSelectedOptionsForType(typeId);
      
      options.forEach(optionId => {
        const option = variationOptions.find(opt => opt.option_id === optionId);
        if (option) {
          currentCombination.push(option);
          generateCombinations(typeIndex + 1, currentCombination);
          currentCombination.pop();
        }
      });
    };

    generateCombinations(0, []);
    return combinations;
  };

  const getTotalVariationCombinations = () => {
    return generateVariationPreview().length;
  };

  // Check if product variations are used in orders
  const checkOrderImpact = async (productId) => {
    try {
      // This would need to be implemented in your backend API
      const response = await suitebiteAPI.checkProductOrderUsage(productId);
      if (response.success && response.hasOrders) {
        setOrderWarning({
          orderCount: response.orderCount,
          lastOrderDate: response.lastOrderDate,
          affectedVariations: response.affectedVariations || []
        });
        return true;
      }
      return false;
    } catch (error) {
      console.warn('Could not check order impact (endpoint not implemented):', error.message);
      // Allow update to proceed even if check fails
      return false;
    }
  };

  const categories = getAllCategories();

  // Handler for adding new variation type (modal)
  const handleAddNewType = async () => {
    
    if (!newTypeData.type_label.trim()) {
      setAddTypeError('Type label is required');
      return;
    }
    
    if (!newTypeData.type_name.trim()) {
      setAddTypeError('Type name could not be generated from label');
      return;
    }
    
    setAddTypeLoading(true);
    
    console.log('Adding new variation type:', {
      type_name: newTypeData.type_name.trim(),
      type_label: newTypeData.type_label.trim(),
    });
    
    try {
      const res = await suitebiteAPI.addVariationType({
        type_name: newTypeData.type_name.trim(),
        type_label: newTypeData.type_label.trim(),
      });
      
      console.log('Add variation type response:', res);
      
      if (res.success && res.variation_type_id) {
        setVariationTypes(prev => [
          ...prev,
          {
            variation_type_id: res.variation_type_id,
            type_name: newTypeData.type_name.trim(),
            type_label: newTypeData.type_label.trim(),
            sort_order: 0, // Default sort order for UI compatibility
            is_active: true
          }
        ]);
        setShowAddTypeModal(false);
        setNewTypeData({ type_name: '', type_label: '' });
        setAddTypeError('');
      } else {
        setAddTypeError(res.message || 'Failed to add variation type');
      }
    } catch (err) {
      console.error('Error adding variation type:', err);
      setAddTypeError('Failed to add variation type');
    } finally {
      setAddTypeLoading(false);
    }
  };

  const [deletingTypeId, setDeletingTypeId] = useState(null);
  const [deletingOptionId, setDeletingOptionId] = useState(null);

  const handleDeleteVariationType = async (variationTypeId) => {
    if (!window.confirm('Are you sure you want to delete this variation type and all its options?')) return;
    setDeletingTypeId(variationTypeId);
    try {
      const res = await suitebiteAPI.deleteVariationType(variationTypeId);
      if (res.success) {
        showNotification('success', 'Variation type deleted successfully');
        await loadInitialData();
      } else {
        showNotification('error', res.message || 'Failed to delete variation type');
      }
    } catch (err) {
      showNotification('error', 'Failed to delete variation type');
    } finally {
      setDeletingTypeId(null);
    }
  };

  const handleDeleteVariationOption = async (optionId) => {
    if (!window.confirm('Are you sure you want to delete this variation option?')) return;
    setDeletingOptionId(optionId);
    try {
      const res = await suitebiteAPI.deleteVariationOption(optionId);
      if (res.success) {
        showNotification('success', 'Variation option deleted successfully');
        await loadInitialData();
      } else {
        showNotification('error', res.message || 'Failed to delete variation option');
      }
    } catch (err) {
      showNotification('error', 'Failed to delete variation option');
    } finally {
      setDeletingOptionId(null);
    }
  };

  // DRY: Extracted image upload section
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

            {/* Product Images Management */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images
              </label>
              {mode === 'edit' && product?.product_id ? (
                <>
                  {/* Current Images Carousel */}
                  
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Upload Images</h4>
                    <ProductImageUploadNew
                      ref={uploadRef}
                      onImagesChange={handleImagesChange}
                      maxFiles={15}
                      disabled={uploadingImages}
                      existingImages={productImages}
                    />
                  </div>
                </>
              ) : (
                // Upload section for add mode
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Upload Images</h4>
                  <ProductImageUploadNew
                    ref={uploadRef}
                    onImagesChange={handleImagesChange}
                    maxFiles={15}
                    disabled={uploadingImages}
                  />
                </div>
              )}
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

            {/* ===================== [Variations Section] ===================== */}
            <div className="mt-8">
              <div className="border-b border-gray-200 mb-4 pb-2 flex items-center gap-2">
                <SwatchIcon className="h-5 w-5 text-[#0097b2]" />
                <h3 className="text-lg font-semibold text-gray-800">[Variations Section]</h3>
                <span className="ml-2 text-xs text-gray-500">(Optional: for products with multiple types/options)</span>
              </div>

              {/* Enable Variations Toggle and selection UI (existing logic) */}
              <div className="flex items-center space-x-3 mb-4">
                <input
                  type="checkbox"
                  id="hasVariations"
                  checked={hasVariations}
                  onChange={(e) => {
                    setHasVariations(e.target.checked);
                    if (!e.target.checked) {
                      setSelectedVariationTypes([]);
                      setSelectedVariationsByType({});
                      setSelectedVariations({ sizes: [], colors: [], designs: [] });
                    }
                  }}
                  className="h-4 w-4 text-[#0097b2] focus:ring-[#0097b2] border-gray-300 rounded"
                />
                <label htmlFor="hasVariations" className="text-sm font-medium text-gray-700">
                  This product has variations
                </label>
              </div>

              {/* Dynamic Variation Form */}
              {hasVariations && (
                <div className="space-y-6 p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <SwatchIcon className="h-4 w-4" />
                    <span>Configure product variations (sizes, colors, styles, etc.)</span>
                  </div>

                  {/* Show validation error for variations */}
                  {errors.variations && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm font-medium">{errors.variations}</p>
                    </div>
                  )}

                  {/* Variation Types Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Variation Types:
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {variationTypes.map(type => (
                        <div key={type.variation_type_id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedVariationTypes.includes(type.variation_type_id)}
                            onChange={(e) => handleVariationTypeChange(type.variation_type_id, e.target.checked)}
                            className="h-4 w-4 text-[#0097b2] focus:ring-[#0097b2] border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">{type.type_label}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteVariationType(type.variation_type_id)}
                            className="ml-1 text-red-500 hover:text-red-700"
                            disabled={deletingTypeId === type.variation_type_id}
                            title="Delete variation type"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add New Variation Type Button */}
                  <button
                    type="button"
                    className="mt-3 text-xs bg-[#0097b2] text-white px-3 py-1 rounded hover:bg-[#007a8e] transition-colors"
                    onClick={() => setShowAddTypeModal(true)}
                  >
                    + Add New Variation Type
                  </button>

                  {/* Add New Variation Type Modal */}
                  {showAddTypeModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blurz-50 flex items-center justify-center p-4">
                      <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Add New Variation Type</h3>
                          <button
                            onClick={() => { setShowAddTypeModal(false); setAddTypeError(''); }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <XMarkIcon className="h-6 w-6" />
                          </button>
                        </div>
                        <div>
                          <div className="mb-4">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Type Label <span className="text-red-500">*</span>
                              <span className="ml-1 text-gray-400" title="This is what users will see. E.g. 'Material'">?</span>
                            </label>
                            <input
                              type="text"
                              value={newTypeData.type_label}
                              onChange={e => setNewTypeData(d => ({ ...d, type_label: e.target.value }))}
                              className="w-full px-2 py-1 border rounded text-xs"
                              placeholder="e.g. Material"
                              required
                            />
                            {/* Show auto-generated type_name as read-only preview */}
                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                              <span>Type Name (auto):</span>
                              <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{newTypeData.type_name}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <button
                              type="button"
                              className="flex-1 px-4 py-2 bg-[#0097b2] text-white rounded-lg hover:bg-[#007a8e] transition-colors"
                              onClick={handleAddNewType}
                              disabled={addTypeLoading}
                            >
                              {addTypeLoading ? 'Adding...' : 'Add Type'}
                            </button>
                            <button
                              type="button"
                              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                              onClick={() => { setShowAddTypeModal(false); setAddTypeError(''); }}
                            >
                              Cancel
                            </button>
                          </div>
                          {addTypeError && <div className="text-xs text-red-500 mt-2 w-full">{addTypeError}</div>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Options per Variation Type */}
                  {selectedVariationTypes.length > 0 && selectedVariationTypes.map(typeId => {
                    const variationType = variationTypes.find(t => t.variation_type_id === typeId);
                    const typeOptions = variationOptions.filter(opt => opt.variation_type_id === typeId);
                    const selectedOptions = getSelectedOptionsForType(typeId);
                    
                    return (
                      <div key={typeId} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-800">
                            {variationType?.type_label} Options:
                          </h4>
                          <button
                            type="button"
                            onClick={() => openAddOptionModal(typeId, variationType?.type_name)}
                            className="text-xs bg-[#0097b2] text-white px-2 py-1 rounded hover:bg-[#007a8e] transition-colors flex items-center space-x-1"
                          >
                            <PlusIcon className="h-3 w-3" />
                            <span>Add new {variationType?.type_label?.toLowerCase()}</span>
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                          {typeOptions.length === 0 && (
                            <div className="col-span-full text-xs text-gray-400 italic p-2">No options yet. Add the first one!</div>
                          )}
                          {typeOptions.map(option => (
                            <label key={option.option_id} className="flex items-center space-x-2 p-2 bg-white rounded border hover:bg-gray-50">
                              <input
                                type="checkbox"
                                checked={selectedOptions.includes(option.option_id)}
                                onChange={(e) => handleVariationOptionChange(typeId, option.option_id, e.target.checked)}
                                className="h-4 w-4 text-[#0097b2] focus:ring-[#0097b2] border-gray-300 rounded"
                              />
                              <div className="flex items-center space-x-2 flex-1 min-w-0">
                                {option.hex_color && (
                                  <div
                                    className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                                    style={{ backgroundColor: option.hex_color }}
                                  />
                                )}
                                <span className="text-sm text-gray-700 truncate">{option.option_label}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteVariationOption(option.option_id)}
                                className="ml-1 text-red-500 hover:text-red-700"
                                disabled={deletingOptionId === option.option_id}
                                title="Delete option"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </label>
                          ))}
                        </div>
                        
                        {selectedOptions.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {selectedOptions.map(optionId => {
                              const option = variationOptions.find(opt => opt.option_id === optionId);
                              return option ? (
                                <span
                                  key={optionId}
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
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
                                    onClick={() => handleVariationOptionChange(typeId, optionId, false)}
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    <XMarkIcon className="h-3 w-3" />
                                  </button>
                                </span>
                              ) : null;
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Preview Table (optional) */}
                  {selectedVariationTypes.length > 0 && getTotalVariationCombinations() > 0 && (
                    <div className="mt-6 p-4 bg-white border rounded-lg">
                      <h4 className="text-sm font-medium text-gray-800 mb-3">Variation Combinations Preview:</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-xs">
                          <thead>
                            <tr className="border-b">
                              {selectedVariationTypes.map(typeId => {
                                const type = variationTypes.find(t => t.variation_type_id === typeId);
                                return (
                                  <th key={typeId} className="text-left p-2 font-medium text-gray-600">
                                    {type?.type_label}
                                  </th>
                                );
                              })}
                            </tr>
                          </thead>
                          <tbody>
                            {generateVariationPreview().slice(0, 10).map((combination, index) => (
                              <tr key={index} className="border-b">
                                {selectedVariationTypes.map(typeId => {
                                  const option = combination.find(opt => opt.variation_type_id === typeId);
                                  return (
                                    <td key={typeId} className="p-2 text-gray-700">
                                      {option ? (
                                        <div className="flex items-center space-x-2">
                                          {option.hex_color && (
                                            <div
                                              className="w-3 h-3 rounded-full border border-gray-300"
                                              style={{ backgroundColor: option.hex_color }}
                                            />
                                          )}
                                          <span>{option.option_label}</span>
                                        </div>
                                      ) : '-'}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {getTotalVariationCombinations() > 10 && (
                          <p className="text-xs text-gray-500 mt-2 text-center">
                            Showing first 10 of {getTotalVariationCombinations()} total combinations
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* ===================== [End Variations Section] ===================== */}
          </div>
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
            {loading ? (mode === 'edit' ? 'Updating Product...' : 'Creating Product...') : 
             uploadingImages ? 'Uploading Images...' : 
             mode === 'edit' ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>

      {/* Add Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
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

      {/* Add Option Modal */}
      {showAddOptionModal && (
        <div className="fixed inset-0 bg-black/40  z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Add New {variationTypes.find(t => t.variation_type_id === newOptionData.typeId)?.type_label}
              </h3>
              <button
                onClick={() => setShowAddOptionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Option Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newOptionData.value}
                  onChange={(e) => setNewOptionData(prev => ({ ...prev, value: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
                  placeholder={`Enter ${newOptionData.typeName} name`}
                />
              </div>
              
              {newOptionData.typeName === 'color' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={newOptionData.hexColor}
                      onChange={(e) => setNewOptionData(prev => ({ ...prev, hexColor: e.target.value }))}
                      className="w-12 h-10 rounded border border-gray-300"
                    />
                    <div
                      className="w-10 h-10 rounded border border-gray-300"
                      style={{ backgroundColor: newOptionData.hexColor }}
                    />
                    <span className="text-sm text-gray-600">{newOptionData.hexColor}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={() => setShowAddOptionModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddNewOption}
                className="flex-1 px-4 py-2 bg-[#0097b2] text-white rounded-lg hover:bg-[#007a8e] transition-colors"
              >
                Add Option
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Confirmation Modal */}
      {showDeleteCategoryModal && categoryToDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
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

      {/* Order Impact Warning Modal */}
      {showOrderWarningModal && orderWarning && (
        <div className="fixed inset-0 bg-black/40  z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">⚠️ Product Used in Orders</h3>
              <button
                onClick={() => {
                  setShowOrderWarningModal(false);
                  setPendingSubmit(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-start gap-3 mb-4">
                <ExclamationTriangleIcon className="h-8 w-8 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    This product has been used in {orderWarning.orderCount} order{orderWarning.orderCount !== 1 ? 's' : ''}.
                  </p>
                  <p className="text-xs text-gray-600 mb-3">
                    Last order: {orderWarning.lastOrderDate ? new Date(orderWarning.lastOrderDate).toLocaleDateString() : 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-700">
                    Changing variations may affect:
                  </p>
                  <ul className="text-sm text-gray-600 mt-2 ml-4 list-disc">
                    <li>Order history and tracking</li>
                    <li>Customer refund/exchange requests</li>
                    <li>Inventory management</li>
                    <li>Analytics and reporting</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowOrderWarningModal(false);
                  setPendingSubmit(false);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setPendingSubmit(true);
                  executeSubmit();
                }}
                className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Continue Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProductForm;