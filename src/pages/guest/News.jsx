import React, { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import MobileNav from "../../components/home/MobileNav";
import TabletNav from "../../components/home/TabletNav";
import DesktopNav from "../../components/home/DesktopNav";
import bgNews from "../../assets/images/bg-news.svg";
import NewsLarge from "../../components/news/NewsLarge";
import newsList from "../../components/news/NewsList";
import NewsCardSmall from "../../components/news/NewsCardSmall";
import ArticleSearchResults from "../../components/news/SearchingBlogOrNews";
import { motion } from "framer-motion";
import BackToTop from "../../components/BackToTop";
import PageMeta from "../../components/layout/PageMeta";
import FooterNew from "../../components/FooterNew";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import TwoCirclesLoader from "../../assets/loaders/TwoCirclesLoader";

const News = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/all-news");
        setNews(response.data);
      } catch (error) {
        console.error("Error fetching news:", error);
        toast.error("Failed to load news. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);
  return (
    <section
      className="gap-4 h-dvh"
      style={{ maxWidth: "2000px", margin: "0 auto", padding: "0 0rem" }}
    >
      <PageMeta
        title="News - SuiteLifer"
        desc="Stay informed with company news, product launches, and industry insights from Fullsuite."
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
      {/* NEWS HERO */}
      <section className="pt-[10%] xl:pt-[8%]">
        <div className="relative hidden">
          <img
            className="-z-50 absolute w-[90%] transform translate-y-5 -translate-x-6 lg:-translate-y-10  xl:-translate-y-15 lg:-translate-x-15 xl:-translate-x-40 opacity-90"
            src={bgNews}
            alt=""
          />
        </div>

        {/* BANNER */}
        <div className="text-center overflow-hidden">
          <p className="text-4xl md:text-7xl font-serif font-extrabold flex justify-center gap-4 md:gap-8 flex-nowrap">
            <motion.span
              initial={{ x: "-100vw", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="text-primary"
            >
              suite
            </motion.span>
            <motion.span
              initial={{ x: "100vw", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            >
              news
            </motion.span>
          </p>
          <p className="text-gray-400 text-[12px] md:text-[14px] lg:text-[16px]">
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, ease: "linear", delay: 0.5 }}
              className="overflow-hidden whitespace-nowrap inline-block"
            >
              we serve the latest. the hottest.
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
              placeholder="Search news..."
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-10 pr-7 py-2 focus:outline-none focus:border-primary-400"
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
              className="rounded-md bg-primary py-2 px-4 border text-sm text-white hover:bg-[#007a8e] cursor-pointer ml-2"
            >
              Search
            </button>
          </div>
        </div>
      </section>
      <div className="py-5"></div>
      {/* NEWS CONTENT */}
      <main className="px-[5%]">
        {isSearching ? (
          <ArticleSearchResults
            type="news"
            list={newsList}
            searchTerm={searchTerm}
          />
        ) : (
          <>
            <p className="md:text-2xl uppercase font-avenir-black text-primary pb-3 lg:pb-4">
              The latest
            </p>
            {loading || !news.length ? (
              <div className="mt-20">
                <TwoCirclesLoader
                  bg={"transparent"}
                  color1={"#0097b2"}
                  color2={"#bfd1a0"}
                  height={"35"}
                />
              </div>
            ) : (
              <>
                <NewsLarge {...news[0]} />
                <p className="mt-10 md:text-xl font-avenir-black text-primary pb-3 lg:pb-4">
                  More Articles
                </p>
                <div className="layout-small-news-cards gap-4 sm:gap-5">
                  {news.length > 0 &&
                    news.map((news, index) => (
                      <NewsCardSmall key={news.id || index} {...news} />
                    ))}
                </div>
              </>
            )}
          </>
        )}
      </main>
      <div className="h-20"></div> <BackToTop />
      <FooterNew />
    </section>
  );
};

export default News;
