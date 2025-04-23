import NewsletterHeader from "../NewsletterHeader";
import NewsletterQuote from "../NewsletterQuote";
import LargeViewDesign01 from "../LargeViewDesign01";
import ArticleViewDesign from "../ArticleViewDesign";
import ColoredArticleViewDesign from "../ColoredArticleViewDesign";
import ReadMoreBtn from "../../buttons/ReadMoreBtn";
import NewsletterArticles from "../NewsletterArticles";
import Divider from "../Divider";

const NewsletterDesign02 = () => {
  const articles = NewsletterArticles;
  return (
    <section>
      <NewsletterHeader year={"2025"} issueNumber={"01"} />
      <div className="pb-[4%]"></div>

      {/* Contents */}
      <section className="md:flex md:gap-10 px-[5%] md:px-[10%] xl:px-[15%]">
        <div className="">
          <ArticleViewDesign
            title={articles[0].title}
            author={articles[0].author}
            readTime={articles[0].readTime}
            datePublished={articles[0].datePublished}
            article={articles[0].article}
            lineclamp={"line-clamp-17"}
          />
          <div className="my-5"></div>
          <ReadMoreBtn href={""} />
          <div className="md:my-7"></div>
          <Divider />
          <ArticleViewDesign
            title={articles[0].title}
            author={articles[0].author}
            readTime={articles[0].readTime}
            datePublished={articles[0].datePublished}
            article={articles[0].article}
            lineclamp={"line-clamp-13 lg:line-clamp-18 xl:line-clamp-25"}
          />
          <div className="my-5"></div>
          <ReadMoreBtn href={""} />
          <div className="mt-5"></div>
        </div>
        <div className="">
          <div className="">
            <LargeViewDesign01
              image={articles[0].image}
              title={articles[0].title}
              author={articles[0].author}
              readTime={articles[0].readTime}
              datePublished={articles[0].datePublished}
              article={articles[0].article}
            />
            <div className="my-5 md:m-0"></div>
            <ReadMoreBtn href={""} />
            <div className="my-10"></div>
          </div>
          <div className="my-5"></div>
          <div className="md:flex gap-10">
            <div className="flex-1 md:px-0">
              <NewsletterQuote
                text={
                  "True innovation begins where curiosity meets opportunity, and every collaboration has the potential to shape the future in ways we never imagined."
                }
              />
            </div>
            <div className="flex-1 md:mt-0">
              <ArticleViewDesign
                image={articles[0].image}
                title={articles[0].title}
                author={articles[0].author}
                readTime={articles[0].readTime}
                datePublished={articles[0].datePublished}
                article={articles[0].article}
                lineclamp={"line-clamp-9"}
              />
              <div className="mt-5"></div>
              <ReadMoreBtn href={""} />
            </div>
          </div>
        </div>
      </section>
      <section className="mt-[4%]">
        <div className="px-[5%] md:px-[10%] xl:px-[15%]">
          <div className="w-full h-full flex flex-col md:flex-row justify-end bg-primary/15 rounded-lg p-[5%] lg:p-[3%]">
            <div className="flex flex-col md:flex-row gap-4 md:gap-10 xl:w-[60%]">
              <img
                className="size-[242px] hidden w-full xl:block aspect-video xl:aspect-square object-cover rounded-lg"
                src={articles[0].image}
                alt=""
              />
              <div className="">
                <p className={`font-avenir-black text-h6 line-clamp-2`}>
                  {articles[0].title}
                </p>
                <p className="text-small pb-3 pt-1">
                  <span className={`text-primary`}>{articles[0].author}</span>
                  <span className={`text-gray-400`}>&nbsp; |</span>
                  <span className={`text-primary`}>
                    &nbsp;&nbsp;{articles[0].readTime}
                  </span>
                  <span className={`text-gray-400`}>&nbsp; |</span>
                  <span className={`text-primary`}>
                    &nbsp;&nbsp;{articles[0].datePublished}
                  </span>
                </p>
                <div
                  className={`line-clamp-4 text-body text-justify text-gray-500`}
                >
                  <article>{articles[0].article}</article>
                </div>
                <div className="mt-5"></div>
                <ReadMoreBtn href={""} />
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
                {articles[0].title}
              </p>
              <p className="text-small pb-3 pt-1">
                <span className={`text-primary`}>{articles[0].author}</span>
                <span className={`text-gray-400`}>&nbsp; |</span>
                <span className={`text-primary`}>
                  &nbsp;&nbsp;{articles[0].readTime}
                </span>
                <span className={`text-gray-400`}>&nbsp; |</span>
                <span className={`text-primary`}>
                  &nbsp;&nbsp;{articles[0].datePublished}
                </span>
              </p>
              <div
                className={`line-clamp-4 text-body text-justify text-gray-500`}
              >
                <article>{articles[0].article}</article>
              </div>
              <div className="mt-5"></div>
              <ReadMoreBtn href={""} />
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default NewsletterDesign02;
