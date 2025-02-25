import { useState, useEffect } from "react";
import logo_fs_full from "../assets/logos/logo-fs-full.svg";
import { Bars2Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { NavLink } from "react-router-dom";

export default function DesktopNav() {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const opacity = Math.min(lastScrollY / 70, 1);

  // Scroll event handler
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    // Show logo
    if (currentScrollY > 70) {
      setIsVisible(true);
    } else {
      // Hide logo
      setIsVisible(false);
    }
    // Save the new scroll position
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <>
      <div
      style={{
        backgroundColor: `rgba(255, 255, 255, ${opacity})`,
      }}
        className={`fixed z-50 top-0 left-0 right-0 ${
          isVisible ? "shadow" : ""
        } flex justify-between items-center h-16 px-7`}
      >
        {/* Navigation Links*/}
        <nav
          className={`flex justify-center items-end`}
        >
          {/* Logo */}
          <div
            className={`w-32 ml-7 mr-7 animate-slideInFromLeft`}
          >
            <img className="object-cover" src={logo_fs_full} alt="Logo" />
          </div>
          <div className="">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `!no-underline text-dark text-md hover:text-[#007a8e] ${
                  isActive ? "active-class  " : ""
                } lg:mr-10 xl:mr-22 ml-7 transition-all duration-300 ease-in-out `
              }
            >
              <>Home</>
            </NavLink>
          </div>

          <div>
            <NavLink
              to="/about-us"
              className={({ isActive }) =>
                `!no-underline text-dark text-md hover:text-[#007a8e] ${
                  isActive ? "active-class" : ""
                } lg:mr-10 xl:mr-22`
              }
            >
              About
            </NavLink>
          </div>

          <div>
            <NavLink
              to="/careers"
              className={({ isActive }) =>
                `!no-underline text-dark text-md hover:text-[#007a8e] ${
                  isActive ? "active-class" : ""
                } lg:mr-10 xl:mr-22`
              }
            >
              Careers
            </NavLink>
          </div>

          <div>
            <NavLink
              to="/news"
              className={({ isActive }) =>
                `!no-underline text-dark text-md hover:text-[#007a8e] ${
                  isActive ? "active-class" : ""
                }lg:mr-10 xl:mr-22`
              }
            >
              News
            </NavLink>
          </div>

          <div>
            <NavLink
              to="/blogs"
              className={({ isActive }) =>
                `!no-underline text-dark text-md hover:text-[#007a8e] ${
                  isActive ? "active-class" : ""
                } lg:mr-10 xl:mr-22`
              }
            >
              Blogs
            </NavLink>
          </div>

          <div>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `!no-underline text-dark text-md font-medium hover:text-[#007a8e] ${
                  isActive ? "active-class" : ""
                }`
              }
            >
              Contact
            </NavLink>
          </div>
        </nav>
        <div>
          <NavLink
            to="/login-employee"
            className={({ isActive }) =>
              `!no-underline bg-[#E5F5F7] px-4 p-3 rounded-4xl text-primary text-md font-md hover:text-[#007a8e] transition-all duration-300 ease-in-out ${isActive ? "active-class" : ""}`
            }
          >
            Employee Login
          </NavLink>
        </div>
      </div>
    </>
  );
}
