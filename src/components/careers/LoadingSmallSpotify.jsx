import Skeleton from "react-loading-skeleton";

const LoadingSmallSpotify = () => {
  return (
    <div className="h-[152px] bg-gray-50 p-4 flex gap-5 items-center">
      <div className="w-[80px] h-[80px] -mt-2">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="flex flex-col flex-auto">
        <div className="">
          <div className="w-full">
            <Skeleton />
            <Skeleton width={"45%"} height={12} />
          </div>
          <Skeleton width={"25%"} />
          <div className="flex gap-2">
            <div className="w-[80%]">
              <Skeleton />
            </div>
            <div className="w-[50%]">
              <Skeleton />
            </div>
            <div className="w-[10%]">
              <Skeleton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSmallSpotify;
