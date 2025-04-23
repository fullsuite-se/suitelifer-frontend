import React from "react";
import { BriefcaseIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";

const TopBarDashboard = () => {
  return (
    <div className="flex gap-3">
      {/* Button for desktop */}
      <button className="text-gray-500 hidden sm:block border border-gray-200 bg-gray-100 px-3 py-2 rounded-md cursor-pointer">
        + Job Listing
      </button>
      <button className="text-gray-500 hidden sm:block border border-gray-200 bg-gray-100 px-3 py-2 rounded-md cursor-pointer">
        + Industry
      </button>

      {/* Icon Button for Mobile */}
      <button className="text-gray-500 border rounded-md cursor-pointer bg-gray-100 border-gray-200 sm:hidden px-3 py-2 flex items-center gap-1">
        <span>+</span>
        <BriefcaseIcon className="w-5 h-5" />
      </button>
      <button className="text-gray-500 border rounded-md cursor-pointer bg-gray-100 border-gray-200 sm:hidden px-3 py-2 flex items-center gap-1">
        <span>+</span> <BuildingOfficeIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default TopBarDashboard;
