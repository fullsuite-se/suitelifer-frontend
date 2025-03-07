import React from "react";
import Footer from "../../components/Footer";
import MobileNav from "../../components/home/MobileNav";
import TabletNav from "../../components/home/TabletNav";
import DesktopNav from "../../components/home/DesktopNav";
import bgNews from "../../assets/images/bg-news.svg";
import NewsLarge from "../../components/news/NewsLarge";
import newsList from "../../components/news/NewsList";
import NewsCardSmall from "../../components/news/NewsCardSmall";

const News = () => {
  return (
    <section
      className="gap-4 h-dvh"
      style={{ maxWidth: "2000px", margin: "0 auto", padding: "0 0rem" }}
    >
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
        <div className="relative">
          <img
            className="-z-50 absolute w-[90%] transform translate-y-5 -translate-x-10 lg:-translate-x-20 xl:-translate-x-30 opacity-90"
            src={bgNews} //NEWS BACKGROUND
            alt=""
          />
        </div>

        {/* BANNER */}
        <div className="text-center">
          <p className="font-avenir-black text-4xl md:text-7xl animate-fadeInUp">
            <span className="text-primary">suite</span> news
          </p>
          <p className="text-gray-400 md:text-xl">
            we serve the latest. the hottest
          </p>
        </div>
        {/* SEARCH BAR */}
        <div className="flex justify-center px-4 mt-5">
          <div className="w-full max-w-sm min-w-[200px] ">
            <div className="relative flex items-center">
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
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-primary-400 hover:border-slate-300  focus:shadow"
                placeholder="Search news..."
              />

              <button
                className="rounded-md bg-primary py-2 px-4 border border-transparent text-center text-sm text-white transition-all hover:shadow-lg focus:bg-[#007a8e] focus:shadow-none active:bg-[#007a8e] hover:bg-[#007a8e] cursor-pointer active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                type="button"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>
      <div className="py-5"></div>
      {/* NEWS CONTENT */}
      <main className="px-[5%]">
        <p className="md:text-2xl uppercase font-avenir-black text-primary pb-3 lg:pb-4">
          The latest
        </p>
        {/* LARGE NEWS */}
        <NewsLarge
          id={newsList[0].id}
          title={newsList[0].title}
          author={newsList[0].author}
          article={newsList[0].article}
          readTime={newsList[0].read_time}
          created_at={newsList[0].created_at}
          imagesWithCaption={newsList[0].imagesWithCaption}
        />

        {/* SMALL ARTICLE CARDS --DISPLAYS 5 LATEST NEWS */}

        <p className="mt-10 md:text-xl  font-avenir-black text-primary pb-3 lg:pb-4">
          More Articles
        </p>
        <div className="layout-small-news-cards gap-4 sm:gap-5">
          {newsList.map((news, index) => (
            <NewsCardSmall
              key={news.id || index} // Use a unique key (id preferred)
              id={news.id}
              title={news.title}
              author={news.author}
              article={news.article}
              readTime={news.read_time}
              created_at={news.created_at}
              imagesWithCaption={news.imagesWithCaption}
            />
          ))}
        </div>
      </main>
      <div className="h-20"></div>
      <Footer />
    </section>
  );
};

export default News;
