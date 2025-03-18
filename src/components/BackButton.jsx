import { ArrowLeft } from "lucide-react";
import { NavLink } from "react-router-dom";

const BackButton = ({ backPath, type, jobId }) => {
  return (
    <NavLink
      to={backPath}
      state={{ jobId }}
      className="!no-underline"
    >
      <button className="flex items-center gap-2 text-primary !text-[12px] md:text-base font-semibold transition active:font-avenir-black">
        <ArrowLeft size={15} /> <span className="mt-1">Back to {type}</span>
      </button>
    </NavLink>
  );
};

export default BackButton;
