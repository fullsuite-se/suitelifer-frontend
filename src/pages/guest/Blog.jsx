import React, { useEffect, useState } from "react";

import MobileNav from "../../components/home/MobileNav";
import TabletNav from "../../components/home/TabletNav";
import DesktopNav from "../../components/home/DesktopNav";
import Footer from "../../components/Footer";

import bgBlogs from "../../assets/images/blogs-text-bg.svg";
import guestBlogsList from "../../components/guest-blogs/GuestBlogsList";
import GuestBlogLarge from "../../components/guest-blogs/GuestBlogLarge";
import AnimatedText from "../../components/guest-blogs/AnimatedText";
import GuestBlogTags from "../../components/guest-blogs/GuestBlogTags";
import GuestBlogCard from "../../components/guest-blogs/GuestBlogCard";
import ArticleSearchResults from "../../components/news/SearchingBlogOrNews";
import { motion } from "framer-motion";
import BackToTop from "../../components/BackToTop";
import PageMeta from "../../components/layout/PageMeta";
import api from "../../utils/axios";
import { removeHtmlTags } from "../../utils/removeHTMLTags";
import { readingTime } from "reading-time-estimator";
// import Skeleton from "react-loading-skeleton";
import LoadingBlogLarge from "../../components/guest-blogs/LoadingBlogLarge";
import LoadingBlogCard from "../../components/guest-blogs/LoadingBlogCard";



import SpotifyEmbed from "../../components/careers/SpotifyEmbed";

import Skeleton from "react-loading-skeleton";
import LoadingLargeSpotify from "../../components/careers/LoadingLargeSpotify";
import LoadingSmallSpotify from "../../components/careers/LoadingSmallSpotify";





