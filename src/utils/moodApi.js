import api from './axios.js';

export const moodApi = {
  // Submit new mood entry
  submitMood: async (moodLevel, notes = null) => {
    const response = await api.post('/api/mood', {
      mood_level: moodLevel,
      notes
    });
    return response.data;
  },

  // Get today's mood
  getTodayMood: async () => {
    const response = await api.get('/api/mood/today');
    return response.data;
  },

  // Get mood history
  getMoodHistory: async (limit = 30) => {
    const response = await api.get(`/api/mood/history?limit=${limit}`);
    return response.data;
  },

  // Get overall mood statistics
  getMoodStats: async () => {
    const response = await api.get('/api/mood/stats');
    return response.data;
  },

  // Get weekly mood statistics
  getWeeklyStats: async () => {
    const response = await api.get('/api/mood/stats/weekly');
    return response.data;
  },

  // Get monthly mood statistics
  getMonthlyStats: async () => {
    const response = await api.get('/api/mood/stats/monthly');
    return response.data;
  },

  // Get yearly mood statistics
  getYearlyStats: async () => {
    const response = await api.get('/api/mood/stats/yearly');
    return response.data;
  },

  // Get mood distribution for charts
  getMoodDistribution: async (days = 30) => {
    const response = await api.get(`/api/mood/distribution?days=${days}`);
    return response.data;
  },

  // Get mood trends over time
  getMoodTrends: async (days = 30) => {
    const response = await api.get(`/api/mood/trends?days=${days}`);
    return response.data;
  },

  // Delete a mood entry
  deleteMoodEntry: async (moodId) => {
    const response = await api.delete(`/api/mood/${moodId}`);
    return response.data;
  },

  // Update a mood entry
  updateMoodEntry: async (moodId, moodLevel, notes = null) => {
    const response = await api.put(`/api/mood/${moodId}`, {
      mood_level: moodLevel,
      notes
    });
    return response.data;
  }
};

export default moodApi;
