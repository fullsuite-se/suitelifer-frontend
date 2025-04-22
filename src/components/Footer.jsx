import React, { useEffect, useState } from "react";

import FacebookIcon from "../assets/logos/Facebook.jsx";
import InstagramIcon from "../assets/logos/Instagram.jsx";
import LinkedlnIcon from "../assets/logos/Linkedln.jsx";
import YoutubeIcon from "../assets/logos/Youtube.jsx";
import { Link, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { getUserFromCookie } from "../utils/cookie.js";
import Certifications from "./footer/Certifications.jsx";
import api from "../utils/axios";

const handleLoginBtn = async (navigate) => {
  try {
    const user = await getUserFromCookie();
    if (user) {
      navigate("/app/blogs-feed");
    } else {
      navigate("/login");
    }
  } catch (error) {
    console.log(err);
    navigate("/login");
  }
};

const Footer = () => {
  const [industries, setIndustries] = useState([]);
  const fetchIndustries = async () => {
    try {
      const response = await api.get("/api/get-all-industries");
      setIndustries((i) => response.data.data);
      console.log(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  const navigate = useNavigate();

  const maxItems = 5;
  const showSeeAll = industries.length > maxItems;

  return (
    <footer className="relative p-8 pb-20 bg-gradient-to-t from-primary to-secondarydark text-white ">
      <div className="flex flex-col md:flex-row justify-between md:justify-center items-center md:items-start mt-2 gap-4">
        <div className="md:w-[40%]! md:mr-5 lg:mr-10">
          <div className="text-small">
            <p>
              FullSuite is the remote operations concierge of choice of
              venture-backed startups in the US.
            </p>
            <br />
            <p>
              {" "}
              We provide tailored and customized finance and operational
              solutions for early stage and growth startups, supporting them
              from pre-revenue stage to when they scale.
            </p>
            <br />
            <p>
              Interested in availing our services? Check this out!{" "}
              <Link
                target="_blank"
                to="https://fullsuite.ph"
                className="font-avenir-black text-white hover:text-secondary"
              >
                fullsuite.ph
              </Link>
            </p>
            <br />
            <p>Let's chat.</p>
          </div>
          <div className="flex flex-row md:flex-col justify-between items-center md:items-start mt-2 gap-4">
            <div className="w-full">
              <ul className="flex items-center gap-4 list-none! -ml-5">
                <li className="hover:scale-150 transition-all duration-100">
                  <Link
                    target="_blank"
                    to={"https://facebook.com/thefullsuitepod"}
                  >
                    <FacebookIcon color={"white"} height="20" width="20" />
                  </Link>
                </li>
                <li className="hover:scale-150 transition-all duration-100">
                  <Link
                    target="_blank"
                    to={"https://instagram.com/thefullsuitepod"}
                  >
                    <InstagramIcon color={"white"} height="20" width="20" />
                  </Link>
                </li>
                <li className="hover:scale-150 transition-all duration-100">
                  <Link
                    target="_blank"
                    to={"https://www.linkedin.com/company/fullsuite"}
                  >
                    <LinkedlnIcon color={"white"} height="20" width="20" />
                  </Link>
                </li>
                <li className="hover:scale-150 transition-all duration-100">
                  <Link
                    target="_blank"
                    to={"https://www.youtube.com/@fs_thesuitepod"}
                  >
                    <YoutubeIcon color={"white"} height="24" width="24" />
                  </Link>
                </li>
              </ul>
            </div>

            <div className="w-full md:mt-2">
              <button
                className="group relative px-6 py-2 text-sm md:text-sm md:px-6 md:py-2 lg:px-7 lg:py-2  text-white transition-all duration-100 cursor-pointer"
                onClick={() => handleLoginBtn(navigate)}
              >
                <div className="absolute inset-0 bg-secondary rounded-full transition-all duration-100 group-hover:bg-accent-2"></div>
                <span className="relative group-hover:text-white text-small">
                  Suitelifer Login
                </span>
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="md:3fr grid grid-cols-3 grid-rows-1 mt-15 md:mt-0 mb-10 md:gap-10 gap-4 text-small">
            <div>
              <span className="no-underline  text-white font-avenir-black">
                About Us
              </span>
              <ul className="flex flex-wrap gap-1 flex-col mt-3 list-none! -ml-5">
                <li className=" text-white ">
                  <HashLink
                    to="/about-us#our-story"
                    className="no-underline hover:!text-secondary"
                  >
                    Our Story
                  </HashLink>
                </li>
                <li className=" text-white ">
                  <HashLink
                    to="/about-us#mission-vision"
                    className="no-underline hover:!text-secondary"
                  >
                    Mission
                  </HashLink>
                </li>
                <li className=" text-white ">
                  <HashLink
                    to="/about-us#mission-vision"
                    className="no-underline hover:!text-secondary"
                  >
                    Vision
                  </HashLink>
                </li>
                <li className=" text-white ">
                  <HashLink
                    to={"/about-us/#ceo-message"}
                    className="no-underline hover:!text-secondary"
                  >
                    CEO's message
                  </HashLink>
                </li>
                <li className=" text-white ">
                  <HashLink
                    to={"/about-us/#testimonials"}
                    className="no-underline hover:!text-secondary"
                  >
                    Testimonials
                  </HashLink>
                </li>
              </ul>
            </div>
            <div>
              <span className="no-underline  text-white font-avenir-black">
                Careers
              </span>
              <ul className="flex flex-wrap gap-1 flex-col mt-3 list-none! -ml-5">
                {industries.slice(0, maxItems).map((industry, index) => (
                  <li key={industry.industryId} className="   text-white">
                    <Link to={""} className="no-underline hover:text-secondary">
                      {industry.industryName}
                    </Link>
                  </li>
                ))}
                {showSeeAll && (
                  <li className=" text-white  ">
                    <Link
                      to="/careers-all"
                      className="no-underline hover:text-secondary font-avenir-black"
                    >
                      See all careers
                    </Link>
                  </li>
                )}
              </ul>
            </div>
            <div>
              <span className=" text-white font-avenir-black ">Legal</span>
              <ul className="flex-wrap flex gap-1 mt-3 flex-col list-none! -ml-5">
                <li className="  ">
                  <Link
                    to={"/privacy-policy"}
                    className="no-underline text-white hover:!text-secondary"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li className=" text-white ">
                  <Link
                    to={"/terms-of-use"}
                    className="no-underline text-white hover:!text-secondary"
                  >
                    Terms of Use
                  </Link>
                </li>
                <li className=" text-white ">
                  <HashLink
                    to={"/contact#faqs"}
                    className="no-underline hover:!text-secondary"
                  >
                    FAQs
                  </HashLink>
                </li>
              </ul>
            </div>
          </div>
          <div className="md:mt-30">
            <Certifications />
          </div>
        </div>
      </div>{" "}
      <div className="py-3"></div>
    </footer>
  );
};

export default Footer;
