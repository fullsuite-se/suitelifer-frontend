import React from "react";
import Footer from "../../components/Footer";
import MobileNav from "../../components/home/MobileNav";
import TabletNav from "../../components/home/TabletNav";
import DesktopNav from "../../components/home/DesktopNav";

const AboutUs = () => {
  return (
    <section className="">
      {/* MOBILE NAV */}
      <div className="sm:hidden">
        <MobileNav />
      </div>
      {/* TABLET NAV */}
      <div className="tablet-nav">
        <TabletNav />
      </div>
      <div className="desktop-nav">
        <DesktopNav />
      </div>
      <main className="md:mt-20">
        {/* Hero Section */}
        <section className="overflow-hidden about-container">
          <div className="h-56 w-72">
            <img
              className="w-full h-full object-cover rounded-r-3xl"
              src="https://images.unsplash.com/photo-1739382121445-19b3460a9e7a?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </div>
          <div className="about-text-banner flex flex-col mb-2">
            <h1 className="font-avenir-black px-5">text banner here</h1>
            <div className="h-10 w-20 lg:h-20 lg:w-32 rounded-l-2xl bg-primary ml-auto"></div>
          </div>
          <div className="mx-5">
            <img
              className="w-full h-full object-cover rounded-3xl"
              src="https://images.unsplash.com/photo-1739382120576-b1434e8bc4d3?q=80&w=1975&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </div>
          <section className="flex flex-col gap-3 mt-5 mx-5">
            <p className="text-primary text-center text-sm font-avenir-black">
              OUR STORY
            </p>
            <h2 className="font-avenir-black lg:text-4xl! text-center m-0!">
              Lorem, ipsum dolor it
            </h2>
            <p className="text-lg leading-tight">
              FullSuite is the preferred and trusted offshore service provider
              to help data-intense tech companies scale operations and revenue
              at a fraction of the cost of traditional staffing.
            </p>
            <p className="text-sm">
              FullSuite is the preferred and trusted offshore service provider
              to help data-intense tech companies scale operations and revenue
              at a fraction of the cost of traditional staffing. FullSuite is
              the preferred and trusted offshore service provider to help
              data-intense tech companies scale operations and revenue at a
              fraction of the cost of traditional staffing. FullSuite is the
              preferred and trusted offshore service provider to help
              data-intense tech companies scale operations and revenue at a
              fraction of the cost of traditional staffing. FullSuite is lorem
              ipsum the preferred and trusted offshore service provider to help
              data-intense.
            </p>
          </section>
          <section className="">
            <div className="flex justify-between overflow-ellipsis mb-4">
              <div className="h-10 w-20 lg:h-20 lg:w-32 rounded-r-full lg:rounded-full bg-secondary opacity-35 self-end"></div>
              <div className="h-20 w-20 lg:h-20 lg:w-32 rounded-2xl bg-primary opacity-15 relative -top-10 -right-10"></div>
            </div>
            <div className="max-w-4xl h-72 lg:h-96 mx-5">
              <video className="w-full h-full rounded-xl object-cover" controls>
                <source src="#" type="video/mp4" />
              </video>
            </div>
          </section>
          <section>
            <p className="text-sm m-5">
              FullSuite is the preferred and trusted offshore service provider
              to help data-intense tech companies scale operations and revenue
              at a fraction of the cost of traditional staffing. FullSuite is
              the preferred and trusted offshore service provider to help
              data-intense tech companies scale operations and revenue at a
              fraction of the cost of traditional staffing. FullSuite is the
              preferred and trusted offshore service provider to help
              data-intense tech companies scale operations and revenue at a
              fraction of the cost of traditional staffing. FullSuite is lorem
              ipsum the preferred and trusted offshore service provider to help
              data-intense.
            </p>
            <p className="text-sm mx-5">
              FullSuite is the preferred and trusted offshore service provider
              to help data-intense tech companies scale operations and revenue
              at a fraction of the cost of traditional staffing. FullSuite is
              the preferred and trusted offshore service provider to help
              data-intense tech companies scale operations and revenue at a
              fraction of the cost of traditional staffing. FullSuite is the
              preferred and trusted offshore service provider to help
              data-intense tech companies scale operations and revenue at a
              fraction of the cost of traditional staffing. FullSuite is lorem
              ipsum the preferred and trusted offshore service provider to help
              data-intense.
            </p>
          </section>
          <section className="flex gap-2 my-5 justify-end">
            <div className="h-2 w-2 lg:w-3 lg:h-3 rounded-full opacity-30 bg-primary"></div>
            <div className="h-2 w-2 lg:w-3 lg:h-3 rounded-full opacity-50 bg-primary"></div>
            <div className="h-2 w-2 lg:w-3 lg:h-3 rounded-full opacity-100 bg-primary"></div>
            <div
              className="w-32 lg:w-44 lg:h-3 rounded-l-xl h-2"
              style={{
                background:
                  "linear-gradient(90deg, rgba(0,151,178,1) 0%, rgba(0,151,178,0.7455357142857143) 50%, rgba(0,151,178,0.33657212885154064) 100%)",
              }}
            ></div>
          </section>
        </section>

        {/* Our Core Values Section */}
        <section>
          <p className="text-primary text-center text-sm font-avenir-black">
            OUR CORE VALUES
          </p>
        </section>
      </main>

      <Footer />
    </section>
  );
};

export default AboutUs;
