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
    
    // Only fetch if we don't have data for this period yet
    if (!leaderboardData[period] || leaderboardData[period].length === 0) {
      await loadLeaderboardData(period);
    }
  };

  const loadSuitebiteData = async () => {
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

      // Load all leaderboard periods on initial load for better UX
      await Promise.all([
        loadLeaderboardData('daily'),
        loadLeaderboardData('weekly'),
        loadLeaderboardData('monthly'),
        loadLeaderboardData('allTime')
      ]);

    } catch (error) {
      console.error('Error loading Suitebite data:', error);
      showNotification('error', 'Failed to load Suitebite data');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
  };

  const handleCheerPostCreated = () => {
    loadSuitebiteData();
    showNotification('success', 'Cheer post created successfully! 🎉');
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
    <div className="suitebite-home min-h-screen bg-gradient-to-br from-[#eee3e3] to-[#f8f1f1] p-6">
      {/* Toast Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-sm font-medium max-w-sm ${
          notification.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {notification.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="space-y-8">
          {/* Heartbits Dashboard - Enhanced */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#1a0202] flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#0097b2] to-[#007a8e] rounded-xl flex items-center justify-center">
                  <HeartIcon className="h-6 w-6 text-white" />
                </div>
                Heartbits Dashboard
              </h2>
              <button
                onClick={loadSuitebiteData}
                className="px-4 py-2 bg-white/50 hover:bg-white/70 rounded-lg text-sm font-medium text-[#1a0202] border border-white/50 transition-all duration-200"
              >
                Refresh
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Available Heartbits */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-[#0097b2] to-[#007a8e] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-6 translate-x-6"></div>
                <div className="relative flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <HeartIcon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">{userHeartbits}</div>
                    <div className="text-white/80 font-medium">Available Heartbits</div>
                    <div className="text-white/60 text-sm mt-1">For shopping & activities</div>
                  </div>
                </div>
              </div>
              
              {/* Monthly Giving Limits */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-[#7c3aed] to-[#5b21b6] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-6 translate-x-6"></div>
                <div className="relative flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <SparklesIcon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">
                      {monthlyLimits ? (monthlyLimits.heartbits_limit - monthlyLimits.heartbits_sent) : 0}
                    </div>
                    <div className="text-white/80 font-medium">Heartbits Left to Give</div>
                    <div className="text-white/60 text-sm mt-1">
                      {monthlyLimits ? `${monthlyLimits.heartbits_sent}/${monthlyLimits.heartbits_limit} used this month` : 'Loading...'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Create Cheer Post */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-xl flex items-center justify-center">
                <FireIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#1a0202]">Send Cheers</h2>
            </div>
            <CreateCheerPost onCheerPostCreated={handleCheerPostCreated} />
          </div>
          
          {/* Combined Cheer Feed and Peers Section - Equal Heights */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Recent Cheers Feed */}
            <div className="xl:col-span-3">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-bold text-[#1a0202]">🔥 Recent Cheers</h2>
                </div>
                
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-[#0097b2]/10 rounded-xl mb-4">
                      <div className="w-6 h-6 border-2 border-[#0097b2] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-[#4a6e7e] font-medium">Loading amazing cheers...</p>
                  </div>
                ) : cheerFeed.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <FireIcon className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#1a0202] mb-3">No cheer posts yet</h3>
                    <p className="text-[#4a6e7e] max-w-sm mx-auto">Be the first to spread some love and recognition! 💝</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cheerFeed.slice(0, 5).map(post => (
                      <CheerPostCard
                        key={post.cheer_post_id}
                        post={post}
                        onUpdate={loadSuitebiteData}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Recent Supporters - Same Height */}
            <div className="xl:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <h3 className="text-xl font-bold text-[#1a0202]">🧑‍🤝‍🧑 Recent Supporters</h3>
                </div>
                
                <div className="flex-1 flex flex-col">
                  {peersWhoCheered.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-center py-8">
                      <div>
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <UserGroupIcon className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-[#4a6e7e] text-sm">No cheers received yet</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 flex-1">
                      {peersWhoCheered.slice(0, 10).map((peer, index) => (
                        <div key={index} className="group flex items-center gap-3 p-3 bg-gradient-to-r from-[#eee3e3]/50 to-white/50 rounded-xl hover:shadow-md transition-all duration-200 border border-white/50">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#0097b2] to-[#007a8e] text-white rounded-xl flex items-center justify-center font-semibold text-sm shadow-lg">
                              {getInitials(peer.first_name, peer.last_name)}
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-400 rounded-full flex items-center justify-center">
                              <span className="text-xs">❤️</span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-[#1a0202] text-sm truncate">
                              {peer.first_name} {peer.last_name}
                            </div>
                            <div className="text-xs text-[#4a6e7e] truncate">{peer.job_title || 'Team Member'}</div>
                          </div>
                          <div className="text-xs font-bold text-[#0097b2] bg-[#0097b2]/10 px-2 py-1 rounded-lg">
                            +{peer.points || 2}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard Section - Modernized */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold text-[#1a0202]">🏅 Top Receivers Leaderboard</h3>
              </div>
            </div>
            
            {/* Period Tabs - Simplified */}
            <div className="flex flex-wrap gap-3 mb-8 p-2 bg-[#eee3e3]/30 rounded-xl">
              {['daily', 'weekly', 'monthly', 'allTime'].map((period) => (
                <button
                  key={period}
                  className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                    leaderboardPeriod === period
                      ? 'bg-gradient-to-r from-[#0097b2] to-[#007a8e] text-white shadow-lg transform scale-105'
                      : 'text-[#4a6e7e] hover:bg-white/60 hover:text-[#1a0202]'
                  }`}
                  onClick={() => handlePeriodChange(period)}
                >
                  {period === 'allTime' ? 'All-Time' : period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>

            {/* Leaderboard Grid */}
            {leaderboardLoading ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 border-4 border-[#0097b2] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-[#4a6e7e] font-medium mt-4">Loading leaderboard...</p>
              </div>
            ) : leaderboardData[leaderboardPeriod]?.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <TrophyIcon className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-[#1a0202] mb-2">No leaderboard data yet</h3>
                <p className="text-[#4a6e7e]">Start cheering to see the rankings!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {leaderboardData[leaderboardPeriod]?.slice(0, 12).map((user, index) => (
                  <div key={index} className={`group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
                    index === 0 ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200' :
                    index === 1 ? 'bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-200' :
                    index === 2 ? 'bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200' :
                    'bg-gradient-to-br from-[#eee3e3]/30 to-white/60 border border-white/60'
                  }`}>
                    {/* Rank Badge */}
                    <div className="absolute top-4 right-4">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shadow-lg ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-yellow-900' :
                        index === 1 ? 'bg-gradient-to-br from-gray-300 to-slate-400 text-gray-700' :
                        index === 2 ? 'bg-gradient-to-br from-orange-400 to-red-400 text-orange-900' :
                        'bg-gradient-to-br from-[#0097b2] to-[#007a8e] text-white'
                      }`}>
                        #{index + 1}
                      </div>
                    </div>
                    
                    {/* User Info */}
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#4a6e7e] to-[#2d3748] text-white rounded-2xl flex items-center justify-center text-lg font-bold shadow-lg">
                          {getInitials(user.first_name, user.last_name)}
                        </div>
                        {index < 3 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                            <span className="text-xs">🏆</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[#1a0202] text-lg truncate">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-sm text-[#4a6e7e] truncate">{user.job_title || 'Team Member'}</div>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="px-3 py-1 bg-gradient-to-r from-[#0097b2]/10 to-[#0097b2]/20 rounded-lg">
                            <span className="text-sm font-bold text-[#0097b2]">{user.points || 0} pts</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuitebiteHome;
