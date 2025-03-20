import { useEffect, useState } from "react";
import api from "../../utils/axios";
import companyBlogs from "../home/CompanyBlogsList";
import TwoCirclesLoader from "../../assets/loaders/TwoCirclesLoader";

const categories = [
  "All",
  "Business",
  "Employees",
  "Startups",
  "Finance",
  "Baguio",
];

const GuestBlogTags = ({ companyBlogTags, activeTag, handleTagClick }) => {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-2 sm:gap-3 md:gap-4 align-middle justify-start px-2 sm:px-3 md:px-4 whitespace-nowrap md:justify-center">
        {companyBlogTags.map((cblogTag, index) => (
          <button
            key={index}
            onClick={() => handleTagClick(cblogTag.tagId)}
            className={`px-4 py-1 sm:px-5 md:px-6 text-sm sm:text-base md:text-lg rounded-full border-1 border-primary text-primary transition-all duration-300 
      ${
        activeTag === cblogTag.tagId
          ? "bg-primary text-white"
          : "hover:bg-primary hover:text-white"
      }`}
          >
            {cblogTag.tagName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GuestBlogTags;
