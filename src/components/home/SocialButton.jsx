import React from "react";

const SocialButton = ({ href, children }) => {
  return (
    <a
      href={href}
      title={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group no-underline bg-white hover:bg-primary border border-primary p-3 lg:px-5 xl:px-[4%] text-primary transition-all duration-400 hover:text-white rounded-2xl font-avenir-black flex items-center justify-center gap-4 cursor-pointer"
    >
      {children}
    </a>
  );
};

export default SocialButton;