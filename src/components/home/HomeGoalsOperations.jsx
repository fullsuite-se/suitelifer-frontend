import desktopCutoutBgMarvin from "../../assets/images/desktop-bg-man-cutout-marvin.svg";
import desktopCutoutBgMaggie from "../../assets/images/desktop-bg-man-cutout-maggie.png";
import desktopBgMaggie from "../../assets/images/bg-maggie.png";
import desktopBgMarvinTwins from "../../assets/images/bg-marvin-twins.png";
import mobileCutoutBgMaggie from "../../assets/images/mobile-bg-man-cutout-maggie.png";
import mobileCutoutBgMaggieNew from "../../assets/images/mobile-bg-man-cutout-maggie-new.png";
import dataOp from "../../assets/images/data-op.svg";
import financeOp from "../../assets/images/finance-op.svg";
import adminOp from "../../assets/images/admin-op.svg";
import socialTitleDesktop from "../../assets/images/social-title-desktop.svg";
import { useState, useEffect } from "react";

const HomeGoalsOperations = () => {
  const operations = [
    {
      title: "Marketing Operations",
      image: financeOp,
      alt: "Marketing operations analyst",
    },
    { title: "Tech Support", image: adminOp, alt: "Tech support analyst" },
    {
      title: "Business Operations",
      image: dataOp,
      alt: "Data operations analyst",
    },
    {
      title: "Finance Operations",
      image: financeOp,
      alt: "Finance operations analyst",
    },
    {
      title: "Administrative Operations",
      image: adminOp,
      alt: "Administrative analyst",
    },
  ];

  return (
    <section className="relative -mt-[5%] mb-10 sm:mb-15 lg:mb-20 xl:mb-30 flex flex-col">
      <div className="block">
        {/* Background Image */}
        <div className="cutout-maggie mb-6">
          <img
            src={mobileCutoutBgMaggieNew}
            alt="cutout background"
            className="block -z-10 w-[100%] sm:hidden"
          />
          <img
            // src={desktopBgMarvinTwins}
            src={desktopBgMaggie}
            alt="cutout background"
            className="-z-10 w-[100%] hidden sm:block"
          />
        </div>
        {/* OPERATIONS */}
        <section className="flex flex-col sm:flex-row justify-center items-center md:flex-row gap-3 lg:gap-8 xl:gap-10 px-4 max-h-min">
          {operations.slice(-3).map((op, index) => (
            <div
              key={index}
              style={{}}
              className={`
                w-full 
                px-[10%] 
                sm:px-0 
                flex flex-col items-center
                ${index == 0 ? "sm:transform sm:-translate-y-[28%]" : ""}
                ${
                  index == 2 ? "admin-op sm:transform sm:-translate-y-[8%]" : ""
                }
                `}
            >
              <img
                className="rounded-4xl sm:rounded-3xl size-[80%] lg:size-[60%] object-cover aspect-[3/4]"
                src={op.image}
                alt={op.alt}
              />
              <p
                className={`op-title mt-3 md:mt-5 font-avenir-black text-center 
                    ${index === 2 ? "text-secondary" : "text-primary"}`}
              >
                {op.title}
              </p>
            </div>
          ))}
        </section>
      </div>

      {/* Texts overlay */}
      <div className="text-goal-container absolute pt-[25%] sm:pt-[14%] pl-[40%] sm:pl-[41%] pr-[5%] w-full z-10">
        <section className="text-goal min-h-[230px] text-end">
          <article className="text-white">
            <p className="indent-8">
              We are a <b>dynamic</b> and <b>inclusive</b> organization that
              serves as a <b className="text-secondary">launchpad</b> for
              individuals to climb the corporate ladder and achieve their full
              potential professionally. We provide <b>training</b>,{" "}
              <b>career exposure</b>, and <b>experience</b>, especially for
              fresh grads and those new to the work industry.{" "}
            </p>{" "}
            <br />
            <p>
              Join our community of achievers.
              <br /> Contact us to learn how we can help you shine.
            </p>{" "}
            <br />
          </article>
          {/* Add more texts/components as needed */}
          <a href="about-us" className="no-underline">
            <button className="txt-btn z-10 btn-light">Learn more</button>
          </a>
        </section>
      </div>
    </section>
  );
};

export default HomeGoalsOperations;
