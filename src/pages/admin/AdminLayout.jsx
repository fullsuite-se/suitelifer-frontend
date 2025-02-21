import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const AdminLayout = () => {
  return (
    <>
      <Sidebar />
      {/* <div>
        <h1>From Admin Layout</h1>

        <button>Hello</button>
        <Outlet />
      </div> */}
    </>
  );
};

export default AdminLayout;
