import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import api from "../utils/axios";

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
        } else {
          setIsAdmin(false);
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
