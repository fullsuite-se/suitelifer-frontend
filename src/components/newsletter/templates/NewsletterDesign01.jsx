import NewsletterHeader from "../NewsletterHeader";
import NewsletterQuote from "../NewsletterQuote";
import LargeViewDesign01 from "../LargeViewDesign01";
import ArticleViewDesign from "../ArticleViewDesign";
import ColoredArticleViewDesign from "../ColoredArticleViewDesign";
import ReadMoreBtn from "../ReadMoreBtn";
import NewsletterArticles from "../NewsletterArticles";
import Divider from "../Divider";
import ArticleImageCard from "../ArticleImageCard";

const NewsletterDesign01 = () => {
  const articles = NewsletterArticles;
  return (
    <section>
      <NewsletterHeader year={"2025"} issueNumber={"01"} />
      <div className="pb-[4%]"></div>

      {/* Contents */}
      <section className="md:flex md:gap-10 md:px-[10%] xl:px-[15%] mb-10">
        <div className="px-[5%] md:px-0">
          <div className="">
            <LargeViewDesign01
              image={articles[0].image}
              title={articles[0].title}
              author={articles[0].author}
              readTime={articles[0].readTime}
              datePublished={articles[0].datePublished}
              article={articles[0].article}
            />
            <div className="mt-5 md:m-0"></div>
            <ReadMoreBtn href={""} />
            <div className="md:mb-5"></div>
          </div>

          <div className="md:flex gap-10">
            <div className="">
              <Divider />
              <ArticleViewDesign
                title={articles[0].title}
                author={articles[0].author}
                readTime={articles[0].readTime}
                datePublished={articles[0].datePublished}
                article={articles[0].article}
                lineclamp={"line-clamp-21"}
              />
              <div className="mt-5"></div>
              <ReadMoreBtn href={""} />
            </div>

            <div className="mt-10 md:mt-0">
              <ArticleViewDesign
                image={articles[0].image}
                title={articles[0].title}
                author={articles[0].author}
                readTime={articles[0].readTime}
                datePublished={articles[0].datePublished}
                article={articles[0].article}
                lineclamp={"line-clamp-14"}
              />
              <div className="mt-5"></div>
              <ReadMoreBtn href={""} />
            </div>
          </div>
        </div>

        <div className="md:mt-0">
          <div className="px-[5%] md:px-0">
            <NewsletterQuote
              text={
                "Every story has the power to inspire change, and every issue brings you closer to the next big idea."
              }
            />
          </div>
          <ColoredArticleViewDesign
            title={articles[0].title}
            author={articles[0].author}
            readTime={articles[0].readTime}
            datePublished={articles[0].datePublished}
            article={articles[0].article}
            lineclamp={"line-clamp-42"}
          />
          <div className="mt-5"></div>
          <div className="px-[5%] md:px-0">
            <ReadMoreBtn href={""} />
          </div>
        </div>
      </section>
      <section className="flex flex-col md:flex-row gap-7 px-[5%] md:px-[10%] xl:px-[15%]">
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
      </section>
    </section>
  );
};

export default NewsletterDesign01;
