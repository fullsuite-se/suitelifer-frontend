import React, { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex w-full h-screen">
      <AdminSidebar />
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
