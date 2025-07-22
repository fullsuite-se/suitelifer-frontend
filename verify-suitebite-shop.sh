#!/bin/bash

# Suitebite Shop System Verification Script
# Run this script to verify all components are working correctly

echo "🚀 Starting Suitebite Shop System Verification..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the frontend root directory"
    exit 1
fi

# Check if required dependencies are installed
echo "📦 Checking dependencies..."
if ! npm list @heroicons/react >/dev/null 2>&1; then
    echo "⚠️ Warning: @heroicons/react not found. Installing..."
    npm install @heroicons/react
fi

# Build the project to check for compilation errors
echo "🔨 Building project to check for errors..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful - no compilation errors found"
else
    echo "❌ Build failed - please check the error messages above"
    exit 1
fi

# Check if all required components exist
echo "🔍 Checking component files..."

components=(
    "src/components/suitebite/ProductCard.jsx"
    "src/components/suitebite/ShoppingCart.jsx" 
    "src/components/suitebite/OrderHistory.jsx"
    "src/components/suitebite/ProductDetailModal.jsx"
    "src/components/suitebite/ProductImageCarousel.jsx"
    "src/components/suitebite/OrderItemCard.jsx"
    "src/pages/employee/SuitebiteShop.jsx"
    "src/utils/suitebiteAPI.js"
)

for component in "${components[@]}"; do
    if [ -f "$component" ]; then
        echo "✅ $component"
    else
        echo "❌ Missing: $component"
    fi
done

# Check for common issues in the components
echo "🔍 Checking for common issues..."

# Check ProductCard for proper image handling
if grep -q "product.product_images" src/components/suitebite/ProductCard.jsx; then
    echo "✅ ProductCard: Enhanced image handling present"
else
    echo "⚠️ ProductCard: Enhanced image handling may be missing"
fi

# Check ShoppingCart for variation grouping
if grep -q "variationsByType" src/components/suitebite/ShoppingCart.jsx; then
    echo "✅ ShoppingCart: Variation grouping present"
else
    echo "⚠️ ShoppingCart: Variation grouping may be missing"
fi

# Check OrderHistory for reorder variations
if grep -q "variation_type_id" src/components/suitebite/OrderHistory.jsx; then
    echo "✅ OrderHistory: Reorder variations handling present"
else
    echo "⚠️ OrderHistory: Reorder variations handling may be missing"
fi

echo ""
echo "🎉 Verification complete!"
echo ""
echo "📋 Manual Testing Checklist:"
echo "1. Open the Suitebite shop in your browser"
echo "2. Verify product images display in carousel"
echo "3. Test adding products with variations to cart"
echo "4. Check cart displays variations properly"
echo "5. Test checkout functionality"
echo "6. Verify order history shows product details"
echo "7. Test reorder functionality"
echo ""
echo "🔧 If you encounter issues:"
echo "1. Check browser console for JavaScript errors"
echo "2. Verify backend is running and accessible"
echo "3. Check that database schema is up to date"
echo "4. Run the test script: node test-suitebite-shop.js"
