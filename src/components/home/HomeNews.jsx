import { ChevronRightIcon } from "@heroicons/react/24/solid";
import mo from "../../assets/images/mo.jpg";
import financeOp from "../../assets/images/finance-op.svg";
import kb_startup from "../../assets/images/keyboard-startup.svg";
import adminOp from "../../assets/images/admin-op.svg";
import newsList from "../news/NewsList";

const HomeNews = () => {

  return (
    <section className="px-7 xl:px-17">
      {/* TITLE: "LATEST COMPANY NEWS" */}
      <div className="mb-5 relative">
        <p
          className="
            absolute -z-10 
            text-[110px] 
            sm:text-[180px] 
            md:text-[200px] 
            lg:text-[280px] 
            xl:text-[380px] 
            -left-5 
            lg:-left-13
            xl:-left-15 transform 
            -translate-y-[60px]
            sm:-translate-y-[90px] 
            md:-translate-y-[100px] 
            lg:-translate-y-[150px] 
            xl:-translate-y-[200px] font-avenir-black text-primary opacity-5"
        >
          NEWS
        </p>
        <p className="font-avenir-black text-2xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-7xl">
          <span className="text-primary">Latest</span> Company News
        </p>
      </div>
      {/* CONTENTS */}
      <section className="flex flex-col lg:flex-row gap-8 lg:gap-6">
        {/* MAIN NEWS (First Item) */}
        <div className="lg:w-1/2 flex px-2 flex-col items-center justify-center">
          {newsList.length > 0 && (
            <a href="#" className="no-underline rounded-2xl cursor-pointer group">
              <div>
              {/* TITLE */}
              <div className="title">
                <p className="sm:text-xl lg:text-2xl line-clamp-2 hover:underline">
                  {newsList[0].title}
                </p>
              </div>
              {/* AUTHOR AND READ TIME */}
              <div className="news-info py-1 md:py-2 mb-2 no-underline!">
                <p className="text-sm">
                  <span className="text-primary">
                    {newsList[0].author}
                  </span>
                  <span className="text-primary">&nbsp; |</span>
                  <span className="text-gray-400">&nbsp;&nbsp;{newsList[0].read_time}</span>
                </p>
              </div>
              {/* IMAGE */}
              <div>
                <img
                  className="aspect-video object-cover rounded-2xl"
                  src={newsList[0].imagesWithCaption[2].image}
                  alt="Main content news image"
                />
              </div>
            </div>
            </a>
          )}
        </div>

        {/* OTHER NEWS (Remaining Items) */}
        <div className="lg:w-1/2 flex flex-col max-h-full overflow-y-auto gap-2 pb-2">
          {newsList.slice(1, 4).map((news) => (
            <a key={news.id} href="" className="no-underline rounded-2xl cursor-pointer px-4 py-3 lg:px-4 transition-all duration-300 hover:shadow-md hover:bg-white">
              <div
                className="other-news flex justify-center items-center gap-2"
              >
                {/* CONTENT */}
                <div className="w-[50%] sm:w-[60%] flex flex-col">
                  <div>
                    {/* TITLE */}
                    <div className="mb-1">
                      <p
                        title={news.title}
                        className="hover:underline text-[12px] line-clamp-2 sm:text-[16px] md:text-lg pr-2 font-avenir-black"
                      >
                        {news.title}
                      </p>
                    </div>
                    {/* DESCRIPTION */}
                    <div className="news-desc pr-2 mb-2">
                      <p className="text-[10px] line-clamp-2 sm:text-[12px] md:text-sm sm:line-clamp-3 text-gray-500">
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
                        <span className="text-gray-400">{news.read_time}</span>
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
            </a>
          ))}
        </div>
      </section>

      <a
        className="text-[10px] z-10 md:mt-2 pr-2 lg:mt-2 sm:text-[16px] no-underline text-primary font-avenir-black flex items-center justify-end gap-1"
        href="news"
      >
        <span className="flex items-end hover:underline">View all</span>
        <ChevronRightIcon className="size-4 sm:size-5 mb-1" />
      </a>
    </section>
  );
};

export default HomeNews;
