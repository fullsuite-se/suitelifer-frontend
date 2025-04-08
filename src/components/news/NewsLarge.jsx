import { NavLink } from "react-router-dom";
import formatTimestamp from "../TimestampFormatter";
import { toSlug } from "../../utils/slugUrl";
import { readingTime } from "reading-time-estimator";

const NewsLarge = ({
  id,
  title,
  article,
  createdBy,
  createdByName,
  createdAt,
  imgUrls,
}) => {
  const { fullDate } = formatTimestamp(createdAt);

  return (
    <section>
      {/* Image and article container */}
      <NavLink
        to={{
          pathname: `/news/${toSlug(title)}`,
        }}
        state={{ id: id }}
        className="no-underline cursor-pointer group flex flex-col
        lg:flex-row-reverse lg:gap-10 hover:bg-white
        hover:rounded-xl transition-all duration-300"
      >
        <div className="lg:w-1/2 flex flex-col justify-center">
          {/* Title */}
          <p className="group-hover:!text-primary transition-all duration-200 line-clamp-2 text-h5 font-avenir-black ">
            {title}
          </p>

          {/* Author | Read Time */}
          <p className="text-small py-2">
            <span className="text-primary">
              {createdByName.split(" ")[0]}&nbsp;&nbsp;
            </span>
            <span className="text-gray-400">
              | &nbsp;&nbsp;{readingTime(article, 238).text}
            </span>
          </p>

          {/* Article */}
          <div className="hidden lg:block">
            <p className="text-body lg:line-clamp-3 xl:line-clamp-6 lg:overflow-hidden text-gray-500 font-avenir">
              {article.replace(/<[^>]+>/g, "")}
            </p>
            <p className=" text-gray-400 mt-2 text-xss">
              {fullDate}
            </p>
          </div>
        </div>
        {/* Image */}
        <img
          className="my-2 w-full h-full aspect-[3/2] object-cover lg:w-1/2 rounded-2xl"
          src={imgUrls[0]}
          alt="News image"
        />
        {/* Gap */}
        <div className="h-2 lg:hidden"></div>
        {/* Article */}
        <article className="text-body lg:hidden line-clamp-4 md:line-clamp-6 lg:line-clamp-1 lg:overflow-hidden text-gray-500 font-avenir">
          {article.replace(/<[^>]+>/g, "")}
        </article>
      </NavLink>
    </section>
  );
};

export default NewsLarge;
