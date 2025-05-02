import newsList from "../news/NewsList";
import { NavLink } from "react-router-dom";
import { toSlug } from "../../utils/slugUrl";
import MotionUp from "../animated/MotionUp";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import DynamicLink from "../buttons/ViewAll";
import formatTimestamp from "../../utils/formatTimestamp";
import newsletterStore from "../../store/stores/newsletterStore";
import { useEffect } from "react";
import api from "../../utils/axios";
import { readingTime } from "reading-time-estimator";
import { removeHtmlTags } from "../../utils/removeHTMLTags";

const HomeNews = () => {
  const { newsletterContent, setNewsletterContent, isLoading, setIsLoading } =
    newsletterStore();
  useEffect(() => {
    const fetchIssueAndArticles = async () => {
      try {
        const issueRes = await api.get("api/issues/current");
        const current = issueRes.data.currentIssue;
        if (!current) {
          setNewsletterContent({ articles: [], currentIssue: null });
          return;
        }
        const articlesRes = await api.get(
          `/api/newsletter?issueId=${current.issueId}`
        );

        const allArticles = articlesRes.data.newsletters || [];

        const filteredArticles = Array.from({ length: 7 }, (_, i) => {
          const sectionNumber = i + 1;
          return (
            allArticles.find(
              (article) => article.section === sectionNumber
            ) || {
              title: "Coming Soon",
              article: "This section is being prepared. Stay tuned!",
              pseudonym: "FullSuite Team",
              createdAt: new Date().toISOString(),
              newsletterId: "",
              images: [],
              section: sectionNumber,
            }
          );
        });

        setNewsletterContent({
          articles: filteredArticles,
          currentIssue: current,
        });
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIssueAndArticles();
  }, [setNewsletterContent, setIsLoading]);

  const articles = newsletterContent.articles || [];
  const currentIssue = newsletterContent.currentIssue || {};

  if (!articles || articles.length === 0 || newsletterContent.currentIssue?.assigned 
    !== 7){
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
        <div className="flex flex-col items-center justify-center text-center p-10 min-h-[60vh]">
          <h1 className="text-3xl md:text-5xl font-avenir-black mb-4">
            📬 Your Next Big Read Is On Its Way!
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-xl">
            We're putting the final touches on something special. Fresh stories,
            insights, and updates will be landing here very soon —{" "}
            <span className="font-avenir-black text-primary">
              stay excited!
            </span>
          </p>
        </div>
      </section>
    );
  }

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
          {articles[0] && (
            <NavLink
              to={`/newsletter/${toSlug(articles[0].title)}?id=${
                articles[0].newsletterId
              }`}
              state={{ fromHome: true }}
              className="no-underline rounded-2xl cursor-pointer group hover:bg-white w-full h-full"
            >
              <div className="group-hover:!text-primary bg-primary p-5 md:p-10 lg:p-15 rounded-xl  md:rounded-2xl ">
                {/* IMAGE */}
                <MotionUp className="mb-5">
                  {articles[0].images ? (
                    <img
                      className="aspect-video object-cover rounded-xl md:rounded-2xl lg:w-full xl:h-[400px]!"
                      src={articles[0].images[0]}
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
                  {articles[0].title ? (
                    <p className="font-avenir-black text-white text-body line-clamp-2 group-hover:text-secondary! duration-300">
                      {articles[0].title}
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
                  {articles[0].pseudonym && articles[0].createdAt ? (
                    <p className="text-xss opacity-80">
                      <span className="text-white">
                        {articles[0].pseudonym}
                      </span>
                      <span className="text-white">&nbsp; |</span>
                      <span className="text-white">
                        &nbsp;&nbsp;
                        {
                          readingTime(
                            removeHtmlTags(articles[0].article ?? "article"),
                            238
                          ).text
                        }
                        <span className="text-white">&nbsp; |</span>
                      </span>
                      <span className="text-white">
                        {" "}
                        &nbsp;&nbsp;
                        {formatTimestamp(articles[0].createdAt).fullDate}
                      </span>
                    </p>
                  ) : (
                    <Skeleton width={"25%"} />
                  )}
                </MotionUp>

                {/* DESCRIPTION */}
                <div className="news-desc pr-2 mb-2">
                  {articles[0].article ? (
                    <article
                      dangerouslySetInnerHTML={{ __html: articles[0].article }}
                      className="font-avenir line-clamp-3 md:line-clamp-5! lg:line-clamp-20! xl:line-clamp-7! text-small text-white"
                    />
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
          {articles.slice(1, 5).map((news) => {
            const {
              images: newsImage,
              title: newsTitle,
              article: newsArticle,
              pseudonym: newsAuthor,
              createdAt,
              newsletterId,
            } = news || {};

            const newsReadTime = readingTime(
              removeHtmlTags(newsArticle ?? "article"),
              238
            ).text;

            const newsCreatedAt = createdAt
              ? formatTimestamp(createdAt).fullDate
              : "";
            const newsLink = newsletterId
              ? `/newsletter/${toSlug(newsTitle)}?id=${newsletterId}`
              : "/newsletter";

            return (
              <NavLink
                key={newsletterId}
                to={newsLink}
                state={{ fromHome: true }}
                className="duration-500 group no-underline rounded-2xl cursor-pointer px-2 py-3 lg:px-4 md:mb-2 transition-all hover:shadow-sm hover:bg-white"
              >
                <MotionUp>
                  <div className="flex justify-center items-center gap-2">
                    {/* CONTENT */}
                    <div className="flex flex-col w-full">
                      {/* CREATED AT */}
                      <MotionUp
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.6,
                          ease: "easeOut",
                          delay: 0.1,
                        }}
                        className="news-info py-1 md:py-2 mb-2"
                      >
                        {newsCreatedAt ? (
                          <p className="text-xss">
                            <span className="text-gray-400">
                              {newsCreatedAt}
                            </span>
                          </p>
                        ) : (
                          <Skeleton width={"25%"} />
                        )}
                      </MotionUp>

                      {/* TITLE */}
                      <div className="group-hover:!text-primary duration-300">
                        <p
                          title={newsTitle}
                          className="font-avenir-black text-body font-avenir-black"
                        >
                          {newsTitle || <Skeleton width={"70%"} />}
                        </p>
                      </div>

                      {/* DESCRIPTION */}
                      <div className="hidden md:block news-desc mb-2">
                        {newsArticle ? (
                          <article
                            dangerouslySetInnerHTML={{ __html: newsArticle }}
                            className="font-avenir line-clamp-2 text-small sm:line-clamp-2 text-gray-500"
                          />
                        ) : (
                          <Skeleton count={2} />
                        )}
                      </div>

                      {/* AUTHOR + READ TIME */}
                      <div>
                        <p className="text-xss">
                          {newsAuthor && newsReadTime ? (
                            <>
                              <span className="text-primary">{newsAuthor}</span>
                              &nbsp;|&nbsp;
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
