import React from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useLocation } from "react-router-dom";
import TopBarGeneratedFunction from "../buttons/TopBarGeneratedFunction";

const CMSTopNavigation = () => {
  const location = useLocation();
  const path = location.pathname.split("/");
  const currentPage = path[path.length - 1];

  const formatTitle = (str) => {
    if (path.includes("my-blogs")) {
      return "My Blog";
    } else if (path.includes("blogs-feed")) {
      return "Blogs Feed";
    }
    return str
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <nav className="p-2 xl:pt-3">
      <div className="lg:flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-avenir-black">{formatTitle(currentPage)}</h2>
          <span className="text-sm text-gray-500 font-avenir-roman">(6)</span>
          <InformationCircleIcon className="w-4 h-4 text-gray-500" />
        </div>
        <TopBarGeneratedFunction page={formatTitle(currentPage)} />
      </div>
    </nav>
  );
};

export default CMSTopNavigation;
