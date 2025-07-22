// Test script for Suitebite shop functionality
// This file can be run in browser console to test the complete data flow

const testSuitebiteShopFunctionality = async () => {
  console.log('🧪 Testing Suitebite Shop Functionality...');
  
  try {
    // 1. Test product loading with images and variations
    console.log('\n1️⃣ Testing Product Loading...');
    const productsResponse = await suitebiteAPI.getProductsWithVariations('true');
    if (productsResponse.success) {
      console.log(`✅ Loaded ${productsResponse.products.length} products`);
      
      // Check product image data
      const productWithImages = productsResponse.products.find(p => p.images && p.images.length > 0);
      if (productWithImages) {
        console.log(`📸 Product with images found: "${productWithImages.name}"`);
        console.log('Images:', productWithImages.images);
      } else {
        console.log('⚠️ No products with images found');
      }
      
      // Check product variations
      const productWithVariations = productsResponse.products.find(p => p.variations && p.variations.length > 0);
      if (productWithVariations) {
        console.log(`🎨 Product with variations found: "${productWithVariations.name}"`);
        console.log('Variations:', productWithVariations.variations);
      } else {
        console.log('⚠️ No products with variations found');
      }
    } else {
      console.error('❌ Failed to load products:', productsResponse);
      return;
    }
    
    // 2. Test cart functionality
    console.log('\n2️⃣ Testing Cart Functionality...');
    const cartResponse = await suitebiteAPI.getCart();
    if (cartResponse.success) {
      const cartItems = cartResponse.data?.cartItems || [];
      console.log(`🛒 Cart has ${cartItems.length} items`);
      
      if (cartItems.length > 0) {
        cartItems.forEach((item, index) => {
          console.log(`Cart Item ${index + 1}:`, {
            name: item.product_name,
            hasImages: Boolean(item.product_images?.length || item.images?.length || item.image_url),
            hasVariations: Boolean(item.variations?.length || item.variation_details),
            variations: item.variations || item.variation_details
          });
        });
      } else {
        console.log('🛒 Cart is empty');
      }
    } else {
      console.error('❌ Failed to load cart:', cartResponse);
    }
    
    // 3. Test order history
    console.log('\n3️⃣ Testing Order History...');
    const ordersResponse = await suitebiteAPI.getOrderHistory();
    if (ordersResponse.success) {
      console.log(`📦 Found ${ordersResponse.orders.length} orders`);
      
      if (ordersResponse.orders.length > 0) {
        const orderWithItems = ordersResponse.orders.find(o => o.orderItems && o.orderItems.length > 0);
        if (orderWithItems) {
          console.log(`📦 Order with items found: #${orderWithItems.order_id}`);
          orderWithItems.orderItems.forEach((item, index) => {
            console.log(`Order Item ${index + 1}:`, {
              name: item.product_name,
              hasImages: Boolean(item.product_images?.length),
              hasVariations: Boolean(item.variations?.length),
              variations: item.variations
            });
          });
        } else {
          console.log('⚠️ No orders with items found');
        }
      } else {
        console.log('📦 No orders found');
      }
    } else {
      console.error('❌ Failed to load order history:', ordersResponse);
    }
    
    // 4. Test user heartbits
    console.log('\n4️⃣ Testing User Heartbits...');
    const heartbitsResponse = await suitebiteAPI.getUserHeartbits();
    if (heartbitsResponse.success) {
      console.log(`💖 User has ${heartbitsResponse.heartbits_balance} heartbits`);
    } else {
      console.error('❌ Failed to load heartbits:', heartbitsResponse);
    }
    
    console.log('\n🎉 Test completed!');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
};

// Test if API is available and run test
if (typeof suitebiteAPI !== 'undefined') {
  testSuitebiteShopFunctionality();
} else {
  console.log('⚠️ suitebiteAPI not available. Please run this script on a page where the API is loaded.');
}

export default testSuitebiteShopFunctionality;
