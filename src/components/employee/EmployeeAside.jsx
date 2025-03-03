import React from "react";
import Calendar from "../Calendar";

const EmployeeAside = () => {
  return (
    <aside className="w-52 md:w-64 lg:w-72 h-dvh flex flex-col p-2 xl:p-3">
      <h2 className="font-avenir-black">Events</h2>
      <Calendar />
    </aside>
  );
};

export default EmployeeAside;
