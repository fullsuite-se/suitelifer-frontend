import { ChevronRightIcon } from "@heroicons/react/24/solid";
import newsList from "../news/NewsList";
import { Link } from "react-router-dom";
import { toSlug } from "../../utils/slugUrl";
import MotionUp from "../MotionUp";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import DynamicLink from "../buttons/ViewAll";

const HomeNews = () => {
  if (!newsList || newsList.length === 0) {
    return (
      <section className="px-7 xl:px-17 text-center">
        <div className="mb-5 relative">
        <MotionUp className="mb-10 md:mb-5 text-start">
          <div className="font-avenir-black text-h4 ">
            <span className="text-primary">Latest</span> Company News
          </div>
          <p className="text-small text-gray-500">
            Stay updated with our latest achievements, events, and
            announcements!
          </p>
        </MotionUp>
      </div>
      <div className="py-10 text-gray-500 flex flex-col items-center">
  <img
    src="src/assets/gif/nothing-found-icon.gif" 
    alt="No articles illustration"
    className="w-40 h-40 mb-4 opacity-50"
  />
  <p>No news articles available.</p>
</div>
 </section>
    );
  }

  const mainNews = newsList?.[0]; // Get the first news item
  const mainImage = mainNews?.imagesWithCaption?.[0]?.image?.trim();
  const mainTitle = mainNews?.title;
  const mainAuthor = mainNews?.author;
  const mainReadTime = mainNews?.readTime;
  const mainArticle = mainNews?.article;
  const mainNewsLink = mainTitle
    ? `/news/${mainNews.id}/${toSlug(mainTitle)}`
    : "";

  return (
    <section className="px-7 xl:px-17">
      <div className="mb-5 relative">
        <MotionUp className="mb-10 md:mb-5">
          <div className="font-avenir-black text-h4 ">
            <span className="text-primary">Latest</span> Company News
          </div>
          <p className="text-small text-gray-500">
            Stay updated with our latest achievements, events, and
            announcements!
          </p>
        </MotionUp>
      </div>

      {/* CONTENTS */}
      <section className="flex flex-col lg:flex-row gap-0 lg:gap-10">
        {/* MAIN NEWS (First Item) */}
        <MotionUp className="lg:w-1/2 flex px-2 flex-col items-center justify-center">
          {mainNews && (
            <Link
              to={mainNewsLink}
              className="no-underline rounded-2xl cursor-pointer group hover:bg-white w-full"
            >
              <div className="group-hover:!text-primary">
                {/* IMAGE */}
                <MotionUp className="mb-5">
                  {mainImage ? (
                    <img
                      className="aspect-video object-cover rounded-2xl lg:w-full xl:h-[400px]!"
                      src={mainImage}
                      alt="Main content news image"
                    />
                  ) : (
                    <Skeleton className="aspect-video object-cover rounded-2xl lg:w-full xl:h-[400px]!" />
                  )}
                </MotionUp>

                {/* TITLE */}
                <MotionUp
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="title hover:text-primary!"
                >
                  {mainTitle ? (
                    <p className="font-avenir-black text-body line-clamp-2">
                      {mainTitle}
                    </p>
                  ) : (
                    <Skeleton width={"70%"} />
                  )}
                </MotionUp>

                {/* AUTHOR AND READ TIME */}
                <MotionUp
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                  className="news-info py-1 md:py-2 mb-2 no-underline!"
                >
                  {mainAuthor && mainReadTime ? (
                    <p className="text-xss">
                      <span className="text-primary">{mainAuthor}</span>
                      <span className="text-primary">&nbsp; |</span>
                      <span className="text-gray-400">
                        &nbsp;&nbsp;{mainReadTime}
                      </span>
                    </p>
                  ) : (
                    <Skeleton width={"25%"} />
                  )}
                </MotionUp>

                {/* DESCRIPTION */}
                <div className="news-desc pr-2 mb-2">
                  {mainArticle ? (
                    <p className="font-avenir line-clamp-3 md:line-clamp-5! xl:line-clamp-3! text-small text-gray-500">
                      {mainArticle}
                    </p>
                  ) : (
                    <Skeleton count={3} />
                  )}
                </div>
              </div>
            </Link>
          )}
        </MotionUp>
        <div className="py-5"></div>

        {/* OTHER NEWS (Remaining Items) */}
        <div className="lg:w-1/2 flex flex-col max-h-full overflow-y-auto gap-2 pb-2">
          <DynamicLink
            text="See More News"
            href="/news"
            className="custom-class"
            iconSize={5}
          />

          {newsList.slice(1, 4).map((news) => {
            const newsImage = news?.imagesWithCaption?.[0]?.image?.trim();
            const newsTitle = news?.title;
            const newsArticle = news?.article;
            const newsAuthor = news?.author;
            const newsReadTime = news?.readTime;
            const newsLink = newsTitle
              ? `/news/${news.id}/${toSlug(newsTitle)}`
              : "";

            return (
              <Link
                key={news.id}
                to={newsLink}
                className="group no-underline rounded-2xl cursor-pointer px-2 py-3 lg:px-4 transition-all duration-300 hover:shadow-sm hover:bg-white"
              >
                <MotionUp>
                  <div className="other-news flex justify-center items-center gap-2">
                    {/* CONTENT */}
                    <div className="w-[50%] sm:w-[60%] flex flex-col">
                      <div className="group-hover:!text-primary">
                        {/* TITLE */}
                        <p
                          title={newsTitle}
                          className="font-avenir-black text-body pr-2 font-avenir-black"
                        >
                          {newsTitle || <Skeleton width={"70%"} />}
                        </p>
                      </div>
                      {/* DESCRIPTION */}
                      <div className="hidden md:block news-desc pr-2 mb-2">
                        <p className="font-avenir line-clamp-2 text-small sm:line-clamp-3   text-gray-500">
                          {newsArticle || <Skeleton count={2} />}
                        </p>

                       
                      </div>
                      <div> {/* AUTHOR AND READ TIME */}
                        <p className="text-xss">
                          {newsAuthor && newsReadTime ? (
                            <>
                              <span className="text-primary">
                                {newsAuthor} &nbsp; |
                              </span>
                              &nbsp;
                              <span className="text-gray-400">
                                {newsReadTime}
                              </span>
                            </>
                          ) : (
                            <Skeleton width={"30%"} />
                          )}
                        </p></div>
                    </div>
                    {/* IMAGE */}
                    <div className="w-[50%] sm:w-[40%] h-full flex items-center">
                      {newsImage ? (
                        <img
                          className="aspect-video h-full object-cover rounded-md sm:rounded-xl"
                          src={newsImage}
                          alt="News image"
                        />
                      ) : (
                        <div className="w-full aspect-video h-full object-cover rounded-md sm:rounded-xl">
                          <Skeleton className="h-full w-full" />
                        </div>
                      )}
                    </div>
                  </div>
                </MotionUp>
              </Link>
            );
          })}
        </div>
      </section>
    </section>
  );
};

export default HomeNews;
