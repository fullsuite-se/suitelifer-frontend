import React from "react";
import { Outlet } from "react-router-dom";

const EmployeeLayout = () => {
  return (
    <div>
      <h1>Employee Layout</h1>

      <Outlet />
    </div>
  );
};

export default EmployeeLayout;
