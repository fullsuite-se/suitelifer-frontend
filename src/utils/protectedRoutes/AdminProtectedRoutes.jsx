import React, { useEffect, useState } from "react";
import api from "../axios";
import { Outlet } from "react-router-dom";

const AdminProtectedRoutes = () => {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await api.get("/api/user-info");
        if (
          response?.data?.user?.role === "ADMIN" ||
          response?.data?.user?.role === "SUPER ADMIN"
        ) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error(error);
        setIsAdmin(false);
      }
    };
    getUser();
  }, []);

  return isAdmin ? <Outlet /> : null;
};

export default AdminProtectedRoutes;
