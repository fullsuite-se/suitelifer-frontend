import React, { useState, useEffect } from 'react';
import { suitebiteAPI } from '../../utils/suitebiteAPI';
import ProductImageUpload from '../../components/suitebite/admin/ProductImageUpload';
import { useCategoryStore } from '../../store/stores/categoryStore';
import { 
  PhotoIcon, 
  TagIcon, 
  CubeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

/**
 * AdminProductImageTest Component
 * 
 * Test page for product image upload functionality
 * Displays current product state and allows testing image uploads
 */
const AdminProductImageTest = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [categoryStats, setCategoryStats] = useState({});
  
  const { getCategoryColor, getCategoryBgColor } = useCategoryStore();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await suitebiteAPI.getProducts();
      
      if (response.success) {
        setProducts(response.products);
        
        // Calculate category statistics
        const stats = response.products.reduce((acc, product) => {
          const category = product.category || 'UNCATEGORIZED';
          if (!acc[category]) {
            acc[category] = { total: 0, withImages: 0, withoutImages: 0 };
          }
          acc[category].total++;
          
          if (product.image_url && product.image_url.trim() !== '') {
            acc[category].withImages++;
          } else {
            acc[category].withoutImages++;
          }
          
          return acc;
        }, {});
        
        setCategoryStats(stats);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Error loading products: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUploaded = (images) => {
    setUploadSuccess(`Image uploaded successfully! Original: ${images.original}`);
    
    // Refresh the selected product
    if (selectedProduct) {
      const updatedProduct = { 
        ...selectedProduct, 
        image_url: images.original 
      };
      setSelectedProduct(updatedProduct);
      
      // Update the products list
      setProducts(products.map(p => 
        p.product_id === selectedProduct.product_id 
          ? updatedProduct 
          : p
      ));
    }
    
    // Clear success message after 5 seconds
    setTimeout(() => setUploadSuccess(''), 5000);
  };

  const handleUploadError = (error) => {
    setError('Upload failed: ' + error.message);
    setTimeout(() => setError(''), 5000);
  };

  const generateThumbnail = (imageUrl) => {
    return suitebiteAPI.generateThumbnailUrl(imageUrl, 150);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0097b2]"></div>
      </div>
    );
  }

  return (
    <div className="admin-product-image-test p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Product Image Management Test
        </h1>
        <p className="text-gray-600">
          Test the new Cloudinary-powered image upload system for Suitebite products
        </p>
      </div>

      {/* Success/Error Messages */}
      {uploadSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <CheckCircleIcon className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Upload Successful</h3>
              <p className="mt-1 text-sm text-green-700">{uploadSuccess}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Products List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <CubeIcon className="w-6 h-6" />
                Products ({products.length})
              </h2>
            </div>
            
            <div className="p-6">
              {/* Category Statistics */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Category Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(categoryStats).map(([category, stats]) => (
                    <div 
                      key={category}
                      className="p-3 rounded-lg border"
                      style={{ backgroundColor: getCategoryBgColor(category) }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <TagIcon 
                          className="w-4 h-4" 
                          style={{ color: getCategoryColor(category) }}
                        />
                        <span className="text-sm font-medium">{category}</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        Total: {stats.total} | Images: {stats.withImages}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <div 
                    key={product.product_id}
                    className={`
                      p-4 border rounded-lg cursor-pointer transition-all
                      ${selectedProduct?.product_id === product.product_id 
                        ? 'border-[#0097b2] bg-[#0097b2]/5' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {product.image_url ? (
                          <img
                            src={generateThumbnail(product.image_url)}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <PhotoIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </h4>
                        <div className="mt-1 flex items-center gap-2">
                          <span 
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: getCategoryBgColor(product.category),
                              color: getCategoryColor(product.category)
                            }}
                          >
                            {product.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            {product.price_points} pts
                          </span>
                        </div>
                        <div className="mt-1 text-xs">
                          {product.image_url ? (
                            <span className="text-green-600">✓ Has image</span>
                          ) : (
                            <span className="text-orange-600">⚠ No image</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Image Upload Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <PhotoIcon className="w-6 h-6" />
                Image Upload
              </h2>
            </div>
            
            <div className="p-6">
              {selectedProduct ? (
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {selectedProduct.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span 
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                        style={{
                          backgroundColor: getCategoryBgColor(selectedProduct.category),
                          color: getCategoryColor(selectedProduct.category)
                        }}
                      >
                        {selectedProduct.category}
                      </span>
                      <span className="text-sm text-gray-500">
                        {selectedProduct.price_points} points
                      </span>
                    </div>
                    
                    {selectedProduct.description && (
                      <p className="text-sm text-gray-600 mb-4">
                        {selectedProduct.description}
                      </p>
                    )}
                  </div>

                  <ProductImageUpload
                    productId={selectedProduct.product_id}
                    currentImageUrl={selectedProduct.image_url}
                    onImageUploaded={handleImageUploaded}
                    onError={handleUploadError}
                    multiple={false}
                  />
                </div>
              ) : (
                <div className="text-center py-8">
                  <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a Product
                  </h3>
                  <p className="text-sm text-gray-500">
                    Choose a product from the list to upload or update its image
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <div className="text-2xl font-bold text-[#0097b2]">
              {products.length}
            </div>
            <div className="text-sm text-gray-600">Total Products</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {products.filter(p => p.image_url && p.image_url.trim() !== '').length}
            </div>
            <div className="text-sm text-gray-600">With Images</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {products.filter(p => !p.image_url || p.image_url.trim() === '').length}
            </div>
            <div className="text-sm text-gray-600">Without Images</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {Object.keys(categoryStats).length}
            </div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductImageTest; 