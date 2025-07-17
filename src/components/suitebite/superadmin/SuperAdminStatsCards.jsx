import React from 'react';
import { useSuitebiteStore } from '../../../store/stores/suitebiteStore';

const SuperAdminStatsCards = () => {
  const { advancedAnalytics } = useSuitebiteStore();

  if (!advancedAnalytics) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  const {
    system_overview,
    user_analytics,
    heartbits_analytics,
    content_analytics,
    performance_metrics
  } = advancedAnalytics;

  return (
    <div className="super-admin-stats">
      {/* System Overview */}
      <div className="stats-section">
        <h3>🏢 System Overview</h3>
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h4>Total Users</h4>
              <div className="stat-value">{system_overview?.total_users?.toLocaleString() || 0}</div>
              <div className="stat-change positive">
                +{system_overview?.new_users_this_month || 0} this month
              </div>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">❤️</div>
            <div className="stat-content">
              <h4>Total Heartbits</h4>
              <div className="stat-value">{heartbits_analytics?.total_circulating?.toLocaleString() || 0}</div>
              <div className="stat-change">
                {heartbits_analytics?.monthly_distributed?.toLocaleString() || 0} distributed this month
              </div>
            </div>
          </div>

          <div className="stat-card info">
            <div className="stat-icon">💬</div>
            <div className="stat-content">
              <h4>Cheer Posts</h4>
              <div className="stat-value">{content_analytics?.total_posts?.toLocaleString() || 0}</div>
              <div className="stat-change positive">
                +{content_analytics?.posts_this_month || 0} this month
              </div>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">🛒</div>
            <div className="stat-content">
              <h4>Shop Orders</h4>
              <div className="stat-value">{system_overview?.total_orders?.toLocaleString() || 0}</div>
              <div className="stat-change">
                {system_overview?.orders_this_month || 0} this month
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Analytics */}
      <div className="stats-section">
        <h3>👥 User Analytics</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <h4>Active Users</h4>
              <span className="trend-indicator positive">↗️</span>
            </div>
            <div className="stat-metrics">
              <div className="metric">
                <span className="metric-label">Daily Active:</span>
                <span className="metric-value">{user_analytics?.daily_active || 0}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Weekly Active:</span>
                <span className="metric-value">{user_analytics?.weekly_active || 0}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Monthly Active:</span>
                <span className="metric-value">{user_analytics?.monthly_active || 0}</span>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <h4>User Engagement</h4>
              <span className="trend-indicator positive">↗️</span>
            </div>
            <div className="stat-metrics">
              <div className="metric">
                <span className="metric-label">Avg Session Time:</span>
                <span className="metric-value">{user_analytics?.avg_session_time || '0m'}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Posts per User:</span>
                <span className="metric-value">{user_analytics?.avg_posts_per_user || 0}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Retention Rate:</span>
                <span className="metric-value">{user_analytics?.retention_rate || 0}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Heartbits Analytics */}
      <div className="stats-section">
        <h3>❤️ Heartbits Analytics</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <h4>Distribution</h4>
            </div>
            <div className="stat-metrics">
              <div className="metric">
                <span className="metric-label">Total Distributed:</span>
                <span className="metric-value">{heartbits_analytics?.total_distributed?.toLocaleString() || 0}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Total Redeemed:</span>
                <span className="metric-value">{heartbits_analytics?.total_redeemed?.toLocaleString() || 0}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Avg per Transaction:</span>
                <span className="metric-value">{heartbits_analytics?.avg_per_transaction || 0}</span>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <h4>Monthly Trends</h4>
            </div>
            <div className="stat-metrics">
              <div className="metric">
                <span className="metric-label">This Month:</span>
                <span className="metric-value">{heartbits_analytics?.monthly_distributed?.toLocaleString() || 0}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Last Month:</span>
                <span className="metric-value">{heartbits_analytics?.last_month_distributed?.toLocaleString() || 0}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Growth:</span>
                <span className={`metric-value ${(heartbits_analytics?.month_over_month_growth || 0) >= 0 ? 'positive' : 'negative'}`}>
                  {(heartbits_analytics?.month_over_month_growth || 0) >= 0 ? '+' : ''}{heartbits_analytics?.month_over_month_growth || 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="stats-section">
        <h3>⚡ Performance Metrics</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <h4>API Performance</h4>
              <span className={`status-indicator ${performance_metrics?.api_health || 'healthy'}`}></span>
            </div>
            <div className="stat-metrics">
              <div className="metric">
                <span className="metric-label">Avg Response Time:</span>
                <span className="metric-value">{performance_metrics?.avg_response_time || 0}ms</span>
              </div>
              <div className="metric">
                <span className="metric-label">Success Rate:</span>
                <span className="metric-value">{performance_metrics?.success_rate || 0}%</span>
              </div>
              <div className="metric">
                <span className="metric-label">Uptime:</span>
                <span className="metric-value">{performance_metrics?.uptime || 0}%</span>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <h4>Database</h4>
              <span className={`status-indicator ${performance_metrics?.db_health || 'healthy'}`}></span>
            </div>
            <div className="stat-metrics">
              <div className="metric">
                <span className="metric-label">Query Time:</span>
                <span className="metric-value">{performance_metrics?.avg_query_time || 0}ms</span>
              </div>
              <div className="metric">
                <span className="metric-label">Connections:</span>
                <span className="metric-value">{performance_metrics?.active_connections || 0}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Storage Used:</span>
                <span className="metric-value">{performance_metrics?.storage_used || 0}GB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Analytics */}
      <div className="stats-section">
        <h3>📊 Content Analytics</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <h4>Post Engagement</h4>
            </div>
            <div className="stat-metrics">
              <div className="metric">
                <span className="metric-label">Total Likes:</span>
                <span className="metric-value">{content_analytics?.total_likes?.toLocaleString() || 0}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Total Comments:</span>
                <span className="metric-value">{content_analytics?.total_comments?.toLocaleString() || 0}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Avg Engagement:</span>
                <span className="metric-value">{content_analytics?.avg_engagement_rate || 0}%</span>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <h4>Popular Hashtags</h4>
            </div>
            <div className="hashtags-list">
              {content_analytics?.popular_hashtags?.slice(0, 5).map((hashtag, index) => (
                <div key={index} className="hashtag-item">
                  <span className="hashtag-name">#{hashtag.name}</span>
                  <span className="hashtag-count">{hashtag.count}</span>
                </div>
              )) || <span className="no-data">No hashtags yet</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminStatsCards;
