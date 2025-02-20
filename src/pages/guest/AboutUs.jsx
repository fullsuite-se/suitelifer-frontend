import React from "react";
import Footer from "../../components/Footer";
import MobileNav from "../../components/MobileNav";
import TabletNav from "../../components/TabletNav";

const AboutUs = () => {
  return (
    <section className="">
      {/* MOBILE NAV */}
      <div className="sm:hidden">
        <MobileNav />
      </div>
      {/* TABLET NAV */}
      <div className="tablet-nav">
        <TabletNav />
      </div>
      <main className="bg-red-30 h-dvh">
        <p>About Us</p>
      </main>
      <Footer />
    </section>
  );
};

export default AboutUs;
