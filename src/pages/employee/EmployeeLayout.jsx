import React from "react";
import { Outlet } from "react-router-dom";
import EmployeeSidebar from "../../components/employee/EmployeeSidebar";
import EmployeeAside from "../../components/employee/EmployeeAside";

const EmployeeLayout = () => {
  return (
    <section
      className="flex gap-3 xl:gap-6 h-dvh"
      style={{ maxWidth: "1800px", margin: "0 auto", padding: "0 1rem" }}
    >
      <section>
        <EmployeeSidebar />
      </section>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <section>
        <EmployeeAside />
      </section>
    </section>
  );
};

export default EmployeeLayout;
