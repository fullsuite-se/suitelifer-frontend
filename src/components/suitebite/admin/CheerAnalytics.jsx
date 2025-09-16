import React, { useState, useEffect } from 'react';
import { suitebiteAPI } from '../../../utils/suitebiteAPI';
import {
  HeartIcon,
  TrophyIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  UsersIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';

const CheerAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalCheers: 0,
    totalReceivers: 0,
    totalGivers: 0,
    todayCheers: 0,
    weekCheers: 0,
    monthCheers: 0
  });
  const [leaderboard, setLeaderboard] = useState({
    topGivers: [],
    topReceivers: []
  });
  const [timePeriod, setTimePeriod] = useState('month'); // daily, weekly, monthly, all-time
  const [leaderboardType, setLeaderboardType] = useState('receivers'); // receivers, givers
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    loadAnalytics();
  }, [timePeriod, dateRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Prepare parameters including date range
      const params = {
        timePeriod,
        ...(dateRange.start && { startDate: dateRange.start }),
        ...(dateRange.end && { endDate: dateRange.end })
      };
      
      // Load analytics data
      const analyticsResponse = await suitebiteAPI.getCheerAnalytics(params);
      if (analyticsResponse.success) {
        setAnalytics(analyticsResponse.analytics);
      }
      
      // Load leaderboard data
      const leaderboardResponse = await suitebiteAPI.getCheerLeaderboard(params);
      if (leaderboardResponse.success) {
        setLeaderboard(leaderboardResponse.leaderboard);
      }
    } catch (error) {
      console.error('Error loading cheer analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportAnalyticsReport = () => {
    const csvContent = generateCSVReport();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `cheer-analytics-${timePeriod}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateCSVReport = () => {
    const headers = ['Rank', 'Name', 'Department', 'Cheers Given', 'Cheers Received', 'Net Score'];
    const data = leaderboardType === 'receivers' ? leaderboard.topReceivers : leaderboard.topGivers;
    
    const rows = data.map((user, index) => [
      index + 1,
      user.name,
      user.department || 'N/A',
      user.cheers_given || 0,
      user.cheers_received || 0,
      (user.cheers_received || 0) - (user.cheers_given || 0)
    ]);
    
    return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  };

  const getTimePeriodLabel = () => {
    switch (timePeriod) {
      case 'daily': return 'Today';
      case 'weekly': return 'This Week';
      case 'monthly': return 'This Month';
      case 'all-time': return 'All Time';
      default: return 'This Month';
    }
  };

  const getPeriodIcon = (period) => {
    switch (period) {
      case 'daily': return '📅';
      case 'weekly': return '📊';
      case 'monthly': return '📈';
      case 'all-time': return '🏆';
      default: return '📊';
    }
  };

  return (
    <div className="cheer-analytics bg-white rounded-lg shadow-sm">
      {/* Analytics Stats */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <HeartIcon className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-3xl font-bold text-gray-900">{analytics.totalCheers}</span>
            <span className="text-sm text-gray-500 font-medium">Total Cheers</span>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <UsersIcon className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-3xl font-bold text-gray-900">{analytics.totalGivers}</span>
            <span className="text-sm text-gray-500 font-medium">Active Givers</span>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <TrophyIcon className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-3xl font-bold text-gray-900">{analytics.totalReceivers}</span>
            <span className="text-sm text-gray-500 font-medium">Active Receivers</span>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
              <ChartBarIcon className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-3xl font-bold text-gray-900">
              {timePeriod === 'daily' ? analytics.todayCheers :
               timePeriod === 'weekly' ? analytics.weekCheers :
               timePeriod === 'monthly' ? analytics.monthCheers :
               analytics.totalCheers}
            </span>
            <span className="text-sm text-gray-500 font-medium">{getTimePeriodLabel()} Cheers</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          {/* Time Period Selector */}
          <div className="flex space-x-1">
            {['daily', 'weekly', 'monthly', 'all-time'].map(period => (
              <button
                key={period}
                onClick={() => setTimePeriod(period)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  timePeriod === period
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
              >
                <span className="mr-1">{getPeriodIcon(period)}</span>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={dateRange.start || ''}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                placeholder="Start Date"
              />
              <span className="text-gray-500 text-sm">to</span>
              <input
                type="date"
                value={dateRange.end || ''}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                placeholder="End Date"
              />
            </div>
            
            <button 
              onClick={exportAnalyticsReport}
              className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hovered focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
            >
              <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-600">Loading analytics...</span>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Receivers */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    <TrophyIcon className="h-5 w-5 text-yellow-500 mr-2" />
                    Top Receivers
                  </h4>
                  <p className="text-sm text-gray-600">
                    {dateRange.start && dateRange.end 
                      ? `${new Date(dateRange.start).toLocaleDateString()} - ${new Date(dateRange.end).toLocaleDateString()}`
                      : getTimePeriodLabel()
                    }
                  </p>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {(leaderboard.topReceivers || []).slice(0, 20).map((user, index) => {
                    const maxCheers = Math.max(leaderboard.topReceivers[0]?.cheers_received || 1, 1);
                    const progressWidth = Math.min(((user.cheers_received || 0) / maxCheers) * 100, 100);
                    
                    return (
                      <div key={user.user_id} className="px-6 py-4 flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-800' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {index + 1}
                        </div>
                        
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.department || 'No Department'}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-900">❤️ {user.cheers_received || 0}</p>
                              <p className="text-xs text-gray-500">
                                {user.cheers_given || 0} given
                              </p>
                            </div>
                          </div>
                          
                          {/* Progress bar */}
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
                              style={{ width: `${progressWidth}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Givers */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    <HeartIcon className="h-5 w-5 text-red-500 mr-2" />
                    Top Givers
                  </h4>
                  <p className="text-sm text-gray-600">
                    {dateRange.start && dateRange.end 
                      ? `${new Date(dateRange.start).toLocaleDateString()} - ${new Date(dateRange.end).toLocaleDateString()}`
                      : getTimePeriodLabel()
                    }
                  </p>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {(leaderboard.topGivers || []).slice(0, 20).map((user, index) => {
                    const maxCheers = Math.max(leaderboard.topGivers[0]?.cheers_given || 1, 1);
                    const progressWidth = Math.min(((user.cheers_given || 0) / maxCheers) * 100, 100);
                    
                    return (
                      <div key={user.user_id} className="px-6 py-4 flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-800' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {index + 1}
                        </div>
                        
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.department || 'No Department'}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-900">❤️ {user.cheers_given || 0}</p>
                              <p className="text-xs text-gray-500">
                                {user.cheers_received || 0} received
                              </p>
                            </div>
                          </div>
                          
                          {/* Progress bar */}
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-red-400 to-pink-500 h-2 rounded-full"
                              style={{ width: `${progressWidth}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default CheerAnalytics; 