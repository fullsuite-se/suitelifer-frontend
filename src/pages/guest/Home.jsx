import React, { useState, useEffect } from "react";
import banner_img from "../../assets/images/banner-img.svg";
import HeroSection from "../../components/home/HomeHeroSection";
import MobileNav from "../../components/home/MobileNav";
import TabletNav from "../../components/home/TabletNav";
import DesktopNav from "../../components/home/DesktopNav";

import kb_startup from "../../assets/images/keyboard-startup.svg";
import HomeGoalsOperations from "../../components/home/HomeGoalsOperations";
import HomeNews from "../../components/home/HomeNews";
import HomeBlogSpot from "../../components/home/HomeBlogSpot";
import { motion } from "framer-motion";
import BackToTop from "../../components/BackToTop";
import PageMeta from "../../components/layout/PageMeta";
import Footer from "../../components/Footer";
import CareerCarousel from "../../components/home/CareerCarousel";
import videoTemplate from "../../assets/videos/video-template.mp4";
import Spotify from "../../assets/logos/Spotify";
import MotionUp from "../../components/MotionUp";
import FacebookIcon from "../../assets/logos/Facebook";
import InstagramIcon from "../../assets/logos/Instagram";
import YoutubeIcon from "../../assets/logos/Youtube";
import SpotifyIcon from "../../assets/logos/Spotify";
import LinkedlnIcon from "../../assets/logos/Linkedln";
import YouTubeEmbed from "../../components/home/YoutubeEmbed";
import api from "../../utils/axios";

