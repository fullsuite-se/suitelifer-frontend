import { Link } from "react-router-dom";
import formatTimestamp from "../TimestampFormatter";
import { toSlug } from "../../utils/slugUrl";

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
      <Link
        to={`/news/${id}/${toSlug(title)}`}
        className="no-underline cursor-pointer group flex flex-col lg:flex-row-reverse lg:gap-10"
      >
        <div className="lg:w-1/2 flex flex-col justify-center">
          {/* Title */}
          <p className="hover:underline line-clamp-2 text-lg lg:text-2xl font-avenir-black xl:text-4xl">
            {title}
          </p>

          {/* Author | Read Time */}
          <p className="text-sm lg:text-[16px] lg:py-4 py-1">
            <span className="text-primary">{author}&nbsp;&nbsp;</span>
         <span className="text-gray-400">|   &nbsp;&nbsp;{readTime}</span>
          </p>

          {/* Article */}
          <div className="hidden lg:block">
            <p className="text-lg lg:line-clamp-6 lg:overflow-hidden text-gray-400">
              {article}
            </p><p className=" text-gray-400 mt-2 !text-sm lg:!text-[14px] ">{fullDate}</p>
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
      </Link>
    </section>
  );
};

export default NewsLarge;
