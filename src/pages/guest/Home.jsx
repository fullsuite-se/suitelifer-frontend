import React from "react";
import banner_img from "../../assets/images/banner-img.svg";
import HeroSection from "../../components/home/HomeHeroSection";
import MobileNav from "../../components/home/MobileNav";
import TabletNav from "../../components/home/TabletNav";
import DesktopNav from "../../components/home/DesktopNav";

import kb_startup from "../../assets/images/keyboard-startup.svg";
import HomeGoalsOperations from "../../components/home/HomeGoalsOperations";
import HomeNews from "../../components/home/HomeNews";
import HomeBlogSpot from "../../components/home/HomeBlogSpot";
import { useEffect } from "react";
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
      <div className="lg:flex lg:flex-row-reverse hidden lg:hidden">
        {/* HERO SECTION */}
        <HeroSection />
        {/* BANNER SECTION */}
        <section className="flex pt-5 lg:w-2/5 ">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 1, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            whileInView={{
              scale: [1, 1.05, 1],
              transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            }}
            className="flex justify-end items-start ml-5 pb-3 lg:hidden overflow-hidden"
          >
            <img
              className="opacity-70 -z-10 rounded-l-4xl object-cover h-full w-full"
              src={banner_img}
              alt="Banner image"
            />
          </motion.div>
        </section>
      </div>
      {/* ADD-ON (SHOWS ON MOBILE & TABLET) */}
      <div className="relative lg:hidden overflow-hidden h-28 sm:h-34 hidden">
        <motion.img
          className="absolute w-[15vw] right-0 opacity-40 rounded-l-4xl object-cover"
          src={kb_startup}
          alt="A keyboard with a startup key"
          style={{
            height: "100%",
            transform: "translateX(70%)",
          }}
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <section className="h-[100dvh] relative lg:mt-17 mb-[10%]">
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
            </div>{" "}
            <div className="hidden">
              <span className="title-line-3">We can help.</span>
            </div>
          </div>
        </div>
        {/* Blue */}
        <div id="left-side" className="side pb-17 relative ">
          <div className="title relative">
            <div>
              <span className="title-line-1">We can help.</span>
            </div>
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
      {/* <div className="h-300 bg-red-900"></div> */}

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
            <video
              className="aspect-16/9 rounded-xl md:rounded-2xl lg:rounded-4xl object-cover"
              autoPlay
              loop
              muted
              controls
            >
              <source src={videoTemplate} type="video/mp4" />
            </video>
          </div>
        </MotionUp>
      </section>

      <section className="bg-primary pt-[15%] md:pt-[10%] lg:pt-[5%] mt-[20%] md:mt-[7%] my-[5%]">
        <MotionUp>
          <div className="text-center text-white px-7 xl:px-17">
            <p className="text-h4 font-avenir-black">
              Your Next <span className="text-secondary">Career</span> Starts
              Here
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
      {/* <div className="relative bg-primary py-10 mt-10 rounded-t-30!"> */}
      {/* SOCIALS SECTION */}
      {/* <HomeSocials /> */}
      {/* </div> */}
      <div className="h-10"></div>

      {/* HOME BLOG SPOT */}
      <div className="bg-primary rounded-2xl md:rounded-3xl mx-7 lg:mx-17">
        <HomeBlogSpot />
      </div>

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

      <BackToTop />

      <Footer />
    </section>
  );
};

export default Home;
