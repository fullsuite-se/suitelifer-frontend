import React, { useState } from "react";
import { Link } from "react-router-dom";
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
  return (
    <>
      <div className="flex flex-col sm:w-52 md:w-80 w-full h-screen bg-primary items-center sticky">
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

        <div className="flex flex-col text-light font-family:Avenir-Black space-y-5 h-screen justify-start w-full place-items-baseline content-start p-12 items-start">
          <Link
            to="/admin/dashboard"
            className="group text-white text-lg font-bold hover:bg-white p-2 rounded-md no-underline inline-flex justify-center items-center space-x-5"
            style={{
              fontSize: "20px",
              textDecoration: "none",
              fontWeight: "bolder",
            }}
          >
            <img
              src={iconDashboard}
              alt="Dashboard"
              className="size-8 group-hover:hidden"
            />
            <img
              src={iconDashboardHover}
              alt="Dashboard"
              className="size-8 hidden group-hover:inline"
            />
            <span className="group-hover:text-primary text-left">
              DASHBOARD
            </span>
          </Link>

          <Link
            to="/admin/joblisting"
            className="group text-white text-lg font-bold hover:bg-white p-2 rounded-md no-underline inline-flex justify-center items-center space-x-5"
            style={{
              fontSize: "20px",
              textDecoration: "none",
            }}
          >
            <img
              src={iconJoblisting}
              alt="Job Listings"
              className="size-8 group-hover:hidden"
            />
            <img
              src={iconJoblistingHover}
              alt="Job Listings"
              className="size-8 hidden group-hover:inline"
            />
            <span className="group-hover:text-primary text-left">
              JOB LISTINGS
            </span>
          </Link>

          <Link
            to="/admin/blogs"
            className="group text-white font-bold hover:bg-white p-2 rounded-md no-underline inline-flex justify-center items-center space-x-5"
            style={{
              fontSize: "20px",
              textDecoration: "none",
            }}
          >
            <img
              src={iconBlog}
              alt="Blogs"
              className="size-8 group-hover:hidden"
            />
            <img
              src={iconBlogHover}
              alt="Blogs"
              className="size-8 hidden group-hover:inline"
            />
            <span className="group-hover:text-primary text-left">BLOGS</span>
          </Link>

          <Link
            to="/admin/news"
            className="group text-white text-lg font-bold hover:bg-white p-2 rounded-md no-underline inline-flex justify-center items-center space-x-5"
            style={{
              fontSize: "20px",
              textDecoration: "none",
            }}
          >
            <img
              src={iconNews}
              alt="News"
              className="size-8 group-hover:hidden"
            />
            <img
              src={iconNewsHover}
              alt="News"
              className="size-8 hidden group-hover:inline"
            />
            <span className="group-hover:text-primary text-left">NEWS</span>
          </Link>

          <Link
            to="/admin/events"
            className="group text-white text-lg font-bold hover:bg-white p-2 rounded-md no-underline inline-flex justify-center items-center space-x-5"
            style={{
              fontSize: "20px",
              textDecoration: "none",
            }}
          >
            <img
              src={iconEvent}
              alt="Events"
              className="size-8 group-hover:hidden"
            />
            <img
              src={iconEventHover}
              alt="Events"
              className="size-8 hidden group-hover:inline"
            />
            <span className="group-hover:text-primary text-left">EVENTS</span>
          </Link>

          <Link
            to="/admin/contents"
            className="group text-white text-lg font-bold hover:bg-white p-2 rounded-md no-underline inline-flex justify-center items-center space-x-5"
            style={{
              fontSize: "20px",
              textDecoration: "none",
            }}
          >
            <img
              src={iconContent}
              alt="Contents"
              className="size-8 group-hover:hidden"
            />
            <img
              src={iconContentHover}
              alt="Contents"
              className="size-8 hidden group-hover:inline"
            />
            <span className="group-hover:text-primary text-left items-center">
              CONTENTS
            </span>
          </Link>
        </div>

        <div className="flex flex-col text-light font-family:Avenir-Black space-y-5 h-screen justify-end w-full place-items-end content-start p-12 items-start">
          <button
            className="group text-white text-lg font-bold  hover:bg-white p-2 rounded-md no-underline inline-flex justify-center items-center space-x-5"
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
            <span className="group-hover:text-primary">LOGOUT</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default AdminSidebar;
