import { useState } from "react";
import logo_fs_full from "../../assets/logos/logo-fs-full.svg";
import { Bars2Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { NavLink, useLocation } from "react-router-dom";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const location = useLocation();
  const isPathActive = location.pathname.startsWith("/careers");

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300); // Match with animation duration (0.3s)
  };

  return (
    <div className="relative h-16 text-center">
      <div className="bg-white z-50 fixed flex justify-between items-center h-16 w-full text-center">
        <div className="w-32 ml-7">
          <a href="/">
            <img className="object-cover" src={logo_fs_full} alt="Logo" />
          </a>
        </div>

        {!isOpen ? (
          <div className="mr-7">
            <Bars2Icon
              className="w-8 cursor-pointer"
              onClick={() => setIsOpen(true)}
            />
          </div>
        ) : (
          <XMarkIcon
            className="w-8 cursor-pointer mr-7"
            onClick={handleClose}
          />
        )}
        {/* Close Button */}
      </div>
      {/* Logo */}

      {/* Mobile Navigation Modal */}
      {isOpen && (
        <div
          onClick={handleClose}
          className="animate-slideIn z-40 fixed inset-0 flex justify-end ass"
        >
          <div
            className={`w-full bg-gradient-to-t from-transparent to-white to-40% h-[100%] p-3 transition-transform duration-300 ${
              isClosing ? "animate-slideOut" : "translate-y-14 opacity-100"
            }`}
          >
            <div className="flex justify-between"></div>

            {/* Navigation Links */}
            <nav className="flex flex-col space-y-4 mt-5">
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
                  className={`!no-underline text-black text-lg font-medium transition-all duration-300
        hover:text-[#007a8e] ${
          isPathActive ? "active-class text-[#007a8e]" : ""
        }`}
                  onClick={handleClose}
                >
                  Careers
                </NavLink>
              </div>

              <div>
                <NavLink
                  to="/newsletter"
                  className={`!no-underline text-black text-lg font-medium transition-all duration-300
                  hover:text-[#007a8e] ${
                    isPathActive ? "active-class text-[#007a8e]" : ""
                  }`}
                  onClick={handleClose}
                >
                  Newsletter
                </NavLink>
              </div>
        
              <div>
                <NavLink
                  to="/podcast"
                  className={({ isActive }) =>
                    `!no-underline text-black text-lg font-medium hover:text-[#007a8e] ${
                      isActive ? "active-class" : ""
                    }`
                  }
                  onClick={handleClose}
                >
                  Podcasts
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

              <div className="mt-8"></div>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
