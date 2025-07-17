import { create } from 'zustand';

/**
 * Category Store with Color Coding
 * 
 * Centralized state management for product categories across the application.
 * Ensures consistency between admin and shop interfaces with visual color coding.
 */
const useCategoryStore = create((set, get) => ({
  // Categories with color coding for better visual distinction
  categories: [
    { name: 'SWAGS', color: '#FF6B6B', bgColor: '#FFE5E5', description: 'Company branded merchandise' },
    { name: 'VOUCHERS', color: '#4ECDC4', bgColor: '#E5F9F6', description: 'Gift cards and vouchers' },
    { name: 'TRAVEL', color: '#45B7D1', bgColor: '#E5F3FF', description: 'Transportation and travel' },
    { name: 'TECH', color: '#96CEB4', bgColor: '#E8F5E8', description: 'Technology and gadgets' },
    { name: 'FOOD', color: '#FFEAA7', bgColor: '#FFF9E5', description: 'Food and beverages' },
    { name: 'WELLNESS', color: '#DDA0DD', bgColor: '#F5E6F5', description: 'Health and fitness' },
    { name: 'ENTERTAINMENT', color: '#FFB74D', bgColor: '#FFF3E0', description: 'Entertainment and events' }
  ],

  /**
   * Get category by name with color information
   * @param {string} categoryName - Category name to find
   * @returns {Object|null} Category object with color info or null
   */
  getCategoryByName: (categoryName) => {
    const { categories } = get();
    // Add null/undefined check before calling toUpperCase
    if (!categoryName || typeof categoryName !== 'string') {
      return null;
    }
    return categories.find(cat => cat.name === categoryName.toUpperCase()) || null;
  },

  /**
   * Get category color by name
   * @param {string} categoryName - Category name
   * @returns {string} Color hex code or default color
   */
  getCategoryColor: (categoryName) => {
    const category = get().getCategoryByName(categoryName);
    return category ? category.color : '#6B7280';
  },

  /**
   * Get category background color by name
   * @param {string} categoryName - Category name
   * @returns {string} Background color hex code or default
   */
  getCategoryBgColor: (categoryName) => {
    const category = get().getCategoryByName(categoryName);
    return category ? category.bgColor : '#F3F4F6';
  },

  /**
   * Add a new category to the store
   * @param {string|Object} category - Category name or object with name and color
   */
  addCategory: (category) => {
    const { categories } = get();
    
    if (typeof category === 'string') {
      const categoryToAdd = category.trim().toUpperCase();
      
      if (!categories.find(cat => cat.name === categoryToAdd)) {
        // Generate a random color for new categories
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFB74D', '#74B9FF', '#FD79A8', '#FDCB6E'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        set({ 
          categories: [...categories, { 
            name: categoryToAdd, 
            color: randomColor, 
            bgColor: randomColor + '33', // Add transparency
            description: 'Custom category' 
          }] 
        });
        return true;
      }
    } else if (typeof category === 'object' && category.name) {
      const categoryToAdd = category.name.trim().toUpperCase();
      
      if (!categories.find(cat => cat.name === categoryToAdd)) {
        set({ 
          categories: [...categories, { 
            name: categoryToAdd,
            category_id: category.category_id || null,
            color: category.color || '#6B7280',
            bgColor: category.bgColor || '#F3F4F6',
            description: category.description || 'Custom category'
          }] 
        });
        return true;
      }
    }
    
    return false; // Category already exists
  },

  /**
   * Sync categories from existing products
   * @param {Array} products - Array of product objects
   */
  syncCategoriesFromProducts: (products) => {
    const { categories } = get();
    const productCategories = products.map(p => p.category).filter(Boolean);
    const uniqueProductCategories = [...new Set(productCategories)];
    
    // Add any new categories from products
    const newCategories = uniqueProductCategories.filter(cat => 
      !categories.find(existing => existing.name === cat)
    );
    
    if (newCategories.length > 0) {
      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFB74D', '#74B9FF', '#FD79A8', '#FDCB6E'];
      
      const categoriesToAdd = newCategories.map((cat, index) => ({
        name: cat,
        color: colors[index % colors.length],
        bgColor: colors[index % colors.length] + '33',
        description: 'Product category'
      }));
      
      set({ categories: [...categories, ...categoriesToAdd] });
    }
  },

  /**
   * Get all categories including 'all' option for filters
   * @returns {string[]} Array of category names with 'all' option
   */
  getCategoriesForFilter: () => {
    const { categories } = get();
    return ['all', ...categories.map(cat => cat.name)];
  },

  /**
   * Get all categories without 'all' option
   * @returns {Array} Array of category objects
   */
  getAllCategories: () => {
    const { categories } = get();
    return categories;
  },

  /**
   * Get category names only
   * @returns {string[]} Array of category names
   */
  getCategoryNames: () => {
    const { categories } = get();
    return categories.map(cat => cat.name);
  },

  /**
   * Check if a category exists
   * @param {string} categoryName - Category name to check
   * @returns {boolean} True if category exists
   */
  hasCategory: (categoryName) => {
    const { categories } = get();
    // Add null/undefined check before calling toUpperCase
    if (!categoryName || typeof categoryName !== 'string') {
      return false;
    }
    return categories.some(cat => cat.name === categoryName.toUpperCase());
  },

  /**
   * Remove a category from the store
   * @param {string} categoryName - Category name to remove
   * @returns {boolean} True if category was removed, false if not found
   */
  removeCategory: (categoryName) => {
    const { categories } = get();
    
    if (!categoryName || typeof categoryName !== 'string') {
      return false;
    }

    const categoryToRemove = categoryName.trim().toUpperCase();
    const initialLength = categories.length;
    
    const updatedCategories = categories.filter(cat => cat.name !== categoryToRemove);
    
    if (updatedCategories.length < initialLength) {
      set({ categories: updatedCategories });
      return true;
    }
    
    return false; // Category not found
  },

  /**
   * Refresh categories from the backend and update the store
   */
  refreshCategories: async () => {
    try {
      const response = await import('../../utils/suitebiteAPI').then(m => m.suitebiteAPI.getAllCategories());
      if (response.success && Array.isArray(response.categories)) {
        const categories = response.categories.map(dbCategory => ({
          name: dbCategory.category_name,
          category_id: dbCategory.category_id,
          color: '#6B7280',
          bgColor: '#F3F4F6',
          description: 'Database category'
        }));
        set({ categories });
        return true;
      }
    } catch (error) {
      // Optionally log error
    }
    return false;
  },

  /**
   * Reset categories to initial state
   */
  resetCategories: () => {
    set({
      categories: [
        { name: 'SWAGS', color: '#FF6B6B', bgColor: '#FFE5E5', description: 'Company branded merchandise' },
        { name: 'VOUCHERS', color: '#4ECDC4', bgColor: '#E5F9F6', description: 'Gift cards and vouchers' },
        { name: 'TRAVEL', color: '#45B7D1', bgColor: '#E5F3FF', description: 'Transportation and travel' },
        { name: 'TECH', color: '#96CEB4', bgColor: '#E8F5E8', description: 'Technology and gadgets' },
        { name: 'FOOD', color: '#FFEAA7', bgColor: '#FFF9E5', description: 'Food and beverages' },
        { name: 'WELLNESS', color: '#DDA0DD', bgColor: '#F5E6F5', description: 'Health and fitness' },
        { name: 'ENTERTAINMENT', color: '#FFB74D', bgColor: '#FFF3E0', description: 'Entertainment and events' }
      ]
    });
  }
}));

export default useCategoryStore; 