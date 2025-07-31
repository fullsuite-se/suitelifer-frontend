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

export const refreshToken = async () => {
  try {
    const response = await api.get("/api/refresh-token");
    const newToken = response.data.accessToken;
    // Store new token in localStorage for Suitebite API compatibility
    if (newToken) {
      localStorage.setItem('token', newToken);
    }
    return newToken;
  } catch (error) {
    // Clear token from localStorage if refresh fails
    localStorage.removeItem('token');
    window.location.href = "/login";
    console.error("Failed to refresh token:", error);
    if (error.response && error.response.status === 401) {
      console.warn("Refresh token expired. Logging out...");
      return null;
    }
    return null;
  }
};
