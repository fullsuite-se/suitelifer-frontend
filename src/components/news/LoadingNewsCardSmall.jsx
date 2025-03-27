import Skeleton from "react-loading-skeleton";

const LoadingNewsCardSmall = () => {

  return (
    <div className="group container-news-card-small rounded-2xl transition-all duration-300 flex gap-3 min-w-[0px] hover:scale-98">
      <div className="h-1/2 image-news-card-small size-[25vw] aspect-[3/2] object-cover">
        <Skeleton className="w-full h-full" />
      </div>

      <div className="w-1/2 md:w-full content-news-card-small flex flex-col justify-center">
        <div className="flex flex-col">
          {/* Title */}
          <Skeleton/>

          {/* Article */}
          <div className="article-news-card-small my-2">
            <Skeleton count={4}/>
          </div>

          {/* Author */}
          <div className="author-news-card-small">
            <Skeleton height={12} width={'80%'}/>
          </div>
          {/* Date */}
          <Skeleton height={10} width={'30%'}/>
        </div>
      </div>
    </div>
  );
};

export default LoadingNewsCardSmall;
