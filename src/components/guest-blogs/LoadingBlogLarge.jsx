import Skeleton from "react-loading-skeleton";

const LoadingBlogLarge = () => {
  return (
    <section
      className="relative rounded-3xl w-full h-100 md:h-130 overflow-hidden"
    >
      <div
        className="lg:gap-10"
      >
        {/* image */}
        <div className="relative">
          <div className="w-full h-100 md:h-130 object-cover bg-gray-50">
          </div>
        </div>

        <div className="absolute w-full bottom-0 p-7 lg:p-15">
          <Skeleton width={'50%'} height={25}/>
          <div className="py-2"></div>
          <Skeleton width={'20%'}/>
          <div className="py-2"></div>
          <Skeleton width={'40%'} count={3} height={12}/>
          <div className="py-2"></div>
          <Skeleton width={'10%'} height={12}/>
        </div>
      </div>
    </section>
  );
};

export default LoadingBlogLarge;
