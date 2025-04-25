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
        <div className="text-primary border border-primary hover:bg-primary hover:text-white duration-500 p-2 px-4 rounded-lg">
          Read more
        </div>
      </div>
    </NavLink>
  );
};

export default ReadMoreBtn;
