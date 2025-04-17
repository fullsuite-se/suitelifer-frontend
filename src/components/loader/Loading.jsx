import React from "react";
import { ThreeDot } from "react-loading-indicators";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 bg-opacity-50 pointer-events-auto">
      <div className="pointer-events-none">
        <ThreeDot
          variant="bounce"
          color="#0097b2"
          size="medium"
          text=""
          textColor=""
        />
      </div>
    </div>
  );
};

export default Loading;
