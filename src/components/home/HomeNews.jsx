import newsList from "../news/NewsList";
import { NavLink } from "react-router-dom";
import { toSlug } from "../../utils/slugUrl";
import MotionUp from "../animated/MotionUp";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import DynamicLink from "../buttons/ViewAll";
import formatTimestamp from "../../utils/formatTimestamp";

const HomeNews = () => {
  if (!newsList || newsList.length === 0) {
    return (
      <section className="px-7 xl:px-40 text-center">
        <div className="mb-5 relative">
          <MotionUp className="mb-10 md:mb-5 text-start">
            <div className="font-avenir-black text-h4 ">
              <span className="text-primary">Latest</span> Company Newsletter
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
  const mainCreatedAt = mainNews?.created_at;
  const mainNewsLink = mainTitle ? `/newsletter/${toSlug(mainTitle)}` : "";

  return (
    <section className="px-7 xl:px-40">
      <div className="mb-10 relative">
        <MotionUp className="mb-10 md:mb-5">
          <div className="flex flex-row items-center justify-between">
            <div>
              <div className="font-avenir-black text-h4 ">
                <span className="text-primary">Latest</span> Company Newsletter
              </div>
            </div>
            <div className="hidden md:block">
              <DynamicLink
                text="View All"
                href="/newsletter"
                className="custom-class "
                iconSize={5}
              />
            </div>
          </div>

          <div className=" flex items-center text-small ">
            <p className="mr-3 text-gray-500 md:whitespace-nowrap">
              Stay updated with our latest achievements, events, and
              announcements!
            </p>
            <div className="w-full h-[0.25vh] bg-primary hidden md:block"></div>{" "}
            <div className="flex items-center hidden md:block">
              <div className="size-[1vh] bg-primary rounded-full"></div>
            </div>
          </div>
        </MotionUp>
      </div>

      {/* CONTENTS */}
      <section className="flex flex-col lg:flex-row gap-0 lg:gap-10">
        <div className="block md:hidden mb-2">
          <DynamicLink
            text="View All"
            href="/news"
            className="custom-class "
            iconSize={5}
          />
        </div>
        {/* MAIN NEWS (First Item) */}
        <MotionUp className="lg:w-1/2 flex  flex-col items-center justify-center">
          {mainNews && (
            <NavLink
              to={mainNewsLink}
              className="no-underline rounded-2xl cursor-pointer group hover:bg-white w-full h-full"
            >
              <div className="group-hover:!text-primary bg-primary p-5 md:p-10 lg:p-15 rounded-xl  md:rounded-2xl ">
                {/* IMAGE */}
                <MotionUp className="mb-5">
                  {mainImage ? (
                    <img
                      className="aspect-video object-cover rounded-xl md:rounded-2xl lg:w-full xl:h-[400px]!"
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
                  className="title "
                >
                  {mainTitle ? (
                    <p className="font-avenir-black text-white text-body line-clamp-2 group-hover:text-secondary! duration-300">
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
                    <p className="text-xss opacity-80">
                      <span className="text-white">{mainAuthor}</span>
                      <span className="text-white">&nbsp; |</span>
                      <span className="text-white">
                        &nbsp;&nbsp;{mainReadTime}
                        <span className="text-white">&nbsp; |</span>
                      </span>
                      <span className="text-white">
                        {" "}
                        &nbsp;&nbsp;{formatTimestamp(mainCreatedAt).fullDate}
                      </span>
                    </p>
                  ) : (
                    <Skeleton width={"25%"} />
                  )}
                </MotionUp>

                {/* DESCRIPTION */}
                <div className="news-desc pr-2 mb-2">
                  {mainArticle ? (
                    <p className="font-avenir line-clamp-3 md:line-clamp-5! lg:line-clamp-20! xl:line-clamp-3! text-small text-white">
                      {mainArticle}
                    </p>
                  ) : (
                    <Skeleton count={3} />
                  )}
                </div>
              </div>
            </NavLink>
          )}
        </MotionUp>
        <div className="py-5"></div>

        {/* OTHER NEWS (Remaining Items) */}
        <div className="lg:w-1/2 flex flex-col max-h-full overflow-y-auto gap-2 pb-2">
          {newsList.slice(1, 5).map((news) => {
            const newsImage = news?.imagesWithCaption?.[0]?.image?.trim();
            const newsTitle = news?.title;
            const newsArticle = news?.article;
            const newsAuthor = news?.author;
            const newsReadTime = news?.readTime;
            const newsCreatedAt = news?.created_at;
            const newsLink = newsTitle
              ? `/newsletter/${toSlug(newsTitle)}`
              : "";

            return (
              <NavLink
                key={news.id}
                to={newsLink}
                className="duration-500 group no-underline rounded-2xl cursor-pointer px-2 py-3 lg:px-4 md:mb-2 transition-all hover:shadow-sm hover:bg-white"
              >
                <MotionUp>
                  <div className="flex justify-center items-center gap-2">
                    {/* CONTENT */}
                    <div className="flex flex-col w-full">
                      <MotionUp
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.6,
                          ease: "easeOut",
                          delay: 0.1,
                        }}
                        className="news-info py-1 md:py-2 mb-2 no-underline!"
                      >
                        {mainAuthor && mainReadTime ? (
                          <p className="text-xss">
                            <span className="text-gray-400">
                              {" "}
                              {formatTimestamp(newsCreatedAt).fullDate}
                            </span>
                          </p>
                        ) : (
                          <Skeleton width={"25%"} />
                        )}
                      </MotionUp>
                      <div className="group-hover:!text-primary duration-300">
                        {/* TITLE */}
                        <p
                          title={newsTitle}
                          className="font-avenir-black text-body  font-avenir-black"
                        >
                          {newsTitle || <Skeleton width={"70%"} />}
                        </p>
                      </div>
                      {/* DESCRIPTION */}
                      <div className="hidden md:block news-desc  mb-2">
                        <p className="font-avenir line-clamp-2 text-small sm:line-clamp-3   text-gray-500">
                          {newsArticle || <Skeleton count={2} />}
                        </p>
                      </div>
                      <div>
                        {" "}
                        {/* AUTHOR AND READ TIME */}
                        <p className="text-xss">
                          {newsAuthor && newsReadTime ? (
                            <>
                              <span className="text-primary">
                                {newsAuthor} &nbsp; |
                              </span>
                              &nbsp; &nbsp;
                              <span className="text-gray-400">
                                {newsReadTime}
                              </span>
                            </>
                          ) : (
                            <Skeleton width={"30%"} />
                          )}
                        </p>
                      </div>
                    </div>
                    {/* IMAGE */}
                    {/* <div className="w-[50%] sm:w-[40%] h-full flex items-center">
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
                    </div> */}
                  </div>
                </MotionUp>
              </NavLink>
            );
          })}
        </div>
      </section>
    </section>
  );
};

export default HomeNews;
