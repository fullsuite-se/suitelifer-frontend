import React from "react";
import fullsuite from "../../assets/logos/logo-fs-tagline.svg";
import TwoCirclesLoader from "../../assets/loaders/TwoCirclesLoader";
const OnLoadLayoutAnimation = () => {
  return (
    // <section className="w-full h-full grid place-content-center">
    //   <img src={fullsuite} alt="FullSuite" className="w-36 h-auto" />
    //   <span className="w-12 h-12 border-5 mt-5 border-primary mx-auto border-b-transparent rounded-full inline-block box-border animate-spin"></span>
    // </section>

    <section className="w-full h-full grid place-content-center">
      <TwoCirclesLoader
        bg={"transparent"}
        color1={"#bfd1a0"}
        color2={"#0097b2"}
        height={30}
        width={40}
      />
    </section>
  );
};

export default OnLoadLayoutAnimation;
