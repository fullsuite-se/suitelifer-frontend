import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { suitebiteAPI } from '../../../utils/suitebiteAPI';
import { toast } from 'react-hot-toast';
import ImageTest from './ImageTest';

const ProductImageCarousel = ({ productId, onImagesChange }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Load images on component mount
  useEffect(() => {
    if (productId) {
      loadImages();
    }
  }, [productId]);

  const loadImages = async () => {
    try {
      console.log('🔍 ProductImageCarousel - Loading images for product ID:', productId);
      setLoading(true);
      const response = await suitebiteAPI.getProductImages(productId);
      console.log('🔍 ProductImageCarousel - API response:', response);
      if (response.success) {
        console.log('🔍 ProductImageCarousel - Setting images:', response.images);
        console.log('🔍 ProductImageCarousel - Images count:', response.images?.length || 0);
        
        // Debug each image's URLs
        response.images?.forEach((image, index) => {
          console.log(`🔍 ProductImageCarousel - Image ${index}:`, {
            id: image.image_id,
            image_url: image.image_url,
            medium_url: image.medium_url,
            thumbnail_url: image.thumbnail_url
          });
        });
        
        setImages(response.images || []);
      } else {
        console.error('🔍 ProductImageCarousel - API returned error:', response.message);
      }
    } catch (error) {
      console.error('🔍 ProductImageCarousel - Error loading product images:', error);
      toast.error('Failed to load product images');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    try {
      setUploading(true);
      
      for (const file of files) {
        // Upload to Cloudinary first
        const uploadResponse = await suitebiteAPI.uploadGenericProductImage(file, 'products');
        
        if (uploadResponse.success) {
          // Add image to product
          const imageData = {
            image_url: uploadResponse.imageUrl,
            thumbnail_url: uploadResponse.thumbnailUrl,
            medium_url: uploadResponse.mediumUrl,
            large_url: uploadResponse.largeUrl,
            public_id: uploadResponse.publicId,
            alt_text: file.name.replace(/\.[^/.]+$/, '') // Remove extension for alt text
          };

          await suitebiteAPI.addProductImage(productId, imageData);
        } else {
          throw new Error('Upload failed');
        }
      }

      // Reload images
      await loadImages();
      toast.success('Images uploaded successfully!');
      
      if (onImagesChange) {
        onImagesChange();
      }
    } catch (error) {
      console.error('🔍 ProductImageCarousel - Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    console.log('🔍 ProductImageCarousel - handleDeleteImage called with imageId:', imageId);
    console.log('🔍 ProductImageCarousel - Current images count before deletion:', images.length);
    
    if (!confirm('Are you sure you want to delete this image?')) return;

    // Optimistically remove the image from UI immediately
    const imageToDelete = images.find(img => img.image_id === imageId);
    console.log('🔍 ProductImageCarousel - Image to delete:', imageToDelete);
    
    const updatedImages = images.filter(img => img.image_id !== imageId);
    console.log('🔍 ProductImageCarousel - Updated images count after filter:', updatedImages.length);
    setImages(updatedImages);

    try {
      console.log('🔍 ProductImageCarousel - Attempting to delete image ID:', imageId);
      console.log('🔍 ProductImageCarousel - About to call suitebiteAPI.deleteProductImage');
      
      const response = await suitebiteAPI.deleteProductImage(imageId);
      console.log('🔍 ProductImageCarousel - Delete response:', response);
      
      if (response.success) {
        console.log('🔍 ProductImageCarousel - Delete successful, reloading images...');
        toast.success('Image deleted successfully!');
        
        // Reload images from server to ensure sync
        await loadImages();
        
        if (onImagesChange) {
          console.log('🔍 ProductImageCarousel - Calling onImagesChange callback');
          onImagesChange();
        }
      } else {
        console.error('🔍 ProductImageCarousel - Delete API returned error:', response.message);
        throw new Error(response.message || 'Delete failed');
      }
    } catch (error) {
      console.error('🔍 ProductImageCarousel - Error deleting image:', error);
      console.error('🔍 ProductImageCarousel - Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url
      });
      
      // If deletion failed, restore the image to the UI
      if (imageToDelete) {
        console.log('🔍 ProductImageCarousel - Restoring image to UI due to error');
        setImages(prevImages => [...prevImages, imageToDelete].sort((a, b) => a.sort_order - b.sort_order));
      }
      
      toast.error(`Failed to delete image: ${error.message}`);
    }
  };

  const handleSetPrimary = async (imageId) => {
    try {
      await suitebiteAPI.setPrimaryImage(imageId);
      await loadImages();
      toast.success('Primary image updated!');
      
      if (onImagesChange) {
        onImagesChange();
      }
    } catch (error) {
      console.error('Error setting primary image:', error);
      toast.error('Failed to set primary image');
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setImages(items);

    // Update order in backend
    try {
      const imageIds = items.map(img => img.image_id);
      await suitebiteAPI.reorderProductImages(productId, imageIds);
      toast.success('Image order updated!');
      
      if (onImagesChange) {
        onImagesChange();
      }
    } catch (error) {
      console.error('Error reordering images:', error);
      toast.error('Failed to update image order');
      // Reload original order
      await loadImages();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Upload Section */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className={`cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
            uploading
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Uploading...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Upload Images
            </>
          )}
        </label>
        <p className="mt-2 text-sm text-gray-500">
          Click to upload multiple images (JPEG, PNG, GIF, WebP up to 10MB each, max 10 images)
        </p>
      </div>

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Product Images ({images.length})</h3>
          
          {/* Image Test Section */}
          {images.length > 0 && (
            <div className="mb-4">
              <h4 className="text-md font-medium text-gray-700 mb-2">Image Test (First Image)</h4>
              <ImageTest imageUrl={images[0].medium_url || images[0].image_url} />
            </div>
          )}
          
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="images" direction="horizontal">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                  {images.map((image, index) => (
                    <Draggable key={image.image_id} draggableId={image.image_id.toString()} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`relative group cursor-move ${
                            snapshot.isDragging ? 'opacity-50' : ''
                          }`}
                        >
                                                    <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors bg-gray-100">
                            <img
                              src={`${image.medium_url || image.image_url}?t=${Date.now()}`}
                              alt={image.alt_text || 'Product image'}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                console.error('🔍 ProductImageCarousel - Image failed to load:', e.target.src);
                                // Fallback to original URL if medium_url fails
                                if (e.target.src !== image.image_url) {
                                  console.log('🔍 ProductImageCarousel - Trying fallback URL:', image.image_url);
                                  e.target.src = `${image.image_url}?t=${Date.now()}`;
                                }
                              }}
                              onLoad={(e) => {
                                console.log('🔍 ProductImageCarousel - Image loaded successfully:', e.target.src);
                                console.log('🔍 ProductImageCarousel - Image natural dimensions:', e.target.naturalWidth, 'x', e.target.naturalHeight);
                                console.log('🔍 ProductImageCarousel - Image display dimensions:', e.target.width, 'x', e.target.height);
                              }}
                            />
                            
                            {/* Overlay with delete button only */}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <button
                                  onClick={(e) => {
                                    console.log('🔍 ProductImageCarousel - Delete button clicked for image ID:', image.image_id);
                                    e.stopPropagation();
                                    console.log('🔍 ProductImageCarousel - About to call handleDeleteImage');
                                    handleDeleteImage(image.image_id);
                                  }}
                                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
                                  title="Delete"
                                  type="button"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            
                            {/* Primary badge */}
                            {image.is_primary && (
                              <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                Primary
                              </div>
                            )}
                            
                            {/* Sort order badge */}
                            <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
                              {image.sort_order}
                            </div>
                            
                            {/* Debug button - temporary */}
                            <button
                              onClick={() => {
                                console.log('🔍 ProductImageCarousel - Debug image data:', image);
                                console.log('🔍 ProductImageCarousel - Image URL being used:', image.medium_url || image.image_url);
                                window.open(image.image_url, '_blank');
                              }}
                              className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full"
                              title="Debug - Open image in new tab"
                            >
                              Debug
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          
          <p className="text-sm text-gray-500">
            Drag and drop to reorder images. The first image will be the primary product image.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductImageCarousel; 