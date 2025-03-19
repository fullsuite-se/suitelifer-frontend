import { useState } from "react";

const industries = ["All", "Business", "Operations", "Finance", "Software"];

const GuestIndustryTags = ({ industries, filter, handleFilterChange }) => {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-2 sm:gap-3 md:gap-4 justify-start px-2 sm:px-3 md:px-4 whitespace-nowrap xl:justify-center">
        <button
          key={-1}
          onClick={() => handleFilterChange("All")}
          className={`cursor-pointer px-4 py-1 sm:px-5 md:px-6 text-sm sm:text-base md:text-lg rounded-full border-1 border-primary text-primary transition-all duration-300 
        ${
          filter === "All"
            ? "bg-primary text-white"
            : "hover:bg-primary hover:text-white"
        }`}
        >
          All
        </button>
        {industries?.map((industry, index) => (
          <button
            key={index}
            onClick={() => handleFilterChange(industry.industryId)}
            className={`cursor-pointer px-4 py-1 sm:px-5 md:px-6 text-sm sm:text-base md:text-lg rounded-full border-1 border-primary text-primary transition-all duration-300 
        ${
          filter === industry.industryId
            ? "bg-primary text-white"
            : "hover:bg-primary hover:text-white"
        }`}
          >
            {industry.industryName}
          </button>
        ))}
        <div className="pr-2"></div>
      </div>
    </div>
  );
};

export default GuestIndustryTags;
