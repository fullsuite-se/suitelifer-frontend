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

  useEffect(() => {
    fetchThreeLatestEpisodes();
    fetchPlaylists();
  }, []);

  return (
    <section className="gap-4" style={{ maxWidth: "2000px", margin: "0 auto" }}>
      <PageMeta
        title="Blogs - SuiteLifer"
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
                    <div className="flex justify-center">
                      <img src={ComingSoon} alt="coming soon gif" />
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="font-avenir-black text-center text-h6">
                        Join in on the conversation. <br />{" "}
                        <span className="text-primary">Reach out to us!</span>
                      </p>
                      <br />
                      <div className="text-body flex flex-col gap-2 md:flex-row text-gray-500 w-full justify-center text-center">
                        <a
                          href="mailto:suitelifer@fullsuite.ph"
                          className="flex justify-center items-center gap-2 text-primary hover:text-secondary transition-colors  no-underline!"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            id="Filled"
                            viewBox="0 0 24 24"
                            width="512"
                            height="512"
                            className="fill-primary size-5 mb-1"
                          >
                            <path d="M23.954,5.542,15.536,13.96a5.007,5.007,0,0,1-7.072,0L.046,5.542C.032,5.7,0,5.843,0,6V18a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V6C24,5.843,23.968,5.7,23.954,5.542Z" />
                            <path d="M14.122,12.546l9.134-9.135A4.986,4.986,0,0,0,19,1H5A4.986,4.986,0,0,0,.744,3.411l9.134,9.135A3.007,3.007,0,0,0,14.122,12.546Z" />
                          </svg>
                          suitelifer@fullsuite.ph
                        </a>
                        <span className="hidden md:block">&nbsp;|&nbsp;</span>
                        <a
                          href="tel:742-442-887"
                          className="flex justify-center items-center gap-2 text-primary hover:text-secondary transition-colors  no-underline!"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            id="Layer_1"
                            data-name="Layer 1"
                            viewBox="0 0 24 24"
                            width="512"
                            height="512"
                            className="fill-primary size-5 mb-1"
                          >
                            <path d="M24,6.24c0,7.64-10.13,17.76-17.76,17.76-1.67,0-3.23-.63-4.38-1.78l-1-1.15c-1.16-1.16-1.16-3.12,.05-4.33,.03-.03,2.44-1.88,2.44-1.88,1.2-1.14,3.09-1.14,4.28,0l1.46,1.17c3.2-1.36,5.47-3.64,6.93-6.95l-1.16-1.46c-1.15-1.19-1.15-3.09,0-4.28,0,0,1.85-2.41,1.88-2.44,1.21-1.21,3.17-1.21,4.38,0l1.05,.91c1.2,1.19,1.83,2.75,1.83,4.42Z" />
                          </svg>
                          742-442-887
                        </a>
                        <span className="hidden md:block">&nbsp;|&nbsp;</span>
                        <a
                          href="tel:09190639001"
                          className="flex justify-center items-center gap-2 text-primary hover:text-secondary transition-colors  no-underline!"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            id="Layer_1"
                            data-name="Layer 1"
                            viewBox="0 0 24 24"
                            width="512"
                            height="512"
                            className="fill-primary size-5 mb-1"
                          >
                            <path d="M15,0h-6c-2.757,0-5,2.243-5,5v14c0,2.757,2.243,5,5,5h6c2.757,0,5-2.243,5-5V5c0-2.757-2.243-5-5-5Zm-2,21h-2c-.552,0-1-.448-1-1s.448-1,1-1h2c.552,0,1,.448,1,1s-.448,1-1,1Z" />
                          </svg>{" "}
                          0917-568-0851
                        </a>
                      </div>
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

      <div className="h-30"></div>
      <BackToTop />
      <Footer />
    </section>
  );
};

export default Blog;
