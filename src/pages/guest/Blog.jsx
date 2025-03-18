import React, { useState } from "react";
import Footer from "../../components/Footer";
import MobileNav from "../../components/home/MobileNav";
import TabletNav from "../../components/home/TabletNav";
import DesktopNav from "../../components/home/DesktopNav";
import bgBlogs from "../../assets/images/blogs-text-bg.svg";
import guestBlogsList from "../../components/guest-blogs/GuestBlogsList";
import GuestBlogLarge from "../../components/guest-blogs/GuestBlogLarge";
import AnimatedText from "../../components/guest-blogs/AnimatedText";
import GuestBlogTags from "../../components/guest-blogs/GuestBlogTags";
import GuestBlogCard from "../../components/guest-blogs/GuestBlogCard";
import TwoCirclesLoader from "../../assets/loaders/TwoCirclesLoader";
import ArticleSearchResults from "../../components/news/SearchingBlogOrNews";
import { motion } from "framer-motion";
import BackToTop from "../../components/BackToTop";
import PageMeta from "../../components/layout/PageMeta";

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  window.scroll(0, 0);


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

  return (
    <section
      className="gap-4"
      style={{ maxWidth: "1800px", margin: "0 auto" }}
    >
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
      <section className="pt-[10%] xl:pt-[8%]">
        <img
          className="-z-50 absolute w-[90%] transform translate-y-5 -translate-x-6 lg:-translate-y-10  xl:-translate-y-15 lg:-translate-x-15 xl:-translate-x-40 opacity-90"
          src={bgBlogs}
          alt=""
        />
        {/* BANNER */}
        <div className="grid grid-cols-2 items-center gap-3">
          <div className="relative flex items-center justify-end">
            <div
              className="absolute bg-primary h-15 md:h-25 w-[200%] rounded-br-2xl rounded-tr-2xl"
              style={{ animation: "slideInFromLeft 0.8s ease-out forwards" }}
            ></div>
            <AnimatedText text="blog" color="white" />
          </div>
          <AnimatedText text="spot" color="black" />
        </div>

        <div className="text-center mt-3 md:mt-5">
          <p className="text-gray-400 text-[12px] md:text-[14px] lg:text-[16px]">
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
        <div className="flex justify-center mt-6 px-4">
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
        </div>
      </section>

      {/* BLOGS CONTENT */}
      <main className="px-[5%]">
        {isSearching ? (
          <ArticleSearchResults
            type="blog"
            list={guestBlogsList}
            searchTerm={searchTerm}
          />
        ) : (
          <>
            <div className="flex justify-center lg:p-10 mt-10">
              <div className="w-full max-w-3xl flex justify-center">
                <GuestBlogTags />
              </div>
            </div>

            <div className="py-5"></div>

            <p className="md:text-2xl uppercase font-avenir-black text-primary pb-3 lg:pb-4">
              The latest
            </p>
            <GuestBlogLarge
              id={guestBlogsList[0].id}
              title={guestBlogsList[0].title}
              author={guestBlogsList[0].author}
              article={guestBlogsList[0].article}
              readTime={guestBlogsList[0].readTime}
              created_at={guestBlogsList[0].created_at}
              images={guestBlogsList[0].images}
            />

            <p className="md:text-2xl font-avenir-black text-primary pb-3 mt-10 lg:pb-4">
              More Blogs
            </p>
            <div className="h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-center items-center">
              {guestBlogsList.slice(1).map((blog, index) => (
                <GuestBlogCard
                  key={blog.id || index}
                  id={blog.id}
                  title={blog.title}
                  author={blog.author}
                  article={blog.article}
                  readTime={blog.readTime}
                  created_at={blog.created_at}
                  images={blog.images}
                />
              ))}
            </div>

            <div className="h-10"></div>
            <div className="flex justify-center items-center w-full h-15 rounded-lg overflow-hidden">
              <TwoCirclesLoader
                bg={"transparent"}
                color1={"#0097b2"}
                color2={"#bfd1a0"}
                height={"35"}
              />
            </div>
          </>
        )}
      </main>

      <div className="h-30"></div>
      <BackToTop />
    </section>
  );
};

export default Blog;
