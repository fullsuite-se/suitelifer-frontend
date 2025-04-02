import React, { useEffect, useState } from "react";
import MobileNav from "../../components/home/MobileNav";
import TabletNav from "../../components/home/TabletNav";
import DesktopNav from "../../components/home/DesktopNav";

import SpotifyEmbed from "../../components/careers/SpotifyEmbed";
import api from "../../utils/axios";
import JobCarousel from "../../components/careers/JobCarousel";
import GuestIndustryTags from "../../components/careers/GuestIndustriesTags";
import dotsLine from "../../assets/images/socials-dots-line.svg";
import BackToTop from "../../components/BackToTop";
import PageMeta from "../../components/layout/PageMeta";
import Footer from "../../components/Footer";
import { useLocation } from "react-router-dom";
import DynamicLink from "../../components/buttons/ViewAll";
import LoadingJobCarousel from "../../components/careers/LoadingJobCarousel";

import Skeleton from "react-loading-skeleton";
import LoadingLargeSpotify from "../../components/careers/LoadingLargeSpotify";
import LoadingSmallSpotify from "../../components/careers/LoadingSmallSpotify";

import careersLeft from "../../assets/images/careers-hero-images/careers-left.png";
import careersRight from "../../assets/images/careers-hero-images/careers-right.png";
import careersMain from "../../assets/images/careers-hero-images/careers-main.png";

