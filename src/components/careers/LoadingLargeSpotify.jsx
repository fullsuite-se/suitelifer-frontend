import Skeleton from "react-loading-skeleton";

const LoadingLargeSpotify = () => {
  return (
    <div className="h-[352px] pt-7 bg-gray-50 p-4 flex flex-col gap-5">
      <div className="flex justify-center items-center h-1/2">
        <div className="w-[150px] h-[150px]">
          <Skeleton className="w-full h-full" />
        </div>
      </div>
      <div className="h-1/2 flex flex-col justify-evenly">
        <div className="">
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
  );
};

export default LoadingLargeSpotify;