const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);




  const [spotifyEpisodes, setEpisodes] = useState([]);
  const [isSpotifyLoading, setIsSpotifyLoading] = useState(true);
  const fetchEpisodes = async () => {
    try {
      const response = await api.get("/api/latest-three-episodes");
      setEpisodes((e) => response.data.data);
      setIsSpotifyLoading(false);
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    fetchEpisodes();
  }, []);






  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      setSearchTerm(searchQuery);
      setIsSearching(true);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchTerm("");
    setIsSearching(false);
  };

  useEffect(() => {}, []);

  const allTag = { tagId: "All", tagName: "All" };

  const [companyBlogTags, setCompanyBlogTags] = useState([allTag]);

  const [activeTag, setActiveTag] = useState("All");

  const fetchCompanyBlogTags = async () => {
    const response = await api.get("/api/all-tags");

    setCompanyBlogTags((cbt) => [allTag, ...response.data.data]);
  };

  useEffect(() => {
    fetchCompanyBlogTags();
  }, []);

  const [tagUpdated, setTagUpdated] = useState(false);

  const handleTagClick = (val) => {
    setActiveTag((at) => val);
    setTagUpdated((tu) => !tu);
  };

  const [companyBlogs, setCompanyBlogs] = useState([]);
  const [isCompanyBlogsLoading, setIsCompanyBlogsLoading] = useState(true);
  const fetchAllCompanyBlogs = async () => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 200)); //check if it's working
      const response = await api.get("/api/all-company-blogs");
      setCompanyBlogs(response.data);
      setIsCompanyBlogsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchFilteredCompanyBlogs = async () => {
    try {
      const response = await api.get(`/api/all-company-blogs/${activeTag}`);

      setCompanyBlogs(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log(activeTag);

    if (activeTag === "All") {
      fetchAllCompanyBlogs();
    } else {
      fetchFilteredCompanyBlogs();
    }

    console.log(companyBlogs);
  }, [tagUpdated]);

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
          <AnimatedText text="pod" color="black" />
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

        {/* SEARCH BAR */}
        {/* <div className="flex justify-center mt-6 px-4">
          <div className="relative flex items-center w-full max-w-xs sm:max-w-sm md:max-w-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="absolute w-5 h-5 top-2.5 left-2.5 text-slate-600"
            >
              <path
                fillRule="evenodd"
                d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                clipRule="evenodd"
              />
            </svg>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blogs..."
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-10 pr-7 py-2 transition duration-300 ease focus:outline-none focus:border-primary-400 hover:border-slate-300 focus:shadow"
            />

            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-24 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            )}

            <button
              onClick={handleSearch}
              className="rounded-md bg-primary py-2 px-4 border border-transparent text-center text-sm text-white transition-all hover:shadow-lg focus:bg-[#007a8e] active:bg-[#007a8e] hover:bg-[#007a8e] cursor-pointer ml-2"
            >
              Search
            </button>
          </div>
        </div> */}
      </section>

      {/* BLOGS CONTENT */}
      <main className="px-[5%] md:px-[10%] xl:px-[15%]">
   {/*    <>
      {isSearching ? (
          <ArticleSearchResults
            type="blog"
            list={guestBlogsList}
            searchTerm={searchTerm}
          />
        ) : companyBlogTags.length === 1 ? (
          <div className="mt-28">
            <div className="mx-[25vw] -translate-y-10">
              <div className="w-full">
                <Skeleton />
                <Skeleton width={"40%"} />
              </div>
            </div>
            <div className="py-5"></div>
            
            <section>
              <p className="md:text-2xl uppercase font-avenir-black text-primary pb-3 lg:pb-4">
                The latest
              </p>
              <LoadingBlogLarge />
              <p className="md:text-2xl font-avenir-black text-primary pb-3 mt-10 lg:pb-4">
          
              </p>
              <div className="h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-center items-center">
                {[...Array(2)].map((_, index) => (
                  <LoadingBlogCard key={index} />
                ))}
              </div>
            </section>
          </div>
        ) : (
          <>
            <div className="flex justify-center lg:p-10 mt-10">
              <div className="w-full max-w-3xl flex justify-center">
                <GuestBlogTags
                  activeTag={activeTag}
                  companyBlogTags={companyBlogTags}
                  handleTagClick={handleTagClick}
                />
              </div>
            </div>

            <div className="py-5"></div>
            {isCompanyBlogsLoading ? (
              <>
                <section>
                <p className="text-small uppercase font-avenir-black text-primary pb-3 lg:pb-4">
              The latest
            </p>
                  <LoadingBlogLarge />
                  <p className="md:text-2xl font-avenir-black text-primary pb-3 mt-10 lg:pb-4">
           
                  </p>
                  <div className="h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-center items-center">
                    {[...Array(2)].map((_, index) => (
                      <LoadingBlogCard key={index} />
                    ))}
                  </div>
                </section>
              </>
            ) : (
              <>
                {companyBlogs.length === 0 ? (
                  <p className="text-center text-lg">
                    Looks like we're out of blogs for this filter—
                    <span className="font-avenir-black text-primary">
                      switch it up
                    </span>{" "}
                    and try again!
                  </p>
                ) : (
                  <>
                   <p className="text-small uppercase font-avenir-black text-primary pb-3 lg:pb-4">
              The latest
            </p>
                    <GuestBlogLarge
                      id={companyBlogs[0].cblogId}
                      title={companyBlogs[0].title}
                      author={companyBlogs[0].createdBy}
                      article={companyBlogs[0].description}
                      readTime={
                        readingTime(companyBlogs[0].description, 238).text
                      }
                      createdAt={companyBlogs[0].createdAt}
                      imageUrl={companyBlogs[0].imageUrl}
                    />

                    <p className="md:text-2xl font-avenir-black text-primary pb-3 mt-10 lg:pb-4">
                    
                    </p>
                    <div className="h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-center items-center">
                      {companyBlogs.slice(1).map((blog, index) => (
                        <GuestBlogCard
                          key={index}
                          id={blog.cblogId}
                          title={blog.title}
                          createdBy={blog.createdBy}
                          description={removeHtmlTags(blog.description)}
                          createdAt={blog.createdAt}
                          imageUrl={blog.imageUrl}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )} 
        */}

<div className="width-full flex justify-center mt-10">
  <iframe
    style={{ borderRadius: "12px" }}
    src="https://open.spotify.com/embed/playlist/5RXEu9jr0qRZMrG4rxfgHq?utm_source=generator"
    width="100%"
    height="400"
    frameBorder="0"
    allowFullScreen
    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    loading="lazy"
  ></iframe>
</div>


  {/* Podcasts */}
  <section className="pb-[7%] lg:pb-[5%] px-[5%]">
            {/* <div className="text-center pb-7">
              <p className="text-h4 font-avenir-black">
                Want to <span className="text-primary">learn more</span> about
                our careers?
              </p>
              <p className="text-small text-gray-500">
                Check out the Suite Spot podcast below
              </p>
            </div> */}
            {/* Spotify Episodes */}
            {isSpotifyLoading ? (
              <section className="mt-20 px-[5%] md:px-[10%] lg:px-[15%]">
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
                    <section className="mt-20 px-[5%] md:px-[10%] lg:px-[15%]">
                      {/* Mobile View: Display all in a column */}
                      <div className="sm:hidden">
                        {spotifyEpisodes.map(({ spotifyId }, index) => (
                          <div className="p-1" key={index}>
                            <SpotifyEmbed id={spotifyId} index={index} />
                          </div>
                        ))}
                      </div>

                      {/* Small Screens and Up: Two-column layout */}
                      <div className="hidden sm:flex gap-7">
                        {/* Left Column: Large Embed */}
                        <div className="w-1/2">
                          <SpotifyEmbed
                            id={spotifyEpisodes[0]?.spotifyId}
                            index={0}
                          />
                        </div>

                        {/* Right Column: Two Smaller Embeds */}
                        <div className="w-1/2 flex flex-col justify-center gap-7">
                          {spotifyEpisodes
                            .slice(1, 3)
                            .map(({ spotifyId }, index) => (
                              <SpotifyEmbed
                                key={index + 1}
                                id={spotifyId}
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
                      Oops! It looks like there are no spotify podcasts
                      available yet. Stay tuned!
                    </div>
                  </>
                )}
              </>
            )}
          </section>


      </main>

      <div className="h-30"></div>
      <BackToTop />
      <Footer />
    </section>
  );
};

export default Blog;
