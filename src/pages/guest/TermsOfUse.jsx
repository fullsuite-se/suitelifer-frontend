import React, { useEffect } from "react";
import Footer from "../../components/Footer";
import MobileNav from "../../components/home/MobileNav";
import TabletNav from "../../components/home/TabletNav";
import DesktopNav from "../../components/home/DesktopNav";

import privacyPolicyimg from "../../assets/images/fingerprint-and-loupe.jpg";
import LegalHeader from "../../components/legal/LegalHeader";
import PrivacyPolicyContent from "../../components/legal/PrivacyPolicyContent";

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
          <LegalHeader
            image={privacyPolicyimg}
            heading="Privacy Policy"
            sectionId="privacy-policy-content"
          />

          <section id="privacy-policy-content">
           
              <br />
              <br />
              <br />
              <br />
       
           <PrivacyPolicyContent />

          </section>
        </main>
      </div>
    </>
  );
};

export default TermsOfUse;