import MobileNav from "../../components/home/MobileNav";
import TabletNav from "../../components/home/TabletNav";
import DesktopNav from "../../components/home/DesktopNav";
import Footer from "../../components/footer/Footer";
import BackToTop from "../../components/buttons/BackToTop";

import NewsletterDesign01 from "../../components/newsletter/templates/NewsletterDesign01";
import NewsletterDesign02 from "../../components/newsletter/templates/NewsletterDesign02";
import PageMeta from "../../components/layout/PageMeta";
import { useLocation } from "react-router-dom";

const Newsletter = () => {
  const location = useLocation();

  return (
    <section
      className="gap-4 h-dvh"
      style={{ maxWidth: "2000px", margin: "0 auto", padding: "0 0rem" }}
    >
      <PageMeta
        title="Newsletter - Suitelifer"
        desc="Stay informed with company news, product launches, and industry insights from Fullsuite."
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

      <main className="lg:my-20 mb-20">
        <NewsletterDesign01 />
      </main>

      <BackToTop />

      <Footer />
    </section>
  );
};

export default Newsletter;
