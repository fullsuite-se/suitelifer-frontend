import formatTimestamp from "../TimestampFormatter";
import { toSlug } from "../../utils/slugUrl";
import { readingTime } from "reading-time-estimator";
import { removeHtmlTags } from "../../utils/removeHTMLTags";
import Skeleton from "react-loading-skeleton";

const LoadingBlogCard = ({
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
      <div className="no-underline bg-white cursor-pointer flex flex-col h-full">       
        <div className="h-1/2">
          <Skeleton className="h-full"/>
        </div>
        <div className="h-1/2 p-4 text-white">          
          <Skeleton width={"50%"} />

          <Skeleton height={10} />

          <Skeleton height={10} count={3} />

          <Skeleton height={8} width={"35%"} />
        </div>
      </div>
    </section>
  );
};

export default LoadingBlogCard;
