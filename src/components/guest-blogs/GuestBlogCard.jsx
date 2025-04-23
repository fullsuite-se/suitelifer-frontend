import formatTimestamp from "../../utils/formatTimestamp";
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
  const { fullDate } = formatTimestamp(created_at);

  return (
    <section
      className="relative md:max-w-[320px] w-full h-80 lg:h-90 rounded-xl overflow-hidden 
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

        <div className="absolute left-0 bottom-0 p-4 text-white">
          <p className="font-avenir-black text-body group-hover:text-secondary transition duration-300 ease-in-out">
            {title}
          </p>

          <p className="text-xss line-clamp-1 mt-1 opacity-80">
            <span className="text-secondary font-avenir-black">
              {" "}
              {createdBy.trim().split(" ")[0]}
            </span>{" "}
            |{" "}
            {
              readingTime(removeHtmlTags(description ?? "Description"), 238)
                .text
            }
          </p>

          <p className="mt-2 text-small opacity-80 line-clamp-3">
            {description}
          </p>

          <p className="text-xss opacity-50 mt-2">{fullDate}</p>
        </div>
      </NavLink>
    </section>
  );
};

export default GuestBlogCard;
