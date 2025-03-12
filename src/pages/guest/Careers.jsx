import React, { useEffect, useState } from "react";
import MobileNav from "../../components/home/MobileNav";
import TabletNav from "../../components/home/TabletNav";
import DesktopNav from "../../components/home/DesktopNav";
import JobCarousel from "../../components/careers/JobCarousel";
import Footer from "../../components/Footer";
import SpotifyEmbed from "../../components/careers/SpotifyEmbed";
import config from "../../config";
import axios from "axios";
import JobCarouselVersion2 from "../../components/careers/JobCarouselVersion2";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import GuestIndustryTags from "../../components/careers/GuestIndustriesTags";
import dotsLine from "../../assets/images/socials-dots-line.svg";
import bgPodcast from "../../assets/images/bg-career-podcast.svg";

const Careers = () => {
  const [spotifyEpisodes, setEpisodes] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const response = await axios.get(
          `${config.apiBaseUrl}/api/latest-three-episodes`
        );

        setEpisodes(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchEpisodes();

    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}/api/all-jobs`);

        setJobs(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchJobs();
  }, []);

  return (
    <>
      <section
        className="gap-4"
        style={{ maxWidth: "2000px", margin: "0 auto", padding: "0 0rem" }}
      >
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
        <main className="lg:mt-20">
          <div className="flex justify-end scale-x-[-1] -translate-x-[1%] pb-[5%]">
            <img className="dots-line" src={dotsLine} alt="3 dots and a line" />
          </div>
          {/* Current Job Openings */}
          <section className="pb-[7%] lg:pb-[5%]">
            {/* Top text */}
            <div className="">
              <p className="px-[5%] font-avenir-black flex justify-between items-center">
                <span className="top-text">Current Job Openings</span>
                <a
                  href=""
                  className="animate-bounceCustom flex text-sm md:text-base no-underline text-primary hover:underline!"
                >
                  View all{" "}
                  <span>
                    {<ChevronRightIcon className="size-4 md:size-5" />}
                  </span>
                </a>
              </p>
              <div className="relative hidden lg:block">
                <div className="absolute overflow-hidden right-0 translate-y-12 -z-50 w-[25%] h-25 bg-secondary/10 rounded-l-4xl"></div>
              </div>
              {/* Filter */}
              <div className="flex justify-center py-[3%] px-[5%] pb-[5%]">
                <div className="w-full max-w-3xl flex justify-center">
                  <GuestIndustryTags />
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute overflow-hidden -translate-y-35 -z-50 w-[10%] h-30 bg-primary/5 rounded-r-4xl"></div>
            </div>
            {/* <div className="">View all jobs</div> */}
            <JobCarouselVersion2 jobs={jobs} />
          </section>

          <div className="-translate-y-27">
            <div className="hidden lg:block">
              <div className="absolute overflow-hidden translate-x-[75%] -translate-y-15 -z-50 w-[10%] h-25 bg-secondary/5 rounded-2xl"></div>
            </div>

            <div className="hidden lg:block">
              <div className="absolute overflow-hidden -z-50 w-[10%] h-25 bg-primary/5 rounded-2xl"></div>
            </div>
          </div>
          <div className="hidden sm:block lg:hidden">
            <div className="absolute right-0 verflow-hidden -translate-y-25 -z-50 w-[18%] h-40 bg-primary/5 rounded-l-4xl"></div>
          </div>

          <div className="hidden lg:block">
            <div className="absolute right-0 verflow-hidden -translate-x-10 -translate-y-15 -z-50 w-[14%] h-40 bg-primary/5 rounded-4xl"></div>
          </div>

          {/* Podcasts */}
          <section className="pb-[7%] lg:pb-[5%] px-[5%]">
            <div className="podcast-container pb-[4%]">
              <div className="top-text font-avenir-black text-center">
                Want to <span className="text-primary">learn more</span> about
                our careers?
              </div>
              <div className="text-gray-500 text-center">
                Check out the Suite Spot podcast below
              </div>
            </div>
            {/* Spotify Episodes */}
            <div className="">
              {/* Mobile View: Display all in a column */}
              <div className="sm:hidden">
                {spotifyEpisodes.map(({ spotifyId }, index) => (
                  <div className="p-1" key={index}>
                    <SpotifyEmbed id={spotifyId} index={index} />
                  </div>
                ))}
              </div>

              {/* Small Screens and Up: Two-column layout */}
              <div className="hidden sm:flex gap-4">
                {/* Left Column: Large Embed */}
                <div className="w-1/2">
                  <SpotifyEmbed id={spotifyEpisodes[0]?.spotifyId} index={0} />
                </div>

                {/* Right Column: Two Smaller Embeds */}
                <div className="w-1/2 flex flex-col justify-center gap-4">
                  {spotifyEpisodes.slice(1, 3).map(({ spotifyId }, index) => (
                    <SpotifyEmbed
                      key={index + 1}
                      id={spotifyId}
                      index={index + 1}
                    />
                  ))}
                </div>
              </div>
            </div>            
          </section>
          <div className="relative hidden sm:block">
              <div className="absolute -translate-y-30 -z-50 w-[15%] h-25 bg-primary/10 rounded-r-4xl"></div>
            </div>
        </main>
        <Footer />
      </section>
    </>
  );
};

export default Careers;
