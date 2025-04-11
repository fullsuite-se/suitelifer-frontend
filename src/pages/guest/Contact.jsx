import React from "react";

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
import { motion } from "framer-motion";
import BackToTop from "../../components/BackToTop";
import { useEffect, useState } from "react";
import PageMeta from "../../components/layout/PageMeta";
import Footer from "../../components/Footer";
const Contact = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section
      className="gap-4 overflow-hidden"
      style={{ maxWidth: "2000px", margin: "0 auto", padding: "0 0rem" }}
    >
      <PageMeta
        title="Contact - SuiteLifer"
        desc="Your career rocket ship is fueled and ready. Want to hop on? Contact us now."
        isDefer={false}
      />
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
        {/* <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="absolute top-10 left-10 w-40 h-40 bg-primary/20 rounded-lg -z-1"
        ></motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="absolute top-255 left-15 bottom-20 right-20 w-28 h-28 bg-secondary/20 rounded-xl -z-1"
        ></motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="absolute top-270 left-5 w-20 h-20 bg-primary/10 -z-1 rounded-xl"
        ></motion.div> */}

        <main className="mt-0 lg:mt-20 text-[12px] md:text-[14px] lg:text-[16px]">
          <motion.div
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col md:flex-row items-start md:items-center"
          >
            <div
              className="relative p-8 pr-8 md:pr-16 rounded-tr-xl rounded-br-xl text-white mr-4 md:min-h-[500px] justify-center items-center flex flex-col 
          w-[98%] md:w-[60%] lg:w-[60%] xl:w-[50%] max-w-[90%] xl:max-w-[60%]"
              style={{
                // backgroundImage: `url(${bgimg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-primary rounded-tr-xl rounded-br-xl"></div>
              <div className="relative z-10">
                <p className="font-avenir-black  text-white-300 text-h3">
                  Check your{" "}
                  <span className="text-secondary"> culture fit </span>
                  with us!
                </p>
                <p className=" text-white text-small">
                  Reach out and discover how you align with our team!
                </p>

                <div className="group mt-6 space-y-5 text-white font-avenir-black text-body">
                  <p className="flex items-center gap-2">
                    <img
                      src={emailicon}
                      alt="Email"
                      className="w-5 h-5 filter invert"
                    />
                    <a
                      href="mailto:abc@fullsuite.ph"
                      className="hover:text-secondary transition-colors  no-underline!"
                    >
                      hireme@fullsuite.ph
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <img
                      src={phoneicon}
                      alt="Phone"
                      className="w-5 h-5 filter invert"
                    />
                    <a
                      href="tel:+63746195521"
                      className="hover:text-secondary transition-colors  no-underline!"
                    >
                      742-442-887
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <img
                      src={tphoneicon}
                      alt="Mobile"
                      className="w-5 h-5 filter invert"
                    />
                    <a
                      href="tel:+639123456789"
                      className="hover:text-secondary transition-colors  no-underline!"
                    >
                      0919-063-9001
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <motion.div
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              variants={fadeInUp}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              className="p-8 w-full md:max-w-lg lg:max-w-2xl xl:max-w-4xl"
            >
              <form action="#" className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-small">
                    Full Name<span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-small">
                    Email Address<span className="text-primary">*</span>
                  </label>
                  <input
                    type="email"
                    className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-small">
                    Subject<span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-small">
                    Message<span className="text-primary">*</span>
                  </label>
                  <textarea
                    rows="4"
                    className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary placeholder-primary/50"
                    placeholder="Type your message here"
                  ></textarea>
                </div>
                <button className="w-full font-avenir-black bg-primary  text-small text-white py-3 rounded-md hover:bg-primary/90 transition">
                  SEND
                </button>
              </form>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            className="flex flex-col md:flex-row items-center md:items-center mt-12 p-10 justify-center gap-10"
          >
            <div className="md:w-1/2 gap-3 flex flex-col justify-center text-left lg:w-1/4">
              <p className="font-avenir-black text-h4">
                Walk-in applicants, welcome! Let's discuss your{" "}
                <span className="text-primary">future</span> over coffee (it's
                on us).
              </p>
              <div className="flex items-center gap-2 mt-2 text-primary text-body">
                <MarkerIcon width={34} height={34} />
                <span className="text-black">
                  5F Curamed Building, Ben Palispis- Aspiras Highway
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-primary text-body">
                <ClockIcon width={24} height={24} />
                <span className="text-black">
                  <strong className="font-avenir-black">
                    Monday to Friday
                  </strong>{" "}
                  <br /> 8:00 to 10:00 AM or 1:00 to 3:00 PM
                </span>
              </div>
            </div>

            <motion.div
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              variants={fadeInUp}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
              className="md:w-2/3 w-full"
            >
              <iframe
                className="w-full h-64 md:h-80 lg:h-96 xl:h-[500px] rounded-lg shadow-lg"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3824.639825797055!2d120.59202167607842!3d16.402008236615966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDI0JzA3LjIiTiAxMjDCsDM1JzQwLjYiRQ!5e0!3m2!1sen!2sph!4v1710672000000"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </motion.div>
          </motion.div>

          <section id="faqs">
            <FAQ />
          </section>
          <BackToTop />
          <Footer />
        </main>
      </div>
    </section>
  );
};

export default Contact;
