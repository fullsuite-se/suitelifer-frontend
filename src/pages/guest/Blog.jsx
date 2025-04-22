import React, { useEffect, useState } from "react";
import MobileNav from "../../components/home/MobileNav";
import TabletNav from "../../components/home/TabletNav";
import DesktopNav from "../../components/home/DesktopNav";
import Footer from "../../components/Footer";
import bgBlogs from "../../assets/images/blogs-text-bg.svg";
import AnimatedText from "../../components/guest-blogs/AnimatedText";
import { motion } from "framer-motion";
import BackToTop from "../../components/BackToTop";
import PageMeta from "../../components/layout/PageMeta";
import api from "../../utils/axios";

import ComingSoon from "../../assets/images/coming-soon.gif";

import SpotifyEmbed from "../../components/careers/SpotifyEmbed";
import LoadingLargeSpotify from "../../components/careers/LoadingLargeSpotify";
import LoadingSmallSpotify from "../../components/careers/LoadingSmallSpotify";

import emailicon from "../../assets/icons/envelope.svg";
import tphoneicon from "../../assets/icons/mobile-button.svg";
import phoneicon from "../../assets/icons/phone-flip.svg";
import ClockIcon from "../../assets/logos/ClockIcon";
import MarkerIcon from "../../assets/logos/MarkerIcon";

