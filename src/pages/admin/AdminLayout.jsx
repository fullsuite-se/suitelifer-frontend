import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";

const AdminLayout = () => {
  return (
    <div className="flex w-full h-screen">
      <Sidebar />
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
