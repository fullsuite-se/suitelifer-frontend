import React, { useEffect, useRef, useState } from "react";
import MobileNav from "../../components/home/MobileNav";
import TabletNav from "../../components/home/TabletNav";
import DesktopNav from "../../components/home/DesktopNav";
import JobCarousel from "../../components/careers/JobCarousel";
import Footer from "../../components/Footer";
import SpotifyEmbed from "../../components/careers/SpotifyEmbed";
import config from '../../config';
import axios from "axios";

const Careers = () => {
  const [spotifyEpisodes, setEpisodes] = useState([]);

  useEffect( () => {
    const fetchEpisodes = async () => {
      try {
        const episodes = await axios.get(`${config.apiBaseUrl}/api/episodes`);
        
        console.log(episodes.data);

        setEpisodes(episodes.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchEpisodes();
  }, [])
  

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
      <div className="px-3 mb-10">
        {spotifyEpisodes.map((episode, index) => {
          return (
            <div className="p-1" key={index}>
              <SpotifyEmbed id={episode.id} index={index} key={index}/>
            </div>
          );
        })}
      </div>

      <Footer />
    </>
  );
};

export default Careers;
