import { NavLink } from "react-router-dom";
import formatTimestamp from "../TimestampFormatter";
import { toSlug } from "../../utils/slugUrl";
import { readingTime } from "reading-time-estimator";

const NewsCardSmall = ({
  id,
  title,
  article,
  createdByName,
  createdAt,
  imgUrls,
}) => {
  const { fullDate } = formatTimestamp(createdAt);

  return (
    <NavLink
      to={{
        pathname: `/news/${toSlug(title)}`,
      }}
      state={{ id: id }}
      className="group container-news-card-small rounded-2xl transition-all duration-300 flex gap-3 no-underline min-w-[0px] hover:scale-98"
    >
      <img
        className="h-1/2 image-news-card-small size-[25vw] aspect-[3/2] object-cover "
        src={imgUrls[0]}
        alt="News image"
      />

      <div className="w-1/2 md:w-full content-news-card-small flex flex-col justify-center ">
        <div className="flex flex-col">
          <p className="content-title line-clamp-3 font-avenir-black sm:text-lg group-hover:!text-primary transition-all duration-100">
            {title}
          </p>

          <article className="article-news-card-small text-gray-400 line-clamp-4 my-2 font-avenir">
            {article.replace(/<[^>]+>/g, "")}
          </article>

          <p className="author-news-card-small line-clamp-1">
            <span className="text-primary">
              {createdByName.split(" ")[0]}&nbsp;&nbsp;|
            </span>
            &nbsp;&nbsp;
            <span className="text-gray-400">
              {readingTime(article, 238).text}
            </span>
          </p>

          <p className="text-xs text-gray-400 mt-2">{fullDate}</p>
        </div>
      </div>
    </NavLink>
  );
};

export default NewsCardSmall;
