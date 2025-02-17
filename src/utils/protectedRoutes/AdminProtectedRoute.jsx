import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import config from "../../config";

const AdminProtectedRoute = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        // Make the request using axios
        const response = await axios.get(`${config.apiBaseUrl}/api/user-info`, {
          withCredentials: true, // Important: This sends the cookie (JWT) along with the request
        });

        // Assuming the backend returns the user's role
        if (response.status === 200) {
          setRole(response.data.role);
        } else {
          setRole(null);
        }
      } catch (error) {
        console.error("Failed to fetch user role", error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Optional loading state
  }

  // If the user doesn't have the 'admin' role, redirect to homepage
  return role === "admin" ? <Outlet /> : <Navigate to="/" />;
};

export default AdminProtectedRoute;
