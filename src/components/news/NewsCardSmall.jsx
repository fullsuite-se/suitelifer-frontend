import { Link } from "react-router-dom";
import formatTimestamp from "../TimestampFormatter";
import { toSlug } from "../../utils/slugUrl";

const NewsCardSmall = ({
  id,
  title,
  author,
  readTime,
  article,
  created_at,
  imagesWithCaption,
}) => {
  const { fullDate } = formatTimestamp(created_at);

  return (
    <Link
      to={`/news/${id}/${toSlug(title)}`}
      className="group container-news-card-small rounded-2xl transition-all duration-300 flex gap-3 no-underline min-w-[0px] hover:scale-95"
    >
      <img
        className="image-news-card-small size-[25vw] aspect-[3/2] object-cover "
        src={imagesWithCaption[0].image}
        alt="News image"
      />

      <div className="content-news-card-small flex flex-col justify-center">
        <div className="flex flex-col">
          <p className="content-title line-clamp-3 font-serif font-bold sm:text-lg group-hover:!text-primary transition-all duration-100">
            {title}
          </p>

          <article className="article-news-card-small text-gray-400 line-clamp-4 my-2 font-serif ">
            {article}
          </article>

          <p className="text-[14px] author-news-card-small">
            <span className="text-primary">{author}&nbsp;&nbsp;|</span>
            &nbsp;&nbsp;<span className="text-gray-400">{readTime}</span>
          </p>

          <p className="text-xs text-gray-400 mt-2">{fullDate}</p>
        </div>
      </div>
    </Link>
  );
};

export default NewsCardSmall;
