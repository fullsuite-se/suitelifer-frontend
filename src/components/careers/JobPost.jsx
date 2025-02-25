import React from "react";

const JobPost = ({ title, employmentType, salary = null, description }) => {
  return (
    <div className="job-container text-sm bg-primary p-8 rounded-xl text-white w-65">
      <p className="text-base font-avenir-black">{title}</p>
      <p className="text-base font-avenir-black mb-3">{employmentType}</p>
      {salary && (<><p style={{ fontSize: ".75em" }}>Expected Salary</p>
        <p className="text-base font-avenir-black mb-3">PHP {salary}</p></>)}
      
      <p className="line-clamp-5 mb-3">{description}</p>

      <button className="bg-[#4DB6C9] text-white p-2 rounded-xl w-full">View Full Details</button>
    </div>
  );
};

export default JobPost;
