import MobileNav from "../../components/home/MobileNav";
import TabletNav from "../../components/home/TabletNav";
import DesktopNav from "../../components/home/DesktopNav";
import Footer from "../../components/Footer";
import BackToTop from "../../components/BackToTop";

import NewsletterDesign01 from "../../components/newsletter/NewsletterDesign01";

const Newsletter = () => {
  return (
    <section
      className="gap-4 h-dvh"
      style={{ maxWidth: "2000px", margin: "0 auto", padding: "0 0rem" }}
    >
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
