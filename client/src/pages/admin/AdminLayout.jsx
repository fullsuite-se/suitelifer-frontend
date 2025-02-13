import React from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div>
      <h1>From Admin Layout</h1>

      <button>Hello</button>
      <Outlet />
    </div>
  );
};

export default AdminLayout;
