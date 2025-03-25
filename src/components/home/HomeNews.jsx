import { ChevronRightIcon } from "@heroicons/react/24/solid";
import newsList from "../news/NewsList";
import { Link } from "react-router-dom";
import { toSlug } from "../../utils/slugUrl";
import MotionUp from "../MotionUp";

const HomeNews = () => {
  return (
    <section className="px-7 xl:px-17">
      <div className="mb-5 relative">
     
   <MotionUp className=" font-avenir-black text-2xl lg:mb-15 sm:text-4xl md:text-4xl lg:text-5xl xl:text-7xl">
  <span className="text-primary">Latest</span> Company News
</MotionUp>

      </div>
      {/* CONTENTS */}
      <section className="flex flex-col lg:flex-row gap-0 lg:gap-10">
        {/* MAIN NEWS (First Item) */}
        <MotionUp className="lg:w-1/2 flex px-2 flex-col items-center justify-center">
          {newsList.length > 0 && (
            <Link
              to={`/news/${newsList[0].id}/${toSlug(newsList[0].title)}`}
              className="no-underline rounded-2xl cursor-pointer group  hover:bg-white"
            >
              <div className="group-hover:!text-primary">
                {/* IMAGE */}
                <MotionUp className="mb-5">
                  <img
                    className="aspect-video object-cover rounded-2xl lg:w-full xl:h-[400px]!"
                    src={newsList[0].imagesWithCaption[2].image}
                    alt="Main content news image"
                  />
                </MotionUp>
                {/* TITLE */}
                <MotionUp
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="title w-fit hover:text-primary!"
                >
                  <p className="font-avenir-black  sm:text-xl lg:text-2xl line-clamp-2">
                    {newsList[0].title}
                  </p>
                </MotionUp>
                {/* AUTHOR AND READ TIME */}
                <MotionUp
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                  className="news-info py-1 md:py-2 mb-2 no-underline!"
                >
                  <p className="text-[12px]">
                    <span className="text-primary">{newsList[0].author}</span>
                    <span className="text-primary">&nbsp; |</span>
                    <span className="text-gray-400">
                      &nbsp;&nbsp;{newsList[0].readTime}
                    </span>
                  </p>
                </MotionUp> <div className="news-desc pr-2 mb-2">
                        <p className="font-avenir text-[10px] line-clamp-3  md:line-clamp-5! xl:line-clamp-3! sm:text-[12px] md:text-sm text-gray-500 ">
                          {newsList[0].article}
                        </p>
                      </div>
              </div>
            </Link>
          )}
        </MotionUp>
        <br />
        {/* OTHER NEWS (Remaining Items) */}
        <div className="lg:w-1/2 flex flex-col max-h-full overflow-y-auto gap-2 pb-2">
          <a
            className="text-[12px] z-10 md:mt-2 pr-2 lg:mt-2 sm:text-[14px] no-underline text-primary font-avenir-black flex items-center justify-end gap-1"
            href="news"
          >
            <span className="flex items-end ">View all</span>
            <ChevronRightIcon className="size-4 sm:size-5 mb-1" />
          </a>
          {newsList.slice(1, 4).map((news) => (
            <Link
              key={news.id}
              to={`/news/${news.id}/${toSlug(newsList[0].title)}`}
              className="group no-underline rounded-2xl cursor-pointer px-2 py-3 lg:px-4 transition-all duration-300 hover:shadow-sm hover:bg-white "
            >
              <MotionUp>
                <div className="other-news flex justify-center items-center gap-2 ">
                  {/* CONTENT */}
                  <div className="w-[50%] sm:w-[60%] flex flex-col">
                    <div className="group-hover:!text-primary">
                      {/* TITLE */}
                      <div className="mb-1 ">
                        <p
                          title={news.title}
                          className="font-avenir-black  text-[12px] line-clamp-2 sm:text-[16px] md:text-lg pr-2 font-avenir-black"
                        >
                          {news.title}
                        </p>
                      </div>
                      {/* DESCRIPTION */}
                      <div className="news-desc pr-2 mb-2">
                        <p className="font-avenir text-[10px] line-clamp-2 sm:text-[12px] md:text-sm sm:line-clamp-3   text-gray-500">
                          {news.article}
                        </p>
                      </div>
                      {/* AUTHOR AND READ TIME */}
                      <div className="news-info">
                        <p className="text-sm text-[10px] sm:text-[12px] md:text-sm">
                          <span className="text-primary">
                            {news.author} &nbsp; |
                          </span>
                          &nbsp;{" "}
                          <span className="text-gray-400">{news.readTime}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* IMAGE */}
                  <div className="w-[50%] sm:w-[40%] h-full flex items-center">
                    <img
                      className="aspect-video h-full object-cover rounded-md sm:rounded-xl"
                      src={news.imagesWithCaption[0].image}
                      alt="News image"
                    />
                  </div>
                </div>
              </MotionUp>
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
};

export default HomeNews;
