import React from "react";
import deactivatedImg from "../../assets/images/deactivated-acc.webp";
import fullsuitelogo from "../../assets/logos/logo-fs-full.svg";
import { useLocation, useNavigate } from "react-router-dom";

const DeactivatedPage = () => {
  return (
    <section
      className="gap-4 h-dvh"
      style={{ maxWidth: "1800px", margin: "0 auto" }}
    >
      <div className="pl-5 pt-5 xl:pt-10">
        <a href="/">
          <img
            src={fullsuitelogo}
            alt="fullsuite logo"
            className="w-auto h-[20px] xl:h-[30px] pointer-events-none"
          />
        </a>
      </div>
      <section className="pt-[20%] lg:pt-0 xl:pt-[5%]">
        <main className="px-[5%]">
          <div className="">
            <div className="flex flex-col items-center justify-center space-y-4 text-sm p-10 md:p-12 lg:p-15 xl:px-50  text-center">
              <img
                src={deactivatedImg}
                alt="not found"
                className="w-auto h-[150px] md:h-[250px] lg:h-[150px] xl:h-[250px] pointer-events-none"
              />{" "}
              {/* Adjusted image width */}
              <p className="text-lg md:text-xl lg:text-3xl font-avenir-black text-primary mb-5 lg:mb-0 mt-10">
                Oops! <span className="text-black">You are deactivated.</span>
              </p>
              <div className="hidden lg:block"></div>
              <p className="text-gray-600 text-[12px] md:text-[14px] lg:text-base md:mb-7">
              You no longer have access to the system. If you believe this is a mistake, please contact support.
              </p>
              <div className="flex justify-center">
                <a
                  className="font-avenir-black transition-all duration-300 cursor-pointer hover:bg-[#007a8e] w-full max-w-[200px] rounded-xl mt-10 text-white text-center no-underline bg-primary px-5 py-3 "
                  href="/sign-out-di-ko-alam"
                >
                  <button className="cursor-pointer text-small">
                    Sign out
                  </button>
                </a>
              </div>
            </div>
          </div>
        </main>
      </section>
    </section>
  );
};

export default DeactivatedPage;
