import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store/authStore";
import image_01 from "../assets/images/image_01.svg";
import iconLogout from "../assets/icons/icon-logout.svg";
import iconLogoutHover from "../assets/icons/icon-logout-hover.svg";
import { ModalLogout } from "./modals/ModalLogout";

// Import icons
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

const iconMap = {
  dashboard: { default: iconDashboard, hover: iconDashboardHover },
  joblisting: { default: iconJoblisting, hover: iconJoblistingHover },
  blogs: { default: iconBlog, hover: iconBlogHover },
  news: { default: iconNews, hover: iconNewsHover },
  events: { default: iconEvent, hover: iconEventHover },
  contents: { default: iconContent, hover: iconContentHover },
};

function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const services = useStore((state) => state.services) || [];

  return (
    <>
      <div className="flex flex-col sm:w-52 md:w-80 w-full h-screen bg-primary items-center sticky">
        <ModalLogout isOpen={isOpen} handleClose={() => setIsOpen(false)} />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 sm:py-4">
          <img
            className="mx-auto block rounded-full sm:mx-0 sm:shrink-0 w-24 sm:w-20"
            src={image_01}
            alt="User Avatar"
          />
          <div className="text-center sm:text-left">
            <p className="text-white font-avenir-black text-xl">
              Melbraei Santiago
            </p>
            <p className="text-white">Software Engineer</p>
            <p className="text-white font-avenir-black">Role/Position</p>
          </div>
        </div>

        {/* Dynamic Sidebar Links */}
        <div className="flex flex-col text-light space-y-5 h-screen justify-start w-full p-12">
          {services.map(({ feature_name }) => {
            if (!feature_name) return null;

            const path = feature_name.toLowerCase().replace(/\s+/g, "-");
            const iconKey = path.replace("/admin/", ""); // Extract feature name
            const icons = iconMap[iconKey] || null;

            return (
              <Link
                key={path}
                to={`/admin/${path}`}
                className="group text-white text-lg font-bold hover:bg-white p-2 rounded-md inline-flex justify-center items-center space-x-5"
              >
                {icons ? (
                  <>
                    <img
                      src={icons.default}
                      alt={feature_name}
                      className="size-8 group-hover:hidden"
                    />
                    <img
                      src={icons.hover}
                      alt={feature_name}
                      className="size-8 hidden group-hover:inline"
                    />
                  </>
                ) : (
                  <span>🔹</span> // Default icon if not found
                )}
                <span className="group-hover:text-primary">
                  {feature_name.toUpperCase()}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Logout Button */}
        <div className="flex flex-col text-light space-y-5 h-screen justify-end w-full p-12">
          <button
            className="group text-white text-lg font-bold hover:bg-white p-2 rounded-md inline-flex justify-center items-center space-x-5"
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
