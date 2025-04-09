import React from "react";

const ReadMoreBtn = ({
    href,
}) => {
  return (
    <div className="flex justify-end cursor-pointer">
      <div className="hover:bg-[#007a8e] duration-500 bg-primary p-2 px-4 mt-5 md:mt-0 mb-7 rounded-lg">
        <a href={href} className="no-underline text-white">
          Read more
        </a>
      </div>
    </div>
  );
};

export default ReadMoreBtn;
