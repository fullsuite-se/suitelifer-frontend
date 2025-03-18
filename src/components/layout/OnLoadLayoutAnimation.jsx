import React from "react";
import fullsuite from "../../assets/logos/logo-fs-tagline.svg";
const OnLoadLayoutAnimation = () => {
  return (
    <section className="w-full h-full grid place-content-center">
      <img src={fullsuite} alt="FullSuite" className="w-36 h-auto" />
      <span className="w-12 h-12 border-5 mt-5 border-primary mx-auto border-b-transparent rounded-full inline-block box-border animate-spin"></span>
    </section>
  );
};

export default OnLoadLayoutAnimation;
