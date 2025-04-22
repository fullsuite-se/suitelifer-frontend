import { Link } from "react-router-dom";
import formatTimestamp from "../TimestampFormatter";
import { toSlug } from "../../utils/slugUrl";
import { NavLink } from "react-router-dom";
import { removeHtmlTags } from "../../utils/removeHTMLTags";

const GuestBlogLarge = ({
  id,
  title,
  author,
  readTime,
  article,
  createdAt,
  imageUrl,
}) => {
  const { day, fullDate, time } = formatTimestamp(createdAt);

  return (
    <section
      className="relative w-full h-100 md:h-130 rounded-3xl overflow-hidden  transform transition-all duration-300 ease-in-out group-hover:scale-105 
  group-hover:shadow-xl group-hover:shadow-secondary/50 active:scale-105 
  active:shadow-xl active:shadow-secondary/50"
    >
      <NavLink
        to={{ pathname: `/blogs/${toSlug(title)}` }}
        state={{ cblog_id: id }}
        className="no-underline cursor-pointer group lg:gap-10"
      >
        <div className="relative">
          <img
            className="w-full h-100 md:h-130 object-cover rounded-3xl"
            src={imageUrl}
            alt="Blog Cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-80"></div>
        </div>

        <div className="absolute bottom-0 p-7 text-white lg:p-15">
          <p
            className="font-avenir-black text-h5 group-hover:text-secondary transition duration-300 ease-in-out
          "
          >
            {title}
          </p>
          <p className="text-small mt-1">
            <span className="text-secondary font-avenir-black"> {author}</span>{" "}
            | {readTime}
          </p>
          <p className="mt-2 text-body text-gray-300 line-clamp-3">{removeHtmlTags(article)} </p>

          <p className="text-xss text-gray-400 mt-2">{fullDate}</p>
        </div>
      </NavLink>
    </section>
  );
};

export default GuestBlogLarge;
