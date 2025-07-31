import React, { useState, useEffect } from 'react';
import { suitebiteAPI } from '../../utils/suitebiteAPI';
import { useSuitebiteStore } from '../../store/stores/suitebiteStore';
import SuperAdminStatsCards from '../../components/suitebite/superadmin/SuperAdminStatsCards';
import AdminUserManagement from '../../components/suitebite/superadmin/AdminUserManagement';
import SystemAuditLogs from '../../components/suitebite/superadmin/SystemAuditLogs';
import AdvancedAnalytics from '../../components/suitebite/superadmin/AdvancedAnalytics';
import SystemMaintenance from '../../components/suitebite/superadmin/SystemMaintenance';
import {
  ChartBarIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  ChartPieIcon,
  DocumentTextIcon,
  WrenchScrewdriverIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const SuperAdminSuitebite = () => {
  const {
    systemConfig,
    advancedAnalytics,
    setSystemConfig,
    setAdvancedAnalytics
  } = useSuitebiteStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSuperAdminData();
  }, []);

  const loadSuperAdminData = async () => {
    try {
      setLoading(true);
      
      const [configResponse, analyticsResponse] = await Promise.all([
        suitebiteAPI.getSystemConfiguration(),
        suitebiteAPI.getAdvancedSystemAnalytics('month')
      ]);

      if (configResponse.success) {
        setSystemConfig(configResponse.config);
      }

      if (analyticsResponse.success) {
        setAdvancedAnalytics(analyticsResponse.analytics);
      }
    } catch (error) {
      console.error('Error loading super admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ChartBarIcon },
    { id: 'admins', label: 'Admin Users', icon: UserGroupIcon },
    { id: 'analytics', label: 'Analytics', icon: ChartPieIcon },
    { id: 'audit', label: 'Audit Logs', icon: DocumentTextIcon },
    { id: 'maintenance', label: 'Maintenance', icon: WrenchScrewdriverIcon }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <SuperAdminStatsCards />;
      case 'admins':
        return <AdminUserManagement />;
      case 'analytics':
        return <AdvancedAnalytics />;
      case 'audit':
        return <SystemAuditLogs />;
      case 'maintenance':
        return <SystemMaintenance />;
      default:
        return <SuperAdminStatsCards />;
    }
  };

  return (
    <div className="super-admin-suitebite bg-gray-50 min-h-screen">
      <div className="admin-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="admin-header bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShieldCheckIcon className="h-8 w-8 text-primary" />
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
                <p className="text-gray-600">System-wide management and configuration for Suitebite</p>
              </div>
            </div>
            
            <div className="header-actions">
              <button 
                onClick={loadSuperAdminData}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hovered focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                disabled={loading}
              >
                <ArrowPathIcon className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-nav-tabs bg-white rounded-lg shadow-sm p-1 mb-8">
          <div className="flex space-x-1">
            {tabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`nav-tab flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === tab.id 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <IconComponent className="h-5 w-5 mr-2" />
                  <span className="tab-label">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="admin-content">
          {loading && activeTab === 'overview' ? (
            <div className="loading-spinner bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="inline-flex items-center">
                <ArrowPathIcon className="h-8 w-8 text-primary animate-spin mr-3" />
                <p className="text-gray-600 text-lg">Loading super admin data...</p>
              </div>
            </div>
          ) : (
            renderTabContent()
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminSuitebite;
