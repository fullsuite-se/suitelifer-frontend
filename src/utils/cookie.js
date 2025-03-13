import axios from "axios";
import config from "../config";

export const getUserFromCookie = async () => {
  try {
    const response = await axios.get(`${config.apiBaseUrl}/api/user-info`, {
      withCredentials: true,
    });
    return response.data.user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
};

export const getServicesFromCookie = async (userId) => {
  try {
    const response = await axios.get(
      `${config.apiBaseUrl}/api/get-services/${userId}`,
      { withCredentials: true }
    );
    return response.data.services;
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
};

export const refreshToken = async () => {
  try {
    const response = await axios.get(`${config.apiBaseUrl}/api/refresh-token`, {
      withCredentials: true,
    });
    return response.data.accessToken;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return null;
  }
};
