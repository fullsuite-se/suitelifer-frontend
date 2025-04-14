import React, { useState } from "react";
import Filter from "./NewsletterFilter";

const Issues = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  return (
    <div className="flex justify-start w-full gap-4">
      <div className="bg-primary rounded-md text-white pr-4 flex items-center">
        <Filter
          showMonth={false}
          showYear={true}
          onYearChange={setSelectedYear}
        />
      </div>
    </div>
  );
};

export default Issues;
