import dotsLine from "../../assets/images/socials-dots-line.svg";
import socialTitleDesktop from "../../assets/images/social-title-desktop.svg";
import socialTitleMobile from "../../assets/images/social-title-mobile.svg";
import YouTubeEmbed from "../../components/home/YoutubeEmbed";
import SingleSpotifyEmbed from "../../components/home/SingleSpotifyEmbed";
import FacebookPostEmbed from "./FacebookEmbed";
import InstagramEmbed from "./InstagramEmbed";
import FacebookIcon from "../../assets/logos/Facebook";
import InstagramIcon from "../../assets/logos/Instagram";
import YoutubeIcon from "../../assets/logos/Youtube";
import SpotifyIcon from "../../assets/logos/Spotify";
import SocialButton from "./SocialButton";
import { motion } from "framer-motion";
import MotionUp from "../MotionUp";
import React from "react";

const videoId = ["1BsbVedEnwM"];

const spotifyId = [
  "2xwUR7I55qd8t8GOA2knvq",
  "54Dumwl83cHf0Mer6QMffn",
  "0ccRsDmuWXrvECqs8mL1Rc",
];

const facebookId = [
  "pfbid02vZtgYPLkXDKbVmWL9FcPLahi4dWGYSevS77we5KETiVa4nup94u35Ayo5eWRCJGYl",
  "pfbid025Lp3t3Jg9ofs6puEjFMRNXj4momadqtXEzzuiLJeXtYoDqUqWDvyc32jADz4D2nal",
];

const instagramId = ["DGJvd8pPZGn"];

const socmedPlatforms = [
  {
    href: "https://www.youtube.com/",
    icon: YoutubeIcon,
    text: "the Suite Tube",
    delay: 0.2,
  },
  {
    href: "https://open.spotify.com/",
    icon: SpotifyIcon,
    text: "the Suite Spot",
    delay: 0.1,
  },
  {
    href: "https://www.facebook.com/thefullsuitepod",
    icon: FacebookIcon,
    text: "the FullSuite Pod",
    delay: 0.3,
  },
  {
    href: "https://www.instagram.com/thefullsuitepod/",
    icon: InstagramIcon,
    text: "@thefullsuitepod",
    delay: 0.4,
  },
];

