import React, { useState, useEffect, useRef } from 'react';
import { suitebiteAPI } from '../../utils/suitebiteAPI';
import { useSuitebiteStore } from '../../store/stores/suitebiteStore';
import CheerAnalytics from '../../components/suitebite/admin/CheerAnalytics';
import CheerPostsManagement from '../../components/suitebite/admin/CheerPostsManagement';
import UserHeartbitsManagement from '../../components/suitebite/admin/UserHeartbitsManagement';
import ProductManagement from '../../components/suitebite/admin/ProductManagement';
import OrderManagement from '../../components/suitebite/admin/OrderManagement';
import AdminVariationsManagement from '../../components/admin/AdminVariationsManagement';
import {
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  SwatchIcon,
} from '@heroicons/react/24/outline';

/**
 * AdminSuitebite Component
 * 
 * Main admin interface for Suitebite management.
 * Features include:
 * - Analytics dashboard
 * - Cheer posts moderation
 * - User and heartbits management
 * - Product and inventory management
 * - Order management
 */
const AdminSuitebite = () => {
  const {
    adminStats,
    setAdminStats
  } = useSuitebiteStore();

  // Local state management
  const [activeTab, setActiveTab] = useState('analytics'); // Default to analytics tab
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [showRefreshNotification, setShowRefreshNotification] = useState(false);
  
  // Auto-refresh functionality
  const autoRefreshInterval = useRef(null);
  const lastTabChange = useRef(Date.now());

  // Auto-refresh every 5 minutes (300000ms)
  const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000;

  // Load admin data on component mount
  useEffect(() => {
    loadAdminData();
    
    // Set up auto-refresh
    if (autoRefreshEnabled) {
      autoRefreshInterval.current = setInterval(() => {
        loadAdminData(true); // true = silent refresh
      }, AUTO_REFRESH_INTERVAL);
    }

    return () => {
      if (autoRefreshInterval.current) {
        clearInterval(autoRefreshInterval.current);
      }
    };
  }, [autoRefreshEnabled]);

  /**
   * Handles tab changes with smart refresh functionality
   * Refreshes data if it's been more than 2 minutes since last refresh
   * @param {string} tabId - ID of the tab to switch to
   */
  const handleTabChange = (tabId) => {
    const timeSinceLastRefresh = Date.now() - lastRefresh.getTime();
    const timeSinceLastTabChange = Date.now() - lastTabChange.current;
    
    // Refresh if it's been more than 2 minutes since last refresh and more than 30 seconds since last tab change
    if (timeSinceLastRefresh > 2 * 60 * 1000 && timeSinceLastTabChange > 30 * 1000) {
      loadAdminData(true); // silent refresh
    }
    
    setActiveTab(tabId);
    lastTabChange.current = Date.now();
  };

  /**
   * Loads admin data from the API
   * @param {boolean} silent - Whether to show refresh notification
   */
  const loadAdminData = async (silent = false) => {
    try {
      setLoading(true);
      
      const statsResponse = await suitebiteAPI.getSystemStats('month');

      if (statsResponse.success) {
        setAdminStats(statsResponse.stats);
      }

      setLastRefresh(new Date());
      
      // Show notification for manual refresh
      if (!silent) {
        setShowRefreshNotification(true);
        setTimeout(() => setShowRefreshNotification(false), 3000);
      }
    } catch (error) {
      // Error handling for production - replace console.error with proper logging
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggles auto-refresh functionality
   */
  const toggleAutoRefresh = () => {
    setAutoRefreshEnabled(!autoRefreshEnabled);
    
    if (autoRefreshEnabled) {
      // Disable auto-refresh
      if (autoRefreshInterval.current) {
        clearInterval(autoRefreshInterval.current);
        autoRefreshInterval.current = null;
      }
    } else {
      // Enable auto-refresh
      autoRefreshInterval.current = setInterval(() => {
        loadAdminData(true);
      }, AUTO_REFRESH_INTERVAL);
    }
  };

  // Reorganized tabs: Analytics → Cheer Posts → Users & Heartbits → Products & Inventory → Variations → Orders
  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
    { id: 'posts', label: 'Cheer Posts', icon: ChatBubbleLeftRightIcon },
    { id: 'users', label: 'Users & Heartbits', icon: UsersIcon },
    { id: 'products', label: 'Products', icon: ShoppingBagIcon },
    { id: 'variations', label: 'Variations', icon: SwatchIcon },
    { id: 'orders', label: 'Orders', icon: ClipboardDocumentListIcon }
  ];

  return (
    <div className="admin-suitebite bg-gray-50 min-h-screen">
      <div className="admin-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Navigation Tabs */}
        <div className="admin-nav-tabs bg-white rounded-lg shadow-sm p-1 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              {tabs.map(tab => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`nav-tab flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
                      activeTab === tab.id 
                        ? 'bg-[#0097b2] text-white shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => handleTabChange(tab.id)}
                  >
                    <IconComponent className="h-5 w-5 mr-2" />
                    <span className="tab-label">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Refresh Notification */}
        {showRefreshNotification && (
          <div className="refresh-notification bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
            ✅ Data refreshed successfully
          </div>
        )}

        {/* Tab Content */}
        <div className="admin-content">
          {/* Analytics Tab - First in order */}
          {activeTab === 'analytics' && (
            <div className="analytics-tab">
              <CheerAnalytics onRefresh={loadAdminData} />
            </div>
          )}

          {/* Cheer Posts Tab - Second in order */}
          {activeTab === 'posts' && (
            <div className="posts-tab">
              <CheerPostsManagement onRefresh={loadAdminData} />
            </div>
          )}

          {/* Users & Heartbits Tab - Third in order */}
          {activeTab === 'users' && (
            <div className="users-tab">
              <UserHeartbitsManagement onRefresh={loadAdminData} />
            </div>
          )}

          {/* Products & Inventory Tab - Fourth in order (combined functionality) */}
          {activeTab === 'products' && (
            <div className="products-tab">
              <ProductManagement onRefresh={loadAdminData} />
            </div>
          )}

          {/* Variations Tab - Fifth in order */}
          {activeTab === 'variations' && (
            <div className="variations-tab">
              <AdminVariationsManagement />
            </div>
          )}

          {/* Orders Tab - Last in order */}
          {activeTab === 'orders' && (
            <div className="orders-tab">
              <OrderManagement onRefresh={loadAdminData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSuitebite;

