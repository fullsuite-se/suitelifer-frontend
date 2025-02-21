import React from "react";
import { Link } from "react-router-dom";
import "tailwindcss";
import image_01 from "../assets/images/image_01.svg";
function Sidebar() {
  return (
    <>
      <div className="flex flex-col w-90 h-screen gap-2 bg-primary p-2">
        <div class="flex flex-col gap-2 p-2 sm:flex-row sm:items-center sm:gap-6 sm:py-4 ...">
          <img
            class="mx-auto block rounded-full sm:mx-0 sm:shrink-0 w-40"
            src={image_01}
            alt=""
          />
          <div class="space-y-2 text-center text-2lg">
            <div class="space-y-0.5">
              <p
                className=""
                style={{
                  fontFamily: "Avenir-Black",
                  color: "white",
                  textDecoration: "none",
                  padding: 7,
                }}
              >
                User
              </p>
              <p
                className=""
                style={{
                  fontFamily: "Avenir-Black",
                  color: "white",
                  textDecoration: "none",
                  padding: 7,
                }}
              >
                Text
              </p>
            </div>
            <div
              style={{
                fontFamily: "Avenir-Black",
                color: "white",
                textDecoration: "none",
                padding: 7,
              }}
            >
              Message
            </div>
          </div>
        </div>
        <div className="flex flex-col nav-links text-light font-family:Avenir-Roman text-left p-8 ">
          <Link
            to="/"
            style={{
              fontFamily: "Avenir-Black",
              color: "white",
              textDecoration: "none",
              padding: 7,
            }}
          >
            DASHBOARD
          </Link>
          <Link
            to="/"
            style={{
              fontFamily: "Avenir-Black",
              color: "white",
              textDecoration: "none",
              padding: 7,
            }}
          >
            JOB LISTINGS
          </Link>
          <Link
            to="/"
            style={{
              fontFamily: "Avenir-Black",
              color: "white",
              textDecoration: "none",
              padding: 7,
            }}
          >
            BLOG
          </Link>
          <Link
            to="/"
            style={{
              fontFamily: "Avenir-Black",
              color: "white",
              textDecoration: "none",
              padding: 7,
            }}
          >
            EVENTS
          </Link>
          <Link
            to="/"
            style={{
              fontFamily: "Avenir-Black",
              color: "white",
              textDecoration: "none",
              padding: 7,
            }}
          >
            CONTENTS
          </Link>
        </div>
        <div className="flex nav-links text-light font-family:Avenir-Roman text-left mt-50"></div>
        <Link
          to="/"
          style={{
            fontFamily: "Avenir-Black",
            color: "white",
            textDecoration: "none",
            padding: 7,
          }}
        >
          LOGOUT
        </Link>
      </div>
    </>
  );
}

export default Sidebar;
