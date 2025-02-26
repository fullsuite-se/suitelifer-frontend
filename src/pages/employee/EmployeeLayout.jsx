import React from "react";
import { Outlet } from "react-router-dom";
import EmployeeSidebar from "../../components/employee/EmployeeSidebar";
import EmployeeAside from "../../components/employee/EmployeeAside";

const EmployeeLayout = () => {
  return (
    <section
      className="flex gap-5"
      style={{ maxWidth: "1800px", margin: "0 auto", padding: "0 1rem" }}
    >
      <section className="">
        <EmployeeSidebar />
      </section>
      <main className="flex-1">
        <Outlet />
      </main>
      <section className="">
        <EmployeeAside />
      </section>
    </section>
  );
};

export default EmployeeLayout;
