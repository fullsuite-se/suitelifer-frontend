import React, { useEffect, useState, useRef } from "react";
import MobileNav from "../../components/home/MobileNav";
import TabletNav from "../../components/home/TabletNav";
import DesktopNav from "../../components/home/DesktopNav";
import api from "../../utils/axios";
import CoreValueCard from "../../components/about-us/CoreValueCard";
import maggie from "../../assets/images/maggie-cutout-circle.png";
import aboutBanner from "../../assets/images/about-banner.webp";
import aboutBannerShadow from "../../assets/images/in-action-about-us.png";
import theSuiteliferValues from "../../assets/images/the-suitelifer-values.webp";
import ourStoryText from "../../assets/images/our-story-text.webp";
import imgMission from "../../assets/images/imgMission.svg";
import imgVision from "../../assets/images/imgVision.svg";
import dotsLine from "../../assets/images/socials-dots-line.svg";
import Testimonials from "../../components/about-us/TestimonialSection";
import YouTubeEmbed from "../../components/home/YoutubeEmbed";
import BackToTop from "../../components/BackToTop";
import FocusedAthleteIcon from "../../assets/icons/FocusedAthleteIcon";
import TeamPlayerIcon from "../../assets/icons/TeamPlayerIcon";
import UnderstoodIcon from "../../assets/icons/UnderstoodIcon";
import WorkLifeHarmonyIcon from "../../assets/icons/WorkLifeHarmonyIcon";
import UpholdsIcon from "../../assets/icons/UpholdsIcon";
import PageMeta from "../../components/layout/PageMeta";
import Footer from "../../components/Footer";
import MissionVision from "../../components/about-us/MissionVision";
import TwoCirclesLoader from "../../assets/loaders/TwoCirclesLoader";

