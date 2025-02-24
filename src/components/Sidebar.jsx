import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import "tailwindcss";
import image_01 from "../assets/images/image_01.svg";
import iconDashboard from "../assets/icons/icon-dashboard.svg";
import iconDashboardHover from "../assets/icons/icon-dashboard-hover.svg";
import iconJoblisting from "../assets/icons/icon-joblisting.svg";
import iconBlog from "../assets/icons/icon-blog.svg";
import iconNews from "../assets/icons/icon-news.svg";
import iconContent from "../assets/icons/icon-content.svg";
import iconEvent from "../assets/icons/icon-events.svg";
import iconLogout from "../assets/icons/icon-logout.svg";
import iconJoblistingHover from "../assets/icons/icon-joblisting-hover.svg";
import iconBlogHover from "../assets/icons/icon-blog-hover.svg";
import iconNewsHover from "../assets/icons/icon-news-hover.svg";
import iconEventHover from "../assets/icons/icon-event-hover.svg";
import iconContentHover from "../assets/icons/icon-content-hover.svg";
import iconLogoutHover from "../assets/icons/icon-logout-hover.svg";

function Sidebar() {
  const [icon1, setIcon1] = useState(iconDashboard);
  const [icon2, setIcon2] = useState(iconDashboard);
  const [icon3, setIcon3] = useState(iconBlog);
  const [icon4, setIcon4] = useState(iconEvent);
  const [icon5, setIcon5] = useState(iconNews);
  const [icon6, setIcon6] = useState(iconContent);
  const [icon7, setIcon7] = useState(iconLogout);

  const handleMouseEnter = () => {
    setIcon1(iconDashboardHover);
    setIcon2(iconJoblistingHover);
    setIcon3(iconBlogHover);
    setIcon4(iconEventHover);
    setIcon5(iconNewsHover);
    setIcon6(iconContentHover);
    setIcon7(iconLogoutHover);
  };

  const handleMouseLeave = () => {
    setIcon1(iconDashboard);
    setIcon2(iconDashboard);
    setIcon3(iconBlog);
    setIcon4(iconEvent);
    setIcon5(iconNews);
    setIcon6(iconContent);
    setIcon7(iconLogout);
  };

  return (
    <>
      <div className="flex flex-col sm:w-52 md:w-80 w-full h-screen bg-primary items-center sticky">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 sm:py-4">
          <img
            className="mx-auto block rounded-full sm:mx-0 sm:shrink-0 w-24 sm:w-20"
            src={image_01}
            alt="User Avatar"
          />
          <div className="space-y-2 text-center sm:text-left text-2xl">
            <div className="space-y-0.5">
              <p
                className="text-white"
                style={{
                  fontFamily: "Avenir-Black",
                  fontSize: "20px",
                }}
              >
                Melbraei Santiago
              </p>
              <p
                className="text-white"
                style={{
                  fontFamily: "Avenir-Roman",
                  fontSize: "20px",
                }}
              >
                Software Engineer
              </p>
            </div>
            <div
              className="text-white"
              style={{
                fontFamily: "Avenir-Roman",
                fontSize: "16px",
              }}
            >
              Role/Position
            </div>
          </div>
        </div>

        <div className="flex flex-col text-light font-family:Avenir-Black space-y-5 h-screen justify-start w-full place-items-baseline content-start p-12 items-start">
          <div className="group text-white text-lg font-bold hover:bg-white p-2 rounded-md no-underline inline-flex justify-center items-center space-x-5">
            <Link
              to="/"
              className="flex justify-center items-center space-x-5"
              style={{
                fontFamily: "Avenir-Black",
                fontSize: "20px",
                textDecoration: "none",
                fontWeight: "bolder",
              }}
            >
              <img
                src={iconDashboard}
                alt="Dashboard"
                className="size-8 group-hover:bg-white inline-grid group-hover:text-primary"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
              <span className="group-hover:text-primary text-left">
                DASHBOARD
              </span>
            </Link>
          </div>

          <Link
            to="/"
            className="group text-white text-lg font-bold hover:bg-white p-2 rounded-md no-underline inline-flex justify-center items-center space-x-5"
            style={{
              fontFamily: "Avenir-Black",
              fontSize: "20px",
              textDecoration: "none",
            }}
          >
            <img
              src={iconJoblisting}
              alt="Dashboard"
              className="size-8 group-hover:bg-primary hover:bg-primary"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
            <span className="group-hover:text-primary text-left">
              JOB LISTINGS
            </span>
          </Link>

          <Link
            to="/"
            className="group text-white text-lg font-bold hover:bg-white p-2 rounded-md no-underline inline-flex justify-center items-center space-x-5"
            style={{
              fontFamily: "Avenir-Black",
              fontSize: "20px",
              textDecoration: "none",
            }}
          >
            <img
              src={iconBlog}
              alt="Dashboard"
              className="size-8 group-hover:bg-primary hover:bg-primary"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
            <span className="group-hover:text-primary text-left">BLOGS</span>
          </Link>

          <Link
            to="/"
            className="group text-white text-lg font-bold hover:bg-white p-2 rounded-md no-underline inline-flex justify-center items-center space-x-5"
            style={{
              fontFamily: "Avenir-Black",
              fontSize: "20px",
              textDecoration: "none",
            }}
          >
            <img
              src={iconNews}
              alt="Dashboard"
              className="size-8 group-hover:bg-primary hover:bg-primary"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
            <span className="group-hover:text-primary text-left">NEWS</span>
          </Link>

          <Link
            to="/"
            className="group text-white text-lg font-bold hover:bg-white p-2 rounded-md no-underline inline-flex justify-center items-center space-x-5"
            style={{
              fontFamily: "Avenir-Black",
              fontSize: "20px",
              textDecoration: "none",
            }}
          >
            <img
              src={iconEvent}
              alt="Dashboard"
              className="size-8 group-hover:bg-primary hover:bg-primary"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
            <span className="group-hover:text-primary text-left">EVENTS</span>
          </Link>

          <Link
            to="/"
            className="group text-white text-lg font-bold hover:bg-white p-2 rounded-md no-underline inline-flex justify-center items-center space-x-5"
            style={{
              fontFamily: "Avenir-Black",
              fontSize: "20px",
              textDecoration: "none",
            }}
          >
            <img
              src={iconContent}
              alt="Dashboard"
              className="size-8 group-hover:bg-primary hover:bg-primary"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
            <span className="group-hover:text-primary text-left items-center">
              CONTENTS
            </span>
          </Link>
        </div>

        <div className="flex flex-col text-light font-family:Avenir-Black space-y-5 h-screen justify-end w-full place-items-end content-start p-12 items-start">
          <Link
            to="/"
            className="group text-white text-lg font-bold  hover:bg-white p-2 rounded-md no-underline inline-flex justify-center items-center space-x-5"
            style={{
              fontFamily: "Avenir-Black",
              fontSize: "20px",
              textDecoration: "none",
            }}
          >
            <img
              src={iconLogout}
              alt="Dashboard"
              className="size-8 group-hover:bg-primary hover:bg-primary"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
            <span className="group-hover:text-primary">LOGOUT</span>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
