import { useState, useEffect } from "react";
import logo_fs_full from "../../assets/logos/logo-fs-full.svg";
import { Bars2Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { NavLink, useLocation } from "react-router-dom";

export default function TabletNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const isPathActive = location.pathname.startsWith("/careers");

  // Function to handle close animation
  const handleClose = () => {
    setIsClosing(true);
    setIsVisible(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300); // Match with animation duration (0.3s)
  };

  // Scroll event handler
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    // If scrolling up (even a little), show the nav
    if (!isOpen && currentScrollY < lastScrollY) {
      setIsVisible(true);
    } else if (currentScrollY > lastScrollY) {
      // Hide nav when scrolling down
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
  // `flex justify-between items-center h-16 text-center mb-5 fixed top-0 left-0 right-0 z-20 transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"}`
  return (
    <>
      <div className="h-16 mb-2">
        <div
          className={`fixed z-50 transition-transform duration-300 bg-white w-full `}
        >
          <div
            className={`bg-white fixed top-0 left-0 right-0 z-20 transition-transform duration-300 ${
              isVisible ? "translate-y-0" : "-translate-y-full"
            } flex justify-between items-center text-center h-16`}
          >
            {/* Logo */}
            <div className="w-32 ml-7">
              <img className="object-cover" src={logo_fs_full} alt="Logo" />
            </div>

            {/* Menu Icon */}
            <div className="mr-7">
              <Bars2Icon
                className="w-8 cursor-pointer"
                onClick={() => {
                  setIsOpen(true), setIsVisible(false);
                }}
              />
            </div>
          </div>

          {/* Tablet Navigation Modal */}
          {isOpen && (
            <div
              onClick={handleClose}
              className="w-full h-full animate-slideInRight fixed inset-0 z-20 flex justify-end"
            >
              <div
                className={`w-[40%] bg-white p-3 pt-8 shadow transition-transform duration-300 ${
                  isClosing
                    ? "animate-slideOutRight"
                    : "translate-y-0 opacity-100"
                }`}
              >
                <div className="flex justify-between">
                  {/* Fullsuite Icon */}
                  <div className="w-32 ml-4">
                    <a href="/">
                      <img
                        className="object-cover"
                        src={logo_fs_full}
                        alt="Logo"
                      />
                    </a>
                  </div>
                  {/* Close Button */}
                  <XMarkIcon
                    className={`w-8 cursor-pointer mr-5 ${
                      isClosing ? "animate-" : "animate-spinCCW"
                    }`}
                    onClick={handleClose}
                  />
                </div>

                {/* Navigation Links FIX SCROLLING*/}
                <div className="max-h-[calc(100vh-4rem)] overflow-y-auto">
                  <nav className="flex items-center flex-col space-y-4 py-10">
                    <div>
                      <NavLink
                        to="/"
                        className={({ isActive }) =>
                          `!no-underline text-black text-lg font-medium hover:text-[#007a8e] ${
                            isActive ? "active-class" : ""
                          }`
                        }
                        onClick={handleClose}
                      >
                        Home
                      </NavLink>
                    </div>

                    <div>
                      <NavLink
                        to="/about-us"
                        className={({ isActive }) =>
                          `!no-underline text-black text-lg font-medium hover:text-[#007a8e] ${
                            isActive ? "active-class" : ""
                          }`
                        }
                        onClick={handleClose}
                      >
                        About
                      </NavLink>
                    </div>

                    <div>
                      <NavLink
                        to="/careers"
                        className={({ isActive }) =>
                          `!no-underline text-black text-lg font-medium hover:text-[#007a8e] ${
                            isPathActive ? "active-class text-[#007a8e]" : ""
                          }`
                        }
                        onClick={handleClose}
                      >
                        Careers
                      </NavLink>
                    </div>

                    <div>
                      <NavLink
                        to="/newsletter"
                        className={({ isActive }) =>
                          `!no-underline text-black text-lg font-medium hover:text-[#007a8e] ${
                            isPathActive ? "active-class text-[#007a8e]" : ""
                          }`
                        }
                        onClick={handleClose}
                      >
                        Newsletter
                      </NavLink>
                    </div>

                    <div>
                      <NavLink
                        to="/news"
                        className={({ isActive }) =>
                          `!no-underline text-black text-lg font-medium hover:text-[#007a8e] ${
                            isActive ? "active-class" : ""
                          }`
                        }
                        onClick={handleClose}
                      >
                        News
                      </NavLink>
                    </div>

                    <div>
                      <NavLink
                        to="/blogs"
                        className={({ isActive }) =>
                          `!no-underline text-black text-lg font-medium hover:text-[#007a8e] ${
                            isActive ? "active-class" : ""
                          }`
                        }
                        onClick={handleClose}
                      >
                        Blogs
                      </NavLink>
                    </div>

                    <div>
                      <NavLink
                        to="/contact"
                        className={({ isActive }) =>
                          `!no-underline text-black text-lg font-medium hover:text-[#007a8e] ${
                            isActive ? "active-class" : ""
                          }`
                        }
                        onClick={handleClose}
                      >
                        Contact
                      </NavLink>
                    </div>

                    <div className="mt-8">
                    
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
