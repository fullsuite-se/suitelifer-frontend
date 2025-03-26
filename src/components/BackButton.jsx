import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackButton = ({ backPath, type }) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    if (backPath === -1) {
      navigate(-1); 
    } else if (typeof backPath === "function") {
      backPath(); 
    } else {
      navigate(backPath || "/"); 
    }
  };

  return (
    <button
      onClick={handleNavigation}
      className="group cursor-pointer flex items-center gap-2 text-primary !text-xs transition active:font-avenir-black"
    >
      <ArrowLeft size={15} />
      <span className="mt-1 group-hover:font-avenir-black">
        Back {type ? `to ${type}` : ""}
      </span>
    </button>
  );
};

export default BackButton;
