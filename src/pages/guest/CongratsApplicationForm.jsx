import React from "react";

import MobileNav from "../../components/home/MobileNav";
import TabletNav from "../../components/home/TabletNav";
import DesktopNav from "../../components/home/DesktopNav";
import congratsImg from "../../assets/images/congrats-app-form-illustration.jpg";
import fullsuitelogo from "../../assets/logos/logo-fs-full.svg";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from '../../components/Footer';

const CongratsApplicationForm = () => {
  const location = useLocation();
  const assessmentUrl = location.state?.assessmentUrl;

  const navigate = useNavigate();

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
      {/* BLOGS HERO */}
      <section className="pt-[10%] xl:pt-[8%]">
        <main className="px-[5%]">
          <div className="md:px-5 lg:px-20 xl:px-50">
            <div className="flex flex-col items-center justify-center space-y-4 text-sm p-10 md:p-12 lg:p-15 xl:px-50 shadow-sm border-primary border-1 rounded-lg bg-white text-center">
              <img
                src={congratsImg}
                alt="Congratulations"
                className="w-24 md:w-35"
              />{" "}
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
              <a
                href={assessmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="md:text-lg font-avenir-black text-primary "
              >
                {assessmentUrl}
              </a>
              <div className="hidden lg:block"></div>
              <p className="text-gray-400 text-[12px] md:text-[14px] lg:text-base mb-2 mt-10">
                from
              </p>
              <img src={fullsuitelogo} alt="fullsuite logo" className="h-5" />
            </div>
          </div>
        </main>
      </section>

      <div className="grid place-content-center">
        <button
          className="group relative px-6 py-2 mt-5 text-primary text-md font-medium rounded-full overflow-hidden lg:w-40 xl:w-50 xl:text-lg transition-all duration-100 cursor-pointer"
          onClick={() => navigate("/careers")}
        >
          <div className="absolute inset-0 bg-primary opacity-10 rounded-full transition-all duration-100 group-hover:opacity-100"></div>
          <span className="relative group-hover:!text-white">
            Back to Careers
          </span>
        </button>
      </div>

      <div className="h-30"></div>

      <Footer />
    </section>
  );
};

export default CongratsApplicationForm;
