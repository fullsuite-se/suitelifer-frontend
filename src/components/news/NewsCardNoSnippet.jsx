import { Link } from "react-router-dom";
import { toSlug } from "../../utils/slugUrl";
import formatTimestamp from "../../components/TimestampFormatter";

const NewsCardNoSnippet = ({ id, title, author, readTime, created_at, imagesWithCaption }) => {
  const { fullDate } = formatTimestamp(created_at);

  return (
    <Link 
      to={`/news/${id}/${toSlug(title)}`} 
      className="flex gap-4 sm:gap-5 items-center no-underline group rounded-2xl transition-all duration-300 hover:shadow-sm hover:bg-white p-2"
    >
      {/* Responsive Image Sizing */}
      <div className="w-full max-w-[130px] sm:max-w-[160px] md:max-w-[140px] aspect-[3/2] rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300 ease-in-out">
        <img
          className="w-full h-full object-cover group-hover:shadow-lg"
          src={imagesWithCaption[0].image}
          alt={title}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center">
        <h2 className="font-serif font-bold !text-sm sm:text-base md:!text-sm md:line-clamp-2 lg:line-clamp-2 xl:line-clamp-none leading-tight group-hover:text-primary transition duration-300 ease-in-out ">
          {title}
        </h2>
        <div className=" sm:text-sm text-gray-500 !text-sm">
          <span className="text-primary  ">{author}</span> &nbsp;|&nbsp; {readTime}
        </div>
        <p className="!text-xs text-gray-400">{fullDate}</p>
      </div>
    </Link>
  );
};

export default NewsCardNoSnippet;
