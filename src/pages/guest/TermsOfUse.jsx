import React, { useEffect } from "react";
import Footer from "../../components/Footer";
import MobileNav from "../../components/home/MobileNav";
import TabletNav from "../../components/home/TabletNav";
import DesktopNav from "../../components/home/DesktopNav";

import termsOfUseimg from "../../assets/images/terms-of-use.jpg";
import LegalHeader from "../../components/legal/LegalHeader";
import TermsOfUseContent from "../../components/legal/TermsOfUseContent";
import BackToTop from "../../components/BackToTop";
import FooterNew from "../../components/FooterNew";


const TermsOfUse = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        <main className="mt-0 lg:mt-20 text-[12px] md:text-[14px] lg:text-[16px]">
          {/* <LegalHeader
            image={termsOfUseimg}
            heading="Terms of Use"
            sectionId="terms-of-use-content"

            classNameValue="w-45 -mb-5 md:w-60 lg:w-70 ml-15"

          /> */}

          <section id="terms-of-use-content" className="mb-20">
           
              {/* <br />
              <br />
              <br />
              <br /> */}
       
           <TermsOfUseContent />

          </section>
          <BackToTop/>
         
          <FooterNew />
        </main>
      </div>
    </>
  );
};

export default TermsOfUse;