const Home = () => {
  const socmedPlatforms = [
    {
      href: "https://www.facebook.com/thefullsuitepod",
      icon: FacebookIcon,
      text: "the FullSuite Pod",
    },
    {
      href: "https://www.instagram.com/thefullsuitepod/",
      icon: InstagramIcon,
      text: "@thefullsuitepod",
    },
    {
      href: "https://www.linkedin.com/company/fullsuite",
      icon: LinkedlnIcon,
      text: "@thefullsuitepod",
    },
    {
      href: "https://open.spotify.com/",
      icon: SpotifyIcon,
      text: "the Suite Spot",
    },
    {
      href: "https://www.youtube.com/",
      icon: YoutubeIcon,
      text: "the Suite Tube",
    },
  ];

  useEffect(() => {
    const left = document.getElementById("left-side");
    if (!left) return;

    const transitionToBlue = () => {
      left.style.transition = "width 1s ease-in-out";
      left.style.width = "100%";

      setTimeout(() => {
        left.style.transition = "width 1s ease-in-out";
        left.style.width = "0%";
      }, 10000);
    };

    setTimeout(transitionToBlue, 3000);

    const interval = setInterval(transitionToBlue, 13000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const [homeContent, setHomeContent] = useState({
    kickstartVideo: "",
  });

  const fetchHomeContent = async () => {
    const response = await api.get("/api/content/home");

    setHomeContent(response.data.homeContent);
  };

  useEffect(() => {
    fetchHomeContent();
  }, []);

  return (
    <section
      className="gap-4 overflow-hidden"
      style={{ maxWidth: "2000px", margin: "0 auto", padding: "0 0rem" }}
    >
      <PageMeta
        title="Home | Empowering Careers & Opportunities - SuiteLifer"
        desc="Discover career opportunities, company insights, and the latest updates at FullSuite. Your journey to success starts here."
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
      <section className="h-[100vh] relative lg:mt-17 mb-[10%]">
        {/* White */}
        <div id="right-side" className="side pb-17">
          <div className="title">
            <div className="">
              <span className="title-line-1">Do you feel like your</span> <br />{" "}
              <br />
            </div>
            <div className="animate-fadeInUp">
              <span className="title-line-2">
                <span className="text-black">Career is going</span>{" "}
                <span className="nowhere">nowhere?</span>
              </span>
            </div>
          </div>
        </div>
        {/* Blue */}
        <div id="left-side" className="side pb-17 relative ">
          <div className="title relative">
            <div>
              <span className="title-line-1">We can help.</span>
            </div> <br />
            <div>
              <span className="title-line-2">
                <span className="text-white">Let's get you on the</span> <br />
                <span className="text-black">right track.</span>
              </span>
            </div>
            <div className="hidden">
              <span className="title-line-3">Join us!</span>
            </div>
          </div>
        </div>
      </section>

      {/* GOAL AND OPERATIONS */}
      <HomeGoalsOperations />

      <section className="px-5 xl:px-17 pb-[5%]">
        <MotionUp>
          <div className="text-center pb-7">
            <p className="text-h4 font-avenir-black">
              <span className="text-primary">Kickstart</span> Your Career With
              Us!
            </p>
            <p className="text-small text-gray-500">
              Watch the video below to see what makes us the perfect place to
              grow your career!
            </p>
          </div>
        </MotionUp>
        <MotionUp>
          <div className="flex justify-center">
            <div className="w-[95%] max-w-[1200px] mx-auto">
              <YouTubeEmbed embedUrl={homeContent?.kickstartVideo} />
            </div>
          </div>
        </MotionUp>
      </section>

      <section className="bg-primary pt-[15%] md:pt-[10%] lg:pt-[5%] mt-[20%] md:mt-[7%] my-[5%]">
        <MotionUp>
          <div className="text-center text-white px-7 xl:px-17">
            <p className="text-h4 font-avenir-black">
            Take the <span className="text-secondary">next step</span> in your career journey here
            </p>
            <p className="text-small">
              Explore diverse industries and career paths—find the perfect fit
              for your future!
            </p>
          </div>
        </MotionUp>
        <br />
        <MotionUp>
          <CareerCarousel />
        </MotionUp>
      </section>

      {/* NEWS SECTION */}
      <HomeNews />

      <div className="h-10"></div>
      <div className="flex items-center justify-end pl-7 xl:pl-40">
        <div className="size-[1vh] bg-primary rounded-full"></div>
        <div className="w-full  h-[0.25vh] bg-primary"></div>
      </div>
      <div className="h-10"></div>

      <section className="relative py-15 md:py-[5%] px-7 ">
        <MotionUp>
          <div className="text-center pb-7">
            <p className="text-h4 font-avenir-black">
              <span className="text-primary">Follow</span> our Socials
            </p>
            <p className="text-small text-gray-500">
              Join the conversation and never miss an update!
            </p>
          </div>
        </MotionUp>
        <div className="flex justify-center gap-7 md:gap-15 mt-5">
          <a
            href={socmedPlatforms[0].href}
            title={socmedPlatforms[0].href}
            target="_blank"
            rel="noopener noreferrer"
            className="group no-underline group-hover:text-secondary cursor-pointer"
          >
            <MotionUp className="flex items-center gap-2">
              <FacebookIcon
                color="duration-500 group-hover:fill-secondary fill-primary"
                height="40"
                width="40"
              />
            </MotionUp>
          </a>
          <a
            href={socmedPlatforms[1].href}
            title={socmedPlatforms[1].href}
            target="_blank"
            rel="noopener noreferrer"
            className="group no-underline group-hover:text-secondary cursor-pointer"
          >
            <MotionUp className="flex items-center gap-2">
              <InstagramIcon
                color="duration-500 group-hover:fill-secondary fill-primary"
                height="40"
                width="40"
              />
            </MotionUp>
          </a>
          <a
            href={socmedPlatforms[2].href}
            title={socmedPlatforms[2].href}
            target="_blank"
            rel="noopener noreferrer"
            className="group no-underline group-hover:text-secondary cursor-pointer"
          >
            <MotionUp className="flex items-center gap-2">
              <LinkedlnIcon
                color="duration-500 group-hover:fill-secondary fill-primary"
                height="40"
                width="40"
              />
            </MotionUp>
          </a>
          <a
            href={socmedPlatforms[3].href}
            title={socmedPlatforms[3].href}
            target="_blank"
            rel="noopener noreferrer"
            className="group no-underline group-hover:text-secondary cursor-pointer"
          >
            <MotionUp className="flex items-center gap-2">
              <Spotify
                color="duration-500 group-hover:fill-secondary fill-primary"
                height="40"
                width="40"
              />
            </MotionUp>
          </a>{" "}
          <a
            href={socmedPlatforms[4].href}
            title={socmedPlatforms[4].href}
            target="_blank"
            rel="noopener noreferrer"
            className="group no-underline group-hover:text-secondary cursor-pointer"
          >
            <MotionUp className="flex items-center gap-2">
              <YoutubeIcon
                color="duration-500 group-hover:fill-secondary fill-primary"
                height="40"
                width="40"
              />
            </MotionUp>
          </a>
        </div>
      </section>
      <div className="h-10"></div>

      <BackToTop />

      <Footer />
    </section>
  );
};

export default Home;
