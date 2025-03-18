import { ArrowLeft } from "lucide-react";
import { NavLink } from "react-router-dom";

const BackButton = ({ backPath, type, jobId }) => {
  return (
    <NavLink
      to={backPath}
      state={{ jobId }}
    >
      <button className="flex items-center no-underline gap-2 text-primary !text-[12px] md:text-base font-semibold transition active:font-avenir-black">
        <ArrowLeft size={15} /> <span className="mt-1 no-underline">Back to {type}</span>
      </button>
    </NavLink>
  );
};

export default BackButton;
