import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import IconBlogs from "../../assets/icons/IconBlogs";
import IconNewspaper from "../../assets/icons/IconNewspaper";
import fullsuitelogo from "../../assets/logos/logo-fs-full.svg";
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import IconMyBlogs from "../../assets/icons/IconMyBlogs";
import IconPersonaTest from "../../assets/icons/IconPersonaTest";
import IconThreads from "../../assets/icons/IconThreads";
import IconWorkshops from "../../assets/icons/IconWorkshops";
import IconEvents from "../../assets/icons/IconEvents";
import { ModalLogout } from "../modals/ModalLogout";

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
    path: "/employee/threads",
  },
  {
    title: "Events",
    icon: IconEvents,
    path: "/employee/events",
  },
  {
    title: "Workshops",
    icon: IconWorkshops,
    path: "/employee/workshops",
  },
  {
    title: "Personality Test",
    icon: IconPersonaTest,
    path: "/employee/personality-test",
  },
];

const EmployeeSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <nav className="w-36 md:w-40 lg:w-44 xl:w-52 h-dvh flex flex-col">
      <ModalLogout isOpen={isOpen} handleClose={handleCloseModal} />
      <section className="py-11">
        <div className="w-20 h-20 mx-auto mb-3">
          <img
            src="http://sa.kapamilya.com/absnews/abscbnnews/media/2020/tvpatrol/06/01/james-reid.jpg"
            alt="Hernani"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <p className="font-avenir-black text-center">Hernani Domingo</p>
        <p className="text-sm text-center text-primary">@hernani.domingo</p>
      </section>
      <section className="employee-sidebar-links flex-1 ">
        <ul className="list-none!">
          {sideBarLinks.map((link, index) => {
            return (
              <li key={index}>
                <NavLink
                  to={`${link.path}`}
                  className={({ isActive }) =>
                    isActive
                      ? "bg-primary text-white p-3 rounded-lg flex items-center gap-3 no-underline! transition-colors duration-200"
                      : "bg-white text-primary p-3 rounded-lg flex items-center gap-3 no-underline! transition-colors duration-200 hover:bg-blue-50"
                  }
                >
                  <link.icon
                    color={"currentColor"}
                    height={"20"}
                    width={"20"}
                  />
                  <span className="no-underline! font-avenir-black">
                    {link.title}
                  </span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </section>
      <section className="p-5 py-7 flex gap-12">
        <img src={fullsuitelogo} alt="fullsuitelogo" className="w-20 h-auto" />
        <button className=" cursor-pointer" onClick={() => setIsOpen(true)}>
          <ArrowRightCircleIcon className="w-6 h-6" />
        </button>
      </section>
    </nav>
  );
};

export default EmployeeSidebar;
