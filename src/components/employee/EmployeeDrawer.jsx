import React from "react";
import logoFull from "../../assets/logos/logo-fs-full.svg";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import IconBlogs from "../../assets/icons/IconBlogs";
import IconNewspaper from "../../assets/icons/IconNewspaper";
import { NavLink } from "react-router-dom";
import IconMyBlogs from "../../assets/icons/IconMyBlogs";
import IconPersonaTest from "../../assets/icons/IconPersonaTest";
import IconThreads from "../../assets/icons/IconThreads";
import IconWorkshops from "../../assets/icons/IconWorkshops";
import IconEvents from "../../assets/icons/IconEvents";

const sideBarLinks = [
  {
    title: "Blogs Feed",
    icon: IconBlogs,
    path: "/employee/blogs-feed",
  },
  {
    title: "My Blogs",
    icon: IconMyBlogs,
    path: "/employee/my-blogs",
  },
  {
    title: "Threads",
    icon: IconThreads,
    // path: "/employee/my-blogs",
  },
  {
    title: "Events",
    icon: IconEvents,
    // path: "/employee/my-blogs",
  },
  {
    title: "Workshops",
    icon: IconWorkshops,
    // path: "/employee/my-blogs",
  },
  {
    title: "Personality Test",
    icon: IconPersonaTest,
    // path: "/employee/my-blogs",
  },
];

const EmployeeDrawer = ({ onClose }) => {
  const handleClose = () => {
    if (onClose) {
      onClose("-100%");
    }
  };

  return (
    <nav className="lg:hidden relative pb-10">
      <section className="flex justify-between pt-5">
        <div className="w-20 h-auto">
          <img src={logoFull} alt="fullsuite" className="w-full h-full" />
        </div>
        <XMarkIcon className="w-9 h-9 rounded-full p-1" onClick={handleClose} />
      </section>
      <section className="">
        <ul>
          {sideBarLinks.map((link, index) => {
            return (
              <li key={index}>
                <NavLink
                  to={`${link.path}`}
                  className={({ isActive }) =>
                    isActive
                      ? "text-primary p-3 flex justify-center items-center gap-3 no-underline! transition-colors duration-200"
                      : "text-gray-400 p-3 justify-center flex items-center gap-3 no-underline! transition-colors duration-200 hover:bg-blue-50"
                  }
                  onClick={handleClose}
                >
                  <link.icon
                    color={"currentColor"}
                    height={"20"}
                    width={"20"}
                  />
                  <span className="no-underline! font-avenir-black text-sm">
                    {link.title}
                  </span>
                </NavLink>
              </li>
            );
          })}
        </ul>
        <section className="mt-5 text-sm flex justify-center items-center gap-2">
          <ArrowRightCircleIcon className="w-5 h-5" />
          <span>Sign out</span>
        </section>
      </section>
    </nav>
  );
};

export default EmployeeDrawer;
