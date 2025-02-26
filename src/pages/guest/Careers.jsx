import React from "react";
import MobileNav from "../../components/home/MobileNav";
import TabletNav from "../../components/home/TabletNav";
import DesktopNav from "../../components/home/DesktopNav";
import JobCarousel from "../../components/careers/JobCarousel";

const Careers = () => {
  return (
    <>
      {/* MOBILE NAV */}
      <div className="sm:hidden">
        <MobileNav />
      </div>
      {/* TABLET NAV */}
      <div className="tablet-nav">
        <TabletNav />
      </div>
      {/* DESKTOP NAV */}
      <div className="desktop-nav">
        <DesktopNav />
      </div>
      <div className="job-openings-container">
        {/* TOP TEXT */}
        <div className="top-text flex flex-row justify-between items-center px-4 font-avenir-black">
          <span className="text-md">Current Job Openings</span>
          <span className="text-xs text-primary">View all jobs</span>
        </div>

        {/* JOB CAROUSEL */}
        <JobCarousel />
      </div>
    </>
  );
};

export default Careers;
