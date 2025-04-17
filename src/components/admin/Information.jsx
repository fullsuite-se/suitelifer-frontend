import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import React from "react";

const Information = ({ type, text }) => {
  return (
    <span className="flex text-sm text-gray-400">
      {type === "info" ? (
        <InformationCircleIcon className="size-5  text-blue-500/70" />
      ) : (
        <ExclamationTriangleIcon className="size-5  text-orange-500/70" />
      )}
      &nbsp;
      {text}
    </span>
  );
};

export default Information;
