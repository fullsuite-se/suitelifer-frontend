import React from "react";
import MobileNav from "../home/MobileNav";
import TabletNav from "../home/TabletNav";
import DesktopNav from "../home/DesktopNav";
import BackToTop from "../BackToTop";
import Footer from "../Footer";
import LoadingBlogCard from "../guest-blogs/LoadingBlogCard";
import { readingTime } from "reading-time-estimator";
import BackButton from "../BackButton";
import Skeleton from "react-loading-skeleton";

const LoadingArticleDetails = () => {
  return (
    <>
      <section
        className="gap-4 h-dvh"
        style={{ maxWidth: "2000px", margin: "0 auto" }}
      >
        <div className="sm:hidden">
          <MobileNav />
        </div>
        <div className="tablet-nav">
          <TabletNav />
        </div>
        <div className="desktop-nav">
          <DesktopNav />
        </div>
        <main className="px-[7%] pt-[10%] xl:pt-[8%] md:px-[5%] lg:px-[8%]">
          <BackButton backPath={-1} />
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-10">
            {/* Main Article */}
            <div>
              {/* Type */}
              <Skeleton width={40} />
              {/* Title */}
              <Skeleton width={"40%"} />

              {/* Author | Readtime */}
              <Skeleton width={"40%"} height={12} />

              {/* Full date */}
              <Skeleton width={20} />
              <div className="py-5"></div>
              {/* Image Carousel */}
              <Skeleton className="h-[90vh]" />
              <div className="py-5"></div>
              {/* Content */}
              <Skeleton count={15} />
            </div>

            {/* Related Articles */}
            <div className="overflow-y-auto lg:px-5 lg:h-[100vh]">
              <p className="text-small mt-5 font-avenir-black text-primary pb-3 lg:pb-4">
                Read More
              </p>
              <div className="grid grid-cols-1 gap-2 justify-center items-center">
                {[...Array(5)].map((_, index) => (
                  <section
                  key={index}
                    className="relative h-30 w-full rounded-xl overflow-hidden"
                  >
                    <div className="no-underline bg-gray-50 cursor-pointer flex flex-col h-full">
                      <div className="h-1/2">
                        {/* <Skeleton className="h-full"/> */}
                      </div>
                      <div className="p-4 text-white">
                        <Skeleton width={"50%"} />

                        <Skeleton height={8} count={2}  />
                      </div>
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </main>
        <div className="h-30"></div> <BackToTop />
        <Footer />
      </section>
    </>
  );
};

export default LoadingArticleDetails;
