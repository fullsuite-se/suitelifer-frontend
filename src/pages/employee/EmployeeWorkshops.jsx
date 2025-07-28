import React from "react";
import { useState } from "react";
import ComingSoon from "../admin/ComingSoon";

const EmployeeWorkshops = () => {
  const [isComingSoon, setComingSoon] = useState(true); //Change this when the page is ready.

  if (isComingSoon) {
    return <ComingSoon />;
  }

  return <div className="flex w-full justify-center items-center"></div>;
};

export default EmployeeWorkshops;