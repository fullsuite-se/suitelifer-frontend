import NewsletterHeader from "../NewsletterHeader";
import LargeViewDesign01 from "../LargeViewDesign01";
import ArticleViewDesign from "../ArticleViewDesign";
import ColoredArticleViewDesign from "../ColoredArticleViewDesign";
import ReadMoreBtn from "../ReadMoreBtn";
import NewsletterArticles from "../NewsletterArticles";
import Divider from "../Divider";

const NewsletterDesign01 = () => {
  const articles = NewsletterArticles;
  return (
    <section>
      <NewsletterHeader year={new Date().toISOString()} />
      <div className="pb-[4%]"></div>

      {/* Contents */}
      <section className="md:flex md:gap-10 md:px-[10%] xl:px-[10%] mb-10">
        <div className="px-[5%] md:px-0 md:w-[66%]">
          <div className="w-[100%]">
            {/* MAIN */}
            <LargeViewDesign01
              image={articles[0].image}
              title={articles[0].title}
              author={articles[0].author}
              readTime={articles[0].readTime}
              datePublished={articles[0].datePublished}
              article={articles[0].article}
            />
            <div className="mt-5 md:m-0"></div>
            <ReadMoreBtn
              href={""}
              title={articles[0].title}
              id={articles[0].id}
            />
            <div className="md:mb-5"></div>
          </div>

          <div className="md:flex gap-10">
            <div className="md:w-[50%]">
              <Divider />
              <ArticleViewDesign
                title={articles[1].title}
                author={articles[1].author}
                readTime={articles[1].readTime}
                datePublished={articles[1].datePublished}
                article={articles[1].article}
                lineclamp={"line-clamp-6"}
              />
              <div className="mt-5"></div>
              <ReadMoreBtn
                href={""}
                title={articles[1].title}
                id={articles[1].id}
              />
            </div>

            <div className="mt-10 md:mt-0 md:w-[50%]">
              <ArticleViewDesign
                image={articles[2].image}
                title={articles[2].title}
                author={articles[2].author}
                readTime={articles[2].readTime}
                datePublished={articles[2].datePublished}
                article={articles[2].article}
                lineclamp={"line-clamp-7"}
              />
              <div className="mt-5"></div>
              <ReadMoreBtn
                href={""}
                title={articles[2].title}
                id={articles[2].id}
              />
            </div>
          </div>
        </div>

        <div className="pt-10 px-[5%] md:w-[34%] md:p-0">
          {/* TOP RIGHT ARTICLE */}
          <div className="">
            <p className={`font-avenir-black text-h6 line-clamp-2`}>
              {articles[1].title}
            </p>
            <p className="text-small pb-3 pt-1">
              <span className={`text-primary`}>{articles[1].author}</span>
              <span className={`text-gray-400`}>&nbsp; |</span>
              <span className={`text-primary`}>
                &nbsp;&nbsp;{articles[1].readTime}
              </span>
              <span className={`text-gray-400`}>&nbsp; |</span>
              <span className={`text-primary`}>
                &nbsp;&nbsp;{articles[1].datePublished}
              </span>
            </p>
            <div
              className={`line-clamp-5 text-body text-justify text-gray-500`}
            >
              <article>{articles[1].article}</article>
            </div>
            <div className="mt-5"></div>
            <ReadMoreBtn
              href={""}
              title={articles[1].title}
              id={articles[1].id}
            />

            <div className="my-5"></div>
          </div>
          {/* COLORED ARTICLE */}
          <ColoredArticleViewDesign
            title={articles[2].title}
            author={articles[2].author}
            readTime={articles[2].readTime}
            datePublished={articles[2].datePublished}
            article={articles[2].article}
            lineclamp={"line-clamp-42"}
          />
          <div className="mt-5"></div>
          <div className="px-[5%] md:px-0">
            <ReadMoreBtn
              href={""}
              title={articles[2].title}
              id={articles[2].id}
            />
          </div>
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
                <ReadMoreBtn
              href={""}
              title={articles[0].title}
              id={articles[0].id}
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
              <ReadMoreBtn
                href={""}
                title={articles[0].title}
                id={articles[0].id}
              />
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default NewsletterDesign01;
