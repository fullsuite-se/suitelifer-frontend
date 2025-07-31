import React, { useState, useEffect } from 'react';
import { suitebiteAPI } from '../../../utils/suitebiteAPI';

const SystemHealthMonitor = () => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    loadSystemHealth();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadSystemHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadSystemHealth = async () => {
    try {
      setLoading(true);
      const response = await suitebiteAPI.getSystemHealthCheck();
      
      if (response.success) {
        setHealthData(response.health);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Error loading system health:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHealthStatus = (metric) => {
    if (!metric) return 'unknown';
    
    if (metric.status === 'healthy' || metric.value === 'ok') return 'healthy';
    if (metric.status === 'warning' || (metric.threshold && metric.value > metric.threshold * 0.8)) return 'warning';
    if (metric.status === 'critical' || (metric.threshold && metric.value > metric.threshold)) return 'critical';
    
    return 'healthy';
  };

  const formatValue = (metric) => {
    if (!metric) return 'N/A';
    
    if (metric.unit === 'percentage') return `${metric.value}%`;
    if (metric.unit === 'bytes') return formatBytes(metric.value);
    if (metric.unit === 'ms') return `${metric.value}ms`;
    
    return metric.value;
  };

  const formatBytes = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (!healthData) {
    return (
      <div className="system-health-monitor">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading system health...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="system-health-monitor">
      <div className="health-header">
        <h3>System Health Monitor</h3>
        
        <div className="health-controls">
          <div className="last-update">
            Last updated: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}
          </div>
          
          <button 
            onClick={loadSystemHealth}
            className="btn-refresh"
            disabled={loading}
          >
            {loading ? '🔄' : '🔄'} Refresh
          </button>
        </div>
      </div>

      {/* Overall System Status */}
      <div className="overall-status">
        <div className={`status-indicator ${healthData.overall_status}`}>
          <div className="status-icon">
            {healthData.overall_status === 'healthy' && '✅'}
            {healthData.overall_status === 'warning' && '⚠️'}
            {healthData.overall_status === 'critical' && '🚨'}
          </div>
          <div className="status-text">
            <h4>Overall System Status</h4>
            <p className="status-label">
              {healthData.overall_status.charAt(0).toUpperCase() + healthData.overall_status.slice(1)}
            </p>
          </div>
        </div>
      </div>

      {/* Health Metrics Grid */}
      <div className="health-metrics-grid">
        {/* Database Health */}
        <div className="health-card">
          <div className="card-header">
            <h4>🗄️ Database</h4>
            <span className={`status-badge ${getHealthStatus(healthData.database)}`}>
              {getHealthStatus(healthData.database)}
            </span>
          </div>
          <div className="card-content">
            <div className="metric-item">
              <span className="metric-label">Connection Status:</span>
              <span className="metric-value">{healthData.database?.connection || 'Unknown'}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Response Time:</span>
              <span className="metric-value">{formatValue(healthData.database?.response_time)}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Active Connections:</span>
              <span className="metric-value">{healthData.database?.active_connections || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* API Performance */}
        <div className="health-card">
          <div className="card-header">
            <h4>🚀 API Performance</h4>
            <span className={`status-badge ${getHealthStatus(healthData.api)}`}>
              {getHealthStatus(healthData.api)}
            </span>
          </div>
          <div className="card-content">
            <div className="metric-item">
              <span className="metric-label">Average Response:</span>
              <span className="metric-value">{formatValue(healthData.api?.avg_response_time)}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Requests/min:</span>
              <span className="metric-value">{healthData.api?.requests_per_minute || 'N/A'}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Error Rate:</span>
              <span className="metric-value">{formatValue(healthData.api?.error_rate)}</span>
            </div>
          </div>
        </div>

        {/* Memory Usage */}
        <div className="health-card">
          <div className="card-header">
            <h4>💾 Memory Usage</h4>
            <span className={`status-badge ${getHealthStatus(healthData.memory)}`}>
              {getHealthStatus(healthData.memory)}
            </span>
          </div>
          <div className="card-content">
            <div className="metric-item">
              <span className="metric-label">Used:</span>
              <span className="metric-value">{formatValue(healthData.memory?.used)}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Total:</span>
              <span className="metric-value">{formatValue(healthData.memory?.total)}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Usage:</span>
              <span className="metric-value">{formatValue(healthData.memory?.usage_percentage)}</span>
            </div>
          </div>
        </div>

        {/* Storage */}
        <div className="health-card">
          <div className="card-header">
            <h4>💿 Storage</h4>
            <span className={`status-badge ${getHealthStatus(healthData.storage)}`}>
              {getHealthStatus(healthData.storage)}
            </span>
          </div>
          <div className="card-content">
            <div className="metric-item">
              <span className="metric-label">Used:</span>
              <span className="metric-value">{formatValue(healthData.storage?.used)}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Available:</span>
              <span className="metric-value">{formatValue(healthData.storage?.available)}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Usage:</span>
              <span className="metric-value">{formatValue(healthData.storage?.usage_percentage)}</span>
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="health-card">
          <div className="card-header">
            <h4>👥 Active Users</h4>
            <span className="status-badge healthy">healthy</span>
          </div>
          <div className="card-content">
            <div className="metric-item">
              <span className="metric-label">Currently Online:</span>
              <span className="metric-value">{healthData.active_users?.current || 0}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Last Hour:</span>
              <span className="metric-value">{healthData.active_users?.last_hour || 0}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Today:</span>
              <span className="metric-value">{healthData.active_users?.today || 0}</span>
            </div>
          </div>
        </div>

        {/* Background Jobs */}
        <div className="health-card">
          <div className="card-header">
            <h4>⚙️ Background Jobs</h4>
            <span className={`status-badge ${getHealthStatus(healthData.background_jobs)}`}>
              {getHealthStatus(healthData.background_jobs)}
            </span>
          </div>
          <div className="card-content">
            <div className="metric-item">
              <span className="metric-label">Queue Size:</span>
              <span className="metric-value">{healthData.background_jobs?.queue_size || 0}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Failed Jobs:</span>
              <span className="metric-value">{healthData.background_jobs?.failed_count || 0}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Last Processed:</span>
              <span className="metric-value">{healthData.background_jobs?.last_processed || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      {healthData.recent_alerts && healthData.recent_alerts.length > 0 && (
        <div className="recent-alerts">
          <h4>⚠️ Recent Alerts</h4>
          <div className="alerts-list">
            {healthData.recent_alerts.map((alert, index) => (
              <div key={index} className={`alert-item ${alert.severity}`}>
                <div className="alert-time">
                  {new Date(alert.timestamp).toLocaleString()}
                </div>
                <div className="alert-message">
                  {alert.message}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <h4>🛠️ Quick Actions</h4>
        <div className="action-buttons">
          <button className="action-btn" onClick={() => window.open('/admin/logs', '_blank')}>
            📋 View Logs
          </button>
          <button className="action-btn" onClick={() => window.open('/admin/analytics', '_blank')}>
            📊 Analytics
          </button>
          <button className="action-btn" onClick={loadSystemHealth}>
            🔄 Refresh Health
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthMonitor;