const HomeSocials = () => {
  return (
    <section>
      {/* HEADING */}
      <MotionUp className="pt-10 xl:pt-25 pb-[32%] sm:pb-[22%] sm:pt-20">
        <div className="relative">
          {/* Animated Background Title */}
          <MotionUp
            className="absolute z-10 transform -translate-y-2/5 -translate-x-[-15%] sm:hidden w-60"
            scale={0.9}
          >
            <img src={socialTitleDesktop} alt="Socials Heading Title" />
          </MotionUp>

          <MotionUp
            className="absolute z-10 transform md:-translate-y-[60%] lg:-translate-y-[30%] -translate-x-[-15%] w-[30%] hidden sm:block"
            scale={0.9}
          >
            <img src={socialTitleDesktop} alt="Socials Heading Title" />
          </MotionUp>
        </div>

        {/* Animated Dots Line */}
        {/* <MotionUp
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="flex justify-end -mr-5 overflow-hidden"
        >
          <img className="dots-line" src={dotsLine} alt="3 dots and a line" />
        </MotionUp> */}
      </MotionUp>

      <section className="relative pt-5 md:pt-0 px-7 xl:px-17 -mt-15 md:-mt-30 z-20">
        <MotionUp className="flex flex-col md:flex-row gap-4 w-full">
          <div className="md:w-2/5 flex flex-col gap-4">
            <div>
              <a
                href={socmedPlatforms[1].href}
                title={socmedPlatforms[1].href}
                target="_blank"
                rel="noopener noreferrer"
                className="group no-underline ml-5 lg:ml-0 group-hover:text-secondary lg:px-5 xl:px-[4%] text-primary  rounded-2xl font-avenir-black flex items-center justify-left gap-4 cursor-pointer"
              >
                <MotionUp className="flex items-center gap-2">
                  <YoutubeIcon
                    color="group-hover:fill-secondary fill-white"
                    height="40"
                    width="40"
                  />
                  <span className="text-sm sm:text-base  text-white group-hover:text-secondary transition-all duration-75">
                    {socmedPlatforms[0].text}
                  </span>
                </MotionUp>
              </a>
              <MotionUp className="scale-90">
                <YouTubeEmbed videoId={videoId[0]} />
              </MotionUp>
            </div>
            <div>
              <a
                href={socmedPlatforms[1].href}
                title={socmedPlatforms[1].href}
                target="_blank"
                rel="noopener noreferrer"
                className="group no-underline ml-5 lg:ml-0  group-hover:text-secondary lg:px-5 xl:px-[4%] text-primary  rounded-2xl font-avenir-black flex items-center justify-left gap-4 cursor-pointer"
              >
                <MotionUp className="flex items-center gap-2">
                  <SpotifyIcon
                    color="group-hover:fill-secondary fill-white"
                    height="40"
                    width="40"
                  />
                  <span className="text-sm sm:text-base  text-white group-hover:text-secondary transition-all duration-75">
                    {socmedPlatforms[1].text}
                  </span>
                </MotionUp>
              </a>
              <MotionUp className="scale-90">
                <SingleSpotifyEmbed spotifyId={spotifyId[0]} />
              </MotionUp>
            </div>
          </div>

          <MotionUp className="md:w-3/5 rounded-2xl flex flex-col md:flex-row gap-20 md:gap-4 pb-2 md:pb-0 scale-90">
          
            <MotionUp className="h-full md:w-full -mt-8 " scale={0.9}>
            <a
                href={socmedPlatforms[2].href}
                title={socmedPlatforms[2].href}
                target="_blank"
                rel="noopener noreferrer"
                className="group no-underline  group-hover:text-secondary lg:px-5 xl:px-[4%] text-primary mb-4 rounded-2xl font-avenir-black flex items-center justify-left gap-4 cursor-pointer"
              >
                <MotionUp className="flex items-center gap-2">
                  <FacebookIcon
                    color="group-hover:fill-secondary fill-white"
                    height="40"
                    width="40"
                  />
                  <span className="text-sm sm:text-base  text-white group-hover:text-secondary transition-all duration-75">
                    {socmedPlatforms[2].text}
                  </span>
                </MotionUp>
              </a>
              <FacebookPostEmbed postId={facebookId[0]} />
            </MotionUp>

            <MotionUp className="h-full md:w-full -mt-8" scale={0.9}>
            <a
                href={socmedPlatforms[3].href}
                title={socmedPlatforms[3].href}
                target="_blank"
                rel="noopener noreferrer"
                className="group no-underline  group-hover:text-secondary lg:px-5 xl:px-[4%] text-primary mb-4 rounded-2xl font-avenir-black flex items-center justify-left gap-4 cursor-pointer"
              >
                <MotionUp className="flex items-center gap-2">
                  <InstagramIcon
                    color="group-hover:fill-secondary fill-white"
                    height="40"
                    width="40"
                  />
                  <span className="text-sm sm:text-base  text-white group-hover:text-secondary transition-all duration-75">
                    {socmedPlatforms[3].text}
                  </span>
                </MotionUp>
              </a>
              <InstagramEmbed postId={instagramId[0]} />
            </MotionUp>
          </MotionUp>
        </MotionUp>

        {/* <MotionUp className="flex flex-col md:flex-row md:justify-evenly md:pt-15 md:pb-5 pt-5 gap-2">
          {socmedPlatforms.map(({ href, icon: Icon, text, delay }) => (
            <SocialButton key={href} href={href}>
              <MotionUp className="flex items-center gap-2">
                <Icon
                  color="group-hover:fill-white fill-primary"
                  height="40"
                  width="40"
                />
                <span className="text-sm sm:text-base">{text}</span>
              </MotionUp>
            </SocialButton>
          ))}
        </MotionUp> */}
      </section>
    </section>
  );
};

export default HomeSocials;
