import React from "react";
import Footer from "../../components/Footer";
import MobileNav from "../../components/home/MobileNav";
import TabletNav from "../../components/home/TabletNav";
import DesktopNav from "../../components/home/DesktopNav";

import bgimg from "../../assets/images/engineers.jpg";
import emailicon from "../../assets/icons/envelope.svg";
import tphoneicon from "../../assets/icons/mobile-button.svg";
import phoneicon from "../../assets/icons/phone-flip.svg";

import ClockIcon from "../../assets/logos/ClockIcon";
import MarkerIcon from "../../assets/logos/MarkerIcon";
import FAQ from "../../components/contact/FaqsDropDown";

const Contact = () => {
  return (
    <>
      {/* MOBILE NAV */}
      <div className="sm:hidden">
        <MobileNav />
      </div>

      {/* TABLET NAV */}
      <div className="tablet-nav">
        <TabletNav />
      </div>

      {/* DESKTOP NAV */}
      <div className="desktop-nav">
        <DesktopNav />
      </div>
      <div className="relative">
  {/* Background Boxes */}
  <div className="absolute top-10 left-10 w-40 h-40 bg-primary/20 rounded-lg -z-1"></div>
  <div className="absolute top-255 left-15 bottom-20 right-20 w-28 h-28 bg-secondary/20 rounded-xl -z-1 "></div>
  <div className="absolute top-270 left-5 w-20 h-20 bg-primary/10 -z-1 rounded-xl"></div>

      <main className="mt-0 lg:mt-20 text-[12px] md:text-[14px] lg:text-[16px] ">
        <div className="flex flex-col md:flex-row items-start md:items-center">
          <div
            className="relative p-8 pr-8 md:pr-16 rounded-tr-xl rounded-br-xl text-white mr-4 md:min-h-[500px] justify-center items-center flex flex-col 
        w-[98%] md:w-[60%] lg:w-[60%] xl:w-[50%] max-w-[90%] xl:max-w-[60%]"
            style={{
              backgroundImage: `url(${bgimg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-primary opacity-80 rounded-tr-xl rounded-br-xl"></div>
            <div className="relative z-10">
              <h2 className="font-avenir-black text-3xl text-white-300 lg:text-xl">
                <span className="text-secondary">Chat</span> to our team
              </h2>
              <p className="mt-4 text-white text-xs md:text-base">
                Lorem ipsum dolor sit amet ipsum consectetur adipiscing elit Ut
                et massa mi. Aliquam in hendrerit urna. Pellent que sit amet
                sapien.Lorem ipsum dolor sit amet consectetur hapsi lorem ipsum
                dolor us.
              </p>

              <div className="mt-6 space-y-2 text-white">
                <p className="flex items-center gap-2">
                  <img
                    src={emailicon}
                    alt="Email"
                    className="w-5 h-5 filter invert"
                  />
                  abc@fullsuite.ph
                </p>
                <p className="flex items-center gap-2">
                  <img
                    src={phoneicon}
                    alt="Phone"
                    className="w-5 h-5 filter invert"
                  />
                  (074) 619-5521
                </p>
                <p className="flex items-center gap-2">
                  <img
                    src={tphoneicon}
                    alt="Mobile"
                    className="w-5 h-5 filter invert"
                  />
                  +63-912-3456-789
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 w-full md:max-w-lg lg:max-w-2xl xl:max-w-4xl ">

            <form action="#" className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium">
                  Full Name*
                </label>
                <input
                  type="text"
                  className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Email Address*
                </label>
                <input
                  type="email"
                  className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Subject*
                </label>
                <input
                  type="text"
                  className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Message*
                </label>
                <textarea
                  rows="4"
                  className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary placeholder-primary/50"
                  placeholder="Type your message here"
                ></textarea>
              </div>
              <button className="w-full font-avenir-black bg-primary text-white py-3 rounded-md hover:bg-primary/90 transition">
                SEND
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-center mt-12 p-10 justify-center gap-10">
          <div className="md:w-1/2 flex flex-col justify-center text-left lg:w-1/4">
            <h2 className="font-avenir-black text-lg md:text-xl">
              Visit us <span className="text-primary">here</span>
            </h2>
            <div className="flex items-center gap-2 mt-2 text-primary">
              <MarkerIcon width={24} height={24} />
              <span className="text-black">
                5F Curamed Building, Ben Palispis-Aspiras Highway
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-primary">
              <ClockIcon width={24} height={24} />
              <span className="text-black">
                <strong className="font-avenir-black">Monday to Friday</strong>{" "}
                <br /> 7 AM - 4 PM
              </span>
            </div>
          </div>

          <div className="md:w-2/3 w-full">
            <iframe
              className="w-full h-64 md:h-80 lg:h-96 xl:h-[500px] rounded-lg shadow-lg"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3824.639825797055!2d120.59202167607842!3d16.402008236615966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDI0JzA3LjIiTiAxMjDCsDM1JzQwLjYiRQ!5e0!3m2!1sen!2sph!4v1710672000000"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        <FAQ />
        <Footer />
      </main>
</div>
    </>
  );
};

export default Contact;
