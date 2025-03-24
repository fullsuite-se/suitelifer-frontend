import { Link } from "react-router-dom";
import formatTimestamp from "../TimestampFormatter";
import { toSlug } from "../../utils/slugUrl";
import { readingTime } from "reading-time-estimator";
import { removeHtmlTags } from "../../utils/removeHTMLTags";
import { NavLink } from "react-router-dom";

const GuestBlogCard = ({
  id,
  title,
  createdBy,
  description,
  article,
  created_at,
  imageUrl,
}) => {
  const { day, fullDate, time } = formatTimestamp(created_at);

  return (
    <section
      className="relative w-full h-80 lg:h-90 rounded-xl overflow-hidden 
  transform transition-all duration-300 ease-in-out group-hover:scale-105 
  group-hover:shadow-xl group-hover:shadow-secondary/50 active:scale-105 
  active:shadow-xl active:shadow-secondary/50"
    >
      <NavLink
        to={{ pathname: `/blogs/${toSlug(title)}` }}
        state={{ cblog_id: id }}
        className="no-underline cursor-pointer group flex flex-col lg:flex-row-reverse lg:gap-10"
      >
        <div className="relative">
          <img
            className="w-full h-80 lg:h-90 object-cover rounded-xl"
            src={imageUrl}
            alt="Blog Cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80"></div>
        </div>

        <div className="absolute bottom-0 p-4 text-white">
          <h2 className="font-avenir-black !text-base sm:!text-lg md:!text-lg  group-hover:text-secondary transition duration-300 ease-in-out">
            {title}
          </h2>

          <p className="!text-[12px] sm:!text-[14px]  mt-1">
            <span className="text-secondary font-avenir-black">
              {" "}
              {createdBy}
            </span>{" "}
            |{" "}
            {
              readingTime(removeHtmlTags(description ?? "Description"), 238)
                .text
            }
          </p>

          <p className="mt-2 !text-[12px] sm:!text-[14px] text-gray-300 line-clamp-3">
            {article}
          </p>

          <p className="text-xs text-gray-400 mt-2">{fullDate}</p>
        </div>
      </NavLink>
    </section>
  );
};

export default GuestBlogCard;
