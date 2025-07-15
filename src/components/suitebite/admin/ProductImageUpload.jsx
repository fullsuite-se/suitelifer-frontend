import React, { useState, useRef, useCallback } from 'react';
import { suitebiteAPI } from '../../../utils/suitebiteAPI';
import { 
  PhotoIcon, 
  XMarkIcon, 
  ArrowUpTrayIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

/**
 * ProductImageUpload Component
 * 
 * Comprehensive image upload component for Suitebite products with:
 * - Drag and drop functionality
 * - Image preview
 * - File validation
 * - Multiple upload support
 * - Progress tracking
 * - Cloudinary integration
 */
const ProductImageUpload = ({ 
  productId, 
  currentImageUrl = '', 
  onImageUploaded, 
  onError,
  multiple = false,
  maxFiles = 5 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [preview, setPreview] = useState(currentImageUrl);
  const [errors, setErrors] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  
  const inputRef = useRef(null);

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  // Handle file drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  // Handle file selection
  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList);
    
    // Validate files
    const validFiles = [];
    const fileErrors = [];

    newFiles.forEach((file, index) => {
      const validation = suitebiteAPI.validateImageFile(file);
      
      if (validation.isValid) {
        validFiles.push({
          file,
          id: Date.now() + index,
          preview: URL.createObjectURL(file),
          name: file.name,
          size: file.size
        });
      } else {
        fileErrors.push(`${file.name}: ${validation.errors.join(', ')}`);
      }
    });

    if (fileErrors.length > 0) {
      setErrors(fileErrors);
    } else {
      setErrors([]);
    }

    // Limit number of files
    const limitedFiles = multiple 
      ? validFiles.slice(0, maxFiles)
      : validFiles.slice(0, 1);

    setFiles(limitedFiles);
    
    if (!multiple && limitedFiles.length > 0) {
      setPreview(limitedFiles[0].preview);
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
    inputRef.current?.click();
  };

  // Remove file from selection
  const removeFile = (fileId) => {
    setFiles(files.filter(file => file.id !== fileId));
    if (!multiple && files.length === 1) {
      setPreview(currentImageUrl);
    }
  };

  // Upload files
  const uploadFiles = async () => {
    if (files.length === 0 || !productId) return;

    setUploading(true);
    setErrors([]);

    try {
      if (multiple) {
        // Upload multiple files
        const fileArray = files.map(f => f.file);
        const response = await suitebiteAPI.uploadMultipleProductImages(productId, fileArray);
        
        if (response.success) {
          setUploadedImages(response.images);
          onImageUploaded?.(response.images);
          setFiles([]);
          setPreview('');
        } else {
          throw new Error(response.message || 'Upload failed');
        }
      } else {
        // Upload single file
        const response = await suitebiteAPI.uploadProductImage(productId, files[0].file);
        
        if (response.success) {
          setUploadedImages([response.images]);
          setPreview(response.images.original);
          onImageUploaded?.(response.images);
          setFiles([]);
        } else {
          throw new Error(response.message || 'Upload failed');
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      setErrors([error.message || 'Failed to upload images']);
      onError?.(error);
    } finally {
      setUploading(false);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="product-image-upload space-y-4">
      {/* Current Image Preview */}
      {(preview || currentImageUrl) && (
        <div className="current-image">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Product Image
          </label>
          <div className="relative inline-block">
            <img
              src={preview || currentImageUrl}
              alt="Product preview"
              className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
            />
            {preview && preview !== currentImageUrl && (
              <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                <CheckCircleIcon className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div className="upload-area">
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${dragActive 
              ? 'border-[#0097b2] bg-[#0097b2]/5' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${uploading ? 'pointer-events-none opacity-50' : ''}
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
                {dragActive ? 'Drop images here' : 'Upload product images'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Drag and drop {multiple ? 'up to ' + maxFiles + ' images' : 'an image'} here, or click to select
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

      {/* Selected Files Preview */}
      {files.length > 0 && (
        <div className="selected-files">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Selected Images ({files.length}/{multiple ? maxFiles : 1})
          </label>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {files.map((file) => (
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
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
                
                {/* File info */}
                <div className="mt-1 text-xs text-gray-500 truncate">
                  <div className="font-medium truncate">{file.name}</div>
                  <div>{formatFileSize(file.size)}</div>
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

      {/* Upload Success */}
      {uploadedImages.length > 0 && (
        <div className="success bg-green-50 border border-green-200 rounded-md p-3">
          <div className="flex">
            <CheckCircleIcon className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Upload Successful</h3>
              <p className="mt-1 text-sm text-green-700">
                {uploadedImages.length} image{uploadedImages.length > 1 ? 's' : ''} uploaded successfully to Cloudinary
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Button */}
      {files.length > 0 && (
        <div className="upload-actions">
          <button
            onClick={uploadFiles}
            disabled={uploading}
            className="w-full bg-[#0097b2] hover:bg-[#007a8e] disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Uploading...
              </>
            ) : (
              <>
                <ArrowUpTrayIcon className="w-5 h-5" />
                Upload {files.length} Image{files.length > 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      )}

      {/* Tips */}
      <div className="tips text-xs text-gray-500 bg-gray-50 rounded-md p-3">
        <h4 className="font-medium mb-2">💡 Tips for best results:</h4>
        <ul className="space-y-1">
          <li>• Use high-quality images (at least 800x800px)</li>
          <li>• Square images work best for product displays</li>
          <li>• Images will be automatically optimized and resized</li>
          <li>• Multiple sizes (thumbnail, medium, original) are generated</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductImageUpload; 