import React, { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import MobileNav from "../../components/home/MobileNav";
import TabletNav from "../../components/home/TabletNav";
import DesktopNav from "../../components/home/DesktopNav";
import api from "../../utils/axios";
import CoreValueCard from "../../components/about-us/CoreValueCard";
import bgMaggieMobile from "../../assets/images/bg-mobile-chair-cutout.png";
import bgMaggieDesktop from "../../assets/images/bg-desktop-chair-cutout-2.png";
import imgMission from "../../assets/images/imgMission.svg";
import imgVision from "../../assets/images/imgVision.svg";
import imgMeeting from "../../assets/images/img-meeting.svg";
import dotsLine from "../../assets/images/socials-dots-line.svg";
import Testimonials from "../../components/about-us/TestimonialSection";
import FillerBoxes from "../../assets/images/about-filler-boxes.png";
import YouTubeEmbed from "../../components/home/YoutubeEmbed";
import largeBottomFiller from "../../assets/images/about-large-bottom-filler.svg";
import smallBottomFiller from "../../assets/images/about-small-bottom-filler.svg";

import { motion } from "framer-motion";
import BackToTop from "../../components/BackToTop";
import FocusedAthleteIcon from "../../assets/icons/FocusedAthleteIcon";
import TeamPlayerIcon from "../../assets/icons/TeamPlayerIcon";
import UnderstoodIcon from "../../assets/icons/UnderstoodIcon";
import WorkLifeHarmonyIcon from "../../assets/icons/WorkLifeHarmonyIcon";
import UpholdsIcon from "../../assets/icons/UpholdsIcon";
import PageMeta from "../../components/layout/PageMeta";
import FooterNew from "../../components/FooterNew";
import MissionVision from "../../components/about-us/MissionVision";
const AboutUs = () => {
  const [content, setContent] = useState({});
  const [videoTitle, setVideoTitle] = useState("Thought it was over, but...");

  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount((prev) => (prev < 6 ? prev + 1 : 0)); // Reset after animation
  };

  useEffect(() => {
    window.scroll(0, 0);
    const fetchContent = async () => {
      try {
        const response = await api.get("/api/get-about-us");
        console.log(response.data.data);

        setContent(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchContent();
  }, []);

  return (
    <section
      className="gap-4"
      style={{ maxWidth: "2000px", margin: "0 auto", padding: "0 0rem" }}
    >
      <PageMeta
        title="About Us - SuiteLifer"
        desc="A launchpad that transforms careers. We'll help you pave the way to your professional success."
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
      <div className="desktop-nav">
        <DesktopNav />
      </div>
      <main className="lg:mt-20">
        {/* Hero Section */}
        <section className="overflow-hidden about-container" id="our-story">
          <div className="h-56 w-72">
            <img
              // style={{ animation: "slideInFromLeft 0.8s ease-out forwards" }}
              className="w-full h-full object-cover rounded-r-3xl "
              src="https://images.unsplash.com/photo-1739382121445-19b3460a9e7a?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </div>
          <div className="about-text-banner flex flex-col mb-2">
            <h2 className="font-avenir-black px-5">{content.textBanner}</h2>

            {/* <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              className="h-10 w-20 lg:h-20 lg:w-32 rounded-l-2xl bg-primary ml-auto mb-2"
            /> */}
          </div>

          <div className="mx-5">
            <img
              className="w-full h-full object-cover rounded-3xl"
              src="https://images.unsplash.com/photo-1739382120576-b1434e8bc4d3?q=80&w=1975&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </div>
          <section className="flex flex-col gap-3 mt-5 mx-5 text-justify">
            <p className="text-primary text-center text-sm font-avenir-black">
              OUR STORY
            </p>
            {/* <h2 className="font-avenir-black lg:text-4xl! text-center m-0!">
              Lorem, ipsum dolor it
            </h2> */}
            <p className="text-sm md:text-base mb-5">
              FullSuite was originally founded by Maggie Po on October 8, 2014
              as Offshore Concept Consulting, Inc. In 2018, the founder acquired
              full ownership of the brand name, FullSuite because it embodied
              the company vision to provide a comprehensive suite of solutions
              for startups. Maggie, alongside her co-founders, envisioned that
              instead of piecemeal services, FullSuite will offer an end-to-end
              approach that helps venture-backed startups handle critical data
              operational functions—especially the ones their AI systems can’t
              yet automate.
            </p>
            <p className="text-sm md:text-base">
              In 2020, the legal entity was changed to Offshore Concept BPO
              Services, Inc. to reflect in the name the more accurate
              representation of its services. But, the brand name is still in
              use which reflects the various suite of operations that the
              company offers to help customers scale their businesses
              efficiently.
            </p>
          </section>
          <section>
            <div className="max-w-4xl h-72 my-4 lg:h-96 mx-5">
              <video
                className="w-full h-full rounded-xl object-cover aspect-video"
                controls
              >
                <source src="#" type="video/mp4" />
              </video>
            </div>
          </section>

          <section className="mx-8 flex flex-col justify-center text-justify">
            <p className="font-avenir-black py-3 !text-xl lg:!text-2xl">
              “{videoTitle}”
            </p>
            <p className="text-sm md:text-base">
              In this exclusive podcast interview, Maggie, the CEO of FullSuite
              Company, shares her journey of resilience and leadership in the
              competitive world of BPO. From navigating challenges to redefining
              success, she proves that every setback is just a setup for a
              greater comeback. Tune in for an inspiring conversation on
              perseverance, innovation, and the future of FullSuite.
            </p>
          </section>

          <section className="flex gap-2 py-7 mt-4 justify-end">
            <div className="h-2 w-2 lg:w-3 lg:h-3 rounded-full opacity-30 bg-primary"></div>
            <div className="h-2 w-2 lg:w-3 lg:h-3 rounded-full opacity-50 bg-primary"></div>
            <div className="h-2 w-2 lg:w-3 lg:h-3 rounded-full opacity-100 bg-primary"></div>
            <div
              className="w-32 lg:w-44 lg:h-3 rounded-l-xl h-2"
              style={{
                background:
                  "linear-gradient(90deg, rgba(0,151,178,1) 0%, rgba(0,151,178,0.7455357142857143) 50%, rgba(0,151,178,0.33657212885154064) 100%)",
              }}
            ></div>
          </section>
        </section>
        {/* Our Core Values Section */}
        <section className="overflow-hidden relative pt-5">
          <h2 className="font-avenir-black lg:text-4xl! text-center m-0!">
            The suitelifer...
          </h2>
          <div className="flex flex-col lg:flex-row lg:justify-center lg:mb-[7%] py-[5%] pb-[12%] md:pb-[4%] gap-6 lg:gap-10">
            <div className="flex justify-evenly lg:flex-none lg:gap-10">
              {/* 1 */}
              <CoreValueCard
                icon={
                  <TeamPlayerIcon
                    color="group-hover:fill-white w-20 fill-primary size-40"
                    size={"45%"}
                  />
                }
                text={
                  <p>
                    is a <br />
                    <b>team player</b>
                  </p>
                }
              />
              {/* 2 */}
              <CoreValueCard
                className={"lg:translate-y-[40%]"}
                icon={
                  <UnderstoodIcon
                    color="group-hover:fill-white w-20 fill-primary size-40"
                    size={"45%"}
                  />
                }
                text={
                  <p>
                    is <br />
                    <b>understood</b>
                  </p>
                }
              />
            </div>
            <div className="flex justify-center">
              {/* 3 */}
              <CoreValueCard
                icon={
                  // <CoreValue01
                  //   color="group-hover:fill-white w-20 fill-primary size-40"
                  //   size={"45%"}
                  // />
                  <FocusedAthleteIcon
                    color="group-hover:fill-white w-20 fill-primary size-40"
                    size={"45%"}
                  />
                }
                text={
                  <p>
                    is a <br />
                    <b>focused athlete</b>
                  </p>
                }
              />
            </div>
            <div className="flex justify-evenly lg:gap-10">
              {/* 4 */}
              <CoreValueCard
                className={"lg:translate-y-[40%]"}
                icon={
                  <UpholdsIcon
                    color="group-hover:fill-white w-20 fill-primary size-40"
                    size={"45%"}
                  />
                }
                text={<b>upholds</b>}
              />
              {/* 5 */}
              <CoreValueCard
                icon={
                  <WorkLifeHarmonyIcon
                    color="group-hover:fill-white w-20 fill-primary size-40"
                    size={"45%"}
                  />
                }
                text={<b>values work/life harmony</b>}
              />
            </div>
          </div>
        </section>
        <div className="py-10"></div>
        <div className="flex justify-end scale-x-[-1]">
          <img className="dots-line" src={dotsLine} alt="3 dots and a line" />
        </div>
        <div className="py-10"></div>
        {/* Mission Vision LASTLY: CHANGE LAYOUT FOR MOBILE. BREAKPOINT: 480px */}
        <MissionVision
          imgMission={imgMission}
          imgVision={imgVision}
          missionContent={content.mission}
          missionSlogan={content.missionSlogan}
          visionContent={content.vision}
          visionSlogan={content.visionSlogan}
        />

        {/* Message from the CEO */}
        <section className="relative" id="ceo-message">
          {/* Text overlay */}
          <article className="absolute text-end text-white -mt-10">
            <div className="container-ceo-message pt-[18%]  pr-[5%] md:pr-[5%]">
              <div className="flex justify-end">
                <p className="text-[12p] font-avenir-black text-secondary">
                  MESSAGE FROM THE CEO
                </p>
              </div>{" "}
              <br />
              <div className="flex justify-end">
                {/* Title */}
                <p className="title w-[60%] font-avenir-black">
                  Scaling Smarter, Growing Faster
                </p>
              </div>{" "}
              <br />
              {/* First paragraph bolded */}
              <div className="flex justify-end">
                {/* Title */}
                <p className="quote w-[50%] md:quote md:w-[55%]">
                  <i className="font-avenir-black indent-8">
                    At FullSuite, we are redefining how startups scale—offering
                    seamless, cost-efficient solutions to help you grow with
                    confidence.
                  </i>
                </p>
              </div>
              <p className=""></p> <br />
              <div className="flex justify-end">
                {/* Second paragraph */}
                <p className="w-1/2 md:w-[55%] indent-8">
                  FullSuite was built to empower venture-backed startups with
                  the operational and financial expertise they need to scale
                  efficiently. Our team understands the challenges of rapid
                  growth, and we are committed to providing tailored, offshore
                  solutions that allow you to focus on innovation while we
                  handle the complexities of finance and operations.
                </p>
              </div>{" "}
              <br />
              {/* Third paragraph */}
              <div className="flex justify-end">
                <p className="w-[48%] md:w-[55%] indent-8">
                  We take pride in being the trusted partner of some of the most
                  ambitious startups, ensuring they have the support and
                  infrastructure needed to thrive in a competitive market.
                  Whether you're looking to streamline processes or expand your
                  team without the burden of traditional staffing costs,
                  FullSuite is here to help you achieve your goals.
                </p>
              </div>
              <div className="flex justify-end">
                <p className="mt-2 md:mt-4 indent-8 text-[12px] md:text-[14px]  lg:text-[16px] font-avenir-roman-oblique">
                  ~ Maggie
                </p>
              </div>
            </div>
          </article>
          {/* Image background */}
          <div className="mt-20  md:-mt-20 md:mb-20">
            <img
              className="md:hidden h-full w-full"
              src={bgMaggieMobile}
              alt=""
            />
            <img
              className="hidden md:block h-full w-full"
              src={bgMaggieDesktop}
              alt=""
            />
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials">
          <div className="flex justify-end scale-x-[-1]">
            <img className="dots-line" src={dotsLine} alt="3 dots and a line" />
          </div>
          <Testimonials />
        </section>

        {/* A Day in the Pod */}
        <section className="mb-[2%] relative">
          <div className="day-in-the-pod">
            <div className="relative pt-[4%] flex flex-col items-end">
              <img className="w-1/2" src={dotsLine} alt="3 dots and a line" />
              <div className="text-end pr-[7%] pt-[2%]">
                <p className="more-about-us text-sm text-primary font-avenir-black">
                  More about us
                </p>
                <p className="title text-lg font-avenir-black">
                  A Day in the Pod!
                </p>
              </div>
            </div>
            {/* <div className="w-[45%]">
              <img
                className="object-cover"
                src={FillerBoxes}
                alt="filler boxes"
              />
            </div> */}
          </div>
          <div className="w-[80%] max-w-[1200px] pt-5 md:pt-20 mx-auto">
            <YouTubeEmbed videoId={"c6fs1gBpjQg"} />
          </div>
          <div className="absolute sm:hidden">
            <div className="w-[15vw] h-13 translate-y-3 -z-50 rounded-r-4xl bg-primary/5 "></div>
          </div>
          <div className="text-sm sm:text-lg mt-10 md:mt-[3%] xl: flex flex-col items-center mx-[10%]">
            <div className="mb-5">
              <p className="">
                Feel like you belong to{" "}
                <span className="font-avenir-black text-primary">
                  SuiteLife?
                </span>
              </p>
            </div>
            <a
              className="font-avenir-black transition-all duration-300 cursor-pointer hover:bg-[#007a8e] w-full max-w-[200px] rounded-2xl text-white text-center no-underline bg-primary p-3"
              href="careers"
            >
              <button className="cursor-pointer">Check our careers</button>
            </a>
          </div>
          <div className="py-20"></div>
          {/* <div className="mt-4 md:mt-0">
            <img
              className="md:hidden"
              src={smallBottomFiller}
              alt="bottom filler"
            />
            <img
              className="hidden md:block"
              src={largeBottomFiller}
              alt="bottom filler"
            />
          </div> */}
        </section>
        {/* <div className="h-100 grid place-content-center bg-amber-100 text-center p-5">
          <i>
            This height is but an illusion, a mere construct of perception,
            bound by the limits we choose to accept.
          </i>
        </div> */}
      </main>
      <BackToTop />

      <FooterNew />
    </section>
  );
};

export default AboutUs;
