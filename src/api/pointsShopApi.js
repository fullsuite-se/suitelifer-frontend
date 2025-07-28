// src/api/pointsShopApi.js
import axios from "../utils/axios";

export const pointsShopApi = {
  async getPoints() {
    const res = await axios.get("/api/points/balance");
    return res.data;
  },
  async getPointsHistory(limit = 10) {
    const res = await axios.get(`/api/points/transactions?limit=${limit}`);
    return res.data;
  },
  async getCheerFeed(limit = 20, from = null, to = null) {
    let url = `/api/points/feed?limit=${limit}`;
    if (from) {
      url += `&from=${encodeURIComponent(from)}`;
    }
    if (to) {
      url += `&to=${encodeURIComponent(to)}`;
    }
    const res = await axios.get(url);
    return res.data;
  },
  async sendCheer(recipientId, amount, message) {
    const res = await axios.post("/api/points/cheer", { recipientId, amount, message });
    return res.data;
  },
  searchUsers: async (query) => {
    const res = await axios.get(`/api/points/search-users?query=${query}`);
    return res.data.data; // Return the data array from the response
  },
  async getCheerStats() {
    const res = await axios.get("/api/points/stats");
    return res.data;
  },
  async getReceivedCheers() {
    const res = await axios.get("/api/points/received");
    return res.data;
  },
  async getLeaderboard(period = "weekly", userId = null) {
    console.log('Calling getLeaderboard with:', { period, userId });
    let url = `/api/points/leaderboard-with-period?period=${period}`;
    if (userId) {
      url += `&user_id=${userId}`;
    }
    const res = await axios.get(url);
    console.log('Leaderboard response:', res.data);
    return res.data; // Return the entire response data
  },
  async toggleCheerLike(cheerId) {
    const res = await axios.post(`/api/points/cheer/${cheerId}/like`);
    return res.data;
  },
  async addCheerComment(cheerId, comment) {
    const res = await axios.post(`/api/points/cheer/${cheerId}/comment`, { comment });
    return res.data.data; // Return the data object from the response
  },
  async getCheerComments(cheerId, { limit = 20, offset = 0, all = false } = {}) {
    let query = `?`;
    if (all) {
      query += `all=true`;
    } else {
      query += `limit=${limit}&offset=${offset}`;
    }
    const res = await axios.get(`/api/points/cheer/${cheerId}/comments${query}`);
    return res.data.data; // Return the data array from the response
  },
  async updateCheerComment(cheerId, commentId, comment) {
    const res = await axios.put(`/api/points/cheer/${cheerId}/comment/${commentId}`, { comment });
    return res.data;
  },
  async deleteCheerComment(cheerId, commentId) {
    const res = await axios.delete(`/api/points/cheer/${cheerId}/comment/${commentId}`);
    return res.data;
  },
  
  // Admin functions for managing user points
  async getAllUserPoints() {
    const res = await axios.get("/api/points/admin/users");
    return res.data;
  },
  
  async addPointsToUser(userId, amount, reason) {
    const res = await axios.post("/api/points/admin/add", {
      user_id: userId, 
      points: amount, 
      reason 
    });
    return res.data;
  },
  
  async deductPointsFromUser(userId, amount, reason) {
    const res = await axios.post("/api/points/admin/deduct", {
      user_id: userId, 
      points: amount, 
      reason 
    });
    return res.data;
  },
};
