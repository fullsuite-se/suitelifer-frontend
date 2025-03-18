import api from "./axios";

export const getUserFromCookie = async () => {
  try {
    const response = await api.get("/api/user-info");
    return response.data.user;
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.warn("User not logged in.");
      return null;
    }
    console.error("Failed to fetch user:", error);
    return null;
  }
};

export const getServicesFromCookie = async (userId) => {
  try {
    const response = await api.get(`/api/get-services/${userId}`);
    return response.data.services;
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
};

export const refreshToken = async () => {
  try {
    const response = await api.get("/api/refresh-token");
    return response.data.accessToken;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    if (error.response && error.response.status === 401) {
      console.warn("Refresh token expired. Logging out...");
      return null;
    }
    return null;
  }
};
