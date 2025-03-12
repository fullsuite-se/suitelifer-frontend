import React from "react";
import footerBg from "../assets/images/footer-bg-mobile.svg";
import logoFS from "../assets/logos/logo-fs.svg";
import logoSOC from "../assets/logos/logo-soc.svg";
import logoTagline from "../assets/logos/logo-fs-tagline.svg";

import FacebookIcon from "../assets/logos/Facebook.jsx";
import InstagramIcon from "../assets/logos/Instagram.jsx";
import LinkedlnIcon from "../assets/logos/Linkedln.jsx";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import FetchLogos from "./footer/LogoSlideShow.jsx";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative pb-5 footer-container">
      <section className="flex flex-col px-4 my-3 gap-3">
        <div className="flex gap-3">
          {/* <div className="w-10 h-auto logoFS">
            <img
              src={logoFS}
              alt="FullSuite"
              className="w-full object-contain h-full"
            />
          </div> */}
          <div className="ml-3 w-32 h-auto logoFSTagline">
            <img
              src={logoTagline}
              alt="FullSuite"
              className="w-full object-contain h-full"
            />
          </div>
        </div>
        <div className="footer-social-container hidden">
          <section className="footer-social-head flex gap-3">
            <div className="flex flex-col gap-3 px-3">
              <p className="footer-text text-white text-sm">
                FullSuite is the remote operations concierge of choice of
                venture-backed startups in the US.
              </p>
              <p className="footer-text text-white text-sm">
                We provide tailored and customized finance and operational
                solutions for early stage and growth startups, supporting them
                from pre-revenue stage to when they scale.
              </p>{" "}
              <p className="footer-text text-white text-sm">
                <span>Interested in availing our services?</span> Check this
                out!&nbsp;
                <span>
                  <Link
                    target="_blank"
                    to="https://fullsuite.ph"
                    className="font-avenir-black text-primary"
                  >
                    fullsuite.ph
                  </Link>
                </span>
              </p>
              <p className="footer-text text-white text-sm">Let's chat.</p>
              <div>
                <ul className="flex items-center gap-4 list-none! -ml-5">
                  <li className="hover:scale-150 transition-all duration-100">
                    <Link 
                      target="_blank"
                      to={"https://facebook.com/thefullsuitepod"}
                    >
                      <FacebookIcon color={"#0097b2"} height="20" width="20" />
                    </Link>
                  </li>
                 
                  <li className="hover:scale-150 transition-all duration-100"><Link target="_blank" to={"https://instagram.com/thefullsuitepod"}>
                    <InstagramIcon color={"#0097b2"} height="20" width="20" /></Link>
                  </li>
              
                  <li className="hover:scale-150 transition-all duration-100">
                    <Link target="_blank" to={"https://www.linkedin.com/company/fullsuite"}>
                      <LinkedlnIcon color={"#0097b2"} height="20" width="20" />
                    </Link>
                  </li>
                </ul>
              </div>

              
              <button className="group relative px-6 py-2 mt-5 text-primary text-md font-medium rounded-full overflow-hidden lg:w-40 xl:w-50 xl:text-lg transition-all duration-100 ">
  <Link className="no-underline" target="_blank" to={"/login"}>
    <div className="absolute inset-0 bg-primary opacity-10 rounded-full transition-all duration-100 group-hover:opacity-100"></div>
    <span className="relative group-hover:!text-white">Suitelifer Login</span>
  </Link>
</button>

            


            </div>
          </section>
        </div>
      </section>

      <section className="footer-bg-container absolute -z-10">
        <img src={footerBg} alt="footer background" className="w-full h-full" />
      </section>

      <section className="footer-social flex gap-3">
        <div className="flex flex-col gap-3 pl-7 pt-8">
          <p className="footer-text text-white text-sm">
            FullSuite is the remote operations concierge of choice of
            venture-backed startups in the US.
          </p>

          <p className="footer-text text-white text-sm">
            We provide tailored and customized finance and operational solutions
            for early stage and growth startups, supporting them from
            pre-revenue stage to when they scale.
          </p>

          <p className="footer-text text-white text-sm">
            <span>Interested in availing our services?</span> Check this out!&nbsp;
            <span>
              <Link
                to="https://fullsuite.ph"
                target="_blank"
                className="font-avenir-black"
              >
                fullsuite.ph
              </Link>
            </span>
          </p>

          <p className="footer-text text-white text-sm">Let's chat.</p>

          <div>
            <ul className="flex items-center gap-4 list-none! -ml-5  ">
              <li>
                <Link
                  target="_blank"
                  to={"https://facebook.com/thefullsuitepod"}
                >
                  <FacebookIcon color={"white"} height="20" width="20" />
                </Link>
              </li>
              <li>
                <Link
                  target="_blank"
                  to={"https://instagram.com/thefullsuitepod"}
                >
                  <InstagramIcon color={"white"} height="20" width="20" />
                </Link>
              </li>
              <li>
               
              <Link target="_blank" to={"https://www.linkedin.com/company/fullsuite"}>
                      <LinkedlnIcon color={"white"} height="20" width="20" />
                    </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* dito allen! */}
        <div className="basis-sm pr-2 self-start">
        <FetchLogos size={22}/>
        </div>
      </section>
      <section className="pl-5 mb-3">
      <button className="group relative px-6 py-2 mt-5 text-white text-md font-medium rounded-full overflow-hidden lg:w-40 xl:w-50 xl:text-lg transition-all duration-100 ">
  <Link className="no-underline" target="_blank" to={"/login"}>
    <div className="absolute inset-0 bg-white opacity-30 rounded-full transition-all duration-100 group-hover:opacity-100"></div>
    <span className="relative group-hover:!text-white">Suitelifer Login</span>
  </Link>
