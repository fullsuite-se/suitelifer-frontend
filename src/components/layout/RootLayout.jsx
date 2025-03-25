import React, { useRef } from "react";
import { Outlet } from "react-router-dom";
import EmployeeAside from "../../components/employee/EmployeeAside";
import logoFull from "../../assets/logos/logo-fs-full.svg";
import { Bars2Icon } from "@heroicons/react/20/solid";
import EmployeeDrawer from "../../components/employee/EmployeeDrawer";
import CMSNavigation from "../navigation/CMSNavigation";
import CMSTopNavigation from "../navigation/CMSTopNavigation";

const RootLayout = () => {
  const drawerRef = useRef();

  const handleDrawer = (location) => {
    drawerRef.current.style.top = location;
  };

  return (
    <section
      className="flex gap-4 h-dvh flex-col lg:flex-row overflow-hidden"
      style={{ maxWidth: "1800px", margin: "0 auto", padding: "0 1rem" }}
    >
      <section
        className="px-6 bg-white fixed -top-full left-0 right-0 z-50 transition-all duration-300"
        ref={drawerRef}
      >
        <EmployeeDrawer onClose={handleDrawer} />
      </section>
      <section className="hidden lg:block overflow-y-auto pr-3">
        <CMSNavigation />
      </section>

      <section className="lg:hidden flex justify-between pt-5 px-2">
        <div className="w-20 h-auto">
          <img src={logoFull} alt="fullsuite" className="w-full h-full" />
        </div>
        <Bars2Icon
          className="w-9 h-9 rounded-full p-2 bg-[#B2E0E8]"
          onClick={() => handleDrawer("0%")}
        />
      </section>

      <section className="flex-1">
        <CMSTopNavigation />
        <main className="overflow-y-auto h-dvh">
          <Outlet />
        </main>
      </section>

      <section className="hidden lg:block overflow-y-auto">
        <EmployeeAside />
      </section>
    </section>
  );
};

export default RootLayout;
