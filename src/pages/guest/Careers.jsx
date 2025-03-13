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
import bgHero from "../../assets/images/bg-hero-careers.svg";
import bgHeroTablet from "../../assets/images/bg-tablet-careers.svg";
import BackToTop from "../../components/BackToTop";

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
        className="gap-4 overflow-hidden"
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
        <main className="">
          {/* 
          landscape:https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c3RhcnR1cHxlbnwwfHwwfHx8MA%3D%3D
          // https://images.unsplash.com/photo-1554780336-390462301acf?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
          portrait: https://images.unsplash.com/photo-1554780336-390462301acf?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
          */}

          <section>
            {/* Mobile Hero Background */}
            <section className=" relative md:hidden">
              {/* blue at top */}
              <div className="">
                <div className="absolute right-10 overflow-hidden -translate-x-[10vw] -translate-y-[23vw] z-50 w-[14%] h-[35vw] bg-primary/5 rounded-b-4xl"></div>
              </div>
              {/* blue at top left */}
              <div className="">
                <div className="w-[15%] h-[13vw] rounded-r-3xl absolute overflow-hidden -z-50  bg-primary/10 "></div>
              </div>
              {/* green at top right */}
              <div className="">
                <div className="right-0 w-[12%] h-[25vw] translate-y-10 rounded-l-3xl absolute overflow-hidden -z-50  bg-secondary/10 "></div>
              </div>
              {/* blue at bottom */}
              <div className="md:hidden">
                <div className="w-[15%] h-[35vw] rounded-r-2xl -translate-x-[7vw] translate-y-[80vw]  absolute overflow-hidden -z-50  bg-primary/10 "></div>
              </div>
            </section>

            {/* Tablet Hero Background */}
            <section className=" relative hidden md:block lg:hidden">
              {/* blue at top */}
              <div className="">
                <div className="absolute w-[8%] h-[35vw] max-w-[150px] max-h-[450px] -translate-x-[15vw] lg:-translate-y-[5vw] -translate-y-[13vw] right-10 overflow-hidden z-50 bg-primary/5 rounded-b-4xl"></div>
              </div>
              {/* blue at top left */}
              <div className="">
                <div className="w-[18%] h-[7vw] max-h-[100px] translate-y-[8vw] lg:translate-y-[15vw] xl:translate-y-[12vw] rounded-r-3xl absolute overflow-hidden -z-50  bg-primary/10 "></div>
              </div>
              {/* green at top right */}
              <div className="">
                <div className="right-0 w-[12%] h-[25vw] max-h-[300px] translate-y-10 lg:translate-y-[12vw] rounded-l-3xl absolute overflow-hidden -z-50  bg-secondary/10 "></div>
              </div>
              {/* blue at bottom left */}
              <div className="">
                <div className="w-[15%] h-[25vw] rounded-r-2xl -translate-x-[7vw] translate-y-[40vw]  absolute overflow-hidden -z-50  bg-primary/15 "></div>
              </div>

              {/* blue at bottom right */}
              <div className="">
                <div className="right-0 w-[15%] h-[5vw] rounded-l-2xl -translate-x-[] translate-y-[65vw]  absolute overflow-hidden -z-50  bg-primary/15 "></div>
              </div>
            </section>
            {/* <img src="https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c3RhcnR1cHxlbnwwfHwwfHx8MA%3D%3Dhttps://images.unsplash.com/photo-1554780336-390462301acf?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" /> */}
            <div className="hero-container">
              {/* Desktop Hero Background */}
              {/* blue at top */}
              <section className="relative hidden lg:block">
                <div className="absolute overflow-hidden right-0 -translate-y-10 -z-50 w-[25%] h-25 bg-secondary/10 rounded-l-4xl"></div>
                <div className="absolute overflow-hidden right-0 translate-y-95 xl:translate-y-110 -z-50 w-[12%] h-50 bg-primary/5 rounded-l-4xl"></div>
                <div className="absolute overflow-hidden translate-y-30 -z-50 w-[13%] h-40 bg-primary/10 rounded-r-4xl"></div>
                <div className="absolute overflow-hidden right-0 translate-y-170 xl:translate-y-185 -z-50 w-[25%] h-20 bg-primary/10 rounded-l-4xl"></div>
              </section>

              <p className="pl-[5%] career-hero-text-desktop font-avenir-black max-w-[1800px] mx-auto">
                Let's <span className="text-primary">launch</span> your career,
              </p>
              {/* MOBILE background images */}
              <section className="bg-mobile-images relative md:hidden">
                <img
                  className="absolute w-[30vw] max-w-[220px] -translate-y-[13vw] -translate-x-[30%] rounded-2xl opacity-60 object-cover aspect-3/4"
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt=""
                />
                {/* lower right image MAIN */}
                <img
                  className="absolute right-0 w-[35vw] translate-y-[30vw] translate-x-[14vw] rounded-2xl opacity-60 object-cover aspect-3/4"
                  src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt=""
                />

                {/* lower left image 1 */}
                <img
                  className="absolute w-[30vw] max-w-[220px] translate-y-[35vw] translate-x-[15vw] rounded-xl opacity-15 object-cover aspect-3/4"
                  src="https://images.unsplash.com/photo-1606836591695-4d58a73eba1e?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt=""
                />

                {/* lower right image 2 */}
                <img
                  className="absolute right-0 w-[20vw] max-w-[120px] translate-y-[36vw] -translate-x-[25vw] rounded-lg opacity-5 object-cover aspect-3/4"
                  src="https://images.unsplash.com/photo-1496851473196-e26508c21494?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt=""
                />

                {/* upper right image 2 */}
                <img
                  className="absolute w-[28vw] max-w-[180px] -translate-y-[14vw] translate-x-[55vw] rounded-2xl opacity-10 object-cover aspect-3/4"
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt=""
                />

                {/* upper left image 1 */}
                <img
                  className="absolute w-[25vw] max-w-[180px] -translate-y-[27vw] translate-x-[22vw] rounded-2xl opacity-5 object-cover aspect-3/4"
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt=""
                />
              </section>
              {/* 

                <img
                  className="absolute w-[15vw]  max-w-[220px] translate-y-[0vw] translate-x-[0vw] rounded-2xl opacity-60 object-cover aspect-3/4"
                  src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt=""
                />

              */}
              {/* DESKTOP background images */}
              <section className="relative hidden lg:block mx-auto">
                {/* left image MAIN */}
                <div className="relative w-full max-w-[400px] mx-auto">
                  <img
                    className="absolute z-10 w-[12vw] max-w-[190px] translate-y-15 -translate-x-[15vw]
                                rounded-3xl opacity-60 
                                object-cover aspect-3/4"
                    src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                  />
                </div>

                {/* right image MAIN */}
                <div className="relative w-full max-w-[400px] mx-auto">
                  <img
                    className="right-0 absolute z-10 w-[15vw] max-w-[250px] translate-y-50 translate-x-[17vw]
                                rounded-3xl opacity-60 
                                object-cover aspect-3/4"
                    src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                  />
                </div>

                {/* upper right image 1 */}
                <div className="relative w-full max-w-[400px] mx-auto">
                  <img
                    className="right-0 absolute z-10 w-[18vw] max-w-[260px] -translate-y-40 translate-x-[7vw]
                                rounded-3xl opacity-10 
                                object-cover aspect-3/4"
                    src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                  />
                </div>

                {/* upper right image 2 */}
                <div className="relative w-full max-w-[400px] mx-auto">
                  <img
                    className="right-0 absolute z-10 w-[15vw] max-w-[240px] -translate-y-none translate-x-[24vw]
                                rounded-3xl opacity-10 
                                object-cover aspect-3/4"
                    src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                  />
                </div>

                {/* bottom image 1 */}
                <div className="relative w-full max-w-[400px] mx-auto">
                  <img
                    className="absolute z-10 w-[15vw] max-w-[200px] translate-y-100 -translate-x-[4vw]
                                rounded-3xl opacity-10 
                                object-cover aspect-3/4"
                    src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                  />
                </div>

                {/* bottom image right 2 */}
                <div className="relative w-full max-w-[400px] mx-auto">
                  <img
                    className="absolute right-0 z-10 w-[15vw] max-w-[200px] translate-y-85 translate-x-[4vw]
                                rounded-3xl opacity-10 
                                object-cover aspect-3/4"
                    src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                  />
                </div>

                {/* bottom image leftest 2 */}
                <div className="relative w-full max-w-[400px] mx-auto">
                  <img
                    className="absolute z-10 w-[15vw] max-w-[280px] translate-y-65 -translate-x-[24vw]
                                rounded-3xl opacity-5 
                                object-cover aspect-3/4"
                    src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                  />
                </div>
              </section>
              {/* Main Image (CENTER) */}
              <div className="flex justify-center md:py-4">
                <img
                  className="size-[40%] md:size-[35%] z-20 max-w-[350px] xl:max-w-[380px] object-cover aspect-3/4 rounded-2xl md:rounded-4xl"
                  src="https://images.unsplash.com/photo-1579389083395-4507e98b5e67?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt=""
                />
              </div>
              <p className="text-end pr-[5%] xl:-translate-x-[4vw] career-hero-text-desktop font-avenir-black max-w-[1800px] mx-auto">
                hop on <span className="text-primary">now</span>.
              </p>
            </div>

            <div className="text-center">
              <p className="career-hero-text-mobile-small font-avenir-black">
                Let's <span className="text-primary">launch</span> your career,
              </p>
              <p className="pl-[20%] career-hero-text-mobile-large font-avenir-black">
                hop on <span className="text-primary">now</span>.
              </p>
            </div>
          </section>

          {/* HEIGHT DUMMY */}
          {/* <div className="h-100 grid place-content-center bg-amber-100 text-center p-5">
            <i>
              This height is but an illusion, a mere construct of perception,
              bound by the limits we choose to accept.
            </i>
          </div> */}

          {/* Three dots one line */}
          <div className="flex justify-end scale-x-[-1] -translate-x-[1%] py-[12%] sm:py-[3%]">
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
              <div className="flex justify-center py-[3%] pl-[5%] pb-[5%]">
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
            <div className="absolute right-0 overflow-hidden -translate-x-10 -translate-y-15 -z-50 w-[14%] h-40 bg-primary/5 rounded-4xl"></div>
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
        <BackToTop />
        <Footer />
      </section>
    </>
  );
};

export default Careers;
