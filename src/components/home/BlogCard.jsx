import { Link } from "react-router-dom";
import { toSlug } from "../../utils/slugUrl";
import formatTimestamp from "../TimestampFormatter";

const BlogCard = ({
  id,
  title,
  author,
  created_at,
  article,
  readTime,
  images,
}) => {
  const { fullDate } = formatTimestamp(created_at);
  return (
    <div className="rounded-2xl md:max-w-[400px] aspect-[3/4] bg-white shadow-sm">
      <Link
        to={`/blogs/${id}/${toSlug(title)}`}
        className="no-underline rounded-2xl"
      >
        {/* Image */}
        <div>
          <img
            className="rounded-t-2xl h-full w-full aspect-video object-cover"
            src={images[0].image}
            alt="Blog post image"
          />
        </div>
        <div className="small-blog-card-content p-4">
          {/* Title */}
          <div>
            <p className="font-sansita-semi-bold text-[16px] md:text-[28px] sm:text-xl lg:text-[20px] line-clamp-2">
              {title}
            </p>
          </div>
          {/* Author and date/time posted */}
          <div className="text-sm sm:text-[18px] md:text-[12px] lg:text-sm py-1 sm:py-3 flex justify-between">
            <span className="text-primary">{author}</span>
            <span className="text-gray-400">{readTime}</span>
          </div>
          {/* Description */}
          <div className="">
            <p className="small-blog-card text-sm sm:text-[18px] md:text-[12px] lg:text-sm !line-clamp-4">
              {article}
            </p>
          </div>
          <p className="text-xs text-gray-400 mt-2">{fullDate}</p>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;
