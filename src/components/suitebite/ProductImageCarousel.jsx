import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const ProductImageCarousel = ({ images, productName, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesArray, setImagesArray] = useState([]);

  // Parse images from different sources
  useEffect(() => {
    let imageList = [];
    
    // If images is an array of objects (from sl_product_images)
    if (Array.isArray(images) && images.length > 0) {
      imageList = images.map(img => ({
        url: img.image_url,
        thumbnail: img.thumbnail_url || img.image_url,
        alt: img.alt_text || productName
      }));
    }
    // If images is a single string (legacy image_url or single URL)
    else if (typeof images === 'string' && images.trim() !== '') {
      // Check if it looks like a JSON array (starts with '[')
      if (images.trim().startsWith('[') && images.trim().endsWith(']')) {
        try {
          const parsedImages = JSON.parse(images);
          if (Array.isArray(parsedImages)) {
            imageList = parsedImages.map((url, index) => ({
              url,
              thumbnail: url,
              alt: `${productName} - Image ${index + 1}`
            }));
          }
        } catch (error) {
          console.warn('Failed to parse images JSON:', error);
          // Fallback to treating as single URL
          imageList = [{
            url: images,
            thumbnail: images,
            alt: productName
          }];
        }
      } else {
        // Treat as single URL
        imageList = [{
          url: images,
          thumbnail: images,
          alt: productName
        }];
      }
    }

    setImagesArray(imageList);
    setCurrentIndex(0);
  }, [images, productName]);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === imagesArray.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? imagesArray.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  // If no images, show placeholder
  if (imagesArray.length === 0) {
    return (
      <div className={`relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 ${className}`}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <svg className="h-12 w-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs text-gray-400">No Image</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-48 overflow-hidden group ${className}`}>
      {/* Main Image */}
      <div className="w-full h-full">
        <img
          src={imagesArray[currentIndex]?.url}
          alt={imagesArray[currentIndex]?.alt || productName}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        
        {/* Fallback for failed images */}
        <div className="w-full h-full flex items-center justify-center bg-gray-100" style={{ display: 'none' }}>
          <div className="text-center">
            <svg className="h-8 w-8 text-gray-300 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs text-gray-400">Image Error</p>
          </div>
        </div>
      </div>

      {/* Navigation Arrows (only show if multiple images) */}
      {imagesArray.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-1.5 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="h-4 w-4 text-gray-700" />
          </button>

          {/* Next Button */}
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-1.5 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Next image"
          >
            <ChevronRightIcon className="h-4 w-4 text-gray-700" />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100">
            {currentIndex + 1} / {imagesArray.length}
          </div>
        </>
      )}

      {/* Thumbnail Dots (only show if multiple images) */}
      {imagesArray.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {imagesArray.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-white' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Multiple Images Indicator (always visible when multiple images) */}
      {imagesArray.length > 1 && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
          <svg className="h-3 w-3 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
          </svg>
          {imagesArray.length}
        </div>
      )}
    </div>
  );
};

export default ProductImageCarousel; 