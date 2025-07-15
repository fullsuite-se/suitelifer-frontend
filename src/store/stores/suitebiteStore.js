import { create } from "zustand";

export const useSuitebiteStore = create((set, get) => ({
  // Cheer Posts State
  cheerFeed: [],
  cheerPost: null,
  feedLoading: false,
  feedError: null,
  
  // User State
  userHeartbits: 0,
  monthlyLimits: null,
  
  // Shop State
  products: [],
  cart: [],
  cartLoading: false,
  orders: [],
  
  // Leaderboard State
  leaderboard: [],
  monthlyLeaderboard: [],
  
  // Admin State
  adminStats: null,
  adminUsers: [],
  adminLogs: [],
  systemHealth: null,
  
  // Super Admin State
  systemConfig: {},
  adminUsersList: [],
  systemAuditLogs: [],
  advancedAnalytics: null,
  
  // Actions for Cheer Posts
  setCheerFeed: (feed) => set({ cheerFeed: feed }),
  setCheerPost: (post) => set({ cheerPost: post }),
  setFeedLoading: (loading) => set({ feedLoading: loading }),
  setFeedError: (error) => set({ feedError: error }),
  
  addCheerPost: (post) => set((state) => ({
    cheerFeed: [post, ...state.cheerFeed]
  })),
  
  updateCheerPost: (postId, updates) => set((state) => ({
    cheerFeed: state.cheerFeed.map(post => 
      post.cheer_post_id === postId ? { ...post, ...updates } : post
    )
  })),
  
  // Actions for User
  setUserHeartbits: (heartbits) => set({ userHeartbits: heartbits }),
  setMonthlyLimits: (limits) => set({ monthlyLimits: limits }),
  
  // Actions for Shop
  setProducts: (products) => set({ products }),
  setCart: (cart) => set({ cart }),
  setCartLoading: (loading) => set({ cartLoading: loading }),
  setOrders: (orders) => set({ orders }),
  
  addToCart: (item) => set((state) => ({
    cart: [...state.cart, item]
  })),
  
  removeFromCart: (itemId) => set((state) => ({
    cart: state.cart.filter(item => item.cart_item_id !== itemId)
  })),
  
  clearCart: () => set({ cart: [] }),
  
  // Actions for Leaderboard
  setLeaderboard: (leaderboard) => set({ leaderboard }),
  setMonthlyLeaderboard: (leaderboard) => set({ monthlyLeaderboard: leaderboard }),
  
  // Actions for Admin
  setAdminStats: (stats) => set({ adminStats: stats }),
  setAdminUsers: (users) => set({ adminUsers: users }),
  setAdminLogs: (logs) => set({ adminLogs: logs }),
  setSystemHealth: (health) => set({ systemHealth: health }),
  
  // Actions for Super Admin
  setSystemConfig: (config) => set({ systemConfig: config }),
  setAdminUsersList: (users) => set({ adminUsersList: users }),
  setSystemAuditLogs: (logs) => set({ systemAuditLogs: logs }),
  setAdvancedAnalytics: (analytics) => set({ advancedAnalytics: analytics }),
  
  updateSystemConfig: (key, value) => set((state) => ({
    systemConfig: {
      ...state.systemConfig,
      [key]: { ...state.systemConfig[key], value }
    }
  })),
  
  // Utility Actions
  reset: () => set({
    cheerFeed: [],
    cheerPost: null,
    feedLoading: false,
    feedError: null,
    userHeartbits: 0,
    monthlyLimits: null,
    products: [],
    cart: [],
    cartLoading: false,
    orders: [],
    leaderboard: [],
    monthlyLeaderboard: [],
    adminStats: null,
    adminUsers: [],
    adminLogs: [],
    systemHealth: null,
    systemConfig: {},
    adminUsersList: [],
    systemAuditLogs: [],
    advancedAnalytics: null,
  })
}));
