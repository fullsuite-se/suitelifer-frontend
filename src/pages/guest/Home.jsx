import React from "react";
import fs_tagline from "../../assets/logos/logo-fs-tagline.svg";
import banner_img from "../../assets/images/banner-img.svg";
import HeroSection from "../../components/home/HomeHeroSection";
import MobileNav from "../../components/home/MobileNav";
import TabletNav from "../../components/home/TabletNav";
import DesktopNav from "../../components/home/DesktopNav";
import Footer from "../../components/Footer";
import desktopCutoutBg from "../../assets/images/desktop-bg-man-cutout.svg";
import kb_startup from "../../assets/images/keyboard-startup.svg";
import dataOp from '../../assets/images/data-op.svg';
import financeOp from '../../assets/images/finance-op.svg';
import adminOp from '../../assets/images/admin-op.svg';
import { useState, useEffect } from "react";
import { data } from "react-router-dom";

const Home = () => {
  const [width, setWidth] = useState(window.innerWidth); //FOR DEBUGGING

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      <div className="lg:flex lg:flex-row-reverse ">
        {/* HERO SECTION */}
        <HeroSection />
        {/* BANNER SECTION */}
        <section className="flex pt-5 lg:w-2/5 ">
          <div className="banner ml-[9%] flex items-center">
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
          </div>
          {/* Column 2 */}
          <div className="flex justify-end items-start ml-5 pb-3 lg:hidden">
            <img
              className="opacity-70 -z-10 rounded-l-4xl object-cover h-full w-full"
              src={banner_img}
              alt="Banner image"
            />
          </div>
        </section>
      </div>
      {/* ADD-ON (SHOWS ON MOBILE & TABLET) */}
      <div className="w-full relative lg:hidden overflow-hidden h-28 sm:h-48">
        <img
          className="absolute right-0 opacity-40 rounded-l-4xl object-cover"
          src={kb_startup}
          alt="A keyboard with a startup key"
          style={{
            height: "100%",
            transform: "translateX(70%)",
          }}
        />
      </div>
      {/* GOAL AND OPERATIONS */}
      <section className="relative -top-12 sm:-top-16 md:-top-25 lg:-top-30 w-full h-full">
        {/* Background Image */}
        <img
          src={desktopCutoutBg}
          alt="cutout background"
          className="absolute inset-0 -z-10 "
        />

        {/* Texts overlay */}
        <div className="relative z-0">
          <section className="home-intro-texts">
            <p className="text-white">
              At <span className="font-avenir-black relative">Fullsuite</span>, our goal
              is to make you{" "}
              <span className="font-avenir-black text-secondary">
                shine like a star
              </span>
              . We are an avenue for dreamers like you who wish to gain{" "}
              <span className="font-avenir-black">skills</span>, expand their{" "}
              <span className="font-avenir-black">knowledge</span>, and
              contribute to <span className="font-avenir-black">growing</span>{" "}
              businesses.
            </p>{" "}
            <br />
            <p className="text-white">
              If you believe that you've got what it takes, learn more about us
              here.
            </p>
            {/* Add more texts/components as needed */}
            <button className="z-10 btn-light mt-2 sm:mt-4 md:mt-6 lg:mt-8 sm:text-md! md:text-md! lg:text-2xl!">
              Learn more
            </button>
          </section>
        </div>
        {/* OPERATIONS */}
        <section className="operations flex justify-center items-center md:flex-row gap-5 lg:gap-8 xl:gap-10 px-4 max-h-min">
          <div className="data-op w-full flex flex-col items-center">
            <img className="rounded-4xl w-full h-full object-cover aspect-[3/4]" src={dataOp} alt="Data operations analyst" />
            <p className="mt-3 md:mt-5 font-avenir-black text-primary text-xl md:text-2xl lg:text-3xl text-center">Data Operations</p>
          </div>
          <div className="w-full flex flex-col items-center">
            <img className="rounded-4xl w-full h-full object-cover aspect-[3/4]" src={financeOp} alt="Finance operations analyst" />
            <p className="mt-3 md:mt-5 font-avenir-black text-primary text-xl md:text-2xl lg:text-3xl text-center">Finance Operations</p>
          </div>
          <div className="admin-op w-full flex flex-col items-center">
            <img className="rounded-4xl w-full h-full object-cover aspect-[3/4]" src={adminOp} alt="Administrative analyst" />
            <p className="mt-3 md:mt-5 font-avenir-black text-secondary text-xl md:text-2xl lg:text-3xl text-center">Administrative Operations</p>
          </div>
        </section>
      </section>
        <div>WIDTH: {width}</div>
      {/* <div className="h-40"></div> */}
      <Footer />
    </>
  );
};

export default Home;
