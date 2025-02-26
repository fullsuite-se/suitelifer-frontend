import React, { useEffect, useRef } from "react";
import MobileNav from "../../components/home/MobileNav";
import TabletNav from "../../components/home/TabletNav";
import DesktopNav from "../../components/home/DesktopNav";
import JobCarousel from "../../components/careers/JobCarousel";
import Footer from "../../components/Footer";
import SpotifyEmbed from "../../components/careers/SpotifyEmbed";

const rawEpisodes = [
  "https://open.spotify.com/episode/0ccRsDmuWXrvECqs8mL1Rc?si=bef9b96228254312",
  "https://open.spotify.com/episode/4kcxdragdUgbApJkWwSl2K?si=8dc9871de0db4edc",
  "https://open.spotify.com/episode/43GsS6y8zIKu4F9UlHqJNu?si=27327d4712794064",
];

const extractedEpisodeIds = rawEpisodes.map((url) => {
  const idPart = url.split("episode/")[1];
  return idPart.split("?")[0];
});

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
      {/* CUURENT JOB OPENINGS */}
      <div className="job-openings-container mb-8">
        {/* TOP TEXT */}
        <div className="top-text flex flex-row justify-between items-center px-4 mb-3 font-avenir-black">
          <span className="text-md">Current Job Openings</span>
          <span className="text-xs text-primary">View all jobs</span>
        </div>

        {/* JOB CAROUSEL */}
        <JobCarousel />
      </div>

      <div className="podcast-container px-4">
        <div className="text-lg font-avenir-black mb-2">
          Want to <span className="text-primary">learn more</span> about our
          careers?
        </div>
        <div className="text-xs mb-5">
          Check out the Suite Spot podcast below
        </div>
      </div>

      {/* SPOTIFY EPISODES */}
      <div className="px-3">
        {extractedEpisodeIds.map((id, index) => {
          return (
            <div className="p-1">
              <SpotifyEmbed id={id} index={index} />
            </div>
          );
        })}
      </div>

      <Footer />
    </>
  );
};

export default Careers;
