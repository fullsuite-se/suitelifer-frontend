import React from "react";
import { useState } from "react";
import ComingSoon from "../admin/ComingSoon";

const EmployeeThreads = () => {
  const [isComingSoon, setComingSoon] = useState(true); //Change this when the page is ready.

  if (isComingSoon) {
    return <ComingSoon />;
  }

  return <div>EmployeeThreads</div>;
};

export default EmployeeThreads;
