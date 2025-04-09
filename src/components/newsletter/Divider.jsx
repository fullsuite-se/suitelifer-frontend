import React from "react";

const Divider = () => {
  return (
    <div className="flex items-center justify-end py-10 md:py-0 md:pb-7">
      <div className="size-[1.3vh] bg-primary rounded-full"></div>
      <div className="w-full h-[0.25vh] bg-primary"></div>
      <div className="size-[1.3vh] bg-primary rounded-full"></div>
    </div>
  );
};

export default Divider;
