import React from "react";
import { NavLink } from "react-router-dom";
import { toSlug } from "../../utils/slugUrl";
const ReadMoreBtn = ({ id, title }) => {
  return (
    <NavLink
      to={`/newsletter/${toSlug(title)}?id=${id}`}
      className="no-underline"
    >
      <div className="flex justify-end cursor-pointer">
        <div className="text-white hover:bg-[#007a8e] duration-500 bg-primary p-2 px-4 rounded-lg">
          Read more
        </div>
      </div>
    </NavLink>
  );
};

export default ReadMoreBtn;
