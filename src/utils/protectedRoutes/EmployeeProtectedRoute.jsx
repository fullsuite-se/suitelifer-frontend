import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import config from "../../config";

const AdminProtectedRoute = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshToken = async () => {
    try {
      const response = await axios.get(
        `${config.apiBaseUrl}/api/refresh-token`,
        { withCredentials: true }
      );

      const newToken = response.data.accessToken;
      return newToken;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return null;
    }
  };

  const getUser = async () => {
    const response = await axios.get(`${config.apiBaseUrl}/api/user-info`, {
      withCredentials: true,
    });

    return response.data.user;
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = await getUser();
        setRole(user.role);
      } catch (error) {
        const newToken = await refreshToken();
        if (newToken) {
          const user = await getUser();
          setRole(user.role);
        } else {
          setRole(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return role === "employee" ? <Outlet /> : <Navigate to="/login-employee" />;
};

export default AdminProtectedRoute;