</button>

      </section>

      <section className="footer-links flex justify-between px-7 pt-4">
        <div>
          <span className="footer-text text-sm text-white font-avenir-black">
            About Us
          </span>
          <ul className="flex flex-wrap gap-1 flex-col mt-2 list-none! -ml-5">
            <li className="text-sm text-white ">
              <HashLink
                to="/about-us#our-story"
                className="footer-text hover:!text-primary"
              >
                Our Story
              </HashLink>
            </li>
            <li className="text-sm text-white">
              <HashLink
                to="/about-us#our-mission"
                className="footer-text hover:!text-primary"
              >
                Mission
              </HashLink>
            </li>
            <li className="text-sm text-white">
              <HashLink
                to="/about-us#our-vision"
                className="footer-text hover:!text-primary"
              >
                Vision
              </HashLink>
            </li>
            <li className="text-sm text-white">
              <HashLink
                to={"/about-us/#ceo-message"}
                className="footer-text hover:!text-primary"
              >
                CEO's message
              </HashLink>
            </li>
            <li className="text-sm text-white">
              <HashLink
                to={"/about-us/#testimonials"}
                className="footer-text hover:!text-primary"
              >
                Testimonials
              </HashLink>
            </li>
          </ul>
        </div>
        <div>
          <span className="footer-text text-sm text-white font-avenir-black">
            Careers
          </span>
          <ul className="flex flex-wrap gap-1 flex-col mt-2 list-none! -ml-5">
            <li className="text-sm text-white">
              <Link to={""} className="footer-text hover:!text-primary">
                Data Operations
              </Link>
            </li>
            <li className="text-sm text-white">
              <Link to={""} className="footer-text hover:!text-primary">
                Finance Operations
              </Link>
            </li>
            <li className="text-sm text-white">
              <Link to={""} className="footer-text hover:!text-primary">
                Administrative Operations
              </Link>
            </li>
          </ul>
          <div className="py-2"></div>
          <div className="footer-legal">
            <span className="footer-text text-sm text-white font-avenir-black">
              Legal
            </span>
            <ul className="flex-wrap flex gap-1 flex-col mt-2 list-none! -ml-5">
              <li className="text-sm text-white">
                <Link to={"/privacy-policy"} className="footer-text">
                  Privacy Policy
                </Link>
              </li>
              <li className="text-sm text-white ">
                <Link to={"/terms-of-use"} className="footer-text">
                  Terms of Use
                </Link>
              </li>
              <li className="text-sm text-white">
                <HashLink
                  to={"/contact#faqs"}
                  className="footer-text hover:!text-primary"
                >
                  FAQs
                </HashLink>
              </li>
            </ul>
          </div>
        </div>
        <div>
          <span className="text-sm text-white font-avenir-black footer-text">
            Legal
          </span>
          <ul className="flex-wrap flex gap-1 mt-3 flex-col list-none! -ml-5">
            <li className="text-sm ">
              <Link
                to={"/privacy-policy"}
                className="footer-text text-white hover:!text-primary"
              >
                Privacy Policy
              </Link>
            </li>
            <li className="text-sm text-white">
              <Link
                to={"/terms-of-use"}
                className="footer-text text-white hover:!text-primary"
              >
                Terms of Use
              </Link>
            </li>
            <li className="text-sm text-white">
              <HashLink
                to={"/contact#faqs"}
                className="footer-text hover:!text-primary"
              >
                FAQs
              </HashLink>
            </li>
          </ul>
        </div>
      </section>
      <section className="soc-logo-container hidden">
       <FetchLogos size={32}/>
      </section>
    </footer>
  );
};

export default Footer;