const Careers = () => {
  const heroImages = {
    careersLeft,
    careersRight,
    careersMain,
  }
  const [jobs, setJobs] = useState([]);
  const fetchJobs = async () => {
    try {
      const response = await api.get("/api/all-open-jobs");
      setJobs((j) => response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const [spotifyEpisodes, setEpisodes] = useState([]);
  const [isSpotifyLoading, setIsSpotifyLoading] = useState(true);
  const fetchEpisodes = async () => {
    try {
      const response = await api.get("/api/latest-three-episodes");
      setEpisodes((e) => response.data.data);
      setIsSpotifyLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const [industries, setIndustries] = useState([]);
  const fetchIndustries = async () => {
    try {
      const response = await api.get("/api/get-all-industries");
      setIndustries((i) => response.data.data);
      console.log(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEpisodes();
    fetchJobs();
    fetchIndustries();
  }, []);

  const [filter, setFilter] = useState("All");
  const handleFilterChange = (filter) => {
    setFilter((f) => filter);
  };

  const fetchFilteredJobs = async () => {
    try {
      const response = await api.get(`/api/all-open-jobs/${filter}`);
      console.log(filter);

      setJobs((j) => response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    filter === "All" ? fetchJobs() : fetchFilteredJobs();
  }, [filter]);

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const section = document.getElementById(location.hash.substring(1));
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <>
      <section
        className="gap-4 overflow-hidden"
        style={{ maxWidth: "2000px", margin: "0 auto", padding: "0 0rem" }}
      >
        <PageMeta
          title="Careers - SuiteLifer"
          desc="Your career journey has to start somewhere. Grab the opportunity, start it with us."
          isDefer={false}
        />
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
        <main>
          <section>
            <div className="hero-container">
              <p className="pl-[5%] career-hero-text-desktop font-avenir-black max-w-[1800px] mx-auto">
                Let's <span className="text-primary">launch</span> your career,
              </p>
              {/* MOBILE background images */}
              <section className="bg-mobile-images relative md:hidden">
                {/* upper left image MAIN */}
                <img
                  className="absolute w-[30vw] max-w-[220px] -translate-y-[13vw] -translate-x-[30%] rounded-2xl object-cover aspect-3/4"
                  src={heroImages.careersLeft}
                  alt="left hero image"
                />
                {/* lower right image MAIN */}
                <img
                  className="absolute right-0 w-[35vw] translate-y-[30vw] translate-x-[14vw] rounded-2xl object-cover aspect-3/4"
                  src={heroImages.careersRight}
                  alt="right hero image"
                />

                {/* lower left image 1 */}
                {/* <img
                  className="absolute w-[30vw] max-w-[220px] translate-y-[35vw] translate-x-[15vw] rounded-xl opacity-15 object-cover aspect-3/4"
                  src="https://images.unsplash.com/photo-1606836591695-4d58a73eba1e?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt=""
                /> */}

                {/* lower right image 2 */}
                {/* <img
                  className="absolute right-0 w-[20vw] max-w-[120px] translate-y-[36vw] -translate-x-[25vw] rounded-lg opacity-5 object-cover aspect-3/4"
                  src="https://images.unsplash.com/photo-1496851473196-e26508c21494?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt=""
                /> */}

                {/* upper right image 2 */}
                {/* <img
                  className="absolute w-[28vw] max-w-[180px] -translate-y-[14vw] translate-x-[55vw] rounded-2xl opacity-10 object-cover aspect-3/4"
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt=""
                /> */}

                {/* upper left image 1 */}
                {/* <img
                  className="absolute w-[25vw] max-w-[180px] -translate-y-[27vw] translate-x-[22vw] rounded-2xl opacity-5 object-cover aspect-3/4"
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt=""
                /> */}
              </section>
              {/* 

                <img
                  className="absolute w-[15vw]  max-w-[220px] translate-y-[0vw] translate-x-[0vw] rounded-2xl opacity-60 object-cover aspect-3/4"
                  src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt=""
                />

              */}
              {/* TABLET + DESKTOP background images */}
              <section className="relative hidden md:block mx-auto">
                {/* left image MAIN */}
                <div className="hidden relative w-full max-w-[400px] mx-auto">
                  <img
                    className="absolute z-10 w-[160px] lg:w-[15vw] max-w-[190px] translate-y-15 -translate-x-[15vw]
                                rounded-3xl opacity-60 
                                object-cover aspect-3/4"
                    src={heroImages.careersLeft}
                    alt=""
                  />
                </div>

                {/* right image MAIN */}
                <div className="hidden relative w-full max-w-[400px] mx-auto">
                  <img
                    className="right-0 absolute z-10 w-[45%] lg:w-[15vw] max-w-[250px] translate-y-40 lg:translate-y-50 translate-x-[18vw] lg:translate-x-[17vw]
                                rounded-3xl opacity-60 
                                object-cover aspect-3/4"
                    src={heroImages.careersRight}
                    alt=""
                  />
                </div>

                {/* upper right image 1 */}
                {/* <div className="relative w-full max-w-[400px] mx-auto">
                  <img
                    className="right-0 top-0 absolute z-10 w-[18vw] max-w-[260px] -translate-y-40 lg:-translate-y-50 translate-x-[7vw]
                                rounded-b-3xl opacity-10 
                                object-cover aspect-3/4"
                    src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                  />
                </div> */}

                {/* upper right image 2 */}
                {/* <div className="relative w-full max-w-[400px] mx-auto">
                  <img
                    className="right-0 absolute z-10 w-[15vw] max-w-[240px] -translate-y-none translate-x-[18vw] lg:translate-x-[24vw]
                                rounded-3xl opacity-5 
                                object-cover aspect-3/4"
                    src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                  />
                </div> */}

                {/* bottom image 1 */}
                {/* <div className="relative w-full max-w-[400px] mx-auto">
                  <img
                    className="absolute z-10 w-[15vw] max-w-[200px] translate-y-100 -translate-x-[4vw]
                                rounded-3xl opacity-10 
                                object-cover aspect-3/4"
                    src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                  />
                </div> */}

                {/* bottom image right 2 */}
                {/* <div className="relative w-full max-w-[400px] mx-auto">
                  <img
                    className="absolute right-0 z-10 w-[15vw] max-w-[200px] translate-y-85 translate-x-[4vw]
                                rounded-3xl opacity-5 
                                object-cover aspect-3/4"
                    src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                  />
                </div> */}

                {/* bottom image leftest 2 */}
                {/* <div className="relative w-full max-w-[400px] mx-auto">
                  <img
                    className="absolute z-10 w-[15vw] max-w-[280px] translate-y-65 -translate-x-[24vw]
                                rounded-3xl opacity-5 
                                object-cover aspect-3/4"
                    src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                  />
                </div> */}
              </section>
              <div className="flex justify-center md:py-4 gap-10">
                {/* Left Image */}
                <img
                  className="hidden md:block size-[18%] z-20 xl:max-w-[200px] object-cover aspect-3/4 rounded-2xl md:rounded-2xl"
                  src={heroImages.careersLeft}
                  alt="left hero image"
                />
                {/* Main Image (CENTER) */}
                <img
                  className="size-[40%] md:size-[35%] z-20 max-w-[350px] xl:max-w-[380px] object-cover aspect-3/4 rounded-2xl md:rounded-4xl"
                  src={heroImages.careersMain}
                  alt="main hero image"
                />
                {/* Right Image */}
                <img
                  className="hidden md:block self-end z-20 size-[20%] xl:max-w-[220px] object-cover aspect-3/4 rounded-2xl md:rounded-2xl"
                  src={heroImages.careersRight}
                  alt="right hero image"
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
          <div
            className="flex justify-end scale-x-[-1] -translate-x-[1%] py-[12%] sm:py-[3%]"
            id="current-job-openings"
          >
            <img className="dots-line" src={dotsLine} alt="3 dots and a line" />
          </div>
          {/* Current Job Openings */}
          <section className="pb-[7%] lg:pb-[5%]">
            {/* Top text */}
            <div className="px-[5%] flex justify-between items-center">
              <div className="text-start pb-7">
                <p className="text-h4 font-avenir-black">
                  <span className="text-primary">Current</span> Job Openings
                </p>
                <p className="text-small text-gray-500">
                  Explore exciting career opportunities and find your perfect
                  role with us.
                </p>
              </div>
            </div>{" "}
            <div className="px-[5%] lg:px-[10%] flex justify-end items-end">
              <DynamicLink
                text="View All Jobs"
                href="/careers-all"
                className="custom-class"
                iconSize={5}
              />{" "}
            </div>
            {/* <div className="relative hidden lg:block">
              <div className="absolute overflow-hidden right-0 translate-y-12 -z-50 w-[25%] h-25 bg-secondary/10 rounded-l-4xl"></div>
            </div> */}
            {industries.length === 0 ? (
              <section className="">
                <div className="flex justify-center py-[3%] pl-[5%] pb-[5%]">
                  <div className="w-full max-w-full flex justify-center">
                    <div className="w-full">
                      <Skeleton width={"80%"} />
                      <Skeleton width={"40%"} />
                    </div>
                  </div>
                </div>
                <LoadingJobCarousel />
              </section>
            ) : (
              <div className="">
                {/* Filter */}
                <div className="flex justify-center py-[3%] pl-[5%] pb-[5%]">
                  <div className="w-full max-w-full flex justify-center">
                    <GuestIndustryTags
                      industries={industries}
                      filter={filter}
                      handleFilterChange={handleFilterChange}
                    />
                  </div>
                </div>

                {jobs.length === 0 ? (
                  <div className="grid place-content-center px-5 text-center text-2xl min-h-100 my-7">
                    <p>
                      No job listings are available for this industry{" "}
                      <span className="font-avenir-black">at the moment</span>
                      —but stay tuned!
                    </p>
                    <p>
                      Exciting{" "}
                      <span className="text-primary font-avenir-black">
                        opportunities
                      </span>{" "}
                      may be coming soon.
                    </p>
                  </div>
                ) : (
                  <JobCarousel jobs={jobs} />
                )}
              </div>
            )}
          </section>

          {/* Podcasts */}
          <section className="pb-[7%] lg:pb-[5%] px-[5%]">
            <div className="text-center pb-7">
              <p className="text-h4 font-avenir-black">
                Want to <span className="text-primary">learn more</span> about
                our careers?
              </p>
              <p className="text-small text-gray-500">
                Check out the Suite Spot podcast below
              </p>
            </div>
            {/* Spotify Episodes */}
            {isSpotifyLoading ? (
              <section className="mt-20 px-[5%] md:px-[10%] lg:px-[15%]">
                <div className="sm:hidden flex flex-col gap-4">
                  <LoadingLargeSpotify />
                  <LoadingSmallSpotify />
                  <LoadingSmallSpotify />
                </div>
                <div className="hidden sm:flex gap-4">
                  <div className="w-1/2">
                    <LoadingLargeSpotify />
                  </div>
                  <div className="w-1/2 flex flex-col justify-center gap-4">
                    <LoadingSmallSpotify />
                    <LoadingSmallSpotify />
                  </div>
                </div>
              </section>
            ) : (
              <>
                {spotifyEpisodes.length > 0 ? (
                  <>
                    <section className="mt-20 px-[5%] md:px-[10%] lg:px-[15%]">
                      {/* Mobile View: Display all in a column */}
                      <div className="sm:hidden">
                        {spotifyEpisodes.map(({ spotifyId }, index) => (
                          <div className="p-1" key={index}>
                            <SpotifyEmbed id={spotifyId} index={index} />
                          </div>
                        ))}
                      </div>

                      {/* Small Screens and Up: Two-column layout */}
                      <div className="hidden sm:flex gap-7">
                        {/* Left Column: Large Embed */}
                        <div className="w-1/2">
                          <SpotifyEmbed
                            id={spotifyEpisodes[0]?.spotifyId}
                            index={0}
                          />
                        </div>

                        {/* Right Column: Two Smaller Embeds */}
                        <div className="w-1/2 flex flex-col justify-center gap-7">
                          {spotifyEpisodes
                            .slice(1, 3)
                            .map(({ spotifyId }, index) => (
                              <SpotifyEmbed
                                key={index + 1}
                                id={spotifyId}
                                index={index + 1}
                              />
                            ))}
                        </div>
                      </div>
                    </section>
                  </>
                ) : (
                  <>
                    <div className="text-center text-gray-500">
                      Oops! It looks like there are no spotify podcasts
                      available yet. Stay tuned!
                    </div>
                  </>
                )}
              </>
            )}
          </section>
        </main>
        <BackToTop />

        <Footer />
      </section>
    </>
  );
};

export default Careers;