const Blog = () => {
  const [isSpotifyLoading, setSpotifyIsLoading] = useState(true);

  const [spotifyEpisodes, setEpisodes] = useState([]);

  const fetchThreeLatestEpisodes = async () => {
    try {
      setSpotifyIsLoading(true);
      const response = await api.get("/api/spotify/latest-three");

      // setEpisodes((e) => response.data.threeLatestEpisodes);
    } catch (err) {
      console.error(err);
    } finally {
      setSpotifyIsLoading(false);
    }
  };

  const [playlists, setPlaylists] = useState([]);

  const fetchPlaylists = async () => {
    try {
      setSpotifyIsLoading(true);
      const response = await api.get("/api/spotify/playlists");

      console.log(response.data);

      setPlaylists(response.data.playlists);
    } catch (err) {
      console.error(err);
    } finally {
      setSpotifyIsLoading(false);
    }
  };
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };
  const [isLoaded, setIsLoaded] = useState(false);

  const [contactDetails, setContactDetails] = useState({
    websiteEmail: "",
    websiteTel: "",
    websitePhone: "",
  });

  const fetchContact = async () => {
    try {
      const response = await api.get("/api/contact");

      setContactDetails(response.data.contact);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchThreeLatestEpisodes();
    fetchPlaylists();
    fetchContact();
    setIsLoaded(true);
  }, []);

  return (
    <section className="gap-4" style={{ maxWidth: "2000px", margin: "0 auto" }}>
      <PageMeta
        title="Blogs - Suitelifer"
        desc="Dive into our collection of valuable perspectives on all things Startup, Careers, Baguio, and Fullsuite."
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
      {/* DESKTOP NAV */}
      <div className="desktop-nav">
        <DesktopNav />
      </div>
      {/* BLOGS HERO */}
      <section className="pt-[10%] xl:pt-[8%] relative">
        <img
          className="hidden -z-50 absolute w-[90%] transform translate-y-5 -translate-x-6 lg:-translate-y-10  xl:-translate-y-15 lg:-translate-x-15 xl:-translate-x-40 opacity-90"
          src={bgBlogs}
          alt=""
        />
        {/* BANNER */}
        <div className="grid grid-cols-2 items-center ">
          <div className="flex items-center justify-end">
            {/* Blue Thing */}
            <div
              className="absolute bg-primary h-15 md:h-25 w-[49.7%] rounded-br-2xl rounded-tr-2xl"
              style={{
                animation: "slideInFromLeft 0.8s ease-out forwards",
                left: 0,
              }}
            ></div>
            <AnimatedText text="suite" color="white" />
          </div>
          <AnimatedText text="spot" color="black" />
        </div>

        <div className="text-center mt-3 md:mt-5">
          <p className="text-gray-400 text-small">
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, ease: "linear", delay: 1 }}
              className="overflow-hidden whitespace-nowrap inline-block"
            >
              where ideas spark and stories thrive.
            </motion.span>
          </p>
        </div>
      </section>

      {/* PODCAST CONTENT */}
      <main className="px-[5%] md:px-[10%] xl:px-[15%]">
        {/* Podcasts */}
        <section className="mt-15">
          {/* Spotify Episodes */}
          {isSpotifyLoading ? (
            <section className="px-[5%] md:px-[10%] lg:px-[15%]">
              <div className="sm:hidden flex flex-col gap-4">
                <LoadingLargeSpotify />
                <LoadingSmallSpotify />
                <LoadingSmallSpotify />
              </div>
              <div className="hidden sm:flex gap-4">
                <div className="w-1/2">
                  <LoadingLargeSpotify />
                </div>
                <div className="w-1/2 flex flex-col justify-center gap-4">
                  <LoadingSmallSpotify />
                  <LoadingSmallSpotify />
                </div>
              </div>
            </section>
          ) : (
            <>
              {spotifyEpisodes.length > 0 ? (
                <>
                  <p className="text-2xl font-avenir-black text-primary">
                    Latest Podcast Episodes
                  </p>
                  <section className="mt-3">
                    {/* Mobile View: Display all in a column */}
                    <div className="sm:hidden">
                      {spotifyEpisodes.map(
                        ({ spotifyId, embedType }, index) => (
                          <div className="p-1" key={index}>
                            <SpotifyEmbed
                              spotifyId={spotifyId}
                              embedType={embedType}
                              index={index + 1}
                            />
                          </div>
                        )
                      )}
                    </div>

                    {/* Small Screens and Up: Two-column layout */}
                    <div className="hidden sm:flex gap-7">
                      <div className="w-1/2">
                        <SpotifyEmbed
                          spotifyId={spotifyEpisodes[0].spotifyId}
                          embedType={spotifyEpisodes[0].embedType}
                          index={0}
                        />
                      </div>
                      {/* Right Column: Two Smaller Embeds */}
                      <div className="w-1/2 flex flex-col justify-center gap-7">
                        {spotifyEpisodes
                          .slice(1, 3)
                          .map(({ spotifyId, embedType }, index) => (
                            <SpotifyEmbed
                              key={index + 1}
                              spotifyId={spotifyId}
                              embedType={embedType}
                              index={index + 1}
                            />
                          ))}
                      </div>
                    </div>
                  </section>
                </>
              ) : (
                <>
                  <div className="">
                    <div className="flex justify-center pt-20">
                      <img
                        src={ComingSoon}
                        alt="coming soon gif"
                        className="pointer-events-none"
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </section>

        <div className="width-full flex flex-col justify-center mt-10">
          {playlists.length > 0 && spotifyEpisodes.length > 0 ? (
            <>
              <p className="text-2xl font-avenir-black text-black/75">
                Check out these Fresh Playlists:
              </p>{" "}
              <div className="mt-3 flex flex-col lg:grid lg:grid-cols-2 gap-7">
                {playlists?.map((playlist, index) => (
                  <iframe
                    key={index}
                    style={{ borderRadius: "12px" }}
                    src={`https://open.spotify.com/embed/playlist/${playlist.spotifyId}?utm_source=generator`}
                    width="100%"
                    height="400"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  ></iframe>
                ))}
              </div>{" "}
            </>
          ) : (
            ""
          )}
        </div>
      </main>
      <section className="">
        <div className="h-30"></div>
        <motion.div
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col md:flex-row items-start md:items-center"
        >
          <div
            className="relative p-8 pr-8 md:pr-16 rounded-tr-xl rounded-br-xl text-white mr-4 md:min-h-[500px] justify-center items-center flex flex-col 
                    w-[98%] md:w-[60%] lg:w-[60%] xl:w-[50%] max-w-[90%] xl:max-w-[60%]"
            style={{
              // backgroundImage: `url(${bgimg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-secondary rounded-tr-xl rounded-br-xl"></div>
            <div className="relative z-10">
              <p className="font-avenir-black text-white-300 text-h3">
                Join in on the conversation.
                <br />
                Reach out to us!
              </p>
              <p className="text-white text-body"></p>

              <div className="group mt-6 space-y-5 text-white font-avenir-back text-body">
                <p className="flex items-center gap-4">
                  <img
                    src={emailicon}
                    alt="Email"
                    className="w-5 h-5 mb-1 filter invert"
                  />
                  <div className="flex">
                    <a
                      href="mailto:suitelifer@fullsuite.ph"
                      className="hover:text-accent-2 transition-colors  no-underline!"
                    >
                      {contactDetails.websiteEmail}
                    </a>
                  </div>
                </p>
                <p className="flex items-center gap-4">
                  <img
                    src={phoneicon}
                    alt="Phone"
                    className="w-5 h-5 mb-1 filter invert"
                  />
                  <a
                    href="tel:742-442-887"
                    className="hover:text-accent-2 transition-colors  no-underline!"
                  >
                    {contactDetails.websiteTel}
                  </a>
                </p>
                <p className="flex items-center gap-4">
                  <img
                    src={tphoneicon}
                    alt="Mobile"
                    className="w-5 h-5 mb-1 filter invert"
                  />
                  <a
                    href="tel:09175680851"
                    className="hover:text-accent-2 transition-colors  no-underline!"
                  >
                    {contactDetails.websitePhone}
                  </a>
                </p>
              </div>
            </div>
          </div>

          <motion.div
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="p-8 w-full md:max-w-lg lg:max-w-2xl xl:max-w-4xl"
          >
            <form action="#" className="space-y-4">
              <div>
                <label className="block text-gray-700 text-small">
                  Full Name<span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  className="text-accent-2 w-full p-3 border-none rounded-md bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-small">
                  Email Address<span className="text-primary">*</span>
                </label>
                <input
                  type="email"
                  className="text-accent-2 w-full p-3 border-none rounded-md bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-small">
                  Subject<span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  className="text-accent-2 w-full p-3 border-none rounded-md bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-small">
                  Message<span className="text-primary">*</span>
                </label>
                <textarea
                  rows="4"
                  className="w-full p-3 border-none rounded-md bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-secondary placeholder-accent-2/50 text-accent-2"
                  placeholder="Type your message here"
                ></textarea>
              </div>
              <button className="w-full font-avenir-black bg-secondary cursor-pointer  text-small text-white py-3 rounded-md hover:bg-secondary/90 transition">
                SEND
              </button>
            </form>
          </motion.div>
        </motion.div>
      </section>

      <div className="h-30"></div>
      <BackToTop />
      <Footer />
    </section>
  );
};

export default Blog;
