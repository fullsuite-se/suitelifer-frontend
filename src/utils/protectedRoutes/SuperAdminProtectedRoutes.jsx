import React, { useEffect, useState } from "react";
import api from "../axios";
import { Outlet } from "react-router-dom";

const SuperAdminProtectedRoutes = () => {
  const [isSuperAdmin, setIsSuperAdmin] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await api.get("/api/user-info");
        if (response?.data?.user?.role === "SUPER ADMIN") {
          setIsSuperAdmin(true);
        }
      } catch (error) {
        console.error(error);
        setIsSuperAdmin(false);
      }
    };
    getUser();
  }, []);

  return isSuperAdmin ? <Outlet /> : null;
};

export default SuperAdminProtectedRoutes;
