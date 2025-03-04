import desktopCutoutBgMarvin from "../../assets/images/desktop-bg-man-cutout-marvin.svg";
import desktopCutoutBgMaggie from "../../assets/images/desktop-bg-man-cutout-maggie.svg";
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
    { title: "Business Operations", image: dataOp, alt: "Data operations analyst" },
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
    <section className="-mt-[5%] md:-mt-[10%] mb-10 sm:mb-15 lg:mb-20 xl:mb-30 flex flex-col">
      <div className="block">
        {/* Background Image */}
        <div className="cutout-maggie mb-6">
          <img
            src={mobileCutoutBgMaggieNew}
            alt="cutout background"
            className="block -z-10 w-[100%] sm:hidden"
          />
          <img
            src={desktopCutoutBgMaggie}
            alt="cutout background"
            className="-z-10 w-[100%] hidden sm:block"
          />
        </div>
        {/* OPERATIONS */}
        <section className="flex flex-col sm:flex-row justify-center items-center md:flex-row gap-5 lg:gap-8 xl:gap-10 px-4 max-h-min">
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
                ${index == 2 ? "admin-op sm:transform sm:-translate-y-[8%]" : ""}
                `}
            >
              <img
                className="rounded-4xl sm:rounded-3xl size-[80%] object-cover aspect-[3/4]"
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
      <div className="text-goal-container absolute pt-[30%] pl-[40%] pr-[5%] w-full z-10">
        <section className="text-goal min-h-[230px] text-end">
          <p className="text-white">
            At <span className="font-avenir-black">Fullsuite</span>, our goal is
            to make you{" "}
            <span className="font-avenir-black text-secondary">
              shine like a star
            </span>
            . We are an avenue for dreamers like you who wish to gain{" "}
            <span className="font-avenir-black">skills</span>, expand their{" "}
            <span className="font-avenir-black">knowledge</span>, and contribute
            to <span className="font-avenir-black">growing</span> businesses.
          </p>{" "}
          <br />
          <p className="text-white">
            If you believe that you've got what it takes, learn more about us
            here.
          </p>
          {/* Add more texts/components as needed */}
          <button className="txt-btn z-10 btn-light mt-3 sm:mt-4 md:mt-6 lg:mt-8 ">
            Learn more
          </button>
        </section>
      </div>
    </section>
  );
};

export default HomeGoalsOperations;
