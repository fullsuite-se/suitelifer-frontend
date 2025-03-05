import React from "react";
import Footer from "../../components/Footer";
import MobileNav from "../../components/home/MobileNav";
import TabletNav from "../../components/home/TabletNav";
import DesktopNav from "../../components/home/DesktopNav";
import bgBlogs from "../../assets/images/blogs-text-bg.svg";
import guestBlogsList from "../../components/guest-blogs/GuestBlogsList";
import GuestBlogLarge from "../../components/guest-blogs/GuestBlogLarge";
import BlogText from "../../components/guest-blogs/GuestBlogText";
import GuestBlogTags from "../../components/guest-blogs/GuestBlogTags";

const Blog = () => {
  return (
    <section
      className="gap-4 h-dvh"
      style={{ maxWidth: "1800px", margin: "0 auto", padding: "0 1rem" }}
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
      {/* BLOGS HERO */}
      <section className="pt-[10%] xl:pt-[8%]">
        <img
          className="-z-50 absolute w-[90%] transform translate-y-5 -translate-x-10 lg:-translate-x-20 xl:-translate-x-50 opacity-90"
          src={bgBlogs}
          alt=""
        />
        {/* BANNER */}
        <div className="relative flex flex-col items-center">
          <div
            className="absolute -left-50 top-[30%]  -translate-y-2/3 bg-primary h-14 w-[94%] rounded-lg z-0  md:h-25 md:w-[77%] md:top-[40%] lg:w-[61%] lg:top-[40%]"
            style={{
              animation: "slideInFromLeft 0.8s ease-out forwards",
            }}
          ></div>

          {/* Text Content */}
          <div className="relative text-center z-10">
            <p className="font-avenir-black text-4xl md:text-7xl">
              <BlogText />
              <span className="text-black">&nbsp; spot</span>
            </p>
            <p className="text-gray-400 md:text-xl mt-7">
              where ideas spark and stories thrive.
            </p>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="flex justify-center px-4 mt-7">
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
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-primary-400 hover:border-slate-300 shadow-sm focus:shadow"
                placeholder="Search blogs..."
              />

              <button
                className="rounded-md bg-primary py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-[#007a8e] focus:shadow-none active:bg-[#007a8e] hover:bg-[#007a8e] cursor-pointer active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                type="button"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>
      <div className="flex justify-center lg:p-10 mt-10">
  <div className="w-full max-w-3xl flex justify-center">
    <GuestBlogTags />
  </div>
</div>


      <div className="py-5"></div>
      {/* BLOGS CONTENT */}
      <main className="px-[5%]">
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

        <p className="md:text-2xl uppercase font-avenir-black text-primary pb-3 mt-20 lg:pb-4">
          MORE BLOGS
        </p>
      </main>
      <div className="h-30"></div>
    </section>
  );
};

export default Blog;
