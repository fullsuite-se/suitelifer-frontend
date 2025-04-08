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

import SpotifyEmbed from "../../components/careers/SpotifyEmbed";
import Skeleton from "react-loading-skeleton";
import LoadingLargeSpotify from "../../components/careers/LoadingLargeSpotify";
import LoadingSmallSpotify from "../../components/careers/LoadingSmallSpotify";
import { IndeterminateCheckBox } from "@mui/icons-material";

const Blog = () => {
  const [isSpotifyLoading, setSpotifyIsLoading] = useState(true);

  const [spotifyEpisodes, setEpisodes] = useState([]);

  const fetchThreeLatestEpisodes = async () => {
    try {
      setSpotifyIsLoading(true);
      const response = await api.get("/api/spotify/latest-three");

      setEpisodes((e) => response.data.threeLatestEpisodes);
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
                  <div className="text-center text-gray-500">
                    Oops! It looks like there are no spotify podcasts available
                    yet. Stay tuned!
                  </div>
                </>
              )}
            </>
          )}
        </section>

        <div className="width-full flex flex-col justify-center mt-10">
          <p className="text-2xl font-avenir-black text-black/75">
            Check out these Fresh Playlists:
          </p>
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
          </div>
        </div>
      </main>

      <div className="h-30"></div>
      <BackToTop />
      <Footer />
    </section>
  );
};

export default Blog;
