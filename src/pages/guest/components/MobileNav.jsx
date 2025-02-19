import { useState } from "react";
import logo_fs_full from "../../../assets/logos/logo-fs-full.svg";
import { Bars2Icon, XMarkIcon } from "@heroicons/react/24/solid";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="animate-wave flex justify-between items-center h-16 text-center mb-5">
      {/* Logo */}
      <div className="w-32 ml-7">
        <img className="object-cover" src={logo_fs_full} alt="Logo" />
      </div>

      {/* Menu Icon */}
      <div className="mr-7">
        <Bars2Icon
          className="w-8 cursor-pointer"
          onClick={() => setIsOpen(true)}
        />
      </div>

      {/* Mobile Navigation Modal */}
      {isOpen && (
        <div
          onClick={() => {
            setIsOpen(false);
          }}
          className="animate-slideIn animate-slide fixed inset-0 z-10 flex justify-end"
        >
          <div className="w-full bg-linear-to-t from-transparent to-white to-20% h-[80%] p-3">
            <div className="flex justify-between">
            {/* Fullsuite Icon */}
              <div className="w-32 ml-4">
                <img className="object-cover" src={logo_fs_full} alt="Logo" />
              </div>
            {/* Close Button */}
              <XMarkIcon
                className="w-8 cursor-pointer mr-5"
                onClick={() => setIsOpen(false)}
              />
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col space-y-4 mt-5">
              <a
                href="#"
                className="!no-underline !text-black text-lg font-medium hover:text-[#007a8e]"
                onClick={() => setIsOpen(false)}
              >
                Home
              </a>
              <a
                href="#"
                className="!no-underline !text-black text-lg font-medium hover:text-[#007a8e]"
                onClick={() => setIsOpen(false)}
              >
                About
              </a>
              <a
                href="#"
                className="!no-underline !text-black text-lg font-medium hover:text-[#007a8e]"
                onClick={() => setIsOpen(false)}
              >
                Careers
              </a>
              <a
                href="#"
                className="!no-underline !text-black text-lg font-medium hover:text-[#007a8e]"
                onClick={() => setIsOpen(false)}
              >
                News
              </a>
              <a
                href="#"
                className="!no-underline !text-black text-lg font-medium hover:text-[#007a8e]"
                onClick={() => setIsOpen(false)}
              >
                Blogs
              </a>
              <a
                href="#"
                className="!no-underline !text-black text-lg font-medium hover:text-[#007a8e]"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </a>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
