import React from "react";

const TwoCirclesLoader = ({ bg, color1, color2, height, width }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="20 20 60 60"
      preserveAspectRatio="xMidYMid"
      width={`${width}`}
      height={`${height}`}
      style={{
        shapeRendering: "auto",
        display: "block",
        background: bg,
      }}
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g>
        <circle r="20" fill={`${color1}`} cy="50" cx="30">
          <animate
            begin="-0.5s"
            values="30;70;30"
            keyTimes="0;0.5;1"
            dur="1s"
            repeatCount="indefinite"
            attributeName="cx"
          ></animate>
        </circle>
        <circle r="20" fill={`${color2}`} cy="50" cx="70">
          <animate
            begin="0s"
            values="30;70;30"
            keyTimes="0;0.5;1"
            dur="1s"
            repeatCount="indefinite"
            attributeName="cx"
          ></animate>
        </circle>
        <circle r="20" fill={`${color1}`} cy="50" cx="30">
          <animate
            begin="-0.5s"
            values="30;70;30"
            keyTimes="0;0.5;1"
            dur="1s"
            repeatCount="indefinite"
            attributeName="cx"
          ></animate>
          <animate
            repeatCount="indefinite"
            dur="1s"
            keyTimes="0;0.499;0.5;1"
            calcMode="discrete"
            values="0;0;1;1"
            attributeName="fill-opacity"
          ></animate>
        </circle>
        <g></g>
      </g>
    </svg>
  );
};

export default TwoCirclesLoader;
