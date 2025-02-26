import React from "react";
import { useSwiperSlide } from "swiper/react";

const JobPost = ({
  title,
  employmentType,
  salary = null,
  description,
  setup,
}) => {
  const swiperSlide = useSwiperSlide();
  const isActive = swiperSlide.isActive;

  return (
    <div
      className={`job-container max-w-90 text-sm p-5 rounded-xl flex flex-col ${
        isActive
          ? "bg-primary text-white h-75"
          : "bg-white text-primary h-65 justify-center items-center"
      }`}
    >
      <p className="text-base font-avenir-black truncate">{title}</p>
      <div
        className={`flex ${isActive ? "flex-row" : "flex-col"} justify-between`}
      >
        <p className="text-sm font-avenir-black">{employmentType}</p>
        <p className="text-sm font-avenir-roman mb-3">{setup}</p>
      </div>
      {isActive && salary && (
        <>
          <p className="text-[0.75em]">Expected Salary</p>
          <p className="text-base font-avenir-black mb-3">PHP {salary}</p>
        </>
      )}
      {isActive && (
        <p className={`mb-3 ${salary ? "line-clamp-5" : "line-clamp-7"}`}>
          {description}
        </p>
      )}
      {isActive && (
        <a href="#" onClick={() => {console.log('hello')}}>
          <button className="bg-[#4DB6C9] text-white p-2 rounded-xl w-full mt-auto">
            View Full Details
          </button>
        </a>
      )}
    </div>
  );
};

export default JobPost;
