import React from "react";
import { NavLink } from "react-router-dom";
import { useSwiperSlide } from "swiper/react";
import { toSlug } from "../../utils/slugUrl";

const JobPost = ({
  jobId,
  jobTitle,
  employmentType,
  salaryMin,
  salaryMax,
  description,
  setupName,
}) => {
  const swiperSlide = useSwiperSlide();
  const isActive = swiperSlide.isActive;
  const isPrev = swiperSlide.isPrev;

  return (
    <div
      className={`job-container shadow-2xs text-sm px-5 pt-5 rounded-xl flex flex-col ${
        isActive
          ? "bg-primary text-white h-75"
          : `bg-white text-primary h-65 justify-center ${
              isPrev ? "items-end" : isActive ? "items-center" : "items-start"
            }`
      }`}
    >
      <p className="text-base font-avenir-black truncate" title={jobTitle}>
        {jobTitle}
      </p>
      <div
        className={`flex ${isActive ? "flex-row" : "flex-col"} justify-between`}
      >
        <p className="text-sm font-avenir-black">{employmentType}</p>
        <p className="text-sm font-avenir-roman mb-3">{setupName}</p>
      </div>
      {isActive && salaryMin && (
        <>
          <p className="text-[0.75em]">Expected Salary</p>
          <p className="text-base font-avenir-black mb-3">
            {Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "PHP",
                    maximumFractionDigits: 0,
                  }).format(salaryMin)}<span className="text-xs font-avenir-roman"> min</span>
          </p>
        </>
      )}
      {isActive && (
        <p className={`mb-3 ${salaryMin ? "line-clamp-5" : "line-clamp-7"}`}>
          {description}
        </p>
      )}
      {isActive && (
        <NavLink to={`/careers/${toSlug(jobTitle)}`} state={{ jobId }}>
          <button className="bg-[#4DB6C9] text-white p-2 rounded-xl w-full mt-auto">
            View Full Details
          </button>
        </NavLink>
      )}
    </div>
  );
};

export default JobPost;
