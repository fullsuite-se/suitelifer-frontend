import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSuitebiteStore } from '../../store/stores/suitebiteStore';
import { suitebiteAPI } from '../../utils/suitebiteAPI';
import LeaderboardCard from '../../components/suitebite/LeaderboardCard';
import { TrophyIcon, CalendarIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const SuitebiteLeaderboard = () => {
  const navigate = useNavigate();
  const {
    leaderboard,
    monthlyLeaderboard,
    setLeaderboard,
    setMonthlyLeaderboard
  } = useSuitebiteStore();

  const [activeTab, setActiveTab] = useState('all-time');
  // Only show received leaderboard
  const [loading, setLoading] = useState(false);
  const [allTimeData, setAllTimeData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    loadLeaderboards();
  }, [activeTab]);

  const loadLeaderboards = async () => {
    try {
      setLoading(true);
      
      let response;
      
      switch (activeTab) {
        case 'daily':
          response = await suitebiteAPI.getLeaderboard('received', 'day');
          break;
        case 'weekly':
          response = await suitebiteAPI.getLeaderboard('received', 'week');
          break;
        case 'monthly':
          response = await suitebiteAPI.getLeaderboard('received', 'month');
          break;
        case 'all-time':
        default:
          response = await suitebiteAPI.getLeaderboard('received', 'all');
          break;
      }

      if (response.success) {
        setLeaderboard(response.leaderboard);
      }
    } catch (error) {
      console.error('Error loading leaderboards:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTabIcon = (tab) => {
    switch (tab) {
      case 'daily': return '📅';
      case 'weekly': return '📊';
      case 'monthly': return '📈';
      case 'all-time': return '🏆';
      default: return '🌟';
    }
  };

  const getTabLabel = (tab) => {
    switch (tab) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      case 'all-time': return 'All-Time';
      default: return 'All Time';
    }
  };

  const getTypeLabel = (type) => {
    return type === 'received' ? 'Top Receivers' : 'Top Givers';
  };

  const getTypeIcon = (type) => {
    return type === 'received' ? '🏅' : '🏆';
  };

  const currentLeaderboard = leaderboard || [];

  // Helper to get the correct heartbit points for a user
  const getHeartbitsPoints = (user) => {
    const points = Number(user.total_heartbits);
    return isNaN(points) ? 0 : points;
  };

  return (
    <div className="suitebite-leaderboard bg-gray-50 min-h-screen">
      <div className="suitebite-container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="leaderboard-header bg-white rounded-lg shadow-sm p-6 mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <TrophyIcon className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Suitebite Leaderboard</h1>
          </div>
          <p className="text-gray-600 text-lg">Celebrating our most generous colleagues!</p>
        </div>

        {/* Navigation */}
        <div className="leaderboard-nav bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Time Period Tabs */}
            <div className="nav-tabs flex flex-wrap gap-2">
              {['daily', 'weekly', 'monthly', 'all-time'].map((tab) => (
                <button 
                  key={tab}
                  className={`nav-tab flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === tab 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  <span className="mr-2">{getTabIcon(tab)}</span>
                  <span>{getTabLabel(tab)}</span>
                </button>
              ))}
            </div>

            {/* Type Toggle and Back Button */}
            <div className="flex items-center gap-4">
              
              <button 
                className="back-btn inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                onClick={() => navigate('/app/suitebite')}
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Feed
              </button>
            </div>
          </div>
        </div>

        {/* Leaderboard Content */}
        <div className="leaderboard-content">
          {loading ? (
            <div className="loading-spinner bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="inline-flex items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                <p className="text-gray-600 text-lg">Loading leaderboard...</p>
              </div>
            </div>
          ) : currentLeaderboard.length === 0 ? (
            <div className="empty-leaderboard bg-white rounded-lg shadow-sm p-12 text-center">
              <TrophyIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No data yet!</h3>
              <p className="text-gray-600">Start spreading cheers to see the leaderboard in action!</p>
            </div>
          ) : (
            <>
              {/* Top 3 Podium */}
              {currentLeaderboard.length >= 3 && (
                <div className="podium bg-white rounded-lg shadow-sm p-8 mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                    {getTypeIcon('received')} {getTabLabel(activeTab)} Champions - {getTypeLabel('received')}
                  </h3>
                  
                  <div className="flex items-end justify-center gap-4">
                    {/* Second Place */}
                    <div className="podium-position second flex flex-col items-center">
                      <div className="medal text-2xl mb-2">🥈</div>
                      <LeaderboardCard 
                        user={currentLeaderboard[1]} 
                        rank={2}
                        isPodium={true}
                        type={'received'}
                      />
                    </div>
                    
                    {/* First Place */}
                    <div className="podium-position first flex flex-col items-center">
                      <div className="medal text-2xl mb-2">🥇</div>
                      <div className="crown text-xl mb-1">👑</div>
                      <LeaderboardCard 
                        user={currentLeaderboard[0]} 
                        rank={1}
                        isPodium={true}
                        type={'received'}
                      />
                    </div>
                    
                    {/* Third Place */}
                    <div className="podium-position third flex flex-col items-center">
                      <div className="medal text-2xl mb-2">🥉</div>
                      <LeaderboardCard 
                        user={currentLeaderboard[2]} 
                        rank={3}
                        isPodium={true}
                        type={'received'}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Full Leaderboard List */}
              <div className="leaderboard-list bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {getTypeIcon('received')} {getTypeLabel('received')} - {getTabLabel(activeTab)}
                  </h3>
                  <p className="text-sm text-gray-600">Showing all participants</p>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {currentLeaderboard.map((user, index) => (
                    <div key={user.user_id} className="px-6 py-4">
                      <div className="flex items-center">
                        {/* Rank */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mr-4 ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-800' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {index + 1}
                        </div>
                        
                        {/* User Info */}
                        <div className="flex-1">
                          <div className="flex items-center">
                            {/* Profile Picture */}
                            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium mr-3">
                              {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                            </div>
                            
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900">
                                {user.first_name} {user.last_name}
                              </h4>
                              <p className="text-xs text-gray-500">{user.department || 'No Department'}</p>
                            </div>
                            
                            {/* Points */}
                            <div className="text-right">
                              <div className="text-lg font-semibold text-gray-900">
                                ❤️ {getHeartbitsPoints(user)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {`${user.cheers_received || 0} received`}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuitebiteLeaderboard;
