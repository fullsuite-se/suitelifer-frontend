import React, { useState } from "react";
import Footer from "../../components/Footer";
import MobileNav from "../../components/home/MobileNav";
import TabletNav from "../../components/home/TabletNav";
import DesktopNav from "../../components/home/DesktopNav";
import congratsImg from "../../assets/images/congrats-app-form-illustration.jpg";
import fullsuitelogo from "../../assets/logos/logo-fs-full.svg";
import guestBlogsList from "../../components/guest-blogs/GuestBlogsList";
import GuestBlogLarge from "../../components/guest-blogs/GuestBlogLarge";
import AnimatedText from "../../components/guest-blogs/AnimatedText";
import GuestBlogTags from "../../components/guest-blogs/GuestBlogTags";
import GuestBlogCard from "../../components/guest-blogs/GuestBlogCard";
import loadingGif from "../../assets/gif/suitelifer-loading.gif";
import ArticleSearchResults from "../../components/news/SearchingBlogOrNews";
import BackButton from "../../components/BackButton";
import { DefaultStepper } from "../../components/careers/ApplicationFormStepper";
import FileUploadIcon from "../../assets/icons/file-upload";

const CongratsApplicationForm = () => {
  const [testLink, setTestLink] = useState(" www.testgorilla.com/assessment");


  return (
    <section
      className="gap-4 h-dvh"
      style={{ maxWidth: "1800px", margin: "0 auto" }}
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
      {/* <div  className="-z-50 absolute w-[90%] transform translate-y-5 -translate-x-10 lg:-translate-x-20 xl:-translate-x-50 opacity-10 text-9xl font-avenir-black text-primary"
         >APPLICATION FORM</div> */}
      {/* BLOGS HERO */}
      <section className="pt-[10%] xl:pt-[8%]">
        <main className="px-[5%]">
          <div className="md:px-5 lg:px-20 xl:px-50">
            <div className="flex flex-col items-center justify-center space-y-4 text-sm p-10 md:p-12 lg:p-15 xl:px-50 shadow-sm border-primary border-1 rounded-lg bg-white text-center">
              <img src={congratsImg} alt="Congratulations" className="w-24 md:w-35" />{" "}
              {/* Adjusted image width */}
              <p className="text-lg md:text-2xl lg:text-4xl font-avenir-black text-primary">
                Congratulations!
              </p>
              <div className="hidden lg:block"></div>
              <p className="text-gray-600 text-[12px] md:text-[14px] lg:text-base md:mb-7">
                You have successfully submitted your application. Now, click the
                link below to start your pre-assessment. It will take 1 hour and
                30 minutes or shorter depending on you.
              </p>
              <div className="hidden lg:block"></div>
              <p className="text-gray-600 text-[12px] md:text-[14px] lg:text-base">
                If you have no time now, you can take it later. Just open your
                email inbox and click the link we have sent you there. Hope the
                best for your initial test! Fighting!!
              </p>
              <a className="md:text-lg font-avenir-black text-primary ">
               {testLink}
              </a>
              <div className="hidden lg:block"></div>
              
              <p className="text-gray-400 text-[12px] md:text-[14px] lg:text-base mb-2 mt-10">from</p>
              <img src={fullsuitelogo} alt="fullsuite logo" className="h-5" />
            </div>
          </div>
        </main>
      </section>

      <div className="h-30"></div>
    </section>
  );
};

export default CongratsApplicationForm;
