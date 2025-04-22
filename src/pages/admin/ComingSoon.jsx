import React from "react";
import UnderConstruction from "../../assets/images/under-construction.png";

const ComingSoon = () => {
  return (
    <div className="grid place-content-center h-full">
      <div className="flex gap-4 flex-col items-center">
        <div className="w-[25vw] -mt-50">
          <img
            className=""
            src={UnderConstruction}
            alt="Fullsuite Events Page Coming Soon"
          />
        </div>
        <p className="text-gray-500 text-xl px-40 text-center">Still working on this one. Hang in there — it’s coming together nicely.</p>
      </div>
    </div>
  );
};

export default ComingSoon;
