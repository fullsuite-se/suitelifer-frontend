import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/authStore';


const MoodPage = () => {
  const user = useStore((state) => state.user);
  const [currentMoodLevel, setCurrentMoodLevel] = useState(3);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Data states
  const [moodHistory, setMoodHistory] = useState([]);
  const [todayMood, setTodayMood] = useState(null);
  const [moodStats, setMoodStats] = useState(null);
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [yearlyStats, setYearlyStats] = useState(null);

  // Use the correct user ID property from JWT: user.id
  const userId = user?.id || '019614eb-5acf-700e-a7f3-295b59219714';

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch all required data
      // TODO: Replace with real API calls. For now, use mock data.
      setMoodHistory([]);
      setTodayMood(null);
      setMoodStats(null);
      setWeeklyStats(null);
      setMonthlyStats(null);
      setYearlyStats(null);
      
    } catch (error) {
      console.error('Error fetching mood data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitMood = async () => {
    if (sending) return;

    try {
      setSending(true);
      
      // TODO: Replace with real API call. For now, just show success.
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      fetchAllData();
    } catch (error) {
      console.error('Error submitting mood:', error);
      alert('Failed to submit mood. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const getMoodEmoji = (level) => {
    const emojis = {
      1: '😢',
      2: '😔',
      3: '😐',
      4: '😊',
      5: '😄'
    };
    return emojis[level] || '😐';
  };

  const getMoodLabel = (level) => {
    const labels = {
      1: 'Very Bad',
      2: 'Bad',
      3: 'Neutral',
      4: 'Good',
      5: 'Excellent'
    };
    return labels[level] || 'Neutral';
  };

  const getMoodColor = (level) => {
    const colors = {
      1: 'bg-red-500',
      2: 'bg-orange-500',
      3: 'bg-yellow-500',
      4: 'bg-green-500',
      5: 'bg-green-600'
    };
    return colors[level] || 'bg-yellow-500';
  };

  const formatMoodStats = (stats) => {
    if (!stats || !stats.avg_mood) return '0';
    return Math.round(parseFloat(stats.avg_mood));
  };

  const getMoodDistribution = () => {
    if (!moodHistory || moodHistory.length === 0) return [];
    
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    moodHistory.forEach(mood => {
      distribution[mood.mood_level]++;
    });
    
    return [
      { level: 1, count: distribution[1], label: 'Low', color: 'bg-red-500' },
      { level: 2, count: distribution[2], label: 'Low', color: 'bg-orange-500' },
      { level: 3, count: distribution[3], label: 'Neutral', color: 'bg-yellow-500' },
      { level: 4, count: distribution[4], label: 'High', color: 'bg-green-500' },
      { level: 5, count: distribution[5], label: 'High', color: 'bg-green-600' }
    ];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mood Tracker</h1>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Mood submitted successfully!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Average Mood Rate */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg p-6 text-white relative overflow-hidden">
        <div className="absolute right-4 top-4 text-6xl opacity-30">😊</div>
        <h2 className="text-lg font-semibold mb-4">Average Mood Rate</h2>
        <div className="flex justify-between items-center">
          <div className="text-center">
            <div className="text-3xl font-bold">{formatMoodStats(weeklyStats)}</div>
            <div className="text-sm">Weekly</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{formatMoodStats(monthlyStats)}</div>
            <div className="text-sm">Monthly</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{formatMoodStats(yearlyStats)}</div>
            <div className="text-sm">Yearly</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rate your mood */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className={`${getMoodColor(currentMoodLevel)} rounded-lg p-8 text-center text-white`}>
                <div className="text-6xl mb-2">{getMoodEmoji(currentMoodLevel)}</div>
                <div className="text-4xl font-bold">{currentMoodLevel}</div>
                <div className="text-sm mt-2">Today's Mood</div>
              </div>
              <div className="flex-1 ml-8">
                <h3 className="text-lg font-semibold mb-4">Rate your mood</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm w-8">1.0</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={currentMoodLevel}
                      onChange={(e) => setCurrentMoodLevel(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm w-8">5.0</span>
                  </div>
                  <div className="text-center text-sm text-gray-600">
                    {getMoodLabel(currentMoodLevel)}
                  </div>
                  <button
                    onClick={handleSubmitMood}
                    disabled={sending}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
                  >
                    {sending ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mood Trend */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Mood Trend</h3>
            <div className="text-2xl font-bold mb-2">{moodStats?.total_entries || 0} <span className="text-sm font-normal text-gray-600">total mood logs</span></div>
            {/* Simple trend visualization */}
            <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-sm">Trend visualization</div>
                <div className="text-xs mt-1">Average: {moodStats?.avg_mood ? parseFloat(moodStats.avg_mood).toFixed(1) : 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Recent Mood Logs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Mood Logs</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {moodHistory.map((mood) => (
                <div key={mood.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${getMoodColor(mood.mood_level)}`}>
                    {getMoodEmoji(mood.mood_level)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{getMoodLabel(mood.mood_level)} log</div>
                    <div className="text-xs text-gray-500">
                      {new Date(mood.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="text-xs text-gray-400">Mood rate: {mood.mood_level}</div>
                  </div>
                </div>
              ))}
              {moodHistory.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  <div className="text-sm">No mood logs yet</div>
                </div>
              )}
            </div>
          </div>

          {/* Weekly Mood Logs Overview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Weekly Mood Logs Overview</h3>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold">{formatMoodStats(weeklyStats)}</div>
              <div className="text-sm text-gray-600">This week's average</div>
            </div>
            
            {/* Simple pie chart representation */}
            <div className="space-y-2">
              {getMoodDistribution().map((item) => (
                <div key={item.level} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <span className="text-sm text-gray-600">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodPage;
