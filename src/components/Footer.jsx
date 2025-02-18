import React from "react";
import footerBg from "../assets/images/footer-bg-mobile.svg";
import logoFS from "../assets/logos/logo-fs.svg";
import logoSOC from "../assets/logos/logo-soc.svg";
import logoTagline from "../assets/logos/logo-fs-tagline.svg";

import facebook from "../assets/logos/facebook.svg";
import instagram from "../assets/logos/instagram.svg";
import linkedln from "../assets/logos/linkedln.svg";

const Footer = () => {
  return (
    <footer className="relative">
      <section className="flex px-4 my-3 gap-3">
        <div className="w-10 h-auto">
          <img
            src={logoFS}
            alt="SOC logo"
            className="w-full object-contain h-full"
          />
        </div>
        <div className="w-32 h-auto">
          <img
            src={logoTagline}
            alt="SOC logo"
            className="w-full object-contain h-full"
          />
        </div>
      </section>

      <section className="absolute -z-10">
        <img
          src={footerBg}
          alt="footer background"
          className="min-w-2xs h-full"
        />
      </section>

      <section className="flex gap-3">
        <div className="flex flex-col gap-3 pl-7 pt-8">
          <p className="text-white text-sm">
            FullSuite is the remote operations concierge of choice of
            venture-backed startups in the US.
          </p>

          <p className="text-white text-sm">
            We provide tailored and customized finance and operational solutions
            for early stage and growth startups, supporting them from
            pre-revenue stage to when they scale.
          </p>

          <p className="text-white text-sm">Let's chat.</p>

          <div>
            <ul className="flex items-center gap-4">
              <li className="text-white">
                <img src={facebook} className="w-5 h-5" />
              </li>
              <li className="text-white">
                <img src={instagram} className="w-6 h-6" />
              </li>
              <li className="text-white">
                <img src={linkedln} className="w-5 h-5" />
              </li>
            </ul>
          </div>
        </div>
        <div className="basis-sm pr-2 self-start">
          <img
            src={logoSOC}
            alt="SOC logo"
            className="w-full object-contain h-full"
          />
        </div>
      </section>

      <section className="flex justify-between px-7 pt-4">
        <div>
          <span className="text-sm text-white font-extrabold">About Us</span>
          <ul className="flex flex-wrap gap-1 flex-col mt-3">
            <li className="text-sm text-white">Our Story</li>
            <li className="text-sm text-white">Mission</li>
            <li className="text-sm text-white">Vision</li>
            <li className="text-sm text-white">CEO's message</li>
            <li className="text-sm text-white">Testimonials</li>
          </ul>
        </div>
        <div>
          <span className="text-sm text-white font-extrabold">Careers</span>
          <ul className="flex flex-wrap gap-1 flex-col mt-3">
            <li className="text-sm text-white">Data Operations</li>
            <li className="text-sm text-white">Finance Operations</li>
            <li className="text-sm text-white">Administrative Operations</li>
            <li className="text-sm text-white">CEO's message</li>
            <li className="text-sm text-white">Testimonials</li>
          </ul>

          <ul className="flex-wrap flex gap-1 flex-col mt-5">
            <li className="text-sm text-white">Privacy Policy</li>
            <li className="text-sm text-white">Terms of Use</li>
            <li className="text-sm text-white">FAQs</li>
          </ul>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
