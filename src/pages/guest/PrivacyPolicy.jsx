import React, { useEffect } from "react";

import MobileNav from "../../components/home/MobileNav";
import TabletNav from "../../components/home/TabletNav";
import DesktopNav from "../../components/home/DesktopNav";
import PrivacyPolicyContent from "../../components/legal/PrivacyPolicyContent";
import BackToTop from "../../components/buttons/BackToTop";
import Footer from "../../components/footer/Footer";
import PageMeta from "../../components/layout/PageMeta";
import { useLocation } from "react-router-dom";

const PrivacyPolicy = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <PageMeta
        title="Data Privacy Policy - Suitelifer"
        desc="Understand how Fullsuite collects, uses, stores, and protects your personal information through our Data Privacy Policy."
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
          <section policy="privacy-policy-content" className="mb-20">
            <PrivacyPolicyContent />
          </section>{" "}
          <BackToTop />
          <Footer />
        </main>
      </div>
    </>
  );
};

export default PrivacyPolicy;
