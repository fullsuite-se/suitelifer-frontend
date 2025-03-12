import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "tailwindcss";
import image_01 from "../../assets/images/image_01.svg";
import iconDashboard from "../../assets/icons/icon-dashboard.svg";
import iconDashboardHover from "../../assets/icons/icon-dashboard-hover.svg";
import iconJoblisting from "../../assets/icons/icon-joblisting.svg";
import iconJoblistingHover from "../../assets/icons/icon-joblisting-hover.svg";
import iconBlog from "../../assets/icons/icon-blog.svg";
import iconBlogHover from "../../assets/icons/icon-blog-hover.svg";
import iconNews from "../../assets/icons/icon-news.svg";
import iconNewsHover from "../../assets/icons/icon-news-hover.svg";
import iconContent from "../../assets/icons/icon-content.svg";
import iconContentHover from "../../assets/icons/icon-content-hover.svg";
import iconEvent from "../../assets/icons/icon-events.svg";
import iconEventHover from "../../assets/icons/icon-event-hover.svg";
import iconLogout from "../../assets/icons/icon-logout.svg";
import iconLogoutHover from "../../assets/icons/icon-logout-hover.svg";
import "../../css/animation/animation.css";

function AdminSidebar({ isOpen }) {
  return (
    <>
    
      <div
        className={`flex-col sm:w-52 md:w-80 p-3 w-full h-screen bg-primary items-center fixed sm:relative transition-transform duration-300 sm:translate-x-0 sm:block 
          
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 sm:py-4">
          <div>
            <img
              className="mx-auto block rounded-full sm:mx-0 sm:shrink-0 w-24 sm:w-20"
              src={image_01}
              alt="User Avatar"
            />
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <div className="space-y-0.5">
              <p className="text-white font-avenir-black text-xl">
                Melbraei Santiago
              </p>
              <p className="text-white">Software Engineer</p>
              <p className="text-white font-avenir-black">Role/Position</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col text-light font-family:Avenir-Black space-y-5 justify-start w-full place-items-baseline content-start p-8 items-start">
          {[
            {
              to: "/admin/dashboard",
              icon: iconDashboard,
              iconHover: iconDashboardHover,
              label: "DASHBOARD",
            },
            {
              to: "/admin/joblisting",
              icon: iconJoblisting,
              iconHover: iconJoblistingHover,
              label: "JOB LISTINGS",
            },
            {
              to: "/admin/blogs",
              icon: iconBlog,
              iconHover: iconBlogHover,
              label: "BLOGS",
            },
            {
              to: "/admin/news",
              icon: iconNews,
              iconHover: iconNewsHover,
              label: "NEWS",
            },
            {
              to: "/admin/events",
              icon: iconEvent,
              iconHover: iconEventHover,
              label: "EVENTS",
            },
            {
              to: "/admin/contents",
              icon: iconContent,
              iconHover: iconContentHover,
              label: "CONTENTS",
            },

            {
              to: "/logout",
              icon: iconLogout,
              iconHover: iconLogoutHover,
              label: "LOGOUT",
            },
          ].map(({ to, icon, iconHover, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive
                  ? "bg-white w-full text-primary p-3 rounded-lg flex items-center gap-3 transition-colors duration-200 no-underline"
                  : "bg-primary text-white p-3 rounded-lg flex items-center gap-3 transition-colors duration-200 no-underline"
              }
            >
              {({ isActive }) => (
                <>
                  <img
                    src={isActive ? iconHover : icon}
                    alt={label}
                    className="size-8"
                  />
                  <span className="font-avenir-black">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
}

export default AdminSidebar;
