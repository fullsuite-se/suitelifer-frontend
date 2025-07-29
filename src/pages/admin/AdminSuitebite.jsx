import React, { useState, useEffect, useRef } from 'react';
import { suitebiteAPI } from '../../utils/suitebiteAPI';
import { useSuitebiteStore } from '../../store/stores/suitebiteStore';
import UserHeartbitsManagement from '../../components/suitebite/admin/UserHeartbitsManagement';
import ProductManagement from '../../components/suitebite/admin/ProductManagement';
import OrderManagement from '../../components/suitebite/admin/OrderManagement';
import {
  UsersIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';

/**
 * AdminSuitebite Component
 * Main admin interface for Suitebite management.
 */
const AdminSuitebite = () => {
  const { adminStats, setAdminStats } = useSuitebiteStore();

  // Local state management
  const [activeTab, setActiveTab] = useState('users'); // Default to users tab
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
    // eslint-disable-next-line
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

  // Reorganized tabs: Users & Heartbits → Products → Orders
  const tabs = [
    { id: 'users', label: 'Users & Heartbits', icon: UsersIcon },
    { id: 'products', label: 'Products', icon: ShoppingBagIcon },
    { id: 'orders', label: 'Orders', icon: ClipboardDocumentListIcon }
  ];

  return (
    <div className="admin-suitebite bg-gray-50 flex flex-col min-h-screen py-4">
      {/* Fixed Header */}
      <div className="admin-header bg-white border-b border-gray-200 px-6 py-1 flex-shrink-0"> {/* Reduce header padding */}
        <div className="max-w-7xl mx-auto">
          {/* Navigation Tabs */}
          <div className="admin-nav-tabs bg-gray-50 rounded-lg p-1"> {/* No margin */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-1">
                {tabs.map(tab => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      className={`nav-tab flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
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
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="admin-content pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Refresh Notification - Hidden but function kept */}
          {/* {showRefreshNotification && (
            <div className="refresh-notification bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-0">
              ✅ Data refreshed successfully
            </div>
          )} */}

          {/* Tab Content */}
          <div className="admin-tab-content mt-0"> {/* No top margin for tab content */}
            {/* Users & Heartbits Tab */}
            {activeTab === 'users' && (
              <div className="users-tab mt-0 mb-6">
                <UserHeartbitsManagement onRefresh={loadAdminData} />
              </div>
            )}
            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="products-tab mt-0"> {/* Remove extra top margin */}
                <ProductManagement onRefresh={loadAdminData} />
              </div>
            )}
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="orders-tab mt-0"> {/* Remove extra top margin */}
                <OrderManagement onRefresh={loadAdminData} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSuitebite;