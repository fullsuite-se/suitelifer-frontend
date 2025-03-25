import React from "react";

const SidebarCollapse = ({ direction }) => {
  return direction === "left" ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="Layer_1"
      data-name="Layer 1"
      viewBox="0 0 24 24"
      className="size-4 cursor-pointer text-primary hover:text-primary-dark"
    >
      <path
        fill="currentColor"
        d="M9,2H3C1.346,2,0,3.346,0,5V22H9V2Zm-3,14H3v-2h3v2Zm0-4H3v-2h3v2Zm-3-4v-2h3v2H3Zm21-3V22H11V2h10c1.654,0,3,1.346,3,3Z"
      />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="Layer_1"
      data-name="Layer 1"
      viewBox="0 0 24 24"
      className="size-4 cursor-pointer text-primary hover:text-primary-dark"
    >
      <path
        fill="currentColor"
        d="M13,22H0V5c0-1.654,1.346-3,3-3H13V22ZM24,5V22H15V2h6c1.654,0,3,1.346,3,3Zm-3,9h-3v2h3v-2Zm0-4h-3v2h3v-2Zm0-4h-3v2h3v-2Z"
      />
    </svg>
  );
};

export default SidebarCollapse;
