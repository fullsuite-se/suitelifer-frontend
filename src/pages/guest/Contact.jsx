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
import BackToTop from "../../components/buttons/BackToTop";
import { useEffect, useState } from "react";
import PageMeta from "../../components/layout/PageMeta";
import Footer from "../../components/footer/Footer";
import api from "../../utils/axios";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import TwoCirclesLoader from "../../assets/loaders/TwoCirclesLoader";
const Contact = () => {
  const [selected, setSelected] = useState("Full-Time");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };
//
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (!fullName || !email || !subject || !message) {
        toast.error("Please fill in all fields.");
        return;
      }
      // const receiver_email = "allen.alvaro@fullsuite.ph";
      const receiver_email =
        selected.toLowerCase() === "full-time"
          ? contactDetails.careersEmail
          : contactDetails.internshipEmail;
      const response = await api.post("/api/send-inquiry-email", {
        fullName,
        receiver_email,
        sender_email: email,
        subject,
        message,
      });

      if (response?.data?.isSuccess) {
        resetForm();
        toast.success(response.data.message);
      } else {
        toast.error(
          response?.data?.message || "Something went wrong. Try again."
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to send message. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const location = useLocation();
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };
  const [isLoaded, setIsLoaded] = useState(false);

  const [contactDetails, setContactDetails] = useState({
    careersEmail: "",
    internshipEmail: "",
    websiteTel: "",
    careersPhone: "",
  });

  const fetchContact = async () => {
    try {
      const response = await api.get("/api/contact");

      setContactDetails(response.data.contact);
    } catch (err) {
      console.log("Unable to fetch Contacts", err);
    }
  };

  useEffect(() => {
    fetchContact();
    setIsLoaded(true);
  }, []);

  return (
    <section
      className="gap-4 overflow-hidden"
      style={{ maxWidth: "2000px", margin: "0 auto", padding: "0 0rem" }}
    >
      <PageMeta
        title="Contact - Suitelifer"
        desc="Your career rocket ship is fueled and ready. Want to hop on? Contact us now."
        isDefer={false}
        url={location.pathname}
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

                <div className="group mt-6 space-y-5 text-white font-avenir-back text-body">
                  <p className="flex items-center gap-4">
                    <img
                      src={emailicon}
                      alt="Email"
                      className="w-5 h-5 mb-1 filter invert"
                    />
                    <div className="flex flex-col xl:flex-row">
                      <div className="">
                        <a
                          href={`mailto:${contactDetails.careersEmail}`}
                          className="hover:text-secondary transition-colors  no-underline!"
                        >
                          {contactDetails.careersEmail}
                        </a>
                      </div>
                      <div className="">
                        <span className="hidden xl:block">&nbsp;|&nbsp;</span>
                      </div>
                      <div className="">
                        <a
                          href={`mailto:${contactDetails.internshipEmail}`}
                          className="hover:text-secondary transition-colors  no-underline!"
                        >
                          {contactDetails.internshipEmail}
                        </a>
                      </div>
                    </div>
                  </p>
                  <p className="flex items-center gap-4">
                    <img
                      src={phoneicon}
                      alt="Phone"
                      className="w-5 h-5 mb-1 filter invert"
                    />
                    <a
                      href="tel:742-442-887"
                      className="hover:text-secondary transition-colors  no-underline!"
                    >
                      {contactDetails.websiteTel}
                    </a>
                  </p>
                  <p className="flex items-center gap-4">
                    <img
                      src={tphoneicon}
                      alt="Mobile"
                      className="w-5 h-5 mb-1 filter invert"
                    />
                    <a
                      href="tel:09190639001"
                      className="hover:text-secondary transition-colors  no-underline!"
                    >
                      {contactDetails.careersPhone}
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
              <div>
                <div className="flex space-x-4">
                  {["Full-Time", "Internship"].map((type) => (
                    <label
                      key={type}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="employmentType"
                        value={type}
                        checked={selected === type}
                        onChange={() => setSelected(type)}
                        className="hidden"
                      />
                      <div
                        className="w-4 h-4 rounded-full border-2"
                        style={{
                          borderColor: selected === type ? "#0097B2" : "#ccc",
                          backgroundColor:
                            selected === type ? "#0097B2" : "transparent",
                        }}
                      ></div>
                      <span
                        className="text-sm"
                        style={{
                          color: selected === type ? "#0097B2" : "#6b7280",
                          fontWeight: selected === type ? "500" : "normal",
                        }}
                      >
                        {type}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="py-2"></div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-small">
                      Full Name<span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-small">
                      Email Address<span className="text-primary">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-small">
                      Subject<span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-small">
                      Message<span className="text-primary">*</span>
                    </label>
                    <textarea
                      rows="4"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary placeholder-primary/50"
                      placeholder="Type your message here"
                      required
                    ></textarea>
                  </div>
                  <button
                    disabled={loading}
                    type="submit"
                    className={`w-full font-avenir-black text-small py-3 rounded-md transition text-white bg-primary  
                      ${
                        loading
                          ? " cursor-not-allowed"
                          : "hover:bg-primary/90 cursor-pointer"
                      }`}
                  >
                    {loading ? (
                      <div className="mx-auto w-fit">
                        <TwoCirclesLoader
                          bg={"transparent"}
                          color1={"#bfd1a0"}
                          color2={"#ffffff"}
                          width={"135"}
                          height={"24"}
                        />
                      </div>
                    ) : (
                      "SEND MESSAGE SAMPLE CHANGES"
                    )}
                  </button>
                </form>
              </div>
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
              <p className="font-avenir-black text-4xl xl:text-5xl">
                Walk-in applicants are welcome!
              </p>
              <p className="font-avenir-black text-xl xl:text-2xl">
                Let's discuss your <span className="text-primary">future</span>{" "}
                over coffee (it's on us).
              </p>
              <div className="flex items-center gap-2 mt-2 text-primary text-small">
                <MarkerIcon width={34} height={34} />
                <span className="text-gray-700">
                  5F Curamed Building, Ben Palispis- Aspiras Highway
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-primary text-small">
                <ClockIcon width={34} height={24} />
                <span className="text-gray-700">
                  <strong className="font-avenir-black">
                    Monday to Friday
                  </strong>{" "}
                  <br /> 8:00 - 10:00 AM or 1:00 - 3:00 PM
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
