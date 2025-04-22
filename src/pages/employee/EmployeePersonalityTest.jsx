import React, { useEffect, useState } from "react";
import TestCardComponent from "../../components/employee/TestCard";
import api from "../../utils/axios";
import ComingSoon from "../admin/ComingSoon";

const EmployeePersonalityTest = () => {
  const [isComingSoon, setComingSoon] = useState(false); //Change this when the page is ready.

  const [personalityTests, setPersonalityTests] = useState([]);

  const fetchPersonalityTests = async () => {
    try {
      const response = await api.get("/api/personality-test");

      setPersonalityTests(response.data.personalityTests);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPersonalityTests();
  }, []);

  if (isComingSoon) {
    return <ComingSoon />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-30">
        {personalityTests.length === 0
          ? "Wala pang personality test"
          : personalityTests.map((test) => (
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
