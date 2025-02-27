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
      <section className="hidden">
        <EmployeeSidebar />
      </section>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <section className="hidden">
        <EmployeeAside />
      </section>
    </section>
  );
};

export default EmployeeLayout;
