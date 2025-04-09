import NewsletterHeader from "./NewsletterHeader";
import NewsletterQuote from "./NewsletterQuote";
import LargeViewDesign01 from "./LargeViewDesign01";
import ArticleViewDesign from "./ArticleViewDesign";
import ColoredArticleViewDesign from "./ColoredArticleViewDesign";
import ReadMoreBtn from "./ReadMoreBtn";

const NewsletterDesign01 = () => {
  const articles = [
    {
      image:
        "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: `FullSuite Partners with Leading Universities for Internship Program`,
      author: `John Wick`,
      readTime: `5 min read`,
      datePublished: `April 05, 2025`,
      article: `This is a placeholder text designed to fill in spaces and give you a
          sense of how content will appear on the page. It's often used during
          the design process to allow designers and developers to focus on
          layout and visual elements without being distracted by the actual
          content. In real-world applications, this text will be replaced with
          relevant information, such as descriptions, articles, or product
          details. However, for now, it serves as a stand-in to show how the
          final copy will look once it's added. During the early stages of
          website development or design, placeholder text like this helps fill
          gaps and gives a rough idea of how the design will come together. It's
          especially useful when content is not yet ready or when you need to
          test the responsiveness and flow of a layout. Placeholder text can
          also be helpful for understanding how different lengths of content
          will affect the overall design. As you continue with the development
          process, you will replace this text with the actual content for your
          website, blog, or application. Whether it's a short description,
          detailed instructions, or in-depth content, replacing placeholder text
          with real words is a critical step in finalizing any project. It's
          also important to ensure that the tone, style, and messaging align
          with the goals and audience of your project. In conclusion, while
          placeholder text may seem like a minor detail, it plays an important
          role in the development and design process. It helps visualize how
          your content will fit into the design, guiding decisions on layout,
          font sizes, and overall appearance. However, for now, it serves as a stand-in to show how the
          final copy will look once it's added.`,
    },
  ];
  return (
    <section>
      <NewsletterHeader year={"2025"} issueNumber={"01"} />
      <div className="pb-[4%]"></div>

      {/* Contents */}
      <section className="md:flex md:gap-10 md:px-[10%] xl:px-[15%]">
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
            <ReadMoreBtn href={""} />
          </div>

          <div className="md:flex gap-10">
            <div className="">
              <div className="flex items-center justify-end py-8 md:py-0 md:pb-7">
                <div className="size-[1.3vh] bg-primary rounded-full"></div>
                <div className="w-full h-[0.25vh] bg-primary"></div>
                <div className="size-[1.3vh] bg-primary rounded-full"></div>
              </div>
              <ArticleViewDesign
                title={articles[0].title}
                author={articles[0].author}
                readTime={articles[0].readTime}
                datePublished={articles[0].datePublished}
                article={articles[0].article}
                lineclamp={"line-clamp-21"}
              />
              <div className="md:mt-5"></div>
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
              <div className="md:mt-5"></div>
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
          <div className="md:mt-5"></div>
          <ReadMoreBtn href={""} />
        </div>
      </section>
      {/* HEIGHT DUMMY */}
      {/* <div className="h-dvh my-5 grid place-content-center bg-amber-100 text-center p-5">
        <i>
          This height is but an illusion, a mere construct of perception, bound
          by the limits we choose to accept.
        </i>
      </div> */}
    </section>
  );
};

export default NewsletterDesign01;
