import { useState } from "react";

const industries = ["All", "Business", "Operations", "Finance", "Software"];

const GuestIndustryTags = () => {
  const [activeTag, setActiveTag] = useState("All");

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-2 sm:gap-3 md:gap-4 align-middle justify-start px-2 sm:px-3 md:px-4 whitespace-nowrap md:justify-center">
        {industries.map((category) => (
          <button
            key={category}
            onClick={() => setActiveTag(category)}
            className={`cursor-pointer px-4 py-1 sm:px-5 md:px-6 text-sm sm:text-base md:text-lg rounded-full border-1 border-primary text-primary transition-all duration-300 
        ${
          activeTag === category
            ? "bg-primary text-white"
            : "hover:bg-primary hover:text-white"
        }`}
          >
            {category}
          </button>
        ))}
      <div className="pr-2"></div>
      </div>
    </div>
  );
};

export default GuestIndustryTags;
