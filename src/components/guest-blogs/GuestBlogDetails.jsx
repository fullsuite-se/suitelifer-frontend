import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import React from "react";
import Footer from "../../components/Footer";
import MobileNav from "../../components/home/MobileNav";
import TabletNav from "../../components/home/TabletNav";
import DesktopNav from "../../components/home/DesktopNav";
import bgBlogs from "../../assets/images/blogs-text-bg.svg";
import GuestBlogsList from "../../components/guest-blogs/GuestBlogsList";
import BlogImageCarousel from "./GuestBlogImageCarousel";
import GuestBlogCard from "./GuestBlogCard";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const blog = GuestBlogsList.find((b) => b.id.toString() === id);

  if (!blog) {
    return <h1 className="text-center text-red-500">Blog not found</h1>;
  }

  return (
    <>
      <section
        className="gap-4 h-dvh"
        style={{ maxWidth: "1800px", margin: "0 auto", padding: "0 1rem" }}
      >
        <div className="sm:hidden">
          <MobileNav />
        </div>
        <div className="tablet-nav">
          <TabletNav />
        </div>
        <div className="desktop-nav">
          <DesktopNav />
        </div>

        <section className="pt-[10%] xl:pt-[8%] relative">
          <img
            className="-z-50 absolute w-[70%] transform translate-y-5 -translate-x-10 lg:-translate-x-20 xl:-translate-x-50 opacity-90"
            src={bgBlogs}
            alt=""
          />
        </section>

        <main className="  px-[2%] text-sm md:text-base md:px-[10%] lg:!px-[15%] xl:px-[20%]">
          <button
            onClick={() => navigate("/blogs")}
            className="flex items-center gap-2 text-primary !text-[12px] md:text-base font-semibold transition  
             active:font-avenir-black"
          >
            <ArrowLeft size={15} /> <span className="mt-1">Back to blogs</span>
          </button>

          <h1 className="!text-xl md:!text-2x lg:!text-3xl font-avenir-black text-center">
            {blog.title}
          </h1>
          <BlogImageCarousel images={blog.images} />

          <p className="mt-4 text-gray-700 whitespace-pre-line">
            {blog.article}
          </p>
          <p className="md:text-xl uppercase font-avenir-black text-primary pb-3 mt-20 lg:pb-4">
            MORE BLOGS
          </p>
          <div className="h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-center items-center">
            {GuestBlogsList.slice(1, GuestBlogsList.length).map(
              (blog, index) => (
                <div key={blog.id || index}>
                  <GuestBlogCard
                    id={blog.id}
                    title={blog.title}
                    author={blog.author}
                    article={blog.article}
                    readTime={blog.readTime}
                    created_at={blog.created_at}
                    images={blog.images}
                  />
                </div>
              )
            )}
          </div>
        </main>

        <div className="h-30"></div>
      </section>
    </>
  );
};

export default BlogDetails;
