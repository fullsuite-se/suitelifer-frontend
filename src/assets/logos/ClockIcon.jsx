import React from "react";

const ClockIcon = ({ color = "currentColor", height = 20, width = 20 }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm1 11h-5V9h2v2h3Z"
        fill={color}
      />
    </svg>
  );
};

export default ClockIcon;
