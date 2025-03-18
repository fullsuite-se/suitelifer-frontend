import React, { useEffect, useState } from "react";
import MobileNav from "../../components/home/MobileNav";
import TabletNav from "../../components/home/TabletNav";
import DesktopNav from "../../components/home/DesktopNav";
import JobCarousel from "../../components/careers/JobCarousel";
import Footer from "../../components/Footer";
import SpotifyEmbed from "../../components/careers/SpotifyEmbed";
import api from "../../utils/axios";
import JobCarouselVersion2 from "../../components/careers/JobCarouselVersion2";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import GuestIndustryTags from "../../components/careers/GuestIndustriesTags";
import dotsLine from "../../assets/images/socials-dots-line.svg";
import bgPodcast from "../../assets/images/bg-career-podcast.svg";
import bgHero from "../../assets/images/bg-hero-careers.svg";
import bgHeroTablet from "../../assets/images/bg-tablet-careers.svg";
import BackToTop from "../../components/BackToTop";
import BackButton from "../../components/BackButton";
import GuestBlogTags from "../../components/guest-blogs/GuestBlogTags";
import { NavLink } from "react-router-dom";
import { toSlug } from "../../utils/slugUrl";

const CareersAll = () => {
  const [spotifyEpisodes, setEpisodes] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const response = await api.get("/api/latest-three-episodes");
        setEpisodes(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchEpisodes();

    const fetchJobs = async () => {
      try {
        const response = await api.get("/api/all-jobs");

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
        <main className="">
          {/* 
          landscape:https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c3RhcnR1cHxlbnwwfHwwfHx8MA%3D%3D
          // https://images.unsplash.com/photo-1554780336-390462301acf?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
          portrait: https://images.unsplash.com/photo-1554780336-390462301acf?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
          */}

          <section>
            <div className="relative -z-50 lg:block hidden w-full">
              <img className="absolute" src={bgHero} alt="" />
            </div>
            {/* For mobile bg */}
            <section className=" relative lg:hidden">
              {/* blue at top */}
              <div className="">
                <div className="absolute right-10 overflow-hidden -translate-x-10 sm:-translate-x-20 -translate-y-[23vw] z-50 w-[14%] h-[35vw] bg-primary/5 rounded-b-4xl"></div>
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
              <div className="">
                <div className="w-[15%] h-[35vw] rounded-r-3xl translate-y-[80vw]  absolute overflow-hidden -z-50  bg-primary/10 "></div>
              </div>
            </section>
          </section>

          <section className="pb-[7%] lg:pb-[5%]">
            <main className="p-[10%]">
              {" "}
              <div className="mb-2">
                <BackButton backPath={"/careers"} type={"Careers"} />
              </div>
              <p className="text-lg font-avenir-black mb-5  lg:mb-10 lg:text-3xl">
                All Jobs here at FullSuite
              </p>
              <div className="mb-10">
                <GuestIndustryTags />
              </div>
              {jobs.map((job, index) => (
                <NavLink
                  key={index}
                  to={`/careers/${toSlug(job.jobTitle)}`}
                  state={{ jobId: job.jobId }}
                  className={`group no-underline`}
                >
                  <div className="group p-6 bg-white group-hover:bg-primary shadow-md rounded-lg transition-transform duration-300 hover:shadow-xl flex flex-col gap-3 relative mb-5">
                    <div className="absolute top-4 right-4 text-primary text-xl cursor-pointer group-hover:text-white">
                      &#8599;
                    </div>

                    <p
                      className={`mt-3 -mb-2 font-avenir-black text-gray-900 group-hover:text-white `}
                    >
                      {job.jobTitle}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-gray-400 uppercase group-hover:text-white group-hover:opacity-50">
                      <span className="text-secondary font-avenir-black">
                        |
                      </span>
                      <span>{job.industryName}</span>
                      {job.isOpen === 0 || job.isOpen === false ? (
                        <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-xl">
                          CLOSED
                        </span>
                      ) : null}
                    </div>

                    <span className="text-primary font-avenir-black text-sm group-hover:text-white">
                      {job.employmentType}, {job.setupName}
                    </span>
                    {job.salaryMin && (
                      <>
                        <p className="text-sm text-gray-400 -mb-3 group-hover:text-white group-hover:opacity-50">
                          Expected Salary
                        </p>
                        <p className="text-md font-avenir-black text-primary group-hover:text-white">
                          {Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "PHP",
                            maximumFractionDigits: 0,
                          }).format(job.salaryMin)}
                        </p>
                      </>
                    )}
                    <p className="text-gray-700 text-sm line-clamp-5 group-hover:text-white">
                      {job.description}
                    </p>
                  </div>
                </NavLink>
              ))}
            </main>
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

          <div className="relative hidden sm:block">
            <div className="absolute -translate-y-30 -z-50 w-[15%] h-25 bg-primary/10 rounded-r-4xl"></div>
          </div>
        </main>
        <BackToTop />
        {/* <Footer /> */}
      </section>
    </>
  );
};

export default CareersAll;
