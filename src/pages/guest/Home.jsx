import React from "react";
import fs_tagline from "../../assets/logos/logo-fs-tagline.svg";
import banner_img from "../../assets/images/banner-img.svg";
import HeroSection from "../../components/HomeHeroSection";
import MobileNav from "../../components/MobileNav";
import TabletNav from "../../components/TabletNav";
import DesktopNav from "../../components/DesktopNav";
import Footer from "../../components/Footer";

const Home = () => {
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
      <div className="lg:flex lg:flex-row-reverse">
        {/* HERO SECTION */}
        <HeroSection/>
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
      <div className="h-svw ani"></div>
      <Footer />
    </>
  );
};

export default Home;
