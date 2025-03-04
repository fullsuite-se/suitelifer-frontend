import React, { createContext, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Outlet } from "react-router-dom";

export const SidebarContext = createContext(null);

const AdminLayout = () => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{isOpen, setIsOpen}}>
      <div className="flex w-full h-screen">
        <AdminSidebar isOpen={isOpen} />
        <main className="w-full">
          <Outlet />
        </main>
      </div>
    </SidebarContext.Provider>
  );
};

export default AdminLayout;