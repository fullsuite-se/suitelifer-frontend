import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSuitebiteStore } from '../../store/stores/suitebiteStore';
import { suitebiteAPI } from '../../utils/suitebiteAPI';
import CreateCheerPost from '../../components/suitebite/CreateCheerPost';
import CheerPostCard from '../../components/suitebite/CheerPostCard';
import UserHeartbitsWidget from '../../components/suitebite/UserHeartbitsWidget';
import { HeartIcon, FireIcon, TrophyIcon, UserGroupIcon, SparklesIcon } from '@heroicons/react/24/outline';

const SuitebiteHome = () => {
  const navigate = useNavigate();
  const {
    cheerFeed,
    userHeartbits,
    monthlyLimits,
    setCheerFeed,
    setUserHeartbits,
    setMonthlyLimits
  } = useSuitebiteStore();

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [peersWhoCheered, setPeersWhoCheered] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState({ daily: [], weekly: [], monthly: [], allTime: [] });
  const [leaderboardPeriod, setLeaderboardPeriod] = useState('allTime'); // daily, weekly, monthly, allTime
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);

  useEffect(() => {
    loadSuitebiteData();
    // Removed all automatic refresh functionality to prevent interruptions while typing
  }, []);

  // Auto-refresh cheer feed every 30 seconds to show updated posts after moderation
  useEffect(() => {
    const interval = setInterval(() => {
      // Only refresh the cheer feed, not all data to avoid interrupting user interactions
      suitebiteAPI.getCheerFeed().then(response => {
        if (response.success) {
          setCheerFeed(response.posts || []);
        }
      }).catch(error => {
        console.error('Error auto-refreshing cheer feed:', error);
      });
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Map frontend periods to backend expected values
  const mapPeriodToBackend = (period) => {
    const periodMap = {
      'daily': 'day',
      'weekly': 'week', 
      'monthly': 'month',
      'allTime': 'all'
    };
    return periodMap[period] || 'all';
  };

  // Load leaderboard data for a specific period
  const loadLeaderboardData = async (period) => {
    try {
      setLeaderboardLoading(true);
      const backendPeriod = mapPeriodToBackend(period);
      const leaderboardResponse = await suitebiteAPI.getLeaderboard('received', backendPeriod);
      
      if (leaderboardResponse.success) {
        setLeaderboardData(prev => ({
          ...prev,
          [period]: leaderboardResponse.leaderboard || []
        }));
      }
    } catch (error) {
      console.error(`Error loading ${period} leaderboard:`, error);
      showNotification('error', `Failed to load ${period} leaderboard`);
    } finally {
      setLeaderboardLoading(false);
    }
  };

  // Handle period tab click
  const handlePeriodChange = async (period) => {
    setLeaderboardPeriod(period);
    
    // Always fetch fresh data for the selected period to ensure accuracy
    await loadLeaderboardData(period);
  };

  const loadSuitebiteData = async (retryCount = 0) => {
    try {
      setLoading(true);
      
      const [cheerFeedResponse, heartbitsResponse, monthlyLimitsResponse, peersResponse] = await Promise.all([
        suitebiteAPI.getCheerFeed(),
        suitebiteAPI.getUserHeartbits(),
        suitebiteAPI.getMonthlyLimits(),
        suitebiteAPI.getPeersWhoCheered()
      ]);

      if (cheerFeedResponse.success) {
        setCheerFeed(cheerFeedResponse.posts || []);
      }

      if (heartbitsResponse.success) {
        setUserHeartbits(heartbitsResponse.heartbits_balance);
      }

      if (monthlyLimitsResponse.success) {
        setMonthlyLimits(monthlyLimitsResponse.limits);
      }

      if (peersResponse.success) {
        setPeersWhoCheered(peersResponse.peers || []);
      }

      // Load current leaderboard period data if not already loaded
      if (!leaderboardData[leaderboardPeriod] || leaderboardData[leaderboardPeriod].length === 0) {
        await loadLeaderboardData(leaderboardPeriod);
      }

    } catch (error) {
      console.error('Error loading Suitebite data:', error);
      
      // Retry logic for network errors
      if (retryCount < 2) {
        setTimeout(() => loadSuitebiteData(retryCount + 1), 1000 * (retryCount + 1));
      } else {
        showNotification('error', 'Failed to load Suitebite data. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
  };

  const handleCheerPostCreated = async () => {
    try {
      // Reload all relevant data immediately after cheer post creation
      const [cheerFeedResponse, heartbitsResponse, monthlyLimitsResponse, peersResponse] = await Promise.all([
        suitebiteAPI.getCheerFeed(),
        suitebiteAPI.getUserHeartbits(),
        suitebiteAPI.getMonthlyLimits(),
        suitebiteAPI.getPeersWhoCheered()
      ]);

      // Update state immediately with fresh data
      if (cheerFeedResponse.success) {
        setCheerFeed(cheerFeedResponse.posts || []);
      }

      if (heartbitsResponse.success) {
        setUserHeartbits(heartbitsResponse.heartbits_balance);
      }

      if (monthlyLimitsResponse.success) {
        setMonthlyLimits(monthlyLimitsResponse.limits);
      }

      if (peersResponse.success) {
        setPeersWhoCheered(peersResponse.peers || []);
      }

      // Refresh current leaderboard data
      await loadLeaderboardData(leaderboardPeriod);

      showNotification('success', 'Cheer post created successfully! 🎉');
    } catch (error) {
      console.error('Error refreshing data after cheer post creation:', error);
      showNotification('error', 'Cheer created but failed to refresh data');
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="suitebite-home min-h-screen bg-gradient-to-br from-[#eee3e3] to-[#f8f1f1] p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="loading-spinner">
              <div className="w-8 h-8 border-4 border-[#0097b2] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-[#4a6e7e] font-medium">Loading Suitebite...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg text-sm font-medium max-w-sm ${
          notification.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-8 py-6 pb-20">
        {/* Top Row - Send Cheer Form & Horizontal Heartbits Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Send Cheer Form - Left Half */}
          <div className="lg:col-span-1">
            <div className="bg-white p-4 rounded-2xl shadow-sm h-full">
              <CreateCheerPost onCheerPostCreated={handleCheerPostCreated} />
            </div>
          </div>

          {/* Right Side - Horizontal Heartbits Dashboard above tables */}
          <div className="lg:col-span-1 space-y-6">
            {/* Horizontal Heartbits Dashboard */}
            <div className="bg-white p-3 rounded-2xl shadow-sm">
              <h2 className="text-sm font-semibold mb-3 text-gray-800">Heartbits Dashboard</h2>
              <div className="grid grid-cols-2 gap-3">
                {/* Heartbits to Shop Card */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <HeartIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xl font-bold text-gray-900">{userHeartbits || 0}</div>
                      <div className="text-xs text-gray-600">To Shop</div>
                    </div>
                  </div>
                </div>

                {/* Heartbits to Give Card */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <FireIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xl font-bold text-gray-900">
                        {monthlyLimits ? (monthlyLimits.heartbits_limit - monthlyLimits.heartbits_sent) : 0}
                      </div>
                      <div className="text-xs text-gray-600">To Give</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Supporters */}
            <div className="bg-white rounded-2xl shadow-sm">
              {/* Fixed Header */}
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-800">Recent Supporters</h2>
              </div>
              
              {/* Scrollable Content */}
              <div className="p-3 max-h-[280px] overflow-y-auto">
                {peersWhoCheered.length === 0 ? (
                  <div className="text-center py-6">
                    <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                      <UserGroupIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-xs">No cheers received yet</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {peersWhoCheered.slice(0, 8).map((peer, index) => (
                      <div key={index}>
                        <div className="flex items-center gap-2 p-2">
                          <div className="text-lg">😊</div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-gray-900 truncate">
                              {peer.first_name} {peer.last_name}
                            </div>
                            <div className="text-xs text-gray-500">Just now</div>
                          </div>
                          <div className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                            +{peer.points || 2}
                          </div>
                        </div>
                        {index < peersWhoCheered.slice(0, 8).length - 1 && (
                          <div className="border-b border-gray-200"></div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - Recent Cheers & Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Cheers Feed - Left Half */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm">
              {/* Fixed Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-800">Recent Cheers</h2>
                  <div className="text-xs text-gray-500">
                    Latest cheer posts from the team
                  </div>
                </div>
              </div>
              
              {/* Scrollable Feed Content */}
              <div className="p-4 max-h-[500px] overflow-y-auto pb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Cheers</h3>
                  <button
                    onClick={loadSuitebiteData}
                    className="flex items-center gap-2 px-3 py-1 text-sm text-[#0097b2] hover:text-[#007a8e] transition-colors duration-200"
                    title="Refresh feed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>
                </div>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading amazing cheers...</p>
                  </div>
                ) : cheerFeed.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FireIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No cheer posts yet</h3>
                    <p className="text-gray-500">Be the first to spread some love and recognition! 💝</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cheerFeed.slice(0, 5).map((post, index) => (
                      <div key={post.cheer_post_id}>
                        <CheerPostCard
                          post={post}
                          onInteraction={handleCheerPostCreated}
                        />
                        {index < cheerFeed.slice(0, 5).length - 1 && (
                          <div className="border-b border-gray-200 mt-4"></div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Leaderboard - Right Half */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm">
              {/* Fixed Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-800">Leaderboard</h2>
                  
                  {/* Improved Filter Tabs */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    {[
                      { key: 'daily', label: 'Day' },
                      { key: 'weekly', label: 'Week' },
                      { key: 'monthly', label: 'Month' },
                      { key: 'allTime', label: 'All' }
                    ].map((period) => (
                      <button
                        key={period.key}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                          leaderboardPeriod === period.key
                            ? 'bg-blue-500 text-white shadow-sm'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                        }`}
                        onClick={() => handlePeriodChange(period.key)}
                      >
                        {period.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Scrollable Leaderboard Content */}
              <div className="p-3 max-h-[500px] overflow-y-auto pb-6">
                {leaderboardLoading ? (
                  <div className="text-center py-6">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-gray-500 text-xs">Loading leaderboard...</p>
                  </div>
                ) : leaderboardData[leaderboardPeriod]?.length === 0 ? (
                  <div className="text-center py-6">
                    <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                      <TrophyIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-xs">No leaderboard data yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {leaderboardData[leaderboardPeriod]?.slice(0, 20).map((user, index) => (
                      <div 
                        key={index}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:shadow-sm ${
                          index === 0 ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200' :
                          index === 1 ? 'bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200' :
                          index === 2 ? 'bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200' :
                          'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        {/* Rank Badge */}
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-yellow-900' :
                          index === 1 ? 'bg-gradient-to-r from-gray-300 to-slate-400 text-gray-700' :
                          index === 2 ? 'bg-gradient-to-r from-orange-400 to-red-400 text-orange-900' :
                          'bg-blue-500 text-white'
                        }`}>
                          #{index + 1}
                        </div>
                        
                        {/* Trophy Icon */}
                        <div className="text-lg">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏆'}
                        </div>
                        
                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-gray-900 truncate">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {user.job_title || 'Team Member'}
                          </div>
                        </div>
                        
                        {/* Points Badge */}
                        <div className={`text-xs font-bold px-3 py-1.5 rounded-lg ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-700' :
                          index === 2 ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {user.points || 0} pts
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuitebiteHome;
