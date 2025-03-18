import React from "react";
import fs_tagline from "../../assets/logos/logo-fs-tagline.svg";
import banner_img from "../../assets/images/banner-img.svg";
import HeroSection from "../../components/home/HomeHeroSection";
import MobileNav from "../../components/home/MobileNav";
import TabletNav from "../../components/home/TabletNav";
import DesktopNav from "../../components/home/DesktopNav";
import Footer from "../../components/Footer";
import kb_startup from "../../assets/images/keyboard-startup.svg";
import HomeGoalsOperations from "../../components/home/HomeGoalsOperations";
import HomeNews from "../../components/home/HomeNews";
import HomeSocials from "../../components/home/HomeSocials";
import HomeBlogSpot from "../../components/home/HomeBlogSpot";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BackToTop from "../../components/BackToTop";

const Home = () => {
  const [width, setWidth] = useState(window.innerWidth); //FOR DEBUGGING
  window.scroll(0, 0);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [width]);

  return (
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
      <div className="lg:flex lg:flex-row-reverse ">
        {/* HERO SECTION */}
        <HeroSection />
        {/* BANNER SECTION */}
        <section className="flex pt-5 lg:w-2/5 ">
          {/* <div className="banner ml-[9%] flex items-center">
            <div>
              <p className="text-primary text-lg md:text-3xl lg:text-3xl! ">
                Welcome to
              </p>
              <div className="pb-5">
                <img
                  className="w-full h-full object-contain"
                  src={fs_tagline}
                  alt="Fullsuite tagline"
                />
              </div>
              <button className="btn-primary text-sm sm:text-xl md:text-2xl">
                Learn more
              </button>
            </div>
          </div> */}
          {/* with animations eto */}
          <div className="banner ml-[9%] flex items-center overflow-hidden">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-primary font-sansita- text-lg md:text-3xl lg:text-3xl"
              >
                Welcome to
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                className="pb-5"
              >
                <img
                  className="w-full h-full object-contain"
                  src={fs_tagline}
                  alt="Fullsuite tagline"
                />
              </motion.div>

              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3, ease: "easeOut" }}
                className="btn-primary text-sm sm:text-xl md:text-2xl"
              >
                Learn more
              </motion.button>
            </div>
          </div>
          {/* Column 2 */}
          {/* <div className="flex justify-end items-start ml-5 pb-3 lg:hidden">
            <img
              className="opacity-70 -z-10 rounded-l-4xl object-cover h-full w-full"
              src={banner_img}
              alt="Banner image"
            />
          </div> */}

          {/* with animations naman ito */}
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
      {/* <div className="w-full relative lg:hidden overflow-hidden h-28 sm:h-48">
        <img
          className="absolute right-0 opacity-40 rounded-l-4xl object-cover"
          src={kb_startup}
          alt="A keyboard with a startup key"
          style={{
            height: "100%",
            transform: "translateX(70%)",
          }}
        />
      </div> */}

      {/* may animations */}
      <div className="w-full relative lg:hidden overflow-hidden h-28 sm:h-48">
        <motion.img
          className="absolute -right-33 opacity-40 rounded-l-4xl object-cover"
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

      {/* GOAL AND OPERATIONS */}
      <HomeGoalsOperations />
      {/* <div className="h-300 bg-red-900"></div> */}
      {/* NEWS SECTION */}
      <HomeNews />

      {/* SOCIALS SECTION */}
      <HomeSocials />

      <div className="h-10"></div>

      {/* HOME BLOG SPOT */}
      <HomeBlogSpot />

      {/* FOR DEBUGGING ONLY */}
      {/* <div className="bg-red-900 h-50 text-white grid place-items-center">WIDTH: {width}</div> */}
      {/* <div className="h-40"></div> */}
      <BackToTop/>
      <Footer />
    </section>
  );
};

export default Home;
