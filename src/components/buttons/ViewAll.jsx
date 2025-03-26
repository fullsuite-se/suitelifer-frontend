import { ChevronRightIcon } from "lucide-react";

const DynamicLink = ({ text = "View all", href = "#", className = "", iconSize = 4 }) => {
  return (
    <a
      className={`text-small z-10 md:mt-2 pr-2 lg:mt-2 no-underline text-primary font-avenir-black flex items-center justify-end gap-1 ${className}`}
      href={href}
    >
      <span className="flex items-end ">{text}</span>
      <ChevronRightIcon className={`size-${iconSize} sm:size-${iconSize + 1} mb-1`} />
    </a>
  );
};

export default DynamicLink;