const AboutUs = () => {
  const [aboutContent, setAboutContent] = useState({});
  const [videoTitle, setVideoTitle] = useState("Thought it was over, but...");
  const [isLoading, setIsLoading] = useState(true);
  const contentRef = useRef(null);
  const [lineHeight, setLineHeight] = useState(0);

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/content/about");

      setAboutContent(response.data.aboutContent);
    } catch (error) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
    const observer = new ResizeObserver(() => {
      if (contentRef.current) {
        setLineHeight(contentRef.current.offsetHeight);
      }
    });

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => {
      observer.disconnect();
    };
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

      {isLoading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
          <div className="w-min">
            <TwoCirclesLoader
              bg="transparent"
              color1="#bfd1a0"
              color2="#0097b2"
              height={30}
              width={40}
            />
          </div>
        </div>
      ) : (
        <>
          <main className="lg:mt-20 overflow-hidden">
            <>
              <div className=" md:mt-100 lg:mt-30"></div>
              <div className="relative w-full flex justify-center h-[100%] items-end mt-20">
                <img
                  src={aboutBannerShadow}
                  alt="background banner"
                  className="filter grayscale absolute bottom-0 lg:bottom-30 xl:bottom-5 w-full lg:w-[80%]  h-full md:h-[900px] object-cover object-top opacity-100 lg:h-[500px] lg:right-0 xl:h-[840px] 
    [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.2),rgba(0,0,0,0))] [mask-size:100%_100%]"
                />

                <div className="relative z-10 flex flex-col items-center gap-30 lg:flex-row p-1 md:p-10 md:!pb-0 md:gap-5 lg:gap-10">
                  <p className="text-h3 md:text-3xl lg:text-3xl xl:text-5xl text-center font-avenir-black mb-4 lg:text-left px-2">
                    {aboutContent.textBanner ? (
                      aboutContent.textBanner.split(" ").map((word, index) => {
                        const match = word.match(/^(\W*)(\w+)(\W*)$/);
                        if (match) {
                          const [, leading, core, trailing] = match;
                          const isTarget = ["fullsuite", "suitelifer"].includes(
                            core.toLowerCase()
                          );

                          return (
                            <span key={index}>
                              {leading}
                              <span className={isTarget ? "text-primary" : ""}>
                                {core}
                              </span>
                              {trailing}{" "}
                            </span>
                          );
                        }

                        return <span key={index}>{word} </span>;
                      })
                    ) : (
                      <span>
                        Welcome to{" "}
                        <span className="text-primary">FullSuite</span>, where
                        passion meets limitless possibilities
                      </span>
                    )}
                  </p>
                  <img
                    src={aboutBanner}
                    alt="banner image"
                    className="w-auto max-h-[400px] p-1 md:max-h-[400px] lg:max-h-[450px] xl:max-h-[700px]"
                  />{" "}
                </div>
              </div>
            </>

            {/* <div className="mt-about-banner"></div> */}
            <div className="py-20 "></div>
            <div className="flex items-center justify-end mb-10">
              <div className="size-[1.3vh] bg-primary rounded-full"></div>
              <div className="w-[45%] h-[0.25vh] bg-primary"></div>
            </div>
            <div className="relative w-full h-auto flex flex-row px-10 md:px-20 lg:px-30 xl:px-50 items-start justify-start">
              <div
                className="flex flex-col items-center justify-between"
                style={{ height: lineHeight }}
              >
                <div className="size-[1.3vh] bg-primary rounded-full"></div>
                <div className="w-[0.25vh] flex-1 bg-primary"></div>
                <div className="size-[1.3vh] bg-primary rounded-full"></div>
              </div>

              <div
                ref={contentRef}
                className="relative pb-10 max-w-4xl mx-auto pl-10 md:pl-20  lg:pl-30 xl:py-30"
              >
                <div className="flex items-end gap-2 mb-6  pointer-events-none">
                  <img
                    src={ourStoryText}
                    alt="Story"
                    className="h-30 object-contain md:h-35 lg:h-40"
                  />
                </div>

                <div className="text-body text-gray-700 xl:leading-10">
                  <p>
                    FullSuite was originally founded by Maggie Po on October 8,
                    2014 as Offshore Concept Consulting, Inc. In 2018, the
                    founder acquired full ownership of the brand name, FullSuite
                    because it embodied the company vision to provide a
                    comprehensive suite of solutions for startups. Maggie,
                    alongside her co-founders, envisioned that instead of
                    piecemeal services, FullSuite will offer an end-to-end
                    approach that helps venture-backed startups handle critical
                    data operational functions—especially the ones their AI
                    systems can't yet automate.
                  </p>
                  <br />
                  <p>
                    In 2020, the legal entity was changed to Offshore Concept
                    BPO Services, Inc. to reflect in the name the more accurate
                    representation of its services. But, the brand name is still
                    in use which reflects the various suite of operations that
                    the company offers to help customers scale their businesses
                    efficiently.
                  </p>
                </div>
              </div>
            </div>
            <div className="px-10 md:px-20  lg:px-30 xl:px-50 mt-20 mb-5 md:mt-30  lg:mt-40">
              <p className="color-gray text-h4 font-avenir-black -mb-3">the</p>
              <p className="text-primary text-h2 font-avenir-black">
                suite<span className="text-black">lifer...</span>
              </p>
            </div>

            {/* Our Core Values Section */}
            <section className="overflow-hidden relative ">
              <div className="flex flex-col lg:flex-row lg:justify-center lg:mb-[7%] py-[5%] pb-[12%] md:pb-[4%] gap-6 lg:gap-10 text-base sm:text-lg md:text-xl">
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
                      <p className="text-body">
                        is a <br />
                        <b>team player</b>
                      </p>
                    }
                    youtubeUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
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
                      <p className="text-body">
                        is <br />
                        <b>understood</b>
                      </p>
                    }
                    youtubeUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  />
                </div>
                <div className="flex justify-center">
                  {/* 3 */}
                  <CoreValueCard
                    icon={
                      <FocusedAthleteIcon
                        color="group-hover:fill-white w-20 fill-primary size-40"
                        size={"45%"}
                      />
                    }
                    text={
                      <p className="text-body">
                        is a <br />
                        <b>focused athlete</b>
                      </p>
                    }
                    youtubeUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
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
                    text={<b className="text-body">upholds</b>}
                    youtubeUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  />
                  {/* 5 */}
                  <CoreValueCard
                    icon={
                      <WorkLifeHarmonyIcon
                        color="group-hover:fill-white w-20 fill-primary size-40"
                        size={"45%"}
                      />
                    }
                    text={
                      <b className="text-body">
                        values <br /> work/life harmony
                      </b>
                    }
                    youtubeUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  />
                </div>
              </div>
            </section>
            <div className="py-10"></div>
            <div className="flex justify-end scale-x-[-1] rotate-180 -mr-10">
              <img
                className="dots-line"
                src={dotsLine}
                alt="3 dots and a line"
              />
            </div>
            <div className="py-10"></div>
            {/* Mission Vision LASTLY: CHANGE LAYOUT FOR MOBILE. BREAKPOINT: 480px */}
            <MissionVision
              imgMission={imgMission}
              imgVision={imgVision}
              missionContent={aboutContent.mission}
              missionSlogan={aboutContent.missionSlogan}
              visionContent={aboutContent.vision}
              visionSlogan={aboutContent.visionSlogan}
            />
            {/* Message from the CEO */}
            <section className="my-[7%] relative bg-linear-to-tl from-[#6DB8A8] to-primary p-[7%] xl:p-[4%] md:px[10%] xl:px-[5%] xl:mx-[10%] rounded-tr-[12vw] lg:rounded-tr-[7vw] rounded-bl-[12vw] lg:rounded-bl-[7vw] xl:rounded-tl-xs xl:rounded-br-xs">
              <div className="flex px-[3%] flex-col md:flex-row items-center gap-10 xl:gap-20">
                <img
                  className="size-[50vw] max-w-[350px] max-h-[350px] object-cover shadow-2xl rounded-full"
                  src={maggie}
                  alt="circle cutout ceo image"
                />
                <div className="text-white text-center md:text-start">
                  <p className="text-small font-avenir-black text-secondary">
                    MESSAGE FROM THE CEO
                  </p>
                  <br />
                  {/* Title */}
                  <p className="text-h4 font-avenir-black">
                    Scaling Smarter, Growing Faster
                  </p>
                  <br />
                  {/* Quote */}
                  <p className="text-body -mt-4">
                    <i className="font-avenir-black indent-8">
                      At FullSuite, we are redefining how startups
                      scale—offering seamless, cost-efficient solutions to help
                      you grow with confidence.
                    </i>
                  </p>
                </div>
              </div>
              <div className="pt-[4%] px-[3%]">
                <p className="text-white text-body">
                  FullSuite was built to empower venture-backed startups with
                  the operational and financial expertise they need to scale
                  efficiently. Our team understands the challenges of rapid
                  growth, and we are committed to providing tailored, offshore
                  solutions that allow you to focus on innovation while we
                  handle the complexities of finance and operations.
                </p>
                <br />
                <p className="text-white text-body">
                  We take pride in being the trusted partner of some of the most
                  ambitious startups, ensuring they have the support and
                  infrastructure needed to thrive in a competitive market.
                  Whether you're looking to streamline processes or expand your
                  team without the burden of traditional staffing costs,
                  FullSuite is here to help you achieve your goals.
                </p>
              </div>
            </section>
            <div className="flex justify-end scale-x-[-1]">
              <img
                className="dots-line"
                src={dotsLine}
                alt="3 dots and a line"
              />
            </div>
            {/* Testimonials */}
            <section id="testimonials">
              <div className="flex justify-end scale-x-[-1]"></div>
              <Testimonials />
            </section>
            <div className="flex justify-end scale-x-[-1] rotate-180">
              <img
                className="dots-line"
                src={dotsLine}
                alt="3 dots and a line"
              />
            </div>
            <div className="py-5"></div>
            {/* A Day in the Pod */}
            <section className="mb-[2%] relative">
              <div className="day-in-the-pod">
                <div className="relative pt-[4%] flex flex-col items-end mr-5 xl:mr-60">
                  <div className="text-end pr-[7%] pt-[2%]">
                    <p className=" text-small text-primary font-avenir-black">
                      More about us
                    </p>
                    <p className="text-h4 font-avenir-black">
                      A Day in the Pod!
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-[80%] max-w-[1200px] pt-5 md:pt-20 mx-auto">
                <YouTubeEmbed embedUrl={aboutContent.dayInPodUrl} />
              </div>

              <section className="mt-10 md:mt-[5%] pb-[7%] lg:pb-[5%] px-[5%]">
                <div className="text-center pb-7">
                  <p className="text-h5 font-avenir-black">
                    Feel like you embody the
                    <span className="text-primary">SuiteLife</span>?
                  </p>
                  <p className="text-small text-gray-500">
                    Transform that feeling into your future. Discover your
                    opportunities with us.
                  </p>
                </div>
                {/* CTA */}
                <div className="flex justify-center">
                  <a
                    className="font-avenir-black transition-all duration-300 cursor-pointer hover:bg-[#007a8e] w-full max-w-[200px] rounded-2xl text-white text-center no-underline bg-primary p-3"
                    href="careers"
                  >
                    <button className="cursor-pointer text-small">
                      Explore our careers
                    </button>
                  </a>
                </div>
              </section>

              <div className="py-10 lg:p-0"></div>
            </section>
          </main>
          <BackToTop />

          <Footer />
        </>
      )}
    </section>
  );
};

export default AboutUs;
