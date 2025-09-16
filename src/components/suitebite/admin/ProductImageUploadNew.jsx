import React, { useState, useRef, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react';
import { suitebiteAPI } from '../../../utils/suitebiteAPI';
import { 
  PhotoIcon, 
  XMarkIcon, 
  ArrowUpTrayIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

/**
 * Enhanced ProductImageUpload Component
 * 
 * Features:
 * - Preview images without instant upload
 * - Delete/X button on previews
 * - Only uploads to Cloudinary when requested (product create/update)
 * - Multiple image support with previews
 * - Drag and drop functionality
 * - File validation
 */
const ProductImageUploadNew = forwardRef(({ 
  currentImageUrl = '', 
  existingImages = [], // Array of existing product images
  onImagesChange, // Callback when files selection changes
  multiple = true,
  maxFiles = 10,
  disabled = false
}, ref) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);
  const existingImagesLoadedRef = useRef(false);

  // Initialize with existing images
  useEffect(() => {
    // Only load existing images when they are provided and not already loaded
    if (existingImages && existingImages.length > 0 && !existingImagesLoadedRef.current) {
      const imagesToLoad = [];
      
      // Add current image if exists and not already in existingImages
      if (currentImageUrl && !existingImages.some(img => img.image_url === currentImageUrl)) {
        imagesToLoad.push({
          id: 'current',
          preview: currentImageUrl,
          name: 'Current Image',
          isExisting: true,
          url: currentImageUrl
        });
      }
      
      // Add existing product images
      existingImages.forEach((img, index) => {
        imagesToLoad.push({
          id: `existing-${img.image_id || index}`,
          preview: img.image_url,
          name: img.alt_text || `Product Image ${index + 1}`,
          isExisting: true,
          url: img.image_url,
          image_id: img.image_id // Include image_id for deletion tracking
        });
      });
      
      if (imagesToLoad.length > 0) {
        setSelectedFiles(prev => {
          // Keep any new files (non-existing) that were already selected
          const newFiles = prev.filter(f => !f.isExisting);
          return [...imagesToLoad, ...newFiles];
        });
        existingImagesLoadedRef.current = true;
      }
    }
  }, [existingImages, currentImageUrl]);

  // Reset loaded flag when component receives new existingImages (different product)
  useEffect(() => {
    // Reset the flag when existingImages array reference changes
    existingImagesLoadedRef.current = false;
  }, [existingImages]);

  // Notify parent when files change
  useEffect(() => {
    const fileData = selectedFiles.map(file => ({
      file: file.file || null,
      preview: file.preview,
      isExisting: file.isExisting || false,
      url: file.url || null,
      image_id: file.image_id || null // Include image_id for deletion tracking
    }));
    onImagesChange?.(fileData);
  }, [selectedFiles]); // Removed onImagesChange from dependencies

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  // Process selected files
  const handleFiles = (newFiles) => {
    if (disabled) return;

    const validFiles = [];
    const fileErrors = [];

    Array.from(newFiles).forEach((file, index) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        fileErrors.push(`${file.name}: Not an image file`);
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        fileErrors.push(`${file.name}: File too large (max 10MB)`);
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        fileErrors.push(`${file.name}: Unsupported format`);
        return;
      }

      validFiles.push({
        id: Date.now() + index,
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        isExisting: false
      });
    });

    if (fileErrors.length > 0) {
      setErrors(fileErrors);
    } else {
      setErrors([]);
    }

    // Handle single vs multiple files
    if (multiple) {
      // Add to existing files (up to maxFiles total)
      const currentCount = selectedFiles.length;
      const availableSlots = maxFiles - currentCount;
      const filesToAdd = validFiles.slice(0, availableSlots);
      
      if (filesToAdd.length > 0) {
        setSelectedFiles(prev => [...prev, ...filesToAdd]);
      }
      
      if (validFiles.length > availableSlots) {
        setErrors(prev => [...prev, `Only ${availableSlots} more files can be added (${maxFiles} max total)`]);
      }
    } else {
      // Single file mode - replace current selection but preserve existing images
      if (validFiles.length > 0) {
        // Clear any non-existing previews before setting new one
        selectedFiles.forEach(file => {
          if (file.preview && !file.isExisting) {
            URL.revokeObjectURL(file.preview);
          }
        });
        const existingFiles = selectedFiles.filter(f => f.isExisting);
        setSelectedFiles([...existingFiles, validFiles[0]]);
      }
    }
  };

  // Handle file input change
  const onInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  // Open file dialog
  const onButtonClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  // Remove file from selection
  const removeFile = (fileId) => {
    setSelectedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  // Clear all files
  const clearAllFiles = () => {
    selectedFiles.forEach(file => {
      if (file.preview && !file.isExisting) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setSelectedFiles([]);
    setErrors([]);
  };

  // Upload files to Cloudinary (called externally)
  const uploadToCloudinary = async () => {
    const filesToUpload = selectedFiles.filter(f => f.file && !f.isExisting);
    
    console.log('🔍 Upload Debug Info:');
    console.log('- Selected files:', selectedFiles);
    console.log('- Files to upload:', filesToUpload);
    console.log('- Files to upload count:', filesToUpload.length);
    
    if (filesToUpload.length === 0) {
      const existingUrls = selectedFiles.filter(f => f.isExisting && f.url).map(f => f.url);
      console.log('- No new files to upload, returning existing URLs:', existingUrls);
      return { success: true, imageUrls: existingUrls };
    }

    setUploading(true);
    setErrors([]);

    try {
      console.log('- Starting Cloudinary upload...');
      const uploadPromises = filesToUpload.map((fileData, index) => {
        console.log(`- Uploading file ${index + 1}:`, fileData.file.name, fileData.file.type);
        return suitebiteAPI.uploadGenericProductImage(fileData.file, 'products');
      });
      
      const results = await Promise.all(uploadPromises);
      console.log('- Upload results:', results);
      
      const uploadedUrls = results.map(r => r.imageUrl || r.url || r.secure_url).filter(Boolean);
      const uploadedPublicIds = results.map(r => r.public_id || r.publicId || '').filter(Boolean);
      console.log('- Extracted URLs:', uploadedUrls);
      console.log('- Extracted Public IDs:', uploadedPublicIds);
      
      // Include existing image URLs
      const existingUrls = selectedFiles.filter(f => f.isExisting && f.url).map(f => f.url);
      const allUrls = [...existingUrls, ...uploadedUrls];
      
      console.log('- Final result URLs:', allUrls);

      setUploading(false);
      return { 
        success: true, 
        imageUrls: allUrls,
        publicIds: uploadedPublicIds,
        uploadResults: results
      };
    } catch (error) {
      console.error('❌ Upload error:', error);
      setErrors([error.message || 'Failed to upload images']);
      setUploading(false);
      return { success: false, error: error.message };
    }
  };

  // Expose upload function to parent via ref
  useImperativeHandle(ref, () => uploadToCloudinary, [selectedFiles]);

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const newFilesCount = selectedFiles.filter(f => !f.isExisting).length;
  const totalFilesCount = selectedFiles.length;

  return (
    <div className="product-image-upload space-y-4">
      {/* Upload Area */}
      <div className="upload-area">
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${dragActive 
              ? 'border-[#0097b2] bg-[#0097b2]/5' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${disabled ? 'pointer-events-none opacity-50' : ''}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
        >
          <input
            ref={inputRef}
            type="file"
            multiple={multiple}
            accept="image/*"
            onChange={onInputChange}
            className="hidden"
            disabled={disabled}
          />
          
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 text-gray-400">
              {uploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0097b2] mx-auto"></div>
              ) : (
                <PhotoIcon className="w-12 h-12" />
              )}
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-900">
                {dragActive ? 'Drop images here' : 'Select product images'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Drag and drop {multiple ? `up to ${maxFiles} images` : 'an image'} here, or click to select
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Supports: JPEG, PNG, GIF, WebP (max 10MB each)
              </p>
            </div>

            {uploading && (
              <div className="text-sm text-[#0097b2] font-medium">
                Uploading to Cloudinary...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* File Preview Section */}
      {totalFilesCount > 0 && (
        <div className="selected-files">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">
              Selected Images ({newFilesCount} new{totalFilesCount > newFilesCount ? `, ${totalFilesCount - newFilesCount} existing` : ''})
            </label>
            {totalFilesCount > 0 && (
              <button
                onClick={clearAllFiles}
                className="text-sm text-red-600 hover:text-red-800"
                disabled={disabled}
              >
                Clear All
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {selectedFiles.map((file) => (
              <div key={file.id} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                  disabled={disabled}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
                
                {/* File info */}
                <div className="mt-1 text-xs text-gray-500 truncate">
                  <div className="font-medium truncate">{file.name}</div>
                  {file.size && <div>{formatFileSize(file.size)}</div>}
                  {file.isExisting && (
                    <div className="text-blue-600">Existing</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="errors bg-red-50 border border-red-200 rounded-md p-3">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Upload Errors</h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Status */}
      {uploading && (
        <div className="upload-status bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-sm text-blue-700">Uploading images to Cloudinary...</span>
          </div>
        </div>
      )}
    </div>
  );
});

ProductImageUploadNew.displayName = 'ProductImageUploadNew';

export default ProductImageUploadNew;
