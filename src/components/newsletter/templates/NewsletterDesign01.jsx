import NewsletterHeader from "../NewsletterHeader";
import LargeViewDesign01 from "../LargeViewDesign01";
import ArticleViewDesign from "../ArticleViewDesign";
import ColoredArticleViewDesign from "../ColoredArticleViewDesign";
import ReadMoreBtn from "../../buttons/ReadMoreBtn";
import NewsletterArticles from "../NewsletterArticles";
import Divider from "../Divider";
import { useState, useEffect } from "react";
import api from "../../../utils/axios";
import { readingTime } from "reading-time-estimator";
import { removeHtmlTags } from "../../../utils/removeHTMLTags";
import formatTimestamp from "../../../utils/formatTimestamp";
import TwoCirclesLoader from "../../../assets/loaders/TwoCirclesLoader";
import Skeleton from "react-loading-skeleton";
import newsletterStore from "../../../store/stores/newsletterStore";
import MotionUp from "../../animated/MotionUp";
import ArticlePreviewWithHyphenation from "../ArticlePreviewWithHyphenation";

const NewsletterDesign01 = () => {
  const { newsletterContent, setNewsletterContent, isLoading, setIsLoading } =
    newsletterStore();

  useEffect(() => {
    const fetchIssueAndArticles = async () => {
      try {
        const issueRes = await api.get("api/issues/current");
        const current = issueRes.data.currentIssue;

        if (issueRes.data.currentIssue === undefined) {
          return setNewsletterContent({ articles: [], currentIssue: {} });
        }

        const articlesRes = await api.get(
          `/api/newsletter?issueId=${current.issueId}`
        );

        setNewsletterContent({
          articles: articlesRes.data.newsletters,
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

  const getArticleBySection = (articles, sectionNumber) => {
    return (
      articles.find((article) => article.section === sectionNumber) || {
        title: "Coming Soon",
        article: "This section is being prepared. Stay tuned!",
        pseudonym: "FullSuite Team",
        createdAt: new Date().toISOString(),
        newsletterId: "",
        images: [],
      }
    );
  };
  const articles = newsletterContent.articles || [];
  const currentIssue = newsletterContent.currentIssue || {};

  const section1 = getArticleBySection(articles, 1);
  const section2 = getArticleBySection(articles, 2);
  const section3 = getArticleBySection(articles, 3);
  const section4 = getArticleBySection(articles, 4);
  const section5 = getArticleBySection(articles, 5);
  const section6 = getArticleBySection(articles, 6);
  const section7 = getArticleBySection(articles, 7);
  return (
    <div>
      {isLoading ? (
        <div>
          {" "}
          <NewsletterHeader />
          <div className="pb-[4%]"></div>
          <section className="px-[5%] md:px-[10%]">
            <div className="md:flex md:gap-10 mb-10">
              <div className="md:w-[66%]">
                <Skeleton className="w-full aspect-video mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-1" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-10 w-24 mb-6" />
                <div className="md:flex gap-10">
                  <div className="md:w-[50%]">
                    <Skeleton className="h-6 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-10 w-20 mt-4" />
                  </div>
                  <div className="mt-10 md:mt-0 md:w-[50%]">
                    <Skeleton className="h-6 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-10 w-20 mt-4" />
                  </div>
                </div>
              </div>
              <div className="md:w-[34%]">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-10 w-20 mt-4" />
                <div className="my-5" />
                <Skeleton className="h-36 w-full rounded-lg" />
                <Skeleton className="h-10 w-20 mt-4" />
                <Skeleton className="h-150 w-full rounded-lg mt-10" />
              </div>
            </div>
            <div className="w-full bg-primary/10 rounded-lg p-5 flex flex-col md:flex-row gap-6">
              <Skeleton className="w-[242px] h-[242px] rounded-lg hidden xl:block" />
              <div className="flex-1">
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-10 w-20 mt-4" />
              </div>
              <div className="hidden md:block h-full w-px bg-primary" />
              <div className="flex-1">
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-10 w-20 mt-4" />
              </div>
            </div>
          </section>
        </div>
      ) : articles.length > 0 ? (
        <section>
          <MotionUp>
            <NewsletterHeader
              month={currentIssue.month}
              year={currentIssue.year}
            />
          </MotionUp>
          <div className="pb-[4%]"></div>

          {/* Contents */}
          <section className="md:flex md:gap-10 md:px-[10%] xl:px-[10%] mb-10">
            <div className="px-[5%] md:px-0 md:w-[66%]">
              <MotionUp>
                <div className="w-[100%]">
                  {/* MAIN */}
                  <LargeViewDesign01
                    image={section1.images[0]}
                    title={section1.title}
                    author={section1.pseudonym}
                    readTime={
                      readingTime(
                        removeHtmlTags(section1.article ?? "article"),
                        238
                      ).text
                    }
                    datePublished={formatTimestamp(section1.createdAt).fullDate}
                    article={section1.article}
                  />
                  <div className="mt-5 md:m-0"></div>
                  <ReadMoreBtn
                    href={""}
                    title={section1.title}
                    id={section1.newsletterId}
                  />
                  <div className="md:mb-5"></div>
                </div>
                <div className="md:flex gap-10">
                  <div className="md:w-[50%]">
                    <Divider />
                    <ArticleViewDesign
                      title={section2.title}
                      author={section2.pseudonym}
                      image={section2.images[0]}
                      readTime={
                        readingTime(
                          removeHtmlTags(section2.article ?? "article"),
                          238
                        ).text
                      }
                      datePublished={
                        formatTimestamp(section2.createdAt).fullDate
                      }
                      article={section2.article}
                      lineclamp="line-clamp-6"
                    />{" "}
                    <div className="mt-5"></div>
                    <ReadMoreBtn
                      href={""}
                      title={section2.title}
                      id={section2.newsletterId}
                    />
                  </div>
                  <div className="mt-10 md:mt-0 md:w-[50%]">
                    <ArticleViewDesign
                      image={section3.images[0]}
                      title={section3.title}
                      author={section3.pseudonym}
                      readTime={
                        readingTime(
                          removeHtmlTags(section3.article ?? "article"),
                          238
                        ).text
                      }
                      datePublished={
                        formatTimestamp(section3.createdAt).fullDate
                      }
                      article={section3.article}
                      lineclamp="line-clamp-7"
                    />
                    <div className="mt-5"></div>
                    <ReadMoreBtn
                      href={""}
                      title={section3.title}
                      id={section3.newsletterId}
                    />
                  </div>
                </div>
              </MotionUp>
            </div>

            <div className="pt-10 px-[5%] md:w-[34%] md:p-0">
              {/* TOP RIGHT ARTICLE */}
              <MotionUp>
                <div className="">
                  <p className={`font-avenir-black text-h6 line-clamp-2`}>
                    {section4.title}
                  </p>
                  <p className="text-small pb-3 pt-1">
                    <span className="text-primary">{section4.pseudonym}</span>
                    <span className="text-gray-400">&nbsp; |</span>
                    <span className="text-primary">
                      &nbsp;&nbsp;
                      {
                        readingTime(
                          removeHtmlTags(section4.article ?? "article"),
                          238
                        ).text
                      }
                    </span>
                    <span className="text-gray-400">&nbsp; |</span>
                    <span className="text-primary">
                      &nbsp;&nbsp;
                      {formatTimestamp(section4.createdAt).fullDate}
                    </span>
                  </p>
                  <div
                    className={`line-clamp-17 text-body text-justify text-gray-500`}
                  >
                    <ArticlePreviewWithHyphenation content={section4.article} />
                  </div>
                  <div className="mt-5"></div>
                  <ReadMoreBtn
                    href={""}
                    title={section4.title}
                    id={section4.newsletterId}
                  />
                  <div className="my-5"></div>
                </div>
              </MotionUp>
              {/* COLORED ARTICLE */}
              <MotionUp>
                <ColoredArticleViewDesign
                  title={section5.title}
                  author={section5.pseudonym}
                  readTime={
                    readingTime(
                      removeHtmlTags(section5.article ?? "article"),
                      238
                    ).text
                  }
                  datePublished={formatTimestamp(section5.createdAt).fullDate}
                  article={section5.article}
                  lineclamp="md:line-clamp-17 lg:line-clamp-17 xl:line-clamp-25"
                />
                <div className="mt-5"></div>
                <div className="px-[5%] md:px-0">
                  <ReadMoreBtn
                    href={""}
                    title={section5.title}
                    id={section5.newsletterId}
                  />
                </div>
              </MotionUp>
            </div>
          </section>
          {/* <section className="flex flex-col md:flex-row gap-7 px-[5%] md:px-[10%] xl:px-[15%]">
        {[...Array(3)].map((_, index) => (
          <ArticleImageCard
            key={index}
            image="https://plus.unsplash.com/premium_photo-1726729274971-4ef1018ee08a?q=80&w=1968&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            title={articles[0].title}
            author={articles[0].author}
            readTime={articles[0].readTime}
            datePublished={articles[0].datePublished}
          />
        ))}
      </section> */}
          <section className="mt-[4%]">
            <div className="px-[5%] md:px-[10%] xl:px-[10%]">
              <MotionUp>
                <div className="w-full h-full flex flex-col md:flex-row justify-end bg-primary/15 rounded-lg p-[5%] lg:p-[3%]">
                  <div className="flex flex-col md:flex-row gap-4 md:gap-10 xl:w-[60%]">
                    {section6.images[0] ? (
                      <img
                        className="size-[242px] hidden w-full xl:block aspect-video xl:aspect-square object-cover rounded-lg"
                        src={section6.images[0]}
                        alt=""
                      />
                    ) : (
                      <></>
                    )}
                    <div className="">
                      <p className={`font-avenir-black text-h6 line-clamp-2`}>
                        {section6.title}
                      </p>
                      <p className="text-small pb-3 pt-1">
                        <span className={`text-primary`}>
                          {section6.pseudonym}
                        </span>
                        <span className={`text-gray-400`}>&nbsp; |</span>
                        <span className={`text-primary`}>
                          &nbsp;&nbsp;
                          {
                            readingTime(
                              removeHtmlTags(section6.article ?? "article"),
                              238
                            ).text
                          }
                        </span>
                        <span className={`text-gray-400`}>&nbsp; |</span>
                        <span className={`text-primary`}>
                          &nbsp;&nbsp;
                          {formatTimestamp(section6.createdAt).fullDate}
                        </span>
                      </p>
                      <div
                        className={`line-clamp-4 text-body text-justify text-gray-500`}
                      >
                        {" "}
                        <ArticlePreviewWithHyphenation
                          content={section6.article}
                        />
                      </div>
                      <div className="mt-5"></div>
                      <ReadMoreBtn
                        href={""}
                        title={section6.title}
                        id={section6.newsletterId}
                      />
                    </div>
                  </div>
                  <div className="md:hidden">
                    <Divider />
                  </div>
                  <div className="hidden md:block">
                    <div className="px-10 h-full flex flex-col items-center">
                      <div className="size-[1.3vh] bg-primary rounded-full"></div>
                      <div className="bg-primary h-full w-[0.25vh]"></div>
                      <div className="size-[1.3vh] bg-primary rounded-full"></div>
                    </div>
                  </div>
                  <div className="xl:w-[40%]">
                    <p className={`font-avenir-black text-h6 line-clamp-2`}>
                      {section7.title}
                    </p>
                    <p className="text-small pb-3 pt-1">
                      <span className={`text-primary`}>
                        {section7.pseudonym}
                      </span>
                      <span className={`text-gray-400`}>&nbsp; |</span>
                      <span className={`text-primary`}>
                        &nbsp;&nbsp;
                        {
                          readingTime(
                            removeHtmlTags(section7.article ?? "article"),
                            238
                          ).text
                        }
                      </span>
                      <span className="text-gray-400">&nbsp; |</span>
                      <span className="text-primary">
                        &nbsp;&nbsp;
                        {formatTimestamp(section7.createdAt).fullDate}
                      </span>
                    </p>
                    <div
                      className={`line-clamp-4 text-body text-justify text-gray-500`}
                    >
                      <ArticlePreviewWithHyphenation
                        content={section7.article}
                      />
                    </div>
                    <div className="mt-5"></div>
                    <ReadMoreBtn
                      href={""}
                      title={section7.title}
                      id={section7.newsletterId}
                    />
                  </div>
                </div>
              </MotionUp>
            </div>
          </section>
        </section>
      ) : (
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
      )}
    </div>
  );
};

export default NewsletterDesign01;
