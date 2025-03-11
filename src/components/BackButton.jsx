import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackButton = ({ backPath, type }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(backPath)}
      className="flex items-center gap-2 text-primary !text-[12px] md:text-base font-semibold transition active:font-avenir-black"
    >
      <ArrowLeft size={15} /> <span className="mt-1">Back to {type}</span>
    </button>
  );
};

export default BackButton;
