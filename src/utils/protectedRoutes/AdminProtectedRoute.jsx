import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import config from "../../config";

const AdminProtectedRoute = () => {
  const [user, setUser] = useState(null);
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
    console.log(response.data);

    return response.data.user;
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = await getUser();
        console.log(user);
        setUser(user);
      } catch (error) {
        const newToken = await refreshToken();
        if (newToken) {
          const user = await getUser();
          console.log(user);
          setUser(user);
        } else {
          setUser(null);
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

  return user ? <Outlet /> : <Navigate to="/login-admin" />;
};

export default AdminProtectedRoute;
