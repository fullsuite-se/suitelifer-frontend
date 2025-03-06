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
import GuestBlogCardSmall from "./GuestBlogCardSmall";

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
        style={{ maxWidth: "2000px", margin: "0 auto" }}
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

        <main className="  px-[7%] text-sm md:text-base md:px-[5%] lg:!px-[10%]">
          <button
            onClick={() => navigate("/blogs")}
            className="flex items-center gap-2 text-primary !text-[12px] md:text-base font-semibold transition  
             active:font-avenir-black"
          >
            <ArrowLeft size={15} /> <span className="mt-1">Back to blogs</span>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr]  gap-10">
  {/* Main Blog Content */}
  <div>
  <p className="!text-[12px] text-gray-500 mt-5">
         {blog.created_at}   </p>
    <p className="!text-xl md:!text-2xl lg:!text-3xl font-avenir-black my-2">
      {blog.title}
    </p>
    <p className="!text-[12px] text-gray-500">
    <span className="text-primary font-avenir-black"> {blog.author}</span>      |{" "}
            {blog.readTime}
          </p>
    <BlogImageCarousel images={blog.images} />

    <p className="mt-4 text-gray-700 whitespace-pre-line">{blog.article}</p>
  </div>

  {/* More Blogs Section (Moves below article on mobile) */}
  <div className="overflow-y-auto lg:px-5 lg:h-[100vh]">
    <p className=" mt-5 font-avenir-black text-primary pb-3 lg:pb-4">
      Read More Blogs
    </p>
    <div className="grid grid-cols-1 gap-2 justify-center items-center">
      {GuestBlogsList.slice(1, 6).map((blog, index) => (
        <div key={blog.id || index}>
          <GuestBlogCardSmall
            id={blog.id}
            title={blog.title}
            author={blog.author}
            article={blog.article}
            readTime={blog.readTime}
            created_at={blog.created_at}
            images={blog.images}
          />
        </div>
      ))}
    </div>
  </div>
</div>

        </main>

        <div className="h-30"></div>
        <Footer />
      </section>
    </>
  );
};

export default BlogDetails;
