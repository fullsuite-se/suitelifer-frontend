import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import React from "react";
import MobileNav from "../home/MobileNav";
import TabletNav from "../home/TabletNav";
import DesktopNav from "../home/DesktopNav";
import bgBlogs from "../../assets/images/blogs-text-bg.svg";
import GuestBlogCardSmall from "../guest-blogs/GuestBlogCardSmall";
import NewsCardNoSnippet from "./NewsCardNoSnippet";
import formatTimestamp from "../../components/TimestampFormatter";
import BackToTop from "../BackToTop";
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import Footer from "../Footer";
import Carousel from "../Carousel";
import { removeHtmlTags } from "../../utils/removeHTMLTags";
import { readingTime } from "reading-time-estimator";

const ArticleDetails = ({
  id,
  title,
  content,
  createdAt,
  createdBy,
  images,
  relatedArticles,
  backPath,
  type,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { fullDate } = formatTimestamp(createdAt);

  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [id, location]);

  const handleBackBtn = () => {
    document.title = `SuiteLifer`;
    navigate(backPath, { replace: true });
  };

  return (
    <>
      <Helmet>
        <title>{title || "SuiteLifer"}</title>
        <meta
          name="description"
          content={
            content
              ? content.substring(0, 150) + "..."
              : "Read the latest articles on SuiteLifer."
          }
        />
        <meta
          name="keywords"
          content={`${title}, ${type}, SuiteLifer News, SuiteLifer Blogs, blog, news`}
        />
        {/* 
          TODO :
          <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={data?.title} />
         <meta name="twitter:description" content={data?.snippet || data?.article?.substring(0, 150)} />
        <meta name="twitter:image" content={data?.images?.[0] || "https://yourwebsite.com/default-image.jpg"} /> */}
      </Helmet>

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
        <main className="px-[7%] text-sm md:text-base md:px-[5%] lg:px-[8%]">
          <button
            onClick={handleBackBtn}
            className="flex cursor-pointer hover:underline items-center gap-2 text-primary !text-[12px] md:text-base font-semibold transition active:font-avenir-black"
          >
            <ArrowLeft size={15} /> <span className="mt-1">Back to {type}</span>
          </button>
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-10">
            {/* Main Article */}
            <div>
              <p className="text-[12px] text-gray-500 mt-5">{fullDate}</p>
              <p
                className={`text-xl md:text-2xl lg:text-3xl font-avenir-black my-2 ${
                  type === "News" ? "font-avenir-black" : "font-avenir-black"
                }`}
              >
                {title}
              </p>
              <p className="text-[12px] text-gray-500">
                <span className="text-primary font-avenir-black">
                  {createdBy}
                </span>{" "}
                | {readingTime("Hello", 238).text}
              </p>

              {/* Image Carousel */}
              <Carousel
                images={Array.isArray(images) ? images : []}
                isButtonOutside={false}
              />

              <p
                className={`mt-4 text-gray-700 whitespace-pre-line ${
                  type === "News" ? "font-avenir-black" : ""
                }`}
              >
                {removeHtmlTags(content)}
              </p>
            </div>

            {/* Related Articles */}
            <div className="overflow-y-auto lg:px-5 lg:h-[100vh]">
              <p className="mt-5 font-avenir-black text-primary pb-3 lg:pb-4">
                Read More {type}
              </p>
              <div className="grid grid-cols-1 gap-2 justify-center items-center">
                {type === "Blog" ? (
                  relatedArticles.map((article, index) => (
                    <div key={article.id || index}>
                      <GuestBlogCardSmall
                        id={article.id}
                        title={article.title}
                        author={article.author}
                        article={article.article}
                        readTime={article.readTime || article.read_time}
                        created_at={article.created_at}
                        images={article.images || article.imagesWithCaption}
                      />
                    </div>
                  ))
                ) : (
                  <div className="grid grid-cols-1 gap-4 justify-center items-center">
                    {relatedArticles.map((news, index) => (
                      <NewsCardNoSnippet
                        key={news.id || index}
                        id={news.id}
                        title={news.title}
                        author={news.author}
                        readTime={news.readTime}
                        created_at={news.created_at}
                        imagesWithCaption={news.imagesWithCaption}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
        <div className="h-30"></div> <BackToTop />
        <Footer />
      </section>
    </>
  );
};

export default ArticleDetails;
