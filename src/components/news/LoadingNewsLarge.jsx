import Skeleton from "react-loading-skeleton";

const LoadingNewsLarge = () => {
  return (
    <section
      className="group flex flex-col
    lg:flex-row-reverse lg:gap-10 hover:bg-white"
    >
      {/* Image and article container */}
      <div className="hidden lg:w-1/2 lg:flex flex-col justify-center">
        {/* Title */}
        <div className="h-[5%] mb-2">
          <Skeleton className="h-full"/>
        </div>
        <div className="h-2"></div>
        {/* Author | Read Time */}
        <Skeleton width={"40%"} height={12} />
        <div className="h-2"></div>
        {/* Article */}
        <Skeleton count={4} height={10} />
        {/* Date */}
        <Skeleton width={"20%"} />
      </div>

      {/* MOBILE: TITLE, AUTHOR, READ TIME ON TOP */}
      <div className="lg:hidden">
        {/* Title */}
        <Skeleton />
        <div className="h-2"></div>
        {/* Author | Read Time */}
        <Skeleton width={"40%"} height={12} />
        <div className="h-2"></div>
      </div>
      {/* Image */}
      <div className="my-2 w-full h-full aspect-[3/2] object-cover lg:w-1/2">
        <Skeleton className="h-full w-full" />
      </div>
      {/* Gap */}
      <div className="h-2 lg:hidden"></div>

      {/* MOBILE: ARTICLE AT BOTTOM */}
      <div className="lg:hidden">
        <Skeleton count={4} height={10} />
      </div>
    </section>
  );
};

export default LoadingNewsLarge;
