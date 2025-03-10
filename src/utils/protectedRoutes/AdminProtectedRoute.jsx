import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import { useStore } from "../../store/authStore";

const AdminProtectedRoute = () => {
  const [user, setUser] = useState(null);
  const setServices = useStore((state) => state.setServices);
  const [loading, setLoading] = useState(true);

  const refreshToken = async () => {
    try {
      const response = await axios.get(
        `${config.apiBaseUrl}/api/refresh-token`,
        { withCredentials: true }
      );
      return response.data.accessToken;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return null;
    }
  };

  const getUser = async () => {
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

  const getUserServices = async (userId) => {
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

  const fetchData = async () => {
    try {
      let user = await getUser();

      if (!user) {
        const newToken = await refreshToken();
        if (newToken) {
          user = await getUser();
        }
      }

      if (user) {
        setUser(user);

        const services = await getUserServices(user.id);
        setServices(services);
      } else {
        setUser(null);
        setServices([]);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login-admin" />;
};

export default AdminProtectedRoute;
