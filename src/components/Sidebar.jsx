import React from "react";
import { Link } from "react-router-dom";
import "tailwindcss";
import image_01 from "../assets/images/image_01.svg";

function Sidebar() {
  return (
    <>
      <div className="flex flex-col sm:w-72 md:w-80 w-full h-screen bg-primary p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 sm:py-4">
          <img
            className="mx-auto block rounded-full sm:mx-0 sm:shrink-0 w-24 sm:w-26"
            src={image_01}
            alt="User Avatar"
          />
          <div className="space-y-2 text-center sm:text-left">
            <div className="space-y-0.5">
              <p
                className="text-white"
                style={{
                  fontFamily: "Avenir-Black",
                  fontSize: "20px",
                }}
              >
                Username
              </p>
              <p
                className="text-white"
                style={{
                  fontFamily: "Avenir-Black",
                  fontSize: "20px",
                }}
              >
                Job
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

        <div className="flex flex-col text-light font-family:Avenir-Black text-left p-14 space-y-5">
          

          <Link
            to="/"
            className="group text-white text-lg font-bold hover:bg-white p-2 rounded-md no-underline"
            style={{
              fontFamily: "Avenir-Black",
              fontSize: "20px",
              textDecoration: "none",
            }}
          >
            <span className="group-hover:text-primary">DASHBOARD</span>
          </Link>

          <Link
            to="/"
            className="group text-white text-lg font-bold hover:bg-white p-2 rounded-md no-underline"
            style={{
              fontFamily: "Avenir-Black",
              fontSize: "20px",
              textDecoration: "none",
            }}
          >
            <span className="group-hover:text-primary">JOB LISTINGS</span>
          </Link>

          <Link
            to="/"
            className="group text-white text-lg font-bold hover:bg-white p-2 rounded-md no-underline"
            style={{
              fontFamily: "Avenir-Black",
              fontSize: "20px",
              textDecoration: "none",
            }}
          >
            <span className="group-hover:text-primary">BLOG</span>
          </Link>

          <Link
            to="/"
            className="group text-white text-lg font-bold hover:bg-white p-2 rounded-md no-underline"
            style={{
              fontFamily: "Avenir-Black",
              fontSize: "20px",
              textDecoration: "none",
            }}
          >
            <span className="group-hover:text-primary">EVENTS</span>
          </Link>

          <Link
            to="/"
            className="group text-white text-lg font-bold hover:bg-white p-2 rounded-md no-underline"
            style={{
              fontFamily: "Avenir-Black",
              fontSize: "20px",
              textDecoration: "none",
            }}
          >
            <span className="group-hover:text-primary">CONTENTS</span>
          </Link>
        </div>

        <div className="flex flex-col text-light font-family:Avenir-Black text-left mt-auto w-auto">
          <Link
            to="/"
            className="group text-white text-lg font-bold  hover:bg-white p-2 rounded-md no-underline justify-center"
            style={{
              fontFamily: "Avenir-Black",
              fontSize: "20px",
              textDecoration: "none",
            }}
          >
            <span className="group-hover:text-primary">LOGOUT</span>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
