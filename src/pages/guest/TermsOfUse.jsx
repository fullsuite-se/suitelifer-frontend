import React, { useEffect } from "react";

import MobileNav from "../../components/home/MobileNav";
import TabletNav from "../../components/home/TabletNav";
import DesktopNav from "../../components/home/DesktopNav";
import TermsOfUseContent from "../../components/legal/TermsOfUseContent";
import BackToTop from "../../components/buttons/BackToTop";
import Footer from "../../components/footer/Footer";
import { useLocation } from "react-router-dom";

const TermsOfUse = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <PageMeta
        title="Terms of Use - Suitelifer"
        desc="Review the Terms of Use for Fullsuite’s website, outlining your rights and responsibilities while using our services."
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
        <main className="mt-0 lg:mt-20 text-[12px] md:text-[14px] lg:text-[16px]">
          <section id="terms-of-use-content" className="mb-20">
            <TermsOfUseContent />
          </section>
          <BackToTop />

          <Footer />
        </main>
      </div>
    </>
  );
};

export default TermsOfUse;
