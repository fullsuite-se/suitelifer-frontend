import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import IconBlogs from "../../assets/icons/IconBlogs";
import IconNewspaper from "../../assets/icons/IconNewspaper";
import IconLogout from "../../assets/icons/IconLogout";
import { Logout } from "../../modals/Logout";

const EmployeeSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <nav className="w-36 md:w-40 lg:w-48 h-dvh flex flex-col">
      <Logout isOpen={isOpen} handleClose={handleCloseModal} />
      <section className="py-11">
        <div className="w-20 h-20 mx-auto mb-3">
          <img
            src="http://sa.kapamilya.com/absnews/abscbnnews/media/2020/tvpatrol/06/01/james-reid.jpg"
            alt="Hernani"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <p className="font-avenir-black text-center">Hernani Domingo</p>
        <p className="text-sm text-center">@hernani.domingo</p>
      </section>
      <section className="employee-sidebar-links flex-1 ">
        <ul>
          <li className="mb-1">
            <NavLink
              to="/employee/blogs-feed"
              className={({ isActive }) =>
                isActive
                  ? "bg-primary text-white p-3 rounded-lg flex items-center gap-3 no-underline! transition-colors duration-200"
                  : "bg-white text-primary p-3 rounded-lg flex items-center gap-3 no-underline! transition-colors duration-200 hover:bg-blue-50"
              }
            >
              <IconBlogs color={"currentColor"} height={"20"} width={"20"} />
              <span className="no-underline! font-avenir-black">
                Blogs Feed
              </span>
            </NavLink>
          </li>
          <li className="mb-1">
            <NavLink
              to={"/employee/my-blogs"}
              className={({ isActive }) =>
                isActive
                  ? "bg-primary text-white p-3 rounded-lg flex items-center gap-3 no-underline! transition-colors duration-200"
                  : "bg-white text-primary p-3 rounded-lg flex items-center gap-3 no-underline! transition-colors duration-200 hover:bg-blue-50"
              }
            >
              {/* #0097b2 */}
              <IconNewspaper
                color={"currentColor"}
                height={"20"}
                width={"20"}
              />
              <span className="no-underline! font-avenir-black">My Blogs</span>
            </NavLink>
          </li>
          {/* <li>
            <NavLink
              to={"/employee/my-blogs"}
              className={({ isActive }) =>
                isActive
                  ? "bg-primary text-white p-3 rounded-lg flex items-center gap-2"
                  : "bg-white text-primary p-3 rounded-lg flex items-center gap-2"
              }
            >
              <IconNewspaper
                color={"currentColor"}
                height={"20"}
                width={"20"}
              />
              <span className="no-underline">Events</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/employee/my-blogs"}
              className={({ isActive }) =>
                isActive
                  ? "bg-primary text-white p-3 rounded-lg flex items-center gap-2"
                  : "bg-white text-primary p-3 rounded-lg flex items-center gap-2"
              }
            >
              <IconNewspaper
                color={"currentColor"}
                height={"20"}
                width={"20"}
              />
              <span className="no-underline">Workshops</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/employee/my-blogs"}
              className={({ isActive }) =>
                isActive
                  ? "bg-primary text-white p-3 rounded-lg flex items-center gap-2"
                  : "bg-white text-primary p-3 rounded-lg flex items-center gap-2"
              }
            >
              <IconNewspaper
                color={"currentColor"}
                height={"20"}
                width={"20"}
              />
              <span className="no-underline">Personality Test</span>
            </NavLink>
          </li> */}
        </ul>
      </section>
      <section className="p-5 py-7">
        <button
          className="flex gap-3 cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <span>Sign out</span>
          <IconLogout color={"black"} height={"20"} width={"20"} />
        </button>
      </section>
    </nav>
  );
};

export default EmployeeSidebar;
