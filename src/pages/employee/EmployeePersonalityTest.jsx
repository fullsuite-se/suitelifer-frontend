import React, { useEffect, useState } from "react";
import TestCardComponent from "../../components/employee/TestCard";
import api from "../../utils/axios";
import ComingSoon from "../admin/ComingSoon";
import Empty from "../../assets/images/empty.svg";

const EmployeePersonalityTest = () => {
  const [isComingSoon, setComingSoon] = useState(false); //Change this when the page is ready.

  const [personalityTests, setPersonalityTests] = useState([]);

  const fetchPersonalityTests = async () => {
    try {
      const response = await api.get("/api/personality-test");

      // setPersonalityTests(response.data.personalityTests);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPersonalityTests();
  }, []);

  if (isComingSoon) {
    return <ComingSoon />;
  } else if (personalityTests.length === 0) {
    return (
      <div className="grid place-content-center h-full">
        <div className="flex gap-4 flex-col items-center">
          <div className="w-[20vw] -mt-50">
            <img
              className=""
              src={Empty}
              alt="Fullsuite Events Page Coming Soon"
            />
          </div>
          <p className="text-lg md:text-xl lg:text-3xl font-avenir-black text-primary mb-5 lg:mb-0 mt-10">
            Oops, <span className="text-black">Empty for Now!</span>
          </p>
          <p className="text-center text-gray-600 text-[12px] md:text-[14px] lg:text-base">
            It looks like no personality tests have been added yet. <br /> Please check
            back soon or contact your administrator for updates.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-30">
        {personalityTests.map((test) => (
          <TestCardComponent
            key={test.testId}
            title={test.testTitle}
            description={test.testDescription}
            url={test.testUrl}
          />
        ))}
      </div>
    </div>
  );
};
//
export default EmployeePersonalityTest;
