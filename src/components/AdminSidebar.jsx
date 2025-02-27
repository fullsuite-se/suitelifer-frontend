import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "tailwindcss";
import image_01 from "../assets/images/image_01.svg";
import iconDashboard from "../assets/icons/icon-dashboard.svg";
import iconDashboardHover from "../assets/icons/icon-dashboard-hover.svg";
import iconJoblisting from "../assets/icons/icon-joblisting.svg";
import iconJoblistingHover from "../assets/icons/icon-joblisting-hover.svg";
import iconBlog from "../assets/icons/icon-blog.svg";
import iconBlogHover from "../assets/icons/icon-blog-hover.svg";
import iconNews from "../assets/icons/icon-news.svg";
import iconNewsHover from "../assets/icons/icon-news-hover.svg";
import iconContent from "../assets/icons/icon-content.svg";
import iconContentHover from "../assets/icons/icon-content-hover.svg";
import iconEvent from "../assets/icons/icon-events.svg";
import iconEventHover from "../assets/icons/icon-event-hover.svg";
import iconLogout from "../assets/icons/icon-logout.svg";
import iconLogoutHover from "../assets/icons/icon-logout-hover.svg";
import { Logout } from "../modals/Logout";

function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="flex flex-col sm:w-52 md:w-90 w-full h-screen bg-primary items-center sticky p-4">
        <Logout isOpen={isOpen} handleClose={handleCloseModal} />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 sm:py-4">
          <div className="div">
            <img
              className="mx-auto block rounded-full sm:mx-0 sm:shrink-0 w-24 sm:w-20"
              src={image_01}
              alt="User Avatar"
            />
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <div className="space-y-0.5">
              <p className="text-white font-avenir-black text-xl!">
                Melbraei Santiago
              </p>
              <p className="text-white">Software Engineer</p>
              <p className="text-white font-avenir-black">Role/Position</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col text-light font-family:Avenir-Black space-y-5 h-screen justify-start w-full place-items-baseline content-start p-8 items-start">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              isActive
                ? "bg-white text-primary p-3 rounded-lg flex items-center gap-3 no-underline! transition-colors duration-200"
                : "bg-primary text-white p-3 rounded-lg flex items-center gap-3 no-underline! transition-colors duration-200"
            }
          >
            {({ isActive }) => (
              <>
                <img
                  src={isActive ? iconDashboardHover : iconDashboard}
                  alt="Dashboard"
                  className="size-8"
                />
                <span className="no-underline! font-avenir-black">
                  DASHBOARD
                </span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/admin/joblisting"
            className={({ isActive }) =>
              isActive
                ? "bg-white text-primary p-3 rounded-lg flex items-center gap-3 no-underline! transition-colors duration-200"
                : "bg-primary text-white p-3 rounded-lg flex items-center gap-3 no-underline! transition-colors duration-200"
            }
          >
            {({ isActive }) => (
              <>
                <img
                  src={isActive ? iconJoblistingHover : iconJoblisting}
                  alt="Job Listings"
                  className="size-8"
                />
                <span className="no-underline! font-avenir-black">
                  JOB LISTINGS
                </span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/admin/blogs"
            className={({ isActive }) =>
              isActive
                ? "bg-white text-primary p-3 rounded-lg flex items-center gap-3 no-underline! transition-colors duration-200"
                : "bg-primary text-white p-3 rounded-lg flex items-center gap-3 no-underline! transition-colors duration-200"
            }
          >
            {({ isActive }) => (
              <>
                <img
                  src={isActive ? iconBlogHover : iconBlog}
                  alt="Blogs"
                  className="size-8"
                />
                <span className="no-underline! font-avenir-black">BLOGS</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/admin/news"
            className={({ isActive }) =>
              isActive
                ? "bg-white text-primary p-3 rounded-lg flex items-center gap-3 no-underline! transition-colors duration-200"
                : "bg-primary text-white p-3 rounded-lg flex items-center gap-3 no-underline! transition-colors duration-200"
            }
          >
            {({ isActive }) => (
              <>
                <img
                  src={isActive ? iconNewsHover : iconNews}
                  alt="News"
                  className="size-8"
                />
                <span className="no-underline! font-avenir-black">NEWS</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/admin/events"
            className={({ isActive }) =>
              isActive
                ? "bg-white text-primary p-3 rounded-lg flex items-center gap-3 no-underline! transition-colors duration-200"
                : "bg-primary text-white p-3 rounded-lg flex items-center gap-3 no-underline! transition-colors duration-200"
            }
          >
            {({ isActive }) => (
              <>
                <img
                  src={isActive ? iconEventHover : iconEvent}
                  alt="Events"
                  className="size-8"
                />
                <span className="no-underline! font-avenir-black">EVENTS</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/admin/contents"
            className={({ isActive }) =>
              isActive
                ? "bg-white text-primary p-3 rounded-lg flex items-center gap-3 no-underline! transition-colors duration-200"
                : "bg-primary text-white p-3 rounded-lg flex items-center gap-3 no-underline! transition-colors duration-200"
            }
          >
            {({ isActive }) => (
              <>
                <img
                  src={isActive ? iconContentHover : iconContent}
                  alt="Contents"
                  className="size-8"
                />
                <span className="no-underline! font-avenir-black">
                  CONTENTS
                </span>
              </>
            )}
          </NavLink>
        </div>

        <div className="flex flex-col text-light font-family:Avenir-Black space-y-5 h-screen justify-end w-full place-items-end content-start p-8 items-start">
          <button
            className="group text-white font-bold hover:bg-white p-3 rounded-lg flex items-center gap-3 no-underline! transition-colors duration-200" 
            style={{
              fontSize: "20px",
              textDecoration: "none",
            }}
            onClick={() => setIsOpen(true)}
          >
            <img
              src={iconLogout}
              alt="Logout"
              className="size-8 group-hover:hidden"
            />
            <img
              src={iconLogoutHover}
              alt="Logout"
              className="size-8 hidden group-hover:inline"
            />
            <span className="no-underline! font-avenir-black">LOGOUT</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default AdminSidebar;
