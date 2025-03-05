import formatTimestamp from "../TimestampFormatter";

const NewsLarge = ({
  id,
  title,
  author,
  readTime,
  article,
  created_at,
  imagesWithCaption,
}) => {
  const { day, fullDate, time } = formatTimestamp(created_at);

  return (
    <section>
      {/* Image and article container */}
      <a href="" className="no-underline cursor-pointer group flex flex-col lg:flex-row-reverse lg:gap-10">
        <div className="lg:w-1/2 flex flex-col justify-center">
            {/* Title */}
            <p className="hover:underline line-clamp-2 text-lg lg:text-2xl lg:font-avenir-black xl:text-4xl">{title}</p>

            {/* Author | Read Time */}
            <p className="text-sm lg:text-[16px] lg:py-4 py-1">
              <span className="text-primary">{author}&nbsp;&nbsp;|</span>
              &nbsp;&nbsp;<span className="text-gray-400">{readTime}</span>
            </p>

            {/* Article */}
            <div className="hidden lg:block">
              <p className="text-lg lg:line-clamp-6 lg:overflow-hidden text-gray-400">
                {article}
              </p>
            </div>
        </div>
        {/* Image */}
        <img
          className="my-2 w-full h-full aspect-[3/2] object-cover lg:w-1/2 rounded-2xl"
          src={imagesWithCaption[2].image}
          alt="News image"
        />
        {/* Gap */}
        <div className="h-2 lg:hidden"></div>
        {/* Article */}
        <article className="lg:hidden line-clamp-4 md:line-clamp-6 lg:line-clamp-1 lg:overflow-hidden text-gray-400">
          {article}
        </article>
      </a>
      {/* <span className="text-end text-primary -mt-1 font-avenir-black hover:underline cursor-pointer">Read the full article here</span> */}
    </section>
  );
};

export default NewsLarge;
