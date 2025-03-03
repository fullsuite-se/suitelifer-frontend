import React from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex w-full h-screen">
      <div className="">
        <AdminSidebar />
      </div>
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